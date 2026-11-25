"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Chip,
  Spinner,
} from "@heroui/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { IAccount } from "@/types/account.type";

interface IRecentAccountsTableProps {
  accounts: IAccount[];
  isLoading?: boolean;
  onToggleFreeze: (account: IAccount) => void;
}

export default function RecentAccountsTable({
  accounts,
  isLoading,
  onToggleFreeze,
}: IRecentAccountsTableProps) {
  const router = useRouter();

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 p-5">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Recent Bank Accounts
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Latest customer accounts registered on the PayVibe core ledger
          </CardDescription>
        </div>
        <Link
          href="/dashboard/admin/accounts"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <span>View all accounts</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Spinner size="md" />
            <span>Loading bank accounts...</span>
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No bank accounts created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Account</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Balance</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {accounts.slice(0, 5).map((acc) => (
                  <tr
                    key={acc.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-foreground">
                        {acc.accountNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {acc.ownerName || "Customer Account"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Chip
                        size="sm"
                        variant="soft"
                        color="default"
                        className="font-medium text-xs"
                      >
                        {acc.accountType}
                      </Chip>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-foreground">
                      ৳{(Number(acc.balance) || 0).toLocaleString("en-BD")}
                    </td>
                    <td className="px-5 py-3.5">
                      <Chip
                        size="sm"
                        variant="soft"
                        color={acc.status === "Active" ? "success" : "danger"}
                        className="font-medium"
                      >
                        {acc.status}
                      </Chip>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onPress={() =>
                            router.push(`/dashboard/admin/accounts/${acc.id}`)
                          }
                          className="h-8 text-xs font-medium"
                        >
                          <span>Details</span>
                          <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onPress={() => onToggleFreeze(acc)}
                          className={`h-8 text-xs font-medium ${
                            acc.status === "Frozen"
                              ? "text-emerald-600 hover:text-emerald-700"
                              : "text-amber-600 hover:text-amber-700"
                          }`}
                        >
                          {acc.status === "Frozen" ? "Unfreeze" : "Freeze"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
