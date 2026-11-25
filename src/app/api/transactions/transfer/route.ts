import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

function generateTransferTxnId(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `TXN-FT-${randomDigits}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in first." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const fromAccountId = String(body?.fromAccountId ?? "").trim();
    const recipientAccountNumber = String(
      body?.recipientAccountNumber ?? "",
    )
      .trim()
      .toUpperCase();
    const amount = Number(body?.amount);
    const pin = String(body?.pin ?? "").trim();
    const description = String(body?.description ?? "").trim();

    if (!recipientAccountNumber || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid recipient account number and amount.",
        },
        { status: 400 },
      );
    }

    if (!/^\d{4,6}$/.test(pin)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid 4–6 digit transaction PIN.",
        },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const userId = String(session.user.id ?? "").trim();
    const userEmail = String(session.user.email ?? "")
      .trim()
      .toLowerCase();

    // 1. Verify customer & PIN
    const userFilters: Record<string, unknown>[] = [];
    if (userId && ObjectId.isValid(userId)) {
      userFilters.push({ _id: new ObjectId(userId) });
    }
    if (userEmail) {
      userFilters.push({ email: userEmail });
    }

    const userDoc =
      userFilters.length > 0
        ? await db.collection("users").findOne({ $or: userFilters })
        : null;

    if (!userDoc || !userDoc.pin) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction PIN is not configured for this user.",
        },
        { status: 400 },
      );
    }

    const isPinValid = await bcrypt.compare(pin, String(userDoc.pin));
    if (!isPinValid) {
      return NextResponse.json(
        { success: false, message: "Invalid transaction PIN." },
        { status: 401 },
      );
    }

    // 2. Find sender account belonging to current user
    const ownerConditions: Record<string, unknown>[] = [];
    if (userId) {
      ownerConditions.push({ customerId: userId }, { ownerId: userId });
    }
    if (userEmail) {
      ownerConditions.push({ ownerEmail: userEmail });
    }

    if (ownerConditions.length === 0) {
      return NextResponse.json(
        { success: false, message: "Unable to identify account owner." },
        { status: 403 },
      );
    }

    const senderFilter: Record<string, unknown> = { $or: ownerConditions };
    if (fromAccountId && ObjectId.isValid(fromAccountId)) {
      senderFilter._id = new ObjectId(fromAccountId);
    }

    const senderAccount = await db.collection("accounts").findOne(senderFilter);
    if (!senderAccount) {
      return NextResponse.json(
        { success: false, message: "Sender bank account not found." },
        { status: 404 },
      );
    }

    if (String(senderAccount.status ?? "Active") !== "Active") {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot transfer from a ${String(senderAccount.status)} account.`,
        },
        { status: 400 },
      );
    }

    // 3. Find receiver account
    const receiverAccount = await db.collection("accounts").findOne({
      accountNumber: recipientAccountNumber,
    });

    if (!receiverAccount) {
      return NextResponse.json(
        { success: false, message: "Recipient bank account not found." },
        { status: 404 },
      );
    }

    if (senderAccount._id.toString() === receiverAccount._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot transfer funds to the same bank account.",
        },
        { status: 400 },
      );
    }

    if (String(receiverAccount.status ?? "Active") !== "Active") {
      return NextResponse.json(
        {
          success: false,
          message: "Recipient bank account is not Active.",
        },
        { status: 400 },
      );
    }

    // 4. Validate limits & balance
    const senderBalance = Number(senderAccount.balance ?? 0);
    const minBalance = Number(senderAccount.minBalance ?? 0);
    const maxSingle = Number(senderAccount.maxSingleTransaction ?? 25000);
    const dailyLimit = Number(senderAccount.dailyLimit ?? 50000);
    const transferAmount = Number(amount.toFixed(2));

    if (transferAmount > maxSingle) {
      return NextResponse.json(
        {
          success: false,
          message: `Amount exceeds maximum single transaction limit (৳${maxSingle.toLocaleString("en-BD")}).`,
        },
        { status: 400 },
      );
    }

    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const todayOutgoingTxns = await db
      .collection("transactions")
      .find({
        senderAccount: String(senderAccount.accountNumber),
        type: { $in: ["Transfer", "Fund Transfer"] },
        status: "Completed",
        createdAt: { $gte: todayStart.toISOString() },
      })
      .toArray();

    const spentToday = todayOutgoingTxns.reduce(
      (sum, t) => sum + Number(t.amount ?? 0),
      0,
    );

    if (spentToday + transferAmount > dailyLimit) {
      return NextResponse.json(
        {
          success: false,
          message: `Daily transfer limit exceeded (Used today: ৳${spentToday.toLocaleString("en-BD")}, Limit: ৳${dailyLimit.toLocaleString("en-BD")}).`,
        },
        { status: 400 },
      );
    }

    if (senderBalance < transferAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient balance (Available: ৳${senderBalance.toLocaleString("en-BD")}).`,
        },
        { status: 400 },
      );
    }

    const nextSenderBalance = Number((senderBalance - transferAmount).toFixed(2));
    if (nextSenderBalance < minBalance) {
      return NextResponse.json(
        {
          success: false,
          message: `Transfer would breach minimum required balance (৳${minBalance.toLocaleString("en-BD")}).`,
        },
        { status: 400 },
      );
    }

    const nextReceiverBalance = Number(
      (Number(receiverAccount.balance ?? 0) + transferAmount).toFixed(2),
    );
    const nowIso = new Date().toISOString();
    const transactionId = generateTransferTxnId();

    // 5. Update both accounts and record transaction
    await db.collection("accounts").updateOne(
      { _id: senderAccount._id },
      { $set: { balance: nextSenderBalance, updatedAt: nowIso } },
    );

    await db.collection("accounts").updateOne(
      { _id: receiverAccount._id },
      { $set: { balance: nextReceiverBalance, updatedAt: nowIso } },
    );

    const senderOwnerId = String(
      senderAccount.ownerId ?? senderAccount.customerId ?? userId,
    );
    if (senderOwnerId && ObjectId.isValid(senderOwnerId)) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(senderOwnerId) },
        { $set: { totalBalance: nextSenderBalance, updatedAt: nowIso } },
      );
    }

    const receiverOwnerId = String(
      receiverAccount.ownerId ?? receiverAccount.customerId ?? "",
    );
    if (receiverOwnerId && ObjectId.isValid(receiverOwnerId)) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(receiverOwnerId) },
        { $set: { totalBalance: nextReceiverBalance, updatedAt: nowIso } },
      );
    }

    await db.collection("transactions").insertOne({
      transactionId,
      senderAccount: String(senderAccount.accountNumber),
      receiverAccount: String(receiverAccount.accountNumber),
      customerId: senderOwnerId,
      customerEmail: userEmail,
      type: "Transfer",
      amount: transferAmount,
      fee: 0,
      status: "Completed",
      description:
        description ||
        `Fund transfer to ${String(receiverAccount.accountNumber)}`,
      createdAt: nowIso,
    });

    return NextResponse.json(
      {
        success: true,
        message: `৳${transferAmount.toLocaleString("en-BD")} transferred to ${String(receiverAccount.accountNumber)}.`,
        data: {
          transactionId,
          amount: transferAmount,
          senderAccount: String(senderAccount.accountNumber),
          receiverAccount: String(receiverAccount.accountNumber),
          newBalance: nextSenderBalance,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/transactions/transfer error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process fund transfer." },
      { status: 500 },
    );
  }
}