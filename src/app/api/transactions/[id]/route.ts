import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";
import { checkRole, isAdminOnly } from "@/lib/checkRole";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const roleCheck = await checkRole(
      "Unauthorized: Only Admin or Bank Staff can update transactions.",
    );
    if (!roleCheck.ok) return roleCheck.response;

    const { id } = await context.params;
    const rawId = decodeURIComponent(id ?? "").trim();

    const body = await req.json();
    const flagged =
      typeof body?.flagged === "boolean" ? body.flagged : undefined;
    const flagReason =
      typeof body?.flagReason === "string" ? body.flagReason.trim() : undefined;
    const requestedStatus =
      typeof body?.status === "string" ? body.status.trim() : undefined;

    const isAdmin = isAdminOnly(roleCheck.session.user.role);

    if (
      requestedStatus &&
      requestedStatus !== "Flagged" &&
      !isAdmin
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Bank Staff can flag suspicious transactions but cannot finalize status changes.",
        },
        { status: 403 },
      );
    }

    if (flagged === true && !flagReason) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a reason for flagging this transaction.",
        },
        { status: 400 },
      );
    }

    const db = await connectToDatabase();
    const txnCollection = db.collection("transactions");

    const filter: Record<string, unknown> = ObjectId.isValid(rawId)
      ? { $or: [{ _id: new ObjectId(rawId) }, { transactionId: rawId }] }
      : { transactionId: rawId };

    const existingTxn = await txnCollection.findOne(filter);
    if (!existingTxn) {
      return NextResponse.json(
        { success: false, message: "Transaction not found." },
        { status: 404 },
      );
    }

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
      reviewedBy: roleCheck.session.user.email ?? "",
    };

    if (typeof flagged === "boolean") {
      updateFields.flagged = flagged;
      if (flagged) {
        updateFields.flagReason = flagReason ?? "";
        updateFields.flaggedAt = new Date().toISOString();
      } else {
        updateFields.flagReason = "";
      }
    }

    if (requestedStatus) {
      updateFields.status = requestedStatus;
    }

    const updatedDoc = await txnCollection.findOneAndUpdate(
      { _id: existingTxn._id },
      { $set: updateFields },
      { returnDocument: "after" },
    );

    return NextResponse.json(
      {
        success: true,
        message: flagged
          ? "Transaction flagged for Admin review."
          : "Transaction updated successfully.",
        data: {
          id: updatedDoc?._id.toString() ?? existingTxn._id.toString(),
          transactionId: String(
            updatedDoc?.transactionId ?? existingTxn.transactionId ?? "",
          ),
          status: String(updatedDoc?.status ?? existingTxn.status ?? "Completed"),
          flagged: Boolean(updatedDoc?.flagged ?? false),
          flagReason: String(updatedDoc?.flagReason ?? ""),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/transactions/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update transaction." },
      { status: 500 },
    );
  }
}