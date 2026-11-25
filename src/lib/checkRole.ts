import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";

// TODO: Extend role checks if granular staff permissions are added later

export function isStaffOrAdmin(role?: string | null): boolean {
  const normalized = role?.trim().toLowerCase();
  return normalized === "admin" || normalized === "bank-staff";
}

export function isAdminOnly(role?: string | null): boolean {
  return role?.trim().toLowerCase() === "admin";
}

type TRoleCheckResult =
  | { ok: true; session: Session; response?: never }
  | { ok: false; session?: never; response: NextResponse };

export async function checkRole(
  forbiddenMessage = "Unauthorized: Only Admin or Bank Staff can perform this action.",
): Promise<TRoleCheckResult> {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in first." },
        { status: 401 },
      ),
    };
  }

  if (!isStaffOrAdmin(session.user.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: forbiddenMessage },
        { status: 403 },
      ),
    };
  }

  return { ok: true, session };
}

export async function checkAdminRole(
  forbiddenMessage = "Unauthorized: Only Admin can perform this action.",
): Promise<TRoleCheckResult> {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in first." },
        { status: 401 },
      ),
    };
  }

  if (!isAdminOnly(session.user.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: forbiddenMessage },
        { status: 403 },
      ),
    };
  }

  return { ok: true, session };
}