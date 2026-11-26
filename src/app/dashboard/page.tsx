import { auth } from "@/lib/auth";
import { getDashboardHome } from "@/lib/role.helper";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const session = await auth();
  const redirectTarget = getDashboardHome(session?.user?.role);
  redirect(redirectTarget);
}
