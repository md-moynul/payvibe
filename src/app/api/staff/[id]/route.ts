import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { checkAdminRole } from "@/lib/checkRole";
import { connectToDatabase } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const roleCheck = await checkAdminRole();
    if (!roleCheck.ok) return roleCheck.response;

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid staff ID." },
        { status: 400 },
      );
    }

    const body = await req.json();
    const updateFields: Record<string, unknown> = {};

    if (typeof body?.name === "string" && body.name.trim()) {
      updateFields.name = body.name.trim();
    }
    if (typeof body?.phone === "string") {
      updateFields.phone = body.phone.trim();
    }
    if (
      body?.status === "Active" ||
      body?.status === "Inactive" ||
      body?.status === "Suspended"
    ) {
      updateFields.status = body.status;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields provided for update." },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const updated = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id), role: "bank-staff" },
        { $set: updateFields },
        { returnDocument: "after" },
      );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Bank staff not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Bank staff updated successfully.",
        data: {
          id: updated._id.toString(),
          name: String(updated.name ?? ""),
          email: String(updated.email ?? ""),
          phone: String(updated.phone ?? ""),
          role: "bank-staff" as const,
          status:
            (updated.status as "Active" | "Inactive" | "Suspended") ?? "Active",
          createdAt:
            typeof updated.createdAt === "string"
              ? updated.createdAt.slice(0, 10)
              : new Date(updated.createdAt ?? Date.now())
                  .toISOString()
                  .slice(0, 10),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update staff error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error while updating staff.",
      },
      { status: 500 },
    );
  }
}