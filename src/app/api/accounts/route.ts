import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import type {
  IAccount,
  TAccountStatus,
  TAccountType,
} from "@/types/account.type";
import { checkRole } from "@/lib/checkRole";

const ALLOWED_ACCOUNT_TYPES: TAccountType[] = [
  "Savings Account",
  "Current Account",
  "Business Account",
];

function generateAccountNumber(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `PV-${randomDigits}`;
}

function isStaffOrAdmin(role?: string | null): boolean {
  const normalized = role?.toLowerCase();
  return (
    normalized === "admin" ||
    normalized === "bank-staff" ||
    normalized === "bank staff"
  );
}

export async function GET() {
 try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const db = await connectToDatabase();
    const filter: Record<string, unknown> = {};

    if (!isStaffOrAdmin(session.user.role)) {
      const userId = session.user.id;
      const userEmail = session.user.email?.toLowerCase();

      if (userId && userEmail) {
        filter.$or = [
          { customerId: userId },
          { ownerId: userId },
          { ownerEmail: userEmail },
        ];
      } else if (userId) {
        filter.$or = [{ customerId: userId }, { ownerId: userId }];
      } else if (userEmail) {
        filter.ownerEmail = userEmail;
      }
    }

    const docs = await db
      .collection("accounts")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const accounts: IAccount[] = docs.map((doc) => ({
      id: doc._id.toString(),
      accountNumber: String(doc.accountNumber ?? ""),
      accountType: doc.accountType as TAccountType,
      balance: Number(doc.balance ?? 0),
      status: (doc.status as TAccountStatus) ?? "Active",
      currency: String(doc.currency ?? "BDT"),
      ownerId: String(doc.customerId ?? doc.ownerId ?? ""),
      ownerName: String(doc.ownerName ?? ""),
      dailyLimit: Number(doc.dailyLimit ?? 50000),
      maxSingleTransaction: Number(doc.maxSingleTransaction ?? 25000),
      minBalance: Number(doc.minBalance ?? 0),
      createdAt: String(doc.createdAt ?? ""),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Accounts fetched successfully.",
        data: accounts,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get accounts error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching accounts.",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const roleCheck = await checkRole();
if (!roleCheck.ok) return roleCheck.response;

    const body = await req.json();
    const {
      customerId,
      ownerId,
      ownerEmail,
      accountType,
      initialBalance = 0,
      dailyLimit = 50000,
      maxSingleTransaction = 25000,
      minBalance = 0,
    } = body ?? {};

    if (!ALLOWED_ACCOUNT_TYPES.includes(accountType)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid account type. Choose Savings Account, Current Account, or Business Account.",
        },
        { status: 400 },
      );
    }

    const numericBalance = Number(initialBalance);
    const numericDailyLimit = Number(dailyLimit);
    const numericMaxSingle = Number(maxSingleTransaction);
    const numericMinBalance = Number(minBalance);

    if (
      Number.isNaN(numericBalance) ||
      numericBalance < 0 ||
      Number.isNaN(numericDailyLimit) ||
      numericDailyLimit <= 0 ||
      Number.isNaN(numericMaxSingle) ||
      numericMaxSingle <= 0 ||
      Number.isNaN(numericMinBalance) ||
      numericMinBalance < 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid balance or limit values." },
        { status: 400 },
      );
    }

    if (numericBalance < numericMinBalance) {
      return NextResponse.json(
        {
          success: false,
          message: "Initial balance cannot be lower than minimum balance.",
        },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const rawId =
      typeof customerId === "string" && customerId.trim()
        ? customerId.trim()
        : typeof ownerId === "string" && ownerId.trim()
          ? ownerId.trim()
          : "";

    let userFilter: Record<string, unknown> | null = null;
    if (rawId && ObjectId.isValid(rawId)) {
      userFilter = { _id: new ObjectId(rawId) };
    } else if (typeof ownerEmail === "string" && ownerEmail.trim()) {
      userFilter = { email: ownerEmail.trim().toLowerCase() };
    }

    if (!userFilter) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid customerId, ownerId, or ownerEmail is required.",
        },
        { status: 400 },
      );
    }

    const customer = await db.collection("users").findOne(userFilter);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found." },
        { status: 404 },
      );
    }

    const resolvedCustomerId = customer._id.toString();
    const resolvedOwnerEmail = String(
      customer.email ?? ownerEmail ?? "",
    ).toLowerCase();

    const existingAccount = await db.collection("accounts").findOne({
      $or: [
        { customerId: resolvedCustomerId },
        { ownerId: resolvedCustomerId },
        ...(resolvedOwnerEmail ? [{ ownerEmail: resolvedOwnerEmail }] : []),
      ],
    });

    if (existingAccount) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This customer already has a bank account. Only one bank account is allowed per user.",
        },
        { status: 409 },
      );
    }

    let accountNumber = generateAccountNumber();
    while (await db.collection("accounts").findOne({ accountNumber })) {
      accountNumber = generateAccountNumber();
    }

    const status: TAccountStatus = "Active";
    const createdAt = new Date().toISOString();

    const newAccountDoc = {
      accountNumber,
      accountType,
      balance: numericBalance,
      status,
      currency: "BDT",
      customerId: resolvedCustomerId,
      ownerId: resolvedCustomerId,
      ownerName: String(customer.name ?? customer.email ?? ""),
      ownerEmail: resolvedOwnerEmail,
      dailyLimit: numericDailyLimit,
      maxSingleTransaction: numericMaxSingle,
      minBalance: numericMinBalance,
      createdAt,
    };

    const insertResult = await db
      .collection("accounts")
      .insertOne(newAccountDoc);

    const targetUserId =
      customer._id instanceof ObjectId
        ? customer._id
        : typeof customer._id === "string" && ObjectId.isValid(customer._id)
          ? new ObjectId(customer._id)
          : customer._id;

    await db.collection("users").updateOne(
      { _id: targetUserId },
      {
        $set: {
          accountsCount: 1,
          totalBalance: numericBalance,
        },
      },
    );

    const createdAccount: IAccount = {
      id: insertResult.insertedId.toString(),
      accountNumber: newAccountDoc.accountNumber,
      accountType: newAccountDoc.accountType,
      balance: newAccountDoc.balance,
      status: newAccountDoc.status,
      currency: newAccountDoc.currency,
      ownerId: newAccountDoc.ownerId,
      ownerName: newAccountDoc.ownerName,
      dailyLimit: newAccountDoc.dailyLimit,
      maxSingleTransaction: newAccountDoc.maxSingleTransaction,
      minBalance: newAccountDoc.minBalance,
      createdAt: newAccountDoc.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Bank account created successfully.",
        data: createdAccount,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create account error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while creating account.",
      },
      { status: 500 },
    );
  }
}