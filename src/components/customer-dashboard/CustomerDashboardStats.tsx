"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
} from "lucide-react";

interface ICustomerDashboardStatsProps {
  balance: number;
  allAccountsTotalBalance: number;
  hasMultipleAccounts: boolean;
  totalDeposits: number;
  totalWithdrawals: number;
  activeLoansCount: number;
  remainingLoanBalance: number;
}

export default function CustomerDashboardStats({
  balance,
  allAccountsTotalBalance,
  hasMultipleAccounts,
  totalDeposits,
  totalWithdrawals,
  activeLoansCount,
  remainingLoanBalance,
}: ICustomerDashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between gap-3 p-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Account Balance
            </p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">
              ৳{Number(balance ?? 0).toLocaleString("en-BD")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {hasMultipleAccounts
                ? `All accounts: ৳${Number(allAccountsTotalBalance ?? 0).toLocaleString("en-BD")}`
                : "Available in active account"}
            </p>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between gap-3 p-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Deposits
            </p>
            <p className="mt-1.5 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ৳{Number(totalDeposits ?? 0).toLocaleString("en-BD")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Completed incoming deposits
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between gap-3 p-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Withdrawals
            </p>
            <p className="mt-1.5 text-2xl font-bold text-amber-600 dark:text-amber-400">
              ৳{Number(totalWithdrawals ?? 0).toLocaleString("en-BD")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Completed withdrawals
            </p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between gap-3 p-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Active Loans
            </p>
            <p className="mt-1.5 text-2xl font-bold text-foreground">
              {activeLoansCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Due: ৳{Number(remainingLoanBalance ?? 0).toLocaleString("en-BD")}
            </p>
          </div>
          <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-600 dark:text-sky-400">
            <Landmark className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}