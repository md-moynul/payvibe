import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";
import { checkAdminRole } from "@/lib/checkRole";

const ALLOWED_CUSTOMER_STATUSES = ["Active", "Inactive", "Flagged"] as const;

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const roleCheck = await checkAdminRole(
      "Unauthorized: Only Admin can update customer status.",
    );
    if (!roleCheck.ok) return roleCheck.response;

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid customer ID." },
        { status: 400 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const nextStatus = String(body?.status ?? "").trim();

    if (
      !ALLOWED_CUSTOMER_STATUSES.includes(
        nextStatus as (typeof ALLOWED_CUSTOMER_STATUSES)[number],
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Status must be Active, Inactive, or Flagged.",
        },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const usersCol = db.collection("users");
    const targetId = new ObjectId(id);

    const existing = await usersCol.findOne({ _id: targetId, role: "customer" });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Customer not found." },
        { status: 404 },
      );
    }

    await usersCol.updateOne(
      { _id: targetId },
      {
        $set: {
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: `Customer status updated to ${nextStatus}.`,
        data: {
          id,
          status: nextStatus,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/customers/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update customer status." },
      { status: 500 },
    );
  }
}