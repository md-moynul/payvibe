import React from "react";
import DashboardSidebar from "@/components/shared/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
