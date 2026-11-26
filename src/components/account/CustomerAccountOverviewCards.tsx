"use client";

import React from "react";
import { Card, CardContent, Chip } from "@heroui/react";
import { Landmark, Wallet, ShieldCheck } from "lucide-react";
import type { IAccount } from "@/types/account.type";

interface ICustomerAccountOverviewCardsProps {
  account: IAccount;
  totalBalance: number;
}

export default function CustomerAccountOverviewCards({
  account,
  totalBalance,
}: ICustomerAccountOverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* 1. Available Balance */}
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
              Account Liquidity
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              ৳{Number(account.balance ?? 0).toLocaleString("en-BD")}
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
            All accounts total:{" "}
            <span className="font-semibold text-foreground">
              ৳{totalBalance.toLocaleString("en-BD")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 2. Account Type & Status */}
      <Card className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-card via-card to-emerald-500/5 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-300 group-hover:bg-emerald-500/20 pointer-events-none" />
        <CardContent className="relative space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified Account
            </span>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <Landmark className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Account Type &amp; Status
            </p>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {account.accountType}
              </span>
              <Chip
                size="sm"
                variant="soft"
                color={
                  account.status === "Active"
                    ? "success"
                    : account.status === "Frozen"
                      ? "warning"
                      : "danger"
                }
              >
                {account.status}
              </Chip>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
            Account:{" "}
            <span className="font-mono font-semibold text-foreground">
              {account.accountNumber}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Transaction Limits */}
      <Card className="group relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-card via-card to-sky-500/5 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-md">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-500/10 blur-2xl transition-all duration-300 group-hover:bg-sky-500/20 pointer-events-none" />
        <CardContent className="relative space-y-3 p-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-600 dark:text-sky-400">
              Daily Quota
            </span>
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Transaction Limits
            </p>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              ৳{Number(account.dailyLimit ?? 0).toLocaleString("en-BD")}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                / day
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground truncate">
            Single max: ৳
            {Number(account.maxSingleTransaction ?? 0).toLocaleString("en-BD")}{" "}
            • Min: ৳{Number(account.minBalance ?? 0).toLocaleString("en-BD")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}