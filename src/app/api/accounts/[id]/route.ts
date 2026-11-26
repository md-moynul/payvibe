import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import type {
  IAccount,
  TAccountStatus,
  TAccountType,
} from "@/types/account.type";
import { checkRole, isStaffOrAdmin } from "@/lib/checkRole";

// TODO: Add audit log / activity tracking when account limits or Frozen status are updated

const ALLOWED_ACCOUNT_TYPES: TAccountType[] = [
  "Savings Account",
  "Current Account",
  "Business Account",
];

const ALLOWED_ACCOUNT_STATUSES: TAccountStatus[] = [
  "Active",
  "Frozen",
  "Inactive",
];

function buildAccountFilter(rawId: string) {
  const filters: Record<string, unknown>[] = [
    { customerId: rawId },
    { ownerId: rawId },
  ];
  if (ObjectId.isValid(rawId)) {
    filters.unshift({ _id: new ObjectId(rawId) });
  }
  if (rawId.includes("@")) {
    filters.push({ ownerEmail: rawId.toLowerCase() });
  }
  return { $or: filters };
}

export async function GET(
  _req: NextRequest,
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

    const { id } = await context.params;
    const rawId = decodeURIComponent(id ?? "").trim();

    if (!rawId) {
      return NextResponse.json(
        { success: false, message: "Account ID is required." },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const accountDoc = await db
      .collection("accounts")
      .findOne(buildAccountFilter(rawId));

    if (!accountDoc) {
      return NextResponse.json(
        { success: false, message: "Bank account not found." },
        { status: 404 },
      );
    }

    // Strict ownership verification for customers / non-staff users
    if (!isStaffOrAdmin(session.user.role)) {
      const userId = String(session.user.id ?? "").trim();
      const userEmail = String(session.user.email ?? "")
        .trim()
        .toLowerCase();

      const docCustomerId = String(accountDoc.customerId ?? "").trim();
      const docOwnerId = String(accountDoc.ownerId ?? "").trim();
      const docOwnerEmail = String(accountDoc.ownerEmail ?? "")
        .trim()
        .toLowerCase();
      const docCustomerEmail = String(accountDoc.customerEmail ?? "")
        .trim()
        .toLowerCase();

      const isOwner =
        (userId && (docCustomerId === userId || docOwnerId === userId)) ||
        (userEmail &&
          (docOwnerEmail === userEmail || docCustomerEmail === userEmail));

      if (!isOwner) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Forbidden: You do not have permission to access this bank account.",
          },
          { status: 403 },
        );
      }
    }

    // TODO: Fetch owner details from users collection if ownerEmail/ownerPhone is needed on details page
    const account: IAccount = {
      id: accountDoc._id.toString(),
      accountNumber: String(accountDoc.accountNumber ?? ""),
      accountType: (accountDoc.accountType ??
        "Savings Account") as TAccountType,
      balance: Number(accountDoc.balance ?? 0),
      status: (accountDoc.status ?? "Active") as TAccountStatus,
      currency: String(accountDoc.currency ?? "BDT"),
      ownerId: String(accountDoc.customerId ?? accountDoc.ownerId ?? ""),
      ownerName: String(accountDoc.ownerName ?? ""),
      dailyLimit: Number(accountDoc.dailyLimit ?? 50000),
      maxSingleTransaction: Number(accountDoc.maxSingleTransaction ?? 25000),
      minBalance: Number(accountDoc.minBalance ?? 500),
      createdAt: String(accountDoc.createdAt ?? ""),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Bank account fetched successfully.",
        data: account,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get account by id error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching account.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const roleCheck = await checkRole();
    if (!roleCheck.ok) return roleCheck.response;

    const { id } = await context.params;
    const rawId = decodeURIComponent(id ?? "").trim();

    if (!rawId) {
      return NextResponse.json(
        { success: false, message: "Account ID is required." },
        { status: 400 },
      );
    }

    const body = await req.json();
    const db = await connectToDatabase();

    // Find account by account _id, customerId/ownerId, or customer email fallback
    const existingAccount = await db
      .collection("accounts")
      .findOne(buildAccountFilter(rawId));

    if (!existingAccount) {
      return NextResponse.json(
        { success: false, message: "Bank account not found." },
        { status: 404 },
      );
    }

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    // 1. Handle Status update (e.g., Freeze)
    if (typeof body?.status === "string" && body.status.trim()) {
      const nextStatus = body.status.trim() as TAccountStatus;
      if (!ALLOWED_ACCOUNT_STATUSES.includes(nextStatus)) {
        return NextResponse.json(
          { success: false, message: "Invalid account status." },
          { status: 400 },
        );
      }
      updateFields.status = nextStatus;

      if (typeof body?.reason === "string" && body.reason.trim()) {
        updateFields.statusReason = body.reason.trim();
      }
    }

    // 2. Handle Edit fields (accountType, minBalance, dailyLimit, maxSingleTransaction)
    if (body?.accountType !== undefined) {
      if (!ALLOWED_ACCOUNT_TYPES.includes(body.accountType)) {
        return NextResponse.json(
          { success: false, message: "Invalid account type." },
          { status: 400 },
        );
      }
      updateFields.accountType = body.accountType;
    }

    const nextMinBalance =
      body?.minBalance !== undefined
        ? Number(body.minBalance)
        : Number(existingAccount.minBalance ?? 0);

    const nextDailyLimit =
      body?.dailyLimit !== undefined
        ? Number(body.dailyLimit)
        : Number(existingAccount.dailyLimit ?? 50000);

    const nextMaxSingle =
      body?.maxSingleTransaction !== undefined
        ? Number(body.maxSingleTransaction)
        : Number(existingAccount.maxSingleTransaction ?? 25000);

    if (
      Number.isNaN(nextMinBalance) ||
      nextMinBalance < 0 ||
      Number.isNaN(nextDailyLimit) ||
      nextDailyLimit <= 0 ||
      Number.isNaN(nextMaxSingle) ||
      nextMaxSingle <= 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid limit or balance values." },
        { status: 400 },
      );
    }

    if (body?.minBalance !== undefined) {
      updateFields.minBalance = nextMinBalance;
    }
    if (body?.dailyLimit !== undefined) {
      updateFields.dailyLimit = nextDailyLimit;
    }
    if (body?.maxSingleTransaction !== undefined) {
      updateFields.maxSingleTransaction = nextMaxSingle;
    }

    await db
      .collection("accounts")
      .updateOne({ _id: existingAccount._id }, { $set: updateFields });

    const updatedDoc = await db
      .collection("accounts")
      .findOne({ _id: existingAccount._id });

    const updatedAccount: IAccount = {
      id: existingAccount._id.toString(),
      accountNumber: String(
        updatedDoc?.accountNumber ?? existingAccount.accountNumber ?? "",
      ),
      accountType: (updatedDoc?.accountType ??
        existingAccount.accountType) as TAccountType,
      balance: Number(updatedDoc?.balance ?? existingAccount.balance ?? 0),
      status: (updatedDoc?.status ??
        existingAccount.status ??
        "Active") as TAccountStatus,
      currency: String(
        updatedDoc?.currency ?? existingAccount.currency ?? "BDT",
      ),
      ownerId: String(
        updatedDoc?.customerId ??
          updatedDoc?.ownerId ??
          existingAccount.ownerId ??
          "",
      ),
      ownerName: String(
        updatedDoc?.ownerName ?? existingAccount.ownerName ?? "",
      ),
      dailyLimit: Number(updatedDoc?.dailyLimit ?? nextDailyLimit),
      maxSingleTransaction: Number(
        updatedDoc?.maxSingleTransaction ?? nextMaxSingle,
      ),
      minBalance: Number(updatedDoc?.minBalance ?? nextMinBalance),
      createdAt: String(
        updatedDoc?.createdAt ?? existingAccount.createdAt ?? "",
      ),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Bank account updated successfully.",
        data: updatedAccount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update account error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while updating account.",
      },
      { status: 500 },
    );
  }
}