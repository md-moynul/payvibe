import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

const REPAYMENT_START_DAY = 1;
const REPAYMENT_END_DAY = 10;

function checkRepaymentWindow(now: Date = new Date()): {
  isOpen: boolean;
  message: string;
} {
  const dayOfMonth = now.getDate();
  if (dayOfMonth >= REPAYMENT_START_DAY && dayOfMonth <= REPAYMENT_END_DAY) {
    return {
      isOpen: true,
      message: "Repayment window is open.",
    };
  }

  const nextWindowDate =
    dayOfMonth < REPAYMENT_START_DAY
      ? new Date(now.getFullYear(), now.getMonth(), REPAYMENT_START_DAY)
      : new Date(now.getFullYear(), now.getMonth() + 1, REPAYMENT_START_DAY);

  const formattedNextDate = nextWindowDate.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return {
    isOpen: false,
    message: `Loan installments can only be paid between the ${REPAYMENT_START_DAY}st and ${REPAYMENT_END_DAY}th of each month. Next repayment window opens on ${formattedNextDate}.`,
  };
}

function generateRepaymentTxnId(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `TXN-RP-${randomDigits}`;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in first." },
        { status: 401 },
      );
    }

    // Enforce monthly installment payment window (1st - 10th of each month)
    const now = new Date();
    const repaymentWindow = checkRepaymentWindow(now);
    if (!repaymentWindow.isOpen) {
      return NextResponse.json(
        { success: false, message: repaymentWindow.message },
        { status: 400 },
      );
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid loan ID." },
        { status: 400 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const db = await connectToDatabase();
    const loansCollection = db.collection("loans");

    const loanDoc = await loansCollection.findOne({ _id: new ObjectId(id) });
    if (!loanDoc) {
      return NextResponse.json(
        { success: false, message: "Loan not found." },
        { status: 404 },
      );
    }

    const userId = String(session.user.id ?? "").trim();
    const userEmail = String(session.user.email ?? "")
      .trim()
      .toLowerCase();
    const loanCustomerId = String(loanDoc.customerId ?? "").trim();
    const loanCustomerEmail = String(loanDoc.customerEmail ?? "")
      .trim()
      .toLowerCase();

    const isOwner =
      (userId && loanCustomerId && userId === loanCustomerId) ||
      (userEmail && loanCustomerEmail && userEmail === loanCustomerEmail);

    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: You can only repay your own loan.",
        },
        { status: 403 },
      );
    }

    const status = String(loanDoc.status ?? "");
    if (status !== "Active" && status !== "Approved") {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot repay a loan with status "${status}". Only Active loans can be repaid.`,
        },
        { status: 400 },
      );
    }

    const currentRemaining = Number(
      loanDoc.remainingBalance ??
        loanDoc.totalPayable ??
        loanDoc.requestedAmount ??
        0,
    );

    if (currentRemaining <= 0) {
      return NextResponse.json(
        { success: false, message: "This loan is already fully paid." },
        { status: 400 },
      );
    }

    const defaultInstallment =
      Number(loanDoc.monthlyInstallment ?? 0) > 0
        ? Math.min(Number(loanDoc.monthlyInstallment), currentRemaining)
        : currentRemaining;

    const requestedPay =
      body?.amount !== undefined && body?.amount !== null && body?.amount !== ""
        ? Number(body.amount)
        : defaultInstallment;

    if (Number.isNaN(requestedPay) || requestedPay <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid repayment amount." },
        { status: 400 },
      );
    }

    const payAmount = Number(
      Math.min(requestedPay, currentRemaining).toFixed(2),
    );

    const accountFilters: Record<string, unknown>[] = [];
    if (loanCustomerId) {
      accountFilters.push(
        { customerId: loanCustomerId },
        { ownerId: loanCustomerId },
      );
    }
    if (loanCustomerEmail) {
      accountFilters.push({ ownerEmail: loanCustomerEmail });
    }

    const customerAccount =
      accountFilters.length > 0
        ? await db.collection("accounts").findOne({ $or: accountFilters })
        : null;

    if (!customerAccount) {
      return NextResponse.json(
        {
          success: false,
          message: "No bank account found to pay the loan installment.",
        },
        { status: 404 },
      );
    }

    if (String(customerAccount.status ?? "Active") !== "Active") {
      return NextResponse.json(
        {
          success: false,
          message: "Your bank account is not Active for repayment.",
        },
        { status: 400 },
      );
    }

    const currentAccountBalance = Number(customerAccount.balance ?? 0);
    if (currentAccountBalance < payAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient account balance (Available: ৳${currentAccountBalance.toLocaleString("en-BD")}).`,
        },
        { status: 400 },
      );
    }

    const nextAccountBalance = Number(
      (currentAccountBalance - payAmount).toFixed(2),
    );
    const nextRemainingBalance = Number(
      Math.max(0, currentRemaining - payAmount).toFixed(2),
    );
    const nextLoanStatus = nextRemainingBalance <= 0 ? "Completed" : "Active";
    const nowIso = now.toISOString();
    const transactionId = generateRepaymentTxnId();

    await db.collection("accounts").updateOne(
      { _id: customerAccount._id },
      {
        $set: {
          balance: nextAccountBalance,
          updatedAt: nowIso,
        },
      },
    );

    if (loanCustomerId && ObjectId.isValid(loanCustomerId)) {
      await db.collection("users").updateOne(
        { _id: new ObjectId(loanCustomerId) },
        {
          $set: {
            totalBalance: nextAccountBalance,
            updatedAt: nowIso,
          },
        },
      );
    }

    await db.collection("transactions").insertOne({
      transactionId,
      senderAccount: String(customerAccount.accountNumber ?? ""),
      senderAccountId: customerAccount._id.toString(),
      receiverAccount: "BANK-LOAN-COLLECTION",
      customerId: loanCustomerId,
      customerEmail: loanCustomerEmail,
      loanId: id,
      type: "Loan Repayment",
      amount: payAmount,
      fee: 0,
      status: "Completed",
      paymentStatus: "On Time",
      description: `Loan installment repayment for ${String(loanDoc.loanType ?? "Loan")} (Loan ID: ${id})`,
      createdAt: nowIso,
    });

    await loansCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          remainingBalance: nextRemainingBalance,
          status: nextLoanStatus,
          lastRepaymentAt: nowIso,
          updatedAt: nowIso,
        },
      },
    );

    return NextResponse.json(
      {
        success: true,
        message:
          nextLoanStatus === "Completed"
            ? `৳${payAmount.toLocaleString("en-BD")} paid. Loan is now fully Completed!`
            : `Installment of ৳${payAmount.toLocaleString("en-BD")} paid successfully.`,
        data: {
          id,
          status: nextLoanStatus,
          paidAmount: payAmount,
          remainingBalance: nextRemainingBalance,
          transactionId,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/loans/[id]/repay error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process loan repayment." },
      { status: 500 },
    );
  }
}