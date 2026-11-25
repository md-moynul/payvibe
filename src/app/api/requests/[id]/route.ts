import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";
import { checkRole } from "@/lib/checkRole";

function generateTxnId(prefix: "DP" | "WD") {
  const digits = Math.floor(10000000 + Math.random() * 90000000);
  return `TXN-${prefix}-${digits}`;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const roleCheck = await checkRole(
      "Unauthorized: Only Admin or Bank Staff can process requests.",
    );
    if (!roleCheck.ok) return roleCheck.response;

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid request ID." }, { status: 400 });
    }

    const body = await req.json();
    const nextStatus = String(body?.status ?? "").trim();
    const rejectionReason = String(body?.rejectionReason ?? "").trim();

    if (nextStatus !== "Approved" && nextStatus !== "Rejected") {
      return NextResponse.json(
        { success: false, message: "Status must be Approved or Rejected." },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const requestsCol = db.collection("depositWithdrawalRequests");
    const reqDoc = await requestsCol.findOne({ _id: new ObjectId(id) });

    if (!reqDoc) {
      return NextResponse.json({ success: false, message: "Request not found." }, { status: 404 });
    }

    if (String(reqDoc.status ?? "") !== "Pending") {
      return NextResponse.json(
        { success: false, message: `Request is already ${String(reqDoc.status)}.` },
        { status: 400 },
      );
    }

    const nowIso = new Date().toISOString();

    if (nextStatus === "Rejected") {
      await requestsCol.updateOne(
        { _id: reqDoc._id },
        {
          $set: {
            status: "Rejected",
            rejectionReason: rejectionReason || "Rejected by reviewer.",
            reviewedBy: roleCheck.session.user.email ?? "",
            updatedAt: nowIso,
          },
        },
      );

      return NextResponse.json(
        { success: true, message: `${String(reqDoc.type)} request rejected.` },
        { status: 200 },
      );
    }

    // Approved -> update account balance & create transaction record
    if (!ObjectId.isValid(String(reqDoc.accountId ?? ""))) {
      return NextResponse.json(
        { success: false, message: "Associated bank account is invalid." },
        { status: 400 },
      );
    }

    const accountDoc = await db
      .collection("accounts")
      .findOne({ _id: new ObjectId(String(reqDoc.accountId)) });

    if (!accountDoc) {
      return NextResponse.json(
        { success: false, message: "Associated bank account not found." },
        { status: 404 },
      );
    }

    const amount = Number(reqDoc.amount ?? 0);
    const currentBalance = Number(accountDoc.balance ?? 0);
    const isDeposit = String(reqDoc.type ?? "") === "Deposit";

    const nextBalance = isDeposit
      ? Number((currentBalance + amount).toFixed(2))
      : Number((currentBalance - amount).toFixed(2));

    if (!isDeposit && nextBalance < Number(accountDoc.minBalance ?? 0)) {
      return NextResponse.json(
        { success: false, message: "Insufficient account balance to approve withdrawal." },
        { status: 400 },
      );
    }

    await db.collection("accounts").updateOne(
      { _id: accountDoc._id },
      { $set: { balance: nextBalance, updatedAt: nowIso } },
    );

    const ownerId = String(accountDoc.ownerId ?? accountDoc.customerId ?? reqDoc.customerId ?? "");
    if (ownerId && ObjectId.isValid(ownerId)) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(ownerId) },
        { $set: { totalBalance: nextBalance, updatedAt: nowIso } },
      );
    }

    const txnId = generateTxnId(isDeposit ? "DP" : "WD");
    await db.collection("transactions").insertOne({
      transactionId: txnId,
      senderAccount: isDeposit ? "BANK-VAULT" : String(accountDoc.accountNumber ?? ""),
      receiverAccount: isDeposit ? String(accountDoc.accountNumber ?? "") : "BANK-VAULT",
      customerId: String(reqDoc.customerId ?? ownerId),
      customerEmail: String(reqDoc.customerEmail ?? ""),
      type: isDeposit ? "Deposit" : "Withdrawal",
      amount,
      fee: 0,
      status: "Completed",
      description:
        String(reqDoc.description ?? "") ||
        `${String(reqDoc.type)} approved (Request ID: ${id})`,
      createdAt: nowIso,
    });

    await requestsCol.updateOne(
      { _id: reqDoc._id },
      {
        $set: {
          status: "Approved",
          transactionId: txnId,
          reviewedBy: roleCheck.session.user.email ?? "",
          updatedAt: nowIso,
        },
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: `${String(reqDoc.type)} of ৳${amount.toLocaleString("en-BD")} approved and recorded.`,
        data: { transactionId: txnId, newBalance: nextBalance },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/requests/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process request." },
      { status: 500 },
    );
  }
}