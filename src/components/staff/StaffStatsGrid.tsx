"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";
import { Users, UserCheck, UserX, ShieldCheck } from "lucide-react";
import type { IStaff } from "@/types/staff.type";

interface IStaffStatsGridProps {
  staffList: IStaff[];
  isLoading?: boolean;
}

export default function StaffStatsGrid({
  staffList,
  isLoading = false,
}: IStaffStatsGridProps) {
  const total = staffList.length;
  const active = staffList.filter((s) => s.status === "Active").length;
  const suspended = staffList.filter((s) => s.status === "Suspended").length;
  const inactive = staffList.filter(
    (s) => s.status !== "Active" && s.status !== "Suspended",
  ).length;

  const stats = [
    {
      label: "Total Authorized Staff",
      value: isLoading ? "—" : total.toString(),
      subtext: "Registered operator profiles",
      icon: Users,
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Active Operators",
      value: isLoading ? "—" : active.toString(),
      subtext: "Full banking access active",
      icon: UserCheck,
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Suspended / Inactive",
      value: isLoading ? "—" : (suspended + inactive).toString(),
      subtext:
        suspended + inactive === 0
          ? "No restricted accounts"
          : `${suspended + inactive} account(s) restricted`,
      icon: UserX,
      badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      label: "Security Governance",
      value: "Admin Only",
      subtext: "Strict RBAC governance",
      icon: ShieldCheck,
      badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md"
          >
            <CardContent className="flex flex-row items-center gap-3.5 p-0">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.badgeClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-muted-foreground truncate">
                  {item.label}
                </span>
                <span className="block text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  {item.value}
                </span>
                <span className="block text-[11px] text-muted-foreground/80 truncate">
                  {item.subtext}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
