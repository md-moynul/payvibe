import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { checkAdminRole } from "@/lib/checkRole";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    const roleCheck = await checkAdminRole();
    if (!roleCheck.ok) return roleCheck.response;

    const db = await connectToDatabase();
    const staffDocs = await db
      .collection("users")
      .find({ role: "bank-staff" })
      .sort({ createdAt: -1 })
      .toArray();

    const staffList = staffDocs.map((doc) => ({
      id: doc._id.toString(),
      name: String(doc.name ?? ""),
      email: String(doc.email ?? ""),
      phone: String(doc.phone ?? ""),
      role: "bank-staff" as const,
      status: (doc.status as "Active" | "Inactive" | "Suspended") ?? "Active",
      createdAt:
        typeof doc.createdAt === "string"
          ? doc.createdAt.slice(0, 10)
          : new Date(doc.createdAt ?? Date.now()).toISOString().slice(0, 10),
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Bank staff fetched successfully.",
        data: staffList,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get staff error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while fetching staff.",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const roleCheck = await checkAdminRole();
    if (!roleCheck.ok) return roleCheck.response;

    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const phone = String(body?.phone ?? "").trim();
    const password = String(body?.password ?? "");

    // TODO: Add branchCode or department field if your staff schema requires it
    if (!name || !email || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide name, valid email, and password (min 6 chars).",
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
    const nowIso = new Date().toISOString();

    const newStaffDoc = {
      name,
      email,
      phone,
      passwordHash,
      role: "bank-staff",
      status: "Active",
      createdAt: nowIso,
    };

    const insertResult = await db.collection("users").insertOne(newStaffDoc);

    return NextResponse.json(
      {
        success: true,
        message: "Bank staff created successfully.",
        data: {
          id: insertResult.insertedId.toString(),
          name: newStaffDoc.name,
          email: newStaffDoc.email,
          phone: newStaffDoc.phone,
          role: "bank-staff" as const,
          status: "Active" as const,
          createdAt: nowIso.slice(0, 10),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create staff error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while creating staff.",
      },
      { status: 500 },
    );
  }
}