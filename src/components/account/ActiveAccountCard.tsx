"use client";

import React from "react";
import {
  Button,
  Chip,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@heroui/react";
import type { IAccount } from "@/types/account.type";

interface IActiveAccountCardProps {
  account: IAccount;
  isAdmin: boolean;
  onToggleFreeze: (accountId: string) => void;
  onUpdateLimits: (accountId: string) => void;
  onDownloadStatement: (accountId: string) => void;
}

export default function ActiveAccountCard({
  account,
  isAdmin,
  onToggleFreeze,
  onUpdateLimits,
  onDownloadStatement,
}: IActiveAccountCardProps) {
  const isActive = account.status === "Active";

  return (
    <Card className="rounded-2xl border border-border bg-background p-6 shadow-sm space-y-4">
      <CardHeader className="p-0 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block">
            Selected Account
          </span>
          <CardTitle className="text-lg font-semibold mt-0.5">
            {account.accountType} • {account.accountNumber}
          </CardTitle>
        </div>

        <Chip
          size="sm"
          variant="soft"
          color={isActive ? "success" : "warning"}
        >
          {account.status}
        </Chip>
      </CardHeader>

      <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Available Balance</p>
          <p className="text-2xl font-bold mt-1">
            ${account.balance.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Daily Transfer Limit</p>
          <p className="text-xl font-semibold mt-1">
            ${account.dailyLimit?.toLocaleString() ?? "0"}
          </p>
        </div>

        <div className="rounded-xl border border-border p-4 flex flex-col justify-between gap-2">
          <p className="text-xs text-muted-foreground">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onPress={() => onDownloadStatement(account.id)}
            >
              Statement
            </Button>

            {isAdmin && (
              <>
                <Button
                  size="sm"
                  variant="danger-soft"
                  onPress={() => onToggleFreeze(account.id)}
                >
                  {isActive ? "Freeze" : "Unfreeze"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => onUpdateLimits(account.id)}
                >
                  Limits
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
