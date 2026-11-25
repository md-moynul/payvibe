"use client";

import React from "react";
import { Card, CardHeader, CardContent, Chip } from "@heroui/react";
import type { IAccount } from "@/types/account.type";

interface IAccountListGridProps {
  accounts: IAccount[];
  selectedAccountId: string | null;
  onSelectAccount: (accountId: string) => void;
}

export default function AccountListGrid({
  accounts,
  selectedAccountId,
  onSelectAccount,
}: IAccountListGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {accounts.map((acc) => {
        const isSelected = acc.id === selectedAccountId;
        const isActive = acc.status === "Active";

        return (
          <Card
            key={acc.id}
            onClick={() => onSelectAccount(acc.id)}
            className={`cursor-pointer rounded-2xl border p-5 transition-all ${
              isSelected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border bg-background hover:border-primary/50"
            }`}
          >
            <CardHeader className="p-0 flex items-center justify-between">
              <span className="text-sm font-semibold">{acc.accountType}</span>
              <Chip
                size="sm"
                variant="soft"
                color={isActive ? "success" : "warning"}
              >
                {acc.status}
              </Chip>
            </CardHeader>

            <CardContent className="p-0">
              <p className="text-xs text-muted-foreground mt-1">
                {acc.accountNumber}
              </p>

              <p className="text-xl font-bold mt-4">
                ${acc.balance.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
