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
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between gap-3 p-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Available Balance
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              ৳{Number(account.balance ?? 0).toLocaleString("en-BD")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              All accounts total: ৳{totalBalance.toLocaleString("en-BD")}
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
              Account Type &amp; Status
            </p>
            <p className="mt-2 text-lg font-bold text-foreground">
              {account.accountType}
            </p>
            <div className="mt-1.5">
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
          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
            <Landmark className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex items-start justify-between gap-3 p-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Transaction Limits
            </p>
            <p className="mt-2 text-lg font-bold text-foreground">
              ৳{Number(account.dailyLimit ?? 0).toLocaleString("en-BD")} / day
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Single max: ৳
              {Number(account.maxSingleTransaction ?? 0).toLocaleString("en-BD")}{" "}
              • Min: ৳
              {Number(account.minBalance ?? 0).toLocaleString("en-BD")}
            </p>
          </div>
          <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-600 dark:text-sky-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}