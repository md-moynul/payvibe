import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";
import { checkAdminRole } from "@/lib/checkRole";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const roleCheck = await checkAdminRole(
      "Unauthorized: Only Admin can approve or update customer KYC.",
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
    const kycVerified =
      typeof body?.kycVerified === "boolean" ? body.kycVerified : true;

    const db = await connectToDatabase();
    const result = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id), role: "customer" },
      {
        $set: {
          kycVerified,
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Customer not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: kycVerified
        ? "Customer KYC approved successfully."
        : "Customer KYC status updated.",
      data: {
        id: result._id.toString(),
        kycVerified: Boolean(result.kycVerified),
      },
    });
  } catch (error) {
    console.error("PATCH /api/customers/[id]/kyc error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update customer KYC status." },
      { status: 500 },
    );
  }
}