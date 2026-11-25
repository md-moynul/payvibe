"use client";

import React from "react";
import { Card, CardContent, Chip } from "@heroui/react";
import { Wallet } from "lucide-react";
import type { IApplicantInfoPayload } from "@/types/loan.type";

interface IApplicantAccountCardProps {
  account: IApplicantInfoPayload["account"];
}

export default function ApplicantAccountCard({
  account,
}: IApplicantAccountCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">
              Bank Account Details
            </h2>
          </div>
          {account && (
            <Chip
              size="sm"
              variant="soft"
              color={account.status === "Active" ? "success" : "danger"}
            >
              {account.status}
            </Chip>
          )}
        </div>

        {!account ? (
          <p className="text-sm text-muted-foreground">
            No bank account found for this customer.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Account Number</p>
              <p className="font-mono font-semibold text-foreground">
                {account.accountNumber}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Account Type</p>
              <p className="font-medium text-foreground">
                {account.accountType}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Current Balance</p>
              <p className="text-xl font-bold text-foreground">
                ৳{Number(account.balance ?? 0).toLocaleString("en-BD")}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}