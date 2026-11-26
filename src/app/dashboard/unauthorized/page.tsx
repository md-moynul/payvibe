import { redirect } from "next/navigation";

export default function DashboardUnauthorizedRedirectPage() {
  redirect("/unauthorized");
}
