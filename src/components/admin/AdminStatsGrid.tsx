"use client";

import React from "react";
import { Card, CardContent, Spinner } from "@heroui/react";
import {
  Wallet,
  TrendingUp,
  Users,
  Landmark,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

interface IAdminStatsGridProps {
  totalBalance: number;
  totalAccounts: number;
  activeAccounts: number;
  frozenAccounts: number;
  totalCustomers: number;
  verifiedCustomers: number;
  pendingKYC: number;
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
  isLoading,
}: IAdminStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Bank Liquidity */}
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between p-0">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Bank Liquidity
            </p>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                `৳${totalBalance.toLocaleString("en-BD")}`
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span>Across {totalAccounts} total accounts</span>
            </p>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Wallet className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Customer Network */}
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between p-0">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Customers
            </p>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? <Spinner size="sm" color="current" /> : totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {verifiedCustomers} Verified
              </span>
              <span>•</span>
              <span>{pendingKYC} Pending KYC</span>
            </p>
          </div>
          <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Bank Accounts */}
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between p-0">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Bank Accounts
            </p>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? <Spinner size="sm" color="current" /> : activeAccounts}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="font-medium text-foreground">
                {totalAccounts} Total Created
              </span>
              {frozenAccounts > 0 && (
                <>
                  <span>•</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    {frozenAccounts} Frozen
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
            <Landmark className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Security & System Guard */}
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between p-0">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              System Risk & Audit
            </p>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {frozenAccounts > 0 ? (
                <span className="text-amber-600 dark:text-amber-400">
                  {frozenAccounts} Review Needed
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400">
                  Secure & Clean
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {frozenAccounts > 0
                ? "Frozen accounts pending audit review"
                : "All accounts functioning normally"}
            </p>
          </div>
          <div
            className={`rounded-xl p-2.5 ${
              frozenAccounts > 0
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {frozenAccounts > 0 ? (
              <ShieldAlert className="h-5 w-5" />
            ) : (
              <ShieldCheck className="h-5 w-5" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
