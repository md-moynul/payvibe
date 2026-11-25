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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Staff */}
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between p-0">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Authorized Staff
            </span>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? "—" : total}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered bank operator profiles
            </p>
          </div>
          <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Active Staff */}
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between p-0">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Operators
            </span>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? "—" : active}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Full banking operations access</span>
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Suspended Staff */}
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between p-0">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Suspended / Inactive
            </span>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? "—" : suspended + inactive}
            </div>
            <p className="text-xs text-muted-foreground">
              {suspended > 0
                ? `${suspended} account(s) restricted pending review`
                : "No restricted operator accounts"}
            </p>
          </div>
          <div
            className={`rounded-xl p-2.5 ${
              suspended > 0
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <UserX className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Access Guard Role */}
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between p-0">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Security Governance
            </span>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              Admin Exclusive
            </div>
            <p className="text-xs text-muted-foreground">
              Staff roles strictly controlled by RBAC
            </p>
          </div>
          <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
