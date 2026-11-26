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
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
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
import CreateAccountModal from "@/components/account/CreateAccountModal";
import FreezeAccountModal from "@/components/account/FreezeAccountModal";
import { IDummyTransaction } from "@/types/transaction.type";

// TODO: Replace DUMMY_TRANSACTIONS with live transaction history query by account ID
// TODO: Enforce Admin / Bank Staff session & role check before rendering sensitive account details

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

  const { data, isLoading, isError, refetch } = useGetAccountByIdQuery(
    routeId,
    {
      skip: !routeId,
    },
  );

  const account: IAccount | undefined = data?.data;
  const [transactions] = useState<IDummyTransaction[]>(DUMMY_TRANSACTIONS);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFreezeOpen, setIsFreezeOpen] = useState(false);

  const handleEditClick = () => {
    if (!account?.id) return;
    setIsEditOpen(true);
  };

  const handleFreezeClick = () => {
    if (!account?.id) return;
    setIsFreezeOpen(true);
  };

  const handleModalSuccess = async () => {
    setIsEditOpen(false);
    setIsFreezeOpen(false);
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <Card className="border border-border bg-card p-10 text-center flex flex-col items-center justify-center gap-3">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading account details...
          </span>
        </Card>
      </div>
    );
  }

  if (isError || !account) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>
              Failed to load account details or account not found.
            </AlertTitle>
          </AlertContent>
        </Alert>
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onPress={() => router.push("/dashboard/admin/accounts")}
          >
            Back to Accounts
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
            aria-label="Back to accounts"
            onPress={() => router.push("/dashboard/admin/accounts")}
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
          <Button
            size="sm"
            variant="outline"
            onPress={handleEditClick}
            className="gap-1.5 font-medium"
          >
            <Pencil className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Button>

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
                ৳{(account.balance ?? 0).toLocaleString("en-BD")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Min balance required: ৳
                {(account.minBalance ?? 0).toLocaleString("en-BD")}
              </p>
            </div>
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
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
                ৳{(account.dailyLimit ?? 0).toLocaleString("en-BD")} / day
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Max single: ৳
                {(account.maxSingleTransaction ?? 0).toLocaleString("en-BD")}
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
                      {isCredit ? "+" : "-"}৳
                      {txn.amount.toLocaleString("en-BD")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* TODO: Ensure FreezeAccountModal & CreateAccountModal props stay aligned across admin pages */}
      <CreateAccountModal
        isOpen={isEditOpen}
        mode="edit"
        editAccount={account}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <FreezeAccountModal
        isOpen={isFreezeOpen}
        customerName={account.ownerName}
        accountId={account.id}
        onClose={() => setIsFreezeOpen(false)}
        onAccountFrozen={handleModalSuccess}
      />
    </div>
  );
}
