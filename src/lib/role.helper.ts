export type TNormalizedRole = "admin" | "bank-staff" | "customer" | "guest";

export function normalizeUserRole(rawRole?: string | null): TNormalizedRole {
  if (!rawRole) return "guest";

  const cleaned = rawRole.trim().toLowerCase().replace(/\s+/g, "-");

  if (cleaned === "admin") return "admin";
  if (cleaned === "bank-staff" || cleaned === "staff") return "bank-staff";
  if (cleaned === "customer" || cleaned === "user") return "customer";

  return "guest";
}

export function getRoleAccess(rawRole?: string | null) {
  const role = normalizeUserRole(rawRole);

  const isAdmin = role === "admin";
  const isBankStaff = role === "bank-staff";
  const isCustomer = role === "customer";
  const canManageCustomers = isAdmin || isBankStaff;
  const canManageAccounts = isAdmin || isBankStaff;

  // TODO: Revisit if delegating staff management to senior staff is ever needed
  const canManageStaff = isAdmin;

  // KYC approval is strictly restricted to Admin
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