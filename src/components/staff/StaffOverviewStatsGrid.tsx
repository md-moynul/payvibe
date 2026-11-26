"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";
import {
  ArrowLeftRight,
  ArrowUpDown,
  Landmark,
  ShieldAlert,
} from "lucide-react";

interface IStaffOverviewStatsGridProps {
  pendingRequestsCount: number;
  reviewLoansCount: number;
  recentTransactionsCount: number;
  flaggedTxnsCount: number;
}

export default function StaffOverviewStatsGrid({
  pendingRequestsCount,
  reviewLoansCount,
  recentTransactionsCount,
  flaggedTxnsCount,
}: IStaffOverviewStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-center justify-between p-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pending Requests
            </p>
            <p className="mt-1.5 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {pendingRequestsCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Deposit &amp; withdrawal items
            </p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
            <ArrowUpDown className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-center justify-between p-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Loans To Review
            </p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">
              {reviewLoansCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add notes &amp; forward to Admin
            </p>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Landmark className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-center justify-between p-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recent Transactions
            </p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">
              {recentTransactionsCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Monitored system activity
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-center justify-between p-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Flagged Txns (Page)
            </p>
            <p className="mt-1.5 text-2xl font-bold text-rose-600 dark:text-rose-400">
              {flaggedTxnsCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Marked for Admin review
            </p>
          </div>
          <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}