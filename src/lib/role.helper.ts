export type TNormalizedRole = "admin" | "bank-staff" | "customer" | "guest";

/**
 * Normalizes user role case-insensitively and standardizes separators (spaces, underscores, dashes).
 * Examples:
 * - "ADMIN", " Admin ", "admin" -> "admin"
 * - "bank staff", "bank-staff", "BANK_STAFF", "Staff", "staff" -> "bank-staff"
 * - "customer", "Customer", "user", "USER" -> "customer"
 * - null, undefined, unknown -> "guest"
 */
export function normalizeUserRole(rawRole?: string | null): TNormalizedRole {
  if (!rawRole || typeof rawRole !== "string") return "guest";

  const cleaned = rawRole
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (cleaned === "admin") return "admin";
  if (cleaned === "bank-staff" || cleaned === "staff") return "bank-staff";
  if (cleaned === "customer" || cleaned === "user") return "customer";

  return "guest";
}

/**
 * Default dashboard home route for each normalized role.
 */
export const ROLE_HOMEPATH: Record<TNormalizedRole, string> = {
  admin: "/dashboard/admin",
  "bank-staff": "/dashboard/staff",
  customer: "/dashboard/customer",
  guest: "/login",
};

/**
 * Resolves the primary dashboard route for any role.
 */
export function getDashboardHome(rawRole?: string | null): string {
  const role = normalizeUserRole(rawRole);
  return ROLE_HOMEPATH[role] ?? "/login";
}

export interface IRouteAccessDecision {
  allowed: boolean;
  redirectPath?: string;
}

/**
 * Evaluates whether a role is authorized to access a given URL pathname.
 * Implements strict role separation:
 * 1. Customer cannot access /dashboard/admin* or /dashboard/staff*
 * 2. Admin cannot access /dashboard/customer* or /dashboard/staff*
 * 3. Bank-staff cannot access /dashboard/admin* or /dashboard/customer*
 * 4. Guest is redirected to /login with callbackUrl
 * 5. Authenticated users on /login or /register are redirected to their dashboard home
 * 6. Root /dashboard is redirected to role-specific dashboard home
 * 7. Redirects are guaranteed loop-free because target is always within allowed role paths.
 */
export function evaluateRouteAccess(
  rawRole: string | null | undefined,
  pathname: string,
): IRouteAccessDecision {
  const role = normalizeUserRole(rawRole);
  const home = getDashboardHome(role);

  // Normalize pathname to strip trailing slashes (except root "/")
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  // Unauthenticated / Guest
  if (role === "guest") {
    if (normalizedPath.startsWith("/dashboard")) {
      return {
        allowed: false,
        redirectPath: `/login?callbackUrl=${encodeURIComponent(pathname)}`,
      };
    }
    return { allowed: true };
  }

  // Already authenticated user visiting login or register
  if (normalizedPath === "/login" || normalizedPath === "/register") {
    return { allowed: false, redirectPath: home };
  }

  // Root dashboard access (/dashboard) -> redirect to role home
  if (normalizedPath === "/dashboard") {
    return { allowed: false, redirectPath: home };
  }

  // Admin routes (/dashboard/admin, /dashboard/admin/*)
  if (
    normalizedPath === "/dashboard/admin" ||
    normalizedPath.startsWith("/dashboard/admin/")
  ) {
    if (role === "admin") return { allowed: true };
    return { allowed: false, redirectPath: home };
  }

  // Staff routes (/dashboard/staff, /dashboard/staff/*)
  if (
    normalizedPath === "/dashboard/staff" ||
    normalizedPath.startsWith("/dashboard/staff/")
  ) {
    if (role === "bank-staff") return { allowed: true };
    return { allowed: false, redirectPath: home };
  }

  // Customer routes (/dashboard/customer, /dashboard/customer/*)
  if (
    normalizedPath === "/dashboard/customer" ||
    normalizedPath.startsWith("/dashboard/customer/")
  ) {
    if (role === "customer") return { allowed: true };
    return { allowed: false, redirectPath: home };
  }

  // Common loan review routes (/dashboard/loans, /dashboard/loans/*)
  // Shared between Admin and Bank Staff for credit appraisal; forbidden to Customers
  if (
    normalizedPath === "/dashboard/loans" ||
    normalizedPath.startsWith("/dashboard/loans/")
  ) {
    if (role === "admin" || role === "bank-staff") {
      return { allowed: true };
    }
    // For customers, redirect to their customer loan portal
    return { allowed: false, redirectPath: "/dashboard/customer/loans" };
  }

  return { allowed: true };
}

export function isRouteAllowedForRole(
  rawRole: string | null | undefined,
  pathname: string,
): boolean {
  return evaluateRouteAccess(rawRole, pathname).allowed;
}

export function getRoleAccess(rawRole?: string | null) {
  const role = normalizeUserRole(rawRole);

  const isAdmin = role === "admin";
  const isBankStaff = role === "bank-staff";
  const isCustomer = role === "customer";
  const canManageCustomers = isAdmin || isBankStaff;
  const canManageAccounts = isAdmin || isBankStaff;

  // Staff management & KYC approval is strictly restricted to Admin
  const canManageStaff = isAdmin;
  const canApproveKyc = isAdmin;

  return {
    role,
    isAdmin,
    isBankStaff,
    isCustomer,
    canManageCustomers,
    canManageAccounts,
    canCreateAccount: canManageAccounts,
    canFreezeAccount: canManageAccounts,
    canManageStaff,
    canApproveKyc,
  };
}
