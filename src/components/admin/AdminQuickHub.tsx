"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@heroui/react";
import {
  Layers,
  Activity,
  UserCheck,
  CreditCard,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface IAdminQuickHubProps {
  totalAccounts: number;
  savingsCount: number;
  currentCount: number;
  businessCount: number;
}

export default function AdminQuickHub({
  totalAccounts,
  savingsCount,
  currentCount,
  businessCount,
}: IAdminQuickHubProps) {
  return (
    <div className="space-y-6">
      {/* Account Types Distribution */}
      <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">
              Account Distribution
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {totalAccounts} Total
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {/* Savings */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground font-medium">
                Savings Accounts
              </span>
              <span className="font-bold text-foreground">
                {savingsCount}{" "}
                <span className="text-muted-foreground font-normal">
                  ({totalAccounts ? Math.round((savingsCount / totalAccounts) * 100) : 0}%)
                </span>
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${totalAccounts ? (savingsCount / totalAccounts) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Current */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground font-medium">
                Current Accounts
              </span>
              <span className="font-bold text-foreground">
                {currentCount}{" "}
                <span className="text-muted-foreground font-normal">
                  ({totalAccounts ? Math.round((currentCount / totalAccounts) * 100) : 0}%)
                </span>
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{
                  width: `${totalAccounts ? (currentCount / totalAccounts) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Business */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground font-medium">
                Business Accounts
              </span>
              <span className="font-bold text-foreground">
                {businessCount}{" "}
                <span className="text-muted-foreground font-normal">
                  ({totalAccounts ? Math.round((businessCount / totalAccounts) * 100) : 0}%)
                </span>
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all"
                style={{
                  width: `${totalAccounts ? (businessCount / totalAccounts) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Admin Hub Navigation */}
      <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Administrative Hub
        </h2>
        <div className="grid grid-cols-1 gap-2 pt-1">
          <Link
            href="/dashboard/admin/customers"
            className="flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-3 text-sm font-medium transition hover:border-primary/50 hover:bg-muted/40"
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">
                  Customer Registry
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Verify KYC & register users
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            href="/dashboard/admin/accounts"
            className="flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-3 text-sm font-medium transition hover:border-primary/50 hover:bg-muted/40"
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">
                  Account Ledger
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Limits, freeze & statements
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </Card>

      {/* Live System Operational Health Card */}
      <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Security & Compliance
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          PayVibe operates with strict role-based access control (RBAC). Bank
          staff and administrators maintain full auditability over account
          freezes and limit alterations.
        </p>
        <div className="pt-2 text-xs border-t border-border flex items-center justify-between text-muted-foreground">
          <span>Database Status</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Connected
          </span>
        </div>
      </Card>
    </div>
  );
}
