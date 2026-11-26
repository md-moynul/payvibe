"use client";

import React from "react";
import { Card, CardHeader, CardContent, Chip } from "@heroui/react";
import { Wallet, ShieldCheck, Clock } from "lucide-react";
import type { IAccount } from "@/types/account.type";

interface ITransferAccountSummaryProps {
  selectedAccount?: IAccount;
}

export default function TransferAccountSummary({
  selectedAccount,
}: ITransferAccountSummaryProps) {
  if (!selectedAccount) return null;

  return (
    <div className="space-y-6">
      {/* Account Balance Card */}
      <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <CardHeader className="p-0 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">
              Source Account
            </span>
          </div>
          <Chip
            size="sm"
            variant="soft"
            color={selectedAccount.status === "Active" ? "success" : "danger"}
          >
            {selectedAccount.status}
          </Chip>
        </CardHeader>

        <CardContent className="space-y-3 p-0">
          <div>
            <p className="font-mono text-xs font-medium text-muted-foreground">
              {selectedAccount.accountNumber}
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              ৳{Number(selectedAccount.balance ?? 0).toLocaleString("en-BD")}
            </p>
          </div>

          <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-white/10 dark:bg-white/5">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Daily Transfer Limit</span>
              <span className="font-semibold text-foreground">
                ৳
                {Number(selectedAccount.dailyLimit ?? 50000).toLocaleString(
                  "en-BD",
                )}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Max Single Txn</span>
              <span className="font-semibold text-foreground">
                ৳
                {Number(
                  selectedAccount.maxSingleTransaction ?? 25000,
                ).toLocaleString("en-BD")}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Min Required Balance</span>
              <span className="font-semibold text-foreground">
                ৳
                {Number(selectedAccount.minBalance ?? 500).toLocaleString(
                  "en-BD",
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Security Card */}
      <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <CardHeader className="p-0 pb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">
            Security &amp; Guarantee
          </span>
        </CardHeader>

        <CardContent className="space-y-2.5 p-0 text-xs text-muted-foreground leading-relaxed">
          <div className="flex items-start gap-2">
            <Clock className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span>
              Transfers are authenticated with your 4–6 digit PIN and settled
              immediately.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              256-bit encrypted channel ensures safe peer-to-peer bank transfers
              with instant receipts.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}