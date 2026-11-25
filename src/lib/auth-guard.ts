import { auth } from "@/lib/auth";
import { UserRole } from "@/types/auth.type";

export async function requireAuth(allowedRoles?: UserRole[]) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      ok: false as const,
      status: 401,
      error: "Unauthorized",
      session: null,
    };
  }

  const userRole = session.user.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return {
      ok: false as const,
      status: 403,
      error: "Forbidden: insufficient permissions",
      session: null,
    };
  }

  return {
    ok: true as const,
    status: 200,
    error: null,
    session,
  };
}