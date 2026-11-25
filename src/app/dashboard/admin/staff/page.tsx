import StaffView from "@/components/staff/StaffView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Management | PayVibe Bank Admin",
  description: "Manage bank staff members, operator roles, and branch administrative credentials.",
};

export default function AdminStaffPage() {
  return <StaffView />;
}
