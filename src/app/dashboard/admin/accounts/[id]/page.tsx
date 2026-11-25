"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  Chip,
} from "@heroui/react";
import {
  ArrowLeft,
  Landmark,
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Pencil,
  Snowflake,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import type { IAccount } from "@/types/account.type";
import { useGetAccountByIdQuery } from "@/redux/features/account";

// TODO: Replace DUMMY_TRANSACTIONS with live transaction history query by account ID
// TODO: Enforce Admin / Bank Staff session & role check before rendering sensitive account details

interface IDummyTransaction {
  id: string;
  type: "Deposit" | "Withdrawal" | "Transfer";
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  date: string;
  reference: string;
  note: string;
}

const DUMMY_TRANSACTIONS: IDummyTransaction[] = [
  {
    id: "txn-901",
    type: "Deposit",
    amount: 1000,
    status: "Completed",
    date: "2026-11-24 10:30 AM",
    reference: "TXN-20261124-01",
    note: "Initial account opening deposit",
  },
  {
    id: "txn-902",
    type: "Transfer",
    amount: 2500,
    status: "Completed",
    date: "2026-11-24 03:15 PM",
    reference: "TXN-20261124-02",
    note: "Internal fund transfer",
  },
  {
    id: "txn-903",
    type: "Withdrawal",
    amount: 500,
    status: "Completed",
    date: "2026-11-25 09:45 AM",
    reference: "TXN-20261124-03",
    note: "ATM cash withdrawal",
  },
];

export default function AdminAccountDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const routeId = params?.id ?? "";

  const { data, isLoading, isError, refetch } = useGetAccountByIdQuery(routeId, {
    skip: !routeId,
  });

  const account: IAccount | undefined = data?.data;
  const [transactions] = useState<IDummyTransaction[]>(DUMMY_TRANSACTIONS);

  // TODO: Connect Edit button to CreateAccountModal in edit mode or open inline edit drawer/modal
  const handleEditClick = () => {
    if (!account?.id) return;
    console.log("TODO: Open Edit modal for account:", account.id);
  };

  // TODO: Connect Freeze button to FreezeAccountModal / PATCH /api/accounts/[id]
  const handleFreezeClick = () => {
    if (!account?.id) return;
    console.log("TODO: Open Freeze modal for account:", account.id);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <Card className="border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Loading account details...
        </Card>
      </div>
    );
  }

  if (isError || !account) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
        <Card className="border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-600 dark:text-rose-400">
          Failed to load account details or account not found.
        </Card>
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onPress={() => router.push("/dashboard/admin/customers")}
          >
            Back to Customers
          </Button>
          <Button size="sm" variant="ghost" onPress={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const isFrozen = account.status === "Frozen";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            size="sm"
            variant="outline"
            aria-label="Back to customers"
            onPress={() => router.push("/dashboard/admin/customers")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Account Details
              </h1>
              <Chip
                size="sm"
                variant="soft"
                color={
                  account.status === "Active"
                    ? "success"
                    : account.status === "Frozen"
                      ? "warning"
                      : "default"
                }
                className="font-medium"
              >
                {account.status}
              </Chip>
            </div>
            <p className="text-xs text-muted-foreground">
              Account No:{" "}
              <span className="font-mono font-medium text-foreground">
                {account.accountNumber || "N/A"}
              </span>{" "}
              • Account ID: <span className="font-mono">{account.id}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* TODO: Wire Edit button to update account limits/type */}
          <Button
            size="sm"
            variant="outline"
            onPress={handleEditClick}
            className="gap-1.5 font-medium"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Button>

          {/* TODO: Wire Freeze / Unfreeze button to account status mutation */}
          <Button
            size="sm"
            variant="ghost"
            isDisabled={isFrozen}
            onPress={handleFreezeClick}
            className="gap-1.5 font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            <Snowflake className="h-3.5 w-3.5" />
            <span>{isFrozen ? "Frozen" : "Freeze"}</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border border-border bg-card p-5 shadow-sm">
          <CardContent className="flex items-start justify-between gap-3 p-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Current Balance
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                ৳{account.balance.toLocaleString("en-BD")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Min balance required: ৳
                {account.minBalance.toLocaleString("en-BD")}
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card p-5 shadow-sm">
          <CardContent className="flex items-start justify-between gap-3 p-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Account Type
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">
                {account.accountType}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Currency: {account.currency}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
              <Landmark className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card p-5 shadow-sm">
          <CardContent className="flex items-start justify-between gap-3 p-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Transaction Limits
              </p>
              <p className="mt-2 text-lg font-bold text-foreground">
                ৳{account.dailyLimit.toLocaleString("en-BD")} / day
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Max single: ৳
                {account.maxSingleTransaction.toLocaleString("en-BD")}
              </p>
            </div>
            <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-600 dark:text-sky-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Holder Info */}
      <Card className="border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Account Holder Information
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="md" variant="soft" color="accent">
              <AvatarFallback className="text-sm font-bold">
                {(account.ownerName || "AC")
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">
                {account.ownerName || "Account Holder"}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {/* TODO: Bind real email/phone from account or customer response when available */}
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Customer ID: {account.ownerId || "N/A"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  Currency: {account.currency}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Opened{" "}
                  {account.createdAt ? account.createdAt.slice(0, 10) : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* TODO: Link to customer profile page if needed */}
          <div className="text-xs text-muted-foreground">
            Customer ID:{" "}
            <span className="font-mono">{account.ownerId || "N/A"}</span>
          </div>
        </div>
      </Card>

      {/* Recent Transactions (Dummy) */}
      <Card className="overflow-hidden border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            Recent Transactions (Sample Data)
          </h2>
          <p className="text-xs text-muted-foreground">
            {/* TODO: Replace sample rows with real transaction history API for this account */}
            Showing dummy transactions for layout preview.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Note</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((txn) => {
                const isCredit = txn.type === "Deposit";
                return (
                  <tr key={txn.id} className="transition hover:bg-muted/30">
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        {isCredit ? (
                          <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-amber-600" />
                        )}
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                      {txn.reference}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {txn.note}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {txn.date}
                    </td>
                    <td className="px-5 py-3.5">
                      <Chip size="sm" variant="soft" color="success">
                        {txn.status}
                      </Chip>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-foreground">
                      {isCredit ? "+" : "-"}৳{txn.amount.toLocaleString("en-BD")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}