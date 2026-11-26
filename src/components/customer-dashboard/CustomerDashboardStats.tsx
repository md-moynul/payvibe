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
      {/* 1. Account Balance (Primary Feature Card) */}
      <Card className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-md">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all duration-300 group-hover:bg-blue-500/20 pointer-events-none" />
        <CardContent className="relative space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Available Balance
            </span>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Account Balance
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              ৳{Number(balance ?? 0).toLocaleString("en-BD")}
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
            {hasMultipleAccounts
              ? `All accounts: ৳${Number(allAccountsTotalBalance ?? 0).toLocaleString("en-BD")}`
              : "Available in active account"}
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Deposits */}
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Inflow
            </span>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Deposits
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              ৳{Number(totalDeposits ?? 0).toLocaleString("en-BD")}
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
            Completed incoming deposits
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Withdrawals */}
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-md">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              Outflow
            </span>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Withdrawals
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              ৳{Number(totalWithdrawals ?? 0).toLocaleString("en-BD")}
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
            Completed withdrawals
          </div>
        </CardContent>
      </Card>

      {/* 4. Active Loans */}
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-md">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-600 dark:text-sky-400">
              Credit Line
            </span>
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400">
              <Landmark className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Active Loans
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {activeLoansCount}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                {activeLoansCount === 1 ? "loan" : "loans"}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
            Due: ৳{Number(remainingLoanBalance ?? 0).toLocaleString("en-BD")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}