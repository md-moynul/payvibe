import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import type { TAccountStatus } from "@/types/account.type";
import { checkRole } from "@/lib/checkRole";

// TODO: Add search query & pagination support at DB query level when customer volume grows

export async function GET() {
  try {
    const roleCheck = await checkRole();
    if (!roleCheck.ok) return roleCheck.response;

    const db = await connectToDatabase();

    const [users, accounts] = await Promise.all([
      db
        .collection("users")
        .find({ role: "customer" })
        .sort({ createdAt: -1 })
        .toArray(),
      db.collection("accounts").find({}).toArray(),
    ]);

    const accountByUserKey = new Map<
      string,
      {
        accountId: string;
        accountStatus: TAccountStatus;
        balance: number;
      }
    >();

    for (const acc of accounts) {
      const accId = acc._id.toString();
      const accStatus = (acc.status as TAccountStatus) ?? "Active";
      const balance = Number(acc.balance ?? 0);

      const cusId = String(acc.customerId ?? "").trim();
      const ownerId = String(acc.ownerId ?? "").trim();
      const ownerEmail = String(acc.ownerEmail ?? "")
        .trim()
        .toLowerCase();

      if (cusId) {
        accountByUserKey.set(cusId, {
          accountId: accId,
          accountStatus: accStatus,
          balance,
        });
      }
      if (ownerId) {
        accountByUserKey.set(ownerId, {
          accountId: accId,
          accountStatus: accStatus,
          balance,
        });
      }
      if (ownerEmail) {
        accountByUserKey.set(ownerEmail, {
          accountId: accId,
          accountStatus: accStatus,
          balance,
        });
      }
    }

    const customers = users.map((u) => {
      const userId = u._id.toString();
      const userEmail = String(u.email ?? "")
        .trim()
        .toLowerCase();

      const matchedAccount =
        accountByUserKey.get(userId) ||
        (userEmail ? accountByUserKey.get(userEmail) : undefined);

      const hasAccount =
        Boolean(matchedAccount) || Number(u.accountsCount ?? 0) > 0;

      return {
        id: userId,
        name: String(u.name ?? ""),
        email: String(u.email ?? ""),
        phone: String(u.phone ?? ""),
        status: (u.status as "Active" | "Inactive" | "Flagged") ?? "Active",
        kycVerified: Boolean(u.kycVerified ?? true),
        accountsCount: hasAccount ? 1 : 0,
        totalBalance: matchedAccount
          ? matchedAccount.balance
          : Number(u.totalBalance ?? 0),
        joinedAt: String(u.createdAt ?? "").slice(0, 10) || "2026-11-25",
        accountId: matchedAccount?.accountId,
        accountStatus: matchedAccount?.accountStatus,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Customers fetched successfully.",
        data: customers,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get customers error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching customers.",
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
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();
    const phone = String(body?.phone ?? "").trim();
    const password = String(body?.password ?? "");
    const pin = String(body?.pin ?? "").trim();

    if (
      !name ||
      !email ||
      !phone ||
      password.length < 6 ||
      !/^\d{4,6}$/.test(pin)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide valid name, email, phone, password (min 6 chars), and 4-6 digit PIN.",
        },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email already exists.",
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);
    const createdAt = new Date().toISOString();

    const newCustomerDoc = {
      name,
      email,
      phone,
      passwordHash,
      pin: hashedPin,
      role: "customer",
      status: "Active",
      kycVerified: true,
      accountsCount: 0,
      totalBalance: 0,
      createdAt,
    };

    const insertResult = await db.collection("users").insertOne(newCustomerDoc);

    const createdCustomer = {
      id: insertResult.insertedId.toString(),
      name: newCustomerDoc.name,
      email: newCustomerDoc.email,
      phone: newCustomerDoc.phone,
      status: "Active" as const,
      kycVerified: true,
      accountsCount: 0,
      totalBalance: 0,
      joinedAt: createdAt.slice(0, 10),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Customer registered successfully.",
        data: createdCustomer,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register customer error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while registering customer.",
      },
      { status: 500 },
    );
  }
}
