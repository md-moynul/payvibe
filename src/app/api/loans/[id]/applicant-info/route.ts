import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";
import { checkRole } from "@/lib/checkRole";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const roleCheck = await checkRole(
      "Unauthorized: Only Admin or Bank Staff can view applicant details.",
    );
    if (!roleCheck.ok) return roleCheck.response;

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid loan ID." },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const loanDoc = await db
      .collection("loans")
      .findOne({ _id: new ObjectId(id) });

    if (!loanDoc) {
      return NextResponse.json(
        { success: false, message: "Loan application not found." },
        { status: 404 },
      );
    }

    const customerId = String(loanDoc.customerId ?? "").trim();
    const customerEmail = String(loanDoc.customerEmail ?? "")
      .trim()
      .toLowerCase();

    const userFilters: Record<string, unknown>[] = [];
    if (customerId && ObjectId.isValid(customerId)) {
      userFilters.push({ _id: new ObjectId(customerId) });
    }
    if (customerEmail) {
      userFilters.push({ email: customerEmail });
    }

    const customerDoc =
      userFilters.length > 0
        ? await db.collection("users").findOne({ $or: userFilters })
        : null;

    const accountFilters: Record<string, unknown>[] = [];
    if (customerId) {
      accountFilters.push({ customerId }, { ownerId: customerId });
    }
    if (customerEmail) {
      accountFilters.push({ ownerEmail: customerEmail });
    }

    const accountDoc =
      accountFilters.length > 0
        ? await db.collection("accounts").findOne({ $or: accountFilters })
        : null;

    const loanFilters: Record<string, unknown>[] = [];
    if (customerId) loanFilters.push({ customerId });
    if (customerEmail) loanFilters.push({ customerEmail });

    const previousLoans =
      loanFilters.length > 0
        ? await db
            .collection("loans")
            .find({
              _id: { $ne: new ObjectId(id) },
              $or: loanFilters,
            })
            .sort({ createdAt: -1 })
            .toArray()
        : [];

    const lastLoanDoc = previousLoans[0] ?? null;

    const repaymentTxns =
      loanFilters.length > 0
        ? await db
            .collection("transactions")
            .find({
              type: "Loan Repayment",
              $or: loanFilters,
            })
            .sort({ createdAt: -1 })
            .toArray()
        : [];

    let repaymentTimeliness:
      | "No Previous Loan"
      | "Timely Paid"
      | "Late / Missed Installment"
      | "Partially Paid / Active" = "No Previous Loan";

    let totalPaidAmount = 0;

    if (lastLoanDoc) {
      const lastLoanId = lastLoanDoc._id.toString();
      const matchedRepayments = repaymentTxns.filter(
        (t) =>
          String(t.loanId ?? "") === lastLoanId ||
          String(t.description ?? "").includes(lastLoanId),
      );

      totalPaidAmount = matchedRepayments.reduce(
        (sum, t) => sum + Number(t.amount ?? 0),
        0,
      );

      const hasLateInstallment = matchedRepayments.some(
        (t) =>
          Boolean(t.isLate) ||
          String(t.paymentStatus ?? "").toLowerCase() === "late" ||
          String(t.paymentStatus ?? "").toLowerCase() === "overdue",
      );

      const totalPayable = Number(
        lastLoanDoc.totalPayable ?? lastLoanDoc.requestedAmount ?? 0,
      );
      const remaining = Number(
        lastLoanDoc.remainingBalance ?? Math.max(0, totalPayable - totalPaidAmount),
      );

      if (hasLateInstallment) {
        repaymentTimeliness = "Late / Missed Installment";
      } else if (
        String(lastLoanDoc.status ?? "") === "Completed" ||
        remaining <= 0
      ) {
        repaymentTimeliness = "Timely Paid";
      } else {
        repaymentTimeliness = "Partially Paid / Active";
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          currentLoan: {
            id: loanDoc._id.toString(),
            loanType: String(loanDoc.loanType ?? "Loan"),
            requestedAmount: Number(loanDoc.requestedAmount ?? 0),
            durationMonths: Number(loanDoc.durationMonths ?? 0),
            interestRate: Number(loanDoc.interestRate ?? 0),
            totalPayable: Number(
              loanDoc.totalPayable ?? loanDoc.requestedAmount ?? 0,
            ),
            monthlyInstallment: Number(loanDoc.monthlyInstallment ?? 0),
            status: String(loanDoc.status ?? "Pending"),
            description: String(loanDoc.description ?? ""),
            staffNotes: String(loanDoc.staffNotes ?? ""),
            createdAt: String(loanDoc.createdAt ?? ""),
          },
          applicant: {
            name: String(
              customerDoc?.name ?? loanDoc.customerName ?? "Customer",
            ),
            email: String(customerDoc?.email ?? loanDoc.customerEmail ?? ""),
            phone: String(customerDoc?.phone ?? "N/A"),
            status: String(customerDoc?.status ?? "Active"),
            kycVerified: Boolean(customerDoc?.kycVerified ?? false),
            monthlyIncome: Number(loanDoc.monthlyIncome ?? 0),
            employmentStatus: String(loanDoc.employmentStatus ?? "N/A"),
          },
          account: accountDoc
            ? {
                accountNumber: String(accountDoc.accountNumber ?? "N/A"),
                accountType: String(accountDoc.accountType ?? "N/A"),
                balance: Number(accountDoc.balance ?? 0),
                currency: String(accountDoc.currency ?? "BDT"),
                status: String(accountDoc.status ?? "Active"),
              }
            : null,
          lastLoan: lastLoanDoc
            ? {
                id: lastLoanDoc._id.toString(),
                loanType: String(lastLoanDoc.loanType ?? "Loan"),
                requestedAmount: Number(lastLoanDoc.requestedAmount ?? 0),
                totalPayable: Number(
                  lastLoanDoc.totalPayable ?? lastLoanDoc.requestedAmount ?? 0,
                ),
                remainingBalance: Number(
                  lastLoanDoc.remainingBalance ??
                    lastLoanDoc.requestedAmount ??
                    0,
                ),
                durationMonths: Number(lastLoanDoc.durationMonths ?? 0),
                status: String(lastLoanDoc.status ?? "Pending"),
                paidAmount: totalPaidAmount,
                repaymentTimeliness,
                createdAt: String(lastLoanDoc.createdAt ?? ""),
              }
            : null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/loans/[id]/applicant-info error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load applicant information." },
      { status: 500 },
    );
  }
}