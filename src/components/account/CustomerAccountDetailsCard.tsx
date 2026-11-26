"use client";

import React, { useState } from "react";
import { Card, CardContent, Chip, Button } from "@heroui/react";
import {
  CreditCard,
  Copy,
  Check,
  ShieldCheck,
  Building2,
  Calendar,
  Lock,
  ArrowRightLeft,
} from "lucide-react";
import type { IAccount } from "@/types/account.type";

interface ICustomerAccountDetailsCardProps {
  account: IAccount;
}

export default function CustomerAccountDetailsCard({
  account,
}: ICustomerAccountDetailsCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (account.accountNumber) {
      navigator.clipboard.writeText(account.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:shadow-md">
      <CardContent className="space-y-6 p-0">
        {/* Header with Title and Copy Action */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Account Specifications
              </h2>
              <p className="text-xs text-muted-foreground">
                Official banking ledger parameters and routing details
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onPress={handleCopy}
            className="h-8 gap-1.5 text-xs font-medium rounded-xl border-border/70 hover:bg-muted/50 transition-colors w-fit cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Copy Account #</span>
              </>
            )}
          </Button>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Account Number */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Account Number
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold text-foreground select-all">
                {account.accountNumber}
              </span>
              <Chip size="sm" variant="soft" color="accent" className="h-5 text-[10px] px-1.5 font-bold">
                PRIMARY
              </Chip>
            </div>
          </div>

          {/* 2. Account Type */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Account Type
            </span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{account.accountType}</span>
            </div>
          </div>

          {/* 3. Base Currency */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Base Currency
            </span>
            <p className="text-sm font-bold text-foreground">
              {account.currency || "BDT"} (৳) • Taka
            </p>
          </div>

          {/* 4. Account Status */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Operational Status
            </span>
            <div>
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
                className="font-semibold text-xs"
              >
                {account.status}
              </Chip>
            </div>
          </div>

          {/* 5. Daily Transaction Cap */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Daily Limit Cap
            </span>
            <p className="text-sm font-bold text-foreground">
              ৳{Number(account.dailyLimit ?? 0).toLocaleString("en-BD")}
            </p>
          </div>

          {/* 6. Single Transfer Cap */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Single Transaction Max
            </span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
              <ArrowRightLeft className="h-3.5 w-3.5 text-blue-500" />
              <span>৳{Number(account.maxSingleTransaction ?? 0).toLocaleString("en-BD")}</span>
            </div>
          </div>

          {/* 7. Minimum Buffer */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Min Balance Buffer
            </span>
            <p className="text-sm font-bold text-foreground">
              ৳{Number(account.minBalance ?? 0).toLocaleString("en-BD")}
            </p>
          </div>

          {/* 8. Opened Date */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Opened On
            </span>
            <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                {account.createdAt
                  ? new Date(account.createdAt).toLocaleDateString("en-BD", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Nov 26, 2026"}
              </span>
            </div>
          </div>
        </div>

        {/* Security & FDIC Partner Trust Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-500/15 bg-blue-500/5 px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium text-foreground">
              Protected by Bank-Grade 256-Bit SSL Encryption &amp; Real-Time Fraud Defense
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>PayVibe FDIC-Insured Partner Banking</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}