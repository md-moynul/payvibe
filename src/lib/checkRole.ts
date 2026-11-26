import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { normalizeUserRole } from "@/lib/role.helper";

export function isStaffOrAdmin(role?: string | null): boolean {
  const normalized = normalizeUserRole(role);
  return normalized === "admin" || normalized === "bank-staff";
}

export function isAdminOnly(role?: string | null): boolean {
  return normalizeUserRole(role) === "admin";
}

export function isCustomerOnly(role?: string | null): boolean {
  return normalizeUserRole(role) === "customer";
}

export function isBankStaffOnly(role?: string | null): boolean {
  return normalizeUserRole(role) === "bank-staff";
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

export async function checkCustomerRole(
  forbiddenMessage = "Unauthorized: Only Customers can perform this action.",
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

  if (!isCustomerOnly(session.user.role)) {
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

/**
 * Checks ownership for resources (accounts, transactions, loans, requests).
 * Allows admin and bank-staff access to all resources; strictly restricts customers
 * to resources where customerId or customerEmail matches the logged-in session user.
 */
export function verifyResourceOwnership(
  session: Session,
  resource: {
    customerId?: string | null;
    ownerId?: string | null;
    customerEmail?: string | null;
    ownerEmail?: string | null;
  },
): boolean {
  if (!session.user) return false;
  if (isStaffOrAdmin(session.user.role)) return true;

  const sessionUserId = String(session.user.id ?? "").trim();
  const sessionUserEmail = String(session.user.email ?? "")
    .trim()
    .toLowerCase();

  const resCustomerId = String(resource.customerId ?? "").trim();
  const resOwnerId = String(resource.ownerId ?? "").trim();
  const resCustomerEmail = String(resource.customerEmail ?? "")
    .trim()
    .toLowerCase();
  const resOwnerEmail = String(resource.ownerEmail ?? "")
    .trim()
    .toLowerCase();

  const idMatches =
    sessionUserId &&
    (sessionUserId === resCustomerId || sessionUserId === resOwnerId);
  const emailMatches =
    sessionUserEmail &&
    (sessionUserEmail === resCustomerEmail ||
      sessionUserEmail === resOwnerEmail);

  return Boolean(idMatches || emailMatches);
}
