"use client";

import React from "react";
import { Card, CardContent, Spinner } from "@heroui/react";
import {
  Wallet,
  TrendingUp,
  Users,
  Landmark,
  ShieldCheck,
  ShieldAlert,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface IAdminStatsGridProps {
  totalBalance: number;
  totalAccounts: number;
  activeAccounts: number;
  frozenAccounts: number;
  totalCustomers: number;
  verifiedCustomers: number;
  pendingKYC: number;
  totalDeposits?: number;
  totalWithdrawals?: number;
  totalTransactions?: number;
  pendingLoansCount?: number;
  isLoading?: boolean;
}

export default function AdminStatsGrid({
  totalBalance,
  totalAccounts,
  activeAccounts,
  frozenAccounts,
  totalCustomers,
  verifiedCustomers,
  pendingKYC,
  totalDeposits = 0,
  totalWithdrawals = 0,
  totalTransactions = 0,
  pendingLoansCount = 0,
  isLoading,
}: IAdminStatsGridProps) {
  const kycRate =
    totalCustomers > 0
      ? Math.round((verifiedCustomers / totalCustomers) * 100)
      : 0;

  const activeRate =
    totalAccounts > 0
      ? Math.round((activeAccounts / totalAccounts) * 100)
      : 0;

  const netCashFlow = totalDeposits - totalWithdrawals;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Bank Liquidity (Primary Feature Card) */}
      <Card className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-linear-to-br from-card via-card to-blue-500/5 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-md">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all duration-300 group-hover:bg-blue-500/20" />
        <CardContent className="relative space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Core Reserve
            </span>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Bank Liquidity
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                `৳${totalBalance.toLocaleString("en-BD")}`
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t border-border/50">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Across <span className="font-semibold text-foreground">{totalAccounts}</span> active ledger accounts</span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Customers */}
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-md">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              {kycRate}% KYC Verified
            </span>
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Customer Profiles
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                totalCustomers.toLocaleString("en-BD")
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {verifiedCustomers} Verified
            </span>
            <span>•</span>
            <span className={pendingKYC > 0 ? "text-amber-600 dark:text-amber-400 font-medium" : "text-muted-foreground"}>
              {pendingKYC} Pending KYC
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Active Bank Accounts */}
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {activeRate}% Operational
            </span>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <Landmark className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Active Deposit Accounts
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                activeAccounts.toLocaleString("en-BD")
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
            <span>{totalAccounts} Total Created</span>
            {frozenAccounts > 0 ? (
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {frozenAccounts} Frozen
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                0 Restricted
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4. Pending Loan Applications */}
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-md">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                pendingLoansCount > 0
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {pendingLoansCount > 0 ? (
                <>
                  <AlertTriangle className="h-3 w-3" /> Needs Review
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3" /> Up to Date
                </>
              )}
            </span>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Pending Loan Applications
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                pendingLoansCount
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-1 border-t border-border/50 truncate">
            {pendingLoansCount > 0
              ? "Awaiting credit notes & approval"
              : "No pending loan applications"}
          </div>
        </CardContent>
      </Card>

      {/* 5. Total Inflow (Deposits) */}
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft className="h-3 w-3" /> Inflow
            </span>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Deposits Volume
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                `৳${totalDeposits.toLocaleString("en-BD")}`
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-1 border-t border-border/50">
            Total verified customer deposits
          </div>
        </CardContent>
      </Card>

      {/* 6. Total Outflow (Withdrawals) */}
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-md">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              <ArrowUpRight className="h-3 w-3" /> Outflow
            </span>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Withdrawals Volume
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                `৳${totalWithdrawals.toLocaleString("en-BD")}`
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-1 border-t border-border/50">
            Completed cash payouts &amp; debits
          </div>
        </CardContent>
      </Card>

      {/* 7. Total Transactions & Velocity */}
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-md">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
              Ledger Events
            </span>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Total Transactions
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                totalTransactions.toLocaleString("en-BD")
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
            <span>Net Flow:</span>
            <span className={`font-semibold ${netCashFlow >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {netCashFlow >= 0 ? "+" : "-"}৳{Math.abs(netCashFlow).toLocaleString("en-BD")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 8. System Security & Audit */}
      <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md">
        <CardContent className="space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                frozenAccounts === 0
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              {frozenAccounts === 0 ? "100% Operational" : "Audit Watch"}
            </span>
            <div
              className={`rounded-xl border p-2 ${
                frozenAccounts === 0
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              {frozenAccounts === 0 ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <ShieldAlert className="h-4 w-4" />
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Security Governance
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {frozenAccounts === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  Bank-Grade
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">
                  {frozenAccounts} Restricted
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-1 border-t border-border/50 truncate">
            {frozenAccounts === 0
              ? "All accounts verified & normal"
              : "Risk controls active on restricted accounts"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
