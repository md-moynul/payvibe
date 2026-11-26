"use client";

import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  Card,
  Chip,
} from "@heroui/react";
import {
  Wallet,
  Building2,
  Copy,
  Check,
  Snowflake,
} from "lucide-react";
import type { IAccount, TAccountType } from "@/types/account.type";
import AccountActionButtons from "./AccountActionButtons";

interface IAccountsTableProps {
  accounts: IAccount[];
  isAdmin: boolean;
  canFreeze: boolean;
  isTogglingFreeze?: boolean;
  onViewDetails: (account: IAccount) => void;
  onEditLimits?: (account: IAccount) => void;
  onToggleFreeze?: (account: IAccount) => void;
}

function getAccountTypeBadge(type: TAccountType) {
  switch (type) {
    case "Savings Account":
      return {
        color: "success" as const,
        label: "Savings",
      };
    case "Current Account":
      return {
        color: "accent" as const,
        label: "Current",
      };
    case "Business Account":
      return {
        color: "accent" as const,
        label: "Business",
      };
    default:
      return {
        color: "default" as const,
        label: type || "Account",
      };
  }
}

export default function AccountsTable({
  accounts,
  isAdmin,
  canFreeze,
  isTogglingFreeze = false,
  onViewDetails,
  onEditLimits,
  onToggleFreeze,
}: IAccountsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAccountNumber = (e: React.MouseEvent, accNumber: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(accNumber);
    setCopiedId(accNumber);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (accounts.length === 0) {
    return (
      <Card className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Wallet className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          No bank accounts found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try adjusting your search criteria or register a new customer account.
        </p>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-muted/25 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5 whitespace-nowrap">Account</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Account Holder</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Type</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Balance</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Daily Limit</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Status</th>
              <th className="px-5 py-3.5 text-right whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {accounts.map((account) => {
              const isFrozen = account.status === "Frozen";
              const typeBadge = getAccountTypeBadge(account.accountType);
              const isCopied = copiedId === account.accountNumber;
              const holderName =
                account.customerName || account.ownerName || "Bank Customer";
              const holderEmail =
                account.customerEmail || account.ownerId || account.customerId || "";

              return (
                <tr
                  key={account.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  {/* Account Number */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-foreground select-all">
                        {account.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={(e) =>
                          handleCopyAccountNumber(e, account.accountNumber)
                        }
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                        title="Copy Account Number"
                        aria-label="Copy Account Number"
                      >
                        {isCopied ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      {account.isPrimary && (
                        <Chip
                          size="sm"
                          variant="soft"
                          color="accent"
                          className="h-4.5 text-[9px] px-1 font-bold"
                        >
                          PRIMARY
                        </Chip>
                      )}
                    </div>
                  </td>

                  {/* Account Holder */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <Avatar size="sm" variant="soft" color="accent">
                        <AvatarFallback className="font-bold text-xs">
                          {holderName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-xs leading-tight">
                          {holderName}
                        </p>
                        {holderEmail && (
                          <p className="text-[11px] text-muted-foreground truncate max-w-44">
                            {holderEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Account Type */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <Chip
                        size="sm"
                        variant="soft"
                        color={typeBadge.color}
                        className="font-medium text-xs"
                      >
                        {account.accountType}
                      </Chip>
                    </div>
                  </td>

                  {/* Balance */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-bold text-foreground">
                      ৳{Number(account.balance ?? 0).toLocaleString("en-BD")}
                    </span>
                    <span className="ml-1 text-[10px] text-muted-foreground font-medium uppercase">
                      {account.currency || "BDT"}
                    </span>
                  </td>

                  {/* Daily Limit */}
                  <td className="px-5 py-4 whitespace-nowrap text-xs">
                    <p className="font-semibold text-foreground">
                      ৳{Number(account.dailyLimit ?? 0).toLocaleString("en-BD")}
                      <span className="text-[10px] font-normal text-muted-foreground">
                        {" "}
                        / day
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Max: ৳
                      {Number(
                        account.maxSingleTransaction ?? 0,
                      ).toLocaleString("en-BD")}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
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
                        className="font-medium text-xs"
                      >
                        {account.status}
                      </Chip>
                      {isFrozen && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          <Snowflake className="h-2.5 w-2.5" />
                          Account Frozen
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <AccountActionButtons
                      account={account}
                      isAdmin={isAdmin}
                      canFreeze={canFreeze}
                      isTogglingFreeze={isTogglingFreeze}
                      onViewDetails={onViewDetails}
                      onEditLimits={onEditLimits}
                      onToggleFreeze={onToggleFreeze}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
