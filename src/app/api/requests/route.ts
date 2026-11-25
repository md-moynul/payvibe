import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { isStaffOrAdmin } from "@/lib/checkRole";

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

    if (!isStaffOrAdmin(session.user.role)) {
      const userId = String(session.user.id ?? "").trim();
      const userEmail = String(session.user.email ?? "")
        .trim()
        .toLowerCase();

      const orConditions: Record<string, unknown>[] = [];
      if (userId) orConditions.push({ customerId: userId });
      if (userEmail) orConditions.push({ customerEmail: userEmail });
      if (orConditions.length > 0) filter.$or = orConditions;
    }

    const docs = await db
      .collection("depositWithdrawalRequests")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const requests = docs.map((doc) => ({
      id: doc._id.toString(),
      accountId: String(doc.accountId ?? ""),
      accountNumber: String(doc.accountNumber ?? ""),
      type: String(doc.type ?? "Deposit"),
      amount: Number(doc.amount ?? 0),
      description: String(doc.description ?? ""),
      status: String(doc.status ?? "Pending"),
      customerId: String(doc.customerId ?? ""),
      customerEmail: String(doc.customerEmail ?? ""),
      customerName: String(doc.customerName ?? ""),
      rejectionReason: String(doc.rejectionReason ?? ""),
      createdAt: String(doc.createdAt ?? ""),
    }));

    return NextResponse.json(
      { success: true, message: "Requests fetched successfully.", data: requests },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/requests error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch requests." },
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
    const type = String(body?.type ?? "").trim();
    const amount = Number(body?.amount);
    const description = String(body?.description ?? "").trim();
    const rawAccountId = String(body?.accountId ?? "").trim();

    if ((type !== "Deposit" && type !== "Withdrawal") || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Please provide valid type (Deposit/Withdrawal) and amount." },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const userId = String(session.user.id ?? "").trim();
    const userEmail = String(session.user.email ?? "").trim().toLowerCase();

    const ownerFilters: Record<string, unknown>[] = [];
    if (userId) ownerFilters.push({ customerId: userId }, { ownerId: userId });
    if (userEmail) ownerFilters.push({ ownerEmail: userEmail });

    const accountFilter: Record<string, unknown> = { $or: ownerFilters };
    if (rawAccountId && ObjectId.isValid(rawAccountId)) {
      accountFilter._id = new ObjectId(rawAccountId);
    }

    const account = await db.collection("accounts").findOne(accountFilter);
    if (!account) {
      return NextResponse.json(
        { success: false, message: "Bank account not found for this customer." },
        { status: 404 },
      );
    }

    if (String(account.status ?? "Active") !== "Active") {
      return NextResponse.json(
        { success: false, message: "Account must be Active to submit a request." },
        { status: 400 },
      );
    }

    if (type === "Withdrawal") {
      const balance = Number(account.balance ?? 0);
      const minBalance = Number(account.minBalance ?? 0);
      if (balance - amount < minBalance) {
        return NextResponse.json(
          { success: false, message: "Insufficient balance for this withdrawal request." },
          { status: 400 },
        );
      }
    }

    const createdAt = new Date().toISOString();
    const doc = {
      accountId: account._id.toString(),
      accountNumber: String(account.accountNumber ?? ""),
      type,
      amount: Number(amount.toFixed(2)),
      description,
      status: "Pending",
      customerId: userId,
      customerEmail: userEmail,
      customerName: String(session.user.name ?? session.user.email ?? "Customer"),
      rejectionReason: "",
      createdAt,
    };

    const insertResult = await db.collection("depositWithdrawalRequests").insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        message: `${type} request submitted for approval.`,
        data: { id: insertResult.insertedId.toString(), ...doc },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/requests error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit request." },
      { status: 500 },
    );
  }
}