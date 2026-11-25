import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { isStaffOrAdmin } from "@/lib/checkRole";
import {
  calculateLoanSummary,
  getDefaultInterestRateByType,
} from "@/lib/loan.helper";

const ALLOWED_EMPLOYMENT_STATUSES = [
  "Salaried",
  "Self-Employed",
  "Business Owner",
  "Freelancer",
  "Other",
];

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in first." },
        { status: 401 },
      );
    }

    const db = await connectToDatabase();
    const filter: Record<string, unknown> = {};

    // Staff & Admin see all loan applications; Customers see only their own loans
    if (!isStaffOrAdmin(session.user.role)) {
      const userId = String(session.user.id ?? "").trim();
      const userEmail = String(session.user.email ?? "")
        .trim()
        .toLowerCase();

      if (userId && userEmail) {
        filter.$or = [{ customerId: userId }, { customerEmail: userEmail }];
      } else if (userId) {
        filter.customerId = userId;
      } else if (userEmail) {
        filter.customerEmail = userEmail;
      }
    }

    const docs = await db
      .collection("loans")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const loans = docs.map((doc) => {
      const requestedAmount = Number(doc.requestedAmount ?? 0);
      const durationMonths = Number(doc.durationMonths ?? 12);
      const loanType = String(doc.loanType ?? "");
      const summary = calculateLoanSummary({
        principal: requestedAmount,
        annualInterestRate:
          typeof doc.interestRate === "number"
            ? doc.interestRate
            : getDefaultInterestRateByType(loanType),
        durationMonths,
      });

      const totalPayable =
        typeof doc.totalPayable === "number"
          ? Number(doc.totalPayable)
          : summary.totalPayable;

      return {
        id: doc._id.toString(),
        loanType,
        requestedAmount,
        durationMonths,
        monthlyIncome: Number(doc.monthlyIncome ?? 0),
        employmentStatus: String(doc.employmentStatus ?? ""),
        description: String(doc.description ?? ""),
        interestRate: summary.annualInterestRate,
        totalPayable,
        monthlyInstallment:
          typeof doc.monthlyInstallment === "number"
            ? Number(doc.monthlyInstallment)
            : summary.monthlyInstallment,
        status: String(doc.status ?? "Pending"),
        customerId: String(doc.customerId ?? ""),
        customerName: String(doc.customerName ?? ""),
        customerEmail: String(doc.customerEmail ?? ""),
        staffNotes: String(doc.staffNotes ?? ""),
        remainingBalance: Number(doc.remainingBalance ?? totalPayable),
        createdAt: String(doc.createdAt ?? ""),
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Loans fetched successfully.",
        data: loans,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/loans error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch loans." },
      { status: 500 },
    );
  }
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
    const loanType = String(body?.loanType ?? "").trim();
    const requestedAmount = Number(body?.requestedAmount);
    const durationMonths = Number(body?.durationMonths);
    const monthlyIncome = Number(body?.monthlyIncome);
    const employmentStatus = String(body?.employmentStatus ?? "").trim();
    const description = String(body?.description ?? "").trim();

    if (
      !loanType ||
      Number.isNaN(requestedAmount) ||
      requestedAmount <= 0 ||
      Number.isNaN(durationMonths) ||
      durationMonths <= 0 ||
      Number.isNaN(monthlyIncome) ||
      monthlyIncome < 0 ||
      !ALLOWED_EMPLOYMENT_STATUSES.includes(employmentStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide valid loan type, requested amount, duration (months), monthly income, and employment status.",
        },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const createdAt = new Date().toISOString();
    const customerId = String(session.user.id ?? "").trim();
    const customerEmail = String(session.user.email ?? "")
      .trim()
      .toLowerCase();
    const customerName = String(
      session.user.name ?? session.user.email ?? "Customer",
    ).trim();

    const defaultRate = getDefaultInterestRateByType(loanType);
    const loanSummary = calculateLoanSummary({
      principal: requestedAmount,
      annualInterestRate: defaultRate,
      durationMonths,
    });

    const newLoanDoc = {
      loanType,
      requestedAmount,
      durationMonths,
      monthlyIncome,
      employmentStatus,
      description,
      interestRate: loanSummary.annualInterestRate,
      totalPayable: loanSummary.totalPayable,
      monthlyInstallment: loanSummary.monthlyInstallment,
      status: "Pending",
      customerId,
      customerName,
      customerEmail,
      staffNotes: "",
      remainingBalance: loanSummary.totalPayable,
      createdAt,
    };

    const insertResult = await db.collection("loans").insertOne(newLoanDoc);

    return NextResponse.json(
      {
        success: true,
        message: "Loan application submitted successfully.",
        data: {
          id: insertResult.insertedId.toString(),
          ...newLoanDoc,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/loans error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit loan application." },
      { status: 500 },
    );
  }
}