"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";
import type { IAccount } from "@/types/account.type";

interface ICustomerAccountDetailsCardProps {
  account: IAccount;
}

export default function CustomerAccountDetailsCard({
  account,
}: ICustomerAccountDetailsCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <CardContent className="space-y-4 p-0">
        <h2 className="text-base font-bold text-foreground">
          Account Information
        </h2>

        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">Account Number</p>
            <p className="mt-0.5 font-mono font-semibold text-foreground">
              {account.accountNumber}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account Type</p>
            <p className="mt-0.5 font-medium text-foreground">
              {account.accountType}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Currency</p>
            <p className="mt-0.5 font-medium text-foreground">
              {account.currency || "BDT"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Opened Date</p>
            <p className="mt-0.5 font-medium text-foreground">
              {account.createdAt
                ? new Date(account.createdAt).toLocaleDateString("en-BD")
                : "—"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}