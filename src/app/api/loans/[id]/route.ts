import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";
import { checkAdminRole, checkRole, isAdminOnly } from "@/lib/checkRole";

function generateTransactionId(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `TXN-LN-${randomDigits}`;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid loan ID." },
        { status: 400 },
      );
    }

    const body = await req.json();
    const staffNotes =
      typeof body?.staffNotes === "string" ? body.staffNotes.trim() : undefined;
    const requestedStatus =
      typeof body?.status === "string" ? body.status.trim() : undefined;
    const rejectionReason =
      typeof body?.rejectionReason === "string"
        ? body.rejectionReason.trim()
        : undefined;

    const isAdminDecision =
      requestedStatus === "Approved" || requestedStatus === "Rejected";

    if (isAdminDecision) {
      const adminCheck = await checkAdminRole(
        "Unauthorized: Only Admin can approve or reject loan applications.",
      );
      if (!adminCheck.ok) return adminCheck.response;
    } else {
      const roleCheck = await checkRole(
        "Unauthorized: Only Admin or Bank Staff can update loan applications.",
      );
      if (!roleCheck.ok) return roleCheck.response;
    }

    const session = isAdminDecision
      ? (await checkAdminRole()).session
      : (await checkRole()).session;

    const db = await connectToDatabase();
    const loansCollection = db.collection("loans");
    const loanDoc = await loansCollection.findOne({ _id: new ObjectId(id) });

    if (!loanDoc) {
      return NextResponse.json(
        { success: false, message: "Loan application not found." },
        { status: 404 },
      );
    }

    const currentStatus = String(loanDoc.status ?? "Pending");
    if (
      currentStatus === "Approved" ||
      currentStatus === "Active" ||
      currentStatus === "Rejected" ||
      currentStatus === "Completed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot modify a loan that is already ${currentStatus}.`,
        },
        { status: 409 },
      );
    }

    // Staff workflow: only add internal notes and forward to "Under Review"
    if (!isAdminDecision) {
      const userRole = session?.user?.role;
      if (!isAdminOnly(userRole)) {
        if (
          requestedStatus &&
          requestedStatus !== "Under Review" &&
          requestedStatus !== "Pending"
        ) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Bank Staff cannot approve or reject loans directly. Applications can only be forwarded for Admin review.",
            },
            { status: 403 },
          );
        }

        if (!staffNotes) {
          return NextResponse.json(
            {
              success: false,
              message: "Internal staff notes are required before forwarding.",
            },
            { status: 400 },
          );
        }
      }

      const staffUpdate: Record<string, unknown> = {
        updatedAt: new Date().toISOString(),
        status: "Under Review",
      };

      if (typeof staffNotes === "string") {
        staffUpdate.staffNotes = staffNotes;
        staffUpdate.reviewedBy = session?.user?.email ?? "";
      }

      const updatedStaffLoan = await loansCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: staffUpdate },
        { returnDocument: "after" },
      );

      return NextResponse.json(
        {
          success: true,
          message: "Internal notes saved and loan forwarded to Admin.",
          data: {
            id: updatedStaffLoan?._id.toString() ?? id,
            status: String(updatedStaffLoan?.status ?? "Under Review"),
            staffNotes: String(updatedStaffLoan?.staffNotes ?? ""),
          },
        },
        { status: 200 },
      );
    }

    // Admin workflow: Reject loan
    if (requestedStatus === "Rejected") {
      const updatedRejected = await loansCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "Rejected",
            rejectionReason:
              rejectionReason || "Rejected by Admin after loan review.",
            reviewedByAdmin: session?.user?.email ?? "",
            updatedAt: new Date().toISOString(),
          },
        },
        { returnDocument: "after" },
      );

      return NextResponse.json(
        {
          success: true,
          message: "Loan application rejected.",
          data: {
            id: updatedRejected?._id.toString() ?? id,
            status: "Rejected",
          },
        },
        { status: 200 },
      );
    }

    // Admin workflow: Approve loan + disburse funds via recorded transaction
    const loanAmount = Number(loanDoc.requestedAmount ?? 0);
    const customerId = String(loanDoc.customerId ?? "").trim();
    const customerEmail = String(loanDoc.customerEmail ?? "")
      .trim()
      .toLowerCase();

    const accountFilters: Record<string, unknown>[] = [];
    if (customerId) {
      accountFilters.push({ customerId }, { ownerId: customerId });
    }
    if (customerEmail) {
      accountFilters.push({ ownerEmail: customerEmail });
    }

    const customerAccount =
      accountFilters.length > 0
        ? await db.collection("accounts").findOne({ $or: accountFilters })
        : null;

    if (!customerAccount) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer does not have an active bank account to disburse the approved loan.",
        },
        { status: 400 },
      );
    }

    const currentBalance = Number(customerAccount.balance ?? 0);
    const nextBalance = currentBalance + loanAmount;
    const nowIso = new Date().toISOString();
    const transactionId = generateTransactionId();

    await db.collection("accounts").updateOne(
      { _id: customerAccount._id },
      {
        $set: {
          balance: nextBalance,
          updatedAt: nowIso,
        },
      },
    );

    if (customerId && ObjectId.isValid(customerId)) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(customerId) },
        {
          $set: {
            totalBalance: nextBalance,
            updatedAt: nowIso,
          },
        },
      );
    }

    await db.collection("transactions").insertOne({
      transactionId,
      senderAccount: "BANK-LOAN-VAULT",
      receiverAccount: String(customerAccount.accountNumber ?? ""),
      receiverAccountId: customerAccount._id.toString(),
      customerId,
      customerEmail,
      type: "Loan Disbursement",
      amount: loanAmount,
      fee: 0,
      status: "Completed",
      description: `Loan disbursement for ${String(loanDoc.loanType ?? "Loan")} (Loan ID: ${id})`,
      createdAt: nowIso,
    });

    const updatedApproved = await loansCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "Active",
          approvedAt: nowIso,
          reviewedByAdmin: session?.user?.email ?? "",
          remainingBalance: loanAmount,
          disbursementTransactionId: transactionId,
          updatedAt: nowIso,
        },
      },
      { returnDocument: "after" },
    );

    return NextResponse.json(
      {
        success: true,
        message: `Loan approved and ৳${loanAmount.toLocaleString("en-BD")} disbursed.`,
        data: {
          id: updatedApproved?._id.toString() ?? id,
          status: "Active",
          disbursedAmount: loanAmount,
          transactionId,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/loans/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update loan application." },
      { status: 500 },
    );
  }
}
