"use client";

import React from "react";
import { Chip } from "@heroui/react";
import type { IAccount } from "@/types/account.type";

interface ICustomerAccountSwitcherProps {
  accounts: IAccount[];
  selectedAccountId: string;
  onSelectAccount: (accountId: string) => void;
}

export default function CustomerAccountSwitcher({
  accounts,
  selectedAccountId,
  onSelectAccount,
}: ICustomerAccountSwitcherProps) {
  if (accounts.length <= 1) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Switch Account ({accounts.length} Accounts)
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => {
          const isSelected = acc.id === selectedAccountId;
          return (
            <button
              key={acc.id}
              type="button"
              onClick={() => onSelectAccount(acc.id)}
              className={`rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-blue-500 bg-blue-500/5 shadow-xs ring-1 ring-blue-500/20"
                  : "border-border/70 bg-card hover:bg-muted/30 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-foreground">
                  {acc.accountNumber}
                </span>
                <Chip
                  size="sm"
                  variant="soft"
                  color={acc.status === "Active" ? "success" : "warning"}
                >
                  {acc.status}
                </Chip>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {acc.accountType}
              </p>
              <p className="mt-2 text-base font-bold text-foreground">
                ৳{Number(acc.balance ?? 0).toLocaleString("en-BD")}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}