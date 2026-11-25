import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { isStaffOrAdmin } from "@/lib/checkRole";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in first." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const search = String(searchParams.get("search") ?? "").trim();
    const type = String(searchParams.get("type") ?? "").trim();
    const status = String(searchParams.get("status") ?? "").trim();
    const from = String(searchParams.get("from") ?? "").trim();
    const to = String(searchParams.get("to") ?? "").trim();
    const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") ?? 10) || 10),
    );

    const db = await connectToDatabase();
    const filter: Record<string, unknown> = {};
    const conditions: Record<string, unknown>[] = [];

    // Customers can only view transactions tied to their own accounts or user info
    if (!isStaffOrAdmin(session.user.role)) {
      const userId = String(session.user.id ?? "").trim();
      const userEmail = String(session.user.email ?? "")
        .trim()
        .toLowerCase();

      const ownAccountFilters: Record<string, unknown>[] = [];
      if (userId) {
        ownAccountFilters.push({ customerId: userId }, { ownerId: userId });
      }
      if (userEmail) {
        ownAccountFilters.push({ ownerEmail: userEmail });
      }

      const userAccounts =
        ownAccountFilters.length > 0
          ? await db
              .collection("accounts")
              .find({ $or: ownAccountFilters })
              .toArray()
          : [];

      const accountNumbers = userAccounts
        .map((acc) => String(acc.accountNumber ?? "").trim())
        .filter(Boolean);

      const customerConditions: Record<string, unknown>[] = [];
      if (userId) customerConditions.push({ customerId: userId });
      if (userEmail) customerConditions.push({ customerEmail: userEmail });
      if (accountNumbers.length > 0) {
        customerConditions.push(
          { senderAccount: { $in: accountNumbers } },
          { receiverAccount: { $in: accountNumbers } },
        );
      }

      if (customerConditions.length > 0) {
        conditions.push({ $or: customerConditions });
      } else {
        conditions.push({ _id: null });
      }
    }

    if (type && type !== "ALL") {
      conditions.push({ type });
    }

    if (status && status !== "ALL") {
      if (status === "Flagged") {
        conditions.push({ $or: [{ status: "Flagged" }, { flagged: true }] });
      } else {
        conditions.push({ status });
      }
    }

    if (from || to) {
      const dateRange: Record<string, string> = {};
      if (from) dateRange.$gte = `${from}T00:00:00.000Z`;
      if (to) dateRange.$lte = `${to}T23:59:59.999Z`;
      conditions.push({ createdAt: dateRange });
    }

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      conditions.push({
        $or: [
          { transactionId: regex },
          { senderAccount: regex },
          { receiverAccount: regex },
          { description: regex },
        ],
      });
    }

    if (conditions.length > 0) {
      filter.$and = conditions;
    }

    const txnCollection = db.collection("transactions");
    const total = await txnCollection.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const docs = await txnCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit)
      .toArray();

    const transactions = docs.map((doc) => ({
      id: doc._id.toString(),
      transactionId: String(doc.transactionId ?? doc._id.toString()),
      type: String(doc.type ?? "Transfer"),
      amount: Number(doc.amount ?? 0),
      fee: Number(doc.fee ?? 0),
      status: String(doc.status ?? "Completed"),
      senderAccount: String(doc.senderAccount ?? ""),
      receiverAccount: String(doc.receiverAccount ?? ""),
      customerId: String(doc.customerId ?? ""),
      customerEmail: String(doc.customerEmail ?? ""),
      description: String(doc.description ?? ""),
      flagged: Boolean(doc.flagged ?? doc.status === "Flagged"),
      flagReason: String(doc.flagReason ?? ""),
      createdAt: String(doc.createdAt ?? ""),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Transactions fetched successfully.",
        data: transactions,
        pagination: {
          total,
          page: safePage,
          limit,
          totalPages,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions." },
      { status: 500 },
    );
  }
}