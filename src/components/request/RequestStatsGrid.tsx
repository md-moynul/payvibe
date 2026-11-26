"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

interface IRequestStatsGridProps {
  pendingCount: number;
  depositCount: number;
  withdrawalCount: number;
  approvedCount?: number;
  showApproved?: boolean;
}

export default function RequestStatsGrid({
  pendingCount,
  depositCount,
  withdrawalCount,
  approvedCount = 0,
  showApproved = false,
}: IRequestStatsGridProps) {
  const gridColsClass = showApproved
    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    : "grid-cols-1 sm:grid-cols-3";

  return (
    <div className={`grid gap-4 ${gridColsClass}`}>
      {/* Pending Card */}
      <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <CardContent className="flex flex-row items-center gap-3.5 p-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-muted-foreground">
              Pending Verification
            </span>
            <span className="text-xl font-bold text-foreground tracking-tight">
              {pendingCount} {pendingCount === 1 ? "Request" : "Requests"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Approved Card (Optional for Admin) */}
      {showApproved && (
        <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <CardContent className="flex flex-row items-center gap-3.5 p-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground">
                Approved Requests
              </span>
              <span className="text-xl font-bold text-foreground tracking-tight">
                {approvedCount}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deposit Requests Card */}
      <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <CardContent className="flex flex-row items-center gap-3.5 p-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-muted-foreground">
              Total Deposit Requests
            </span>
            <span className="text-xl font-bold text-foreground tracking-tight">
              {depositCount}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Requests Card */}
      <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <CardContent className="flex flex-row items-center gap-3.5 p-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-muted-foreground">
              Total Withdrawal Requests
            </span>
            <span className="text-xl font-bold text-foreground tracking-tight">
              {withdrawalCount}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
