"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@heroui/react";
import {
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
} from "lucide-react";
import TransactionFilters from "@/components/transaction/TransactionFilters";
import TransactionsTable from "@/components/transaction/TransactionsTable";
import TransactionReceiptModal from "@/components/transaction/TransactionReceiptModal";
import RequestsTable from "@/components/request/RequestsTable";
import { useGetTransactionsQuery } from "@/redux/features/transaction/transaction.api";
import { useGetAccountsQuery } from "@/redux/features/account/account.api";
import { useGetRequestsQuery } from "@/redux/features/request/request.api";
import type { ITransaction } from "@/types/transaction.type";
import type { IAccount } from "@/types/account.type";

export default function CustomerTransactionsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const [selectedReceipt, setSelectedReceipt] = useState<ITransaction | null>(
    null,
  );

  const { data: accountsData } = useGetAccountsQuery();
  const accounts = useMemo<IAccount[]>(
    () => (accountsData?.data as IAccount[] | undefined) ?? [],
    [accountsData],
  );

  const { data: requestsData } = useGetRequestsQuery();
  const requests = useMemo(
    () => requestsData?.data ?? [],
    [requestsData],
  );

  const { data, isLoading, isError } = useGetTransactionsQuery({
    search,
    type,
    status: status === "ALL" ? undefined : status,
    from: fromDate || undefined,
    to: toDate || undefined,
    page,
    limit: 10,
  });

  const transactions = useMemo<ITransaction[]>(
    () => data?.data ?? [],
    [data],
  );
  const totalPages = data?.pagination?.totalPages ?? 1;

  // Inflow & Outflow stats
  const stats = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    const accountNumbers = new Set(accounts.map((a) => a.accountNumber));

    for (const txn of transactions) {
      const amount = Number(txn.amount ?? 0);
      if (txn.status === "Completed") {
        if (
          txn.type === "Deposit" ||
          txn.type === "Loan Disbursement" ||
          (txn.receiverAccount && accountNumbers.has(txn.receiverAccount))
        ) {
          inflow += amount;
        } else {
          outflow += amount;
        }
      }
    }

    return {
      inflow,
      outflow,
      totalCount: transactions.length,
    };
  }, [transactions, accounts]);

  const handleResetFilters = () => {
    setSearch("");
    setType("ALL");
    setStatus("ALL");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Transactions &amp; Transfers
            </h1>
            <Chip size="sm" variant="soft" color="accent" className="font-semibold text-xs">
              Live Ledger
            </Chip>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, filter, and inspect receipts for all your bank account activity.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onPress={() =>
              router.push("/dashboard/customer/deposits-withdrawals/deposits")
            }
            className="gap-1.5 font-medium"
          >
            <ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Deposit Funds</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onPress={() =>
              router.push("/dashboard/customer/deposits-withdrawals/withdrawals")
            }
            className="gap-1.5 font-medium"
          >
            <ArrowUpRight className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Withdraw Funds</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            onPress={() => router.push("/dashboard/customer/transfers")}
            className="gap-2 font-medium"
          >
            <Send className="h-4 w-4" />
            <span>Transfer Funds</span>
          </Button>
        </div>
      </div>

      {/* Metrics Highlights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* 1. Inflow Card */}
        <Card className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-card via-card to-emerald-500/5 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-300 group-hover:bg-emerald-500/20 pointer-events-none" />
          <CardContent className="relative space-y-3 p-0">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Inflow Volume
              </span>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                <ArrowDownLeft className="h-4 w-4" />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Inflow (Deposits &amp; Credits)
              </p>
              <div className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                +৳{stats.inflow.toLocaleString("en-BD")}
              </div>
            </div>

            <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
              Completed deposits &amp; incoming transfers
            </div>
          </CardContent>
        </Card>

        {/* 2. Outflow Card */}
        <Card className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-card via-card to-amber-500/5 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl transition-all duration-300 group-hover:bg-amber-500/20 pointer-events-none" />
          <CardContent className="relative space-y-3 p-0">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Outflow Volume
              </span>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Outflow (Transfers &amp; Debits)
              </p>
              <div className="mt-1 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                -৳{stats.outflow.toLocaleString("en-BD")}
              </div>
            </div>

            <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
              Completed transfers &amp; withdrawals
            </div>
          </CardContent>
        </Card>

        {/* 3. Listed Records Card */}
        <Card className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all duration-300 group-hover:bg-blue-500/20 pointer-events-none" />
          <CardContent className="relative space-y-3 p-0">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                Ledger Activity
              </span>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                <ArrowLeftRight className="h-4 w-4" />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Transactions Listed
              </p>
              <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {stats.totalCount}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {stats.totalCount === 1 ? "record" : "records"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
              Filtered activity across your accounts
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar / Form */}
      <TransactionFilters
        search={search}
        type={type}
        status={status}
        fromDate={fromDate}
        toDate={toDate}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onTypeChange={(val) => {
          setType(val);
          setPage(1);
        }}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onFromDateChange={(val) => {
          setFromDate(val);
          setPage(1);
        }}
        onToDateChange={(val) => {
          setToDate(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* Transactions Table */}
      {isLoading ? (
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading your transaction history...
          </span>
        </Card>
      ) : isError ? (
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Failed to load transactions</AlertTitle>
            <AlertDescription>
              Please check your session and try again.
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : (
        <TransactionsTable
          transactions={transactions}
          page={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => setPage(nextPage)}
          onViewReceipt={(txn) => setSelectedReceipt(txn)}
        />
      )}

      {/* Deposit & Withdrawal Requests History */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Deposit &amp; Withdrawal Requests
            </h2>
            <p className="text-xs text-muted-foreground">
              Track the approval status of your deposit and withdrawal requests.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onPress={() => router.push("/dashboard/customer/deposits-withdrawals")}
            className="gap-1.5 font-medium text-xs w-fit"
          >
            <span>Manage Requests Portal</span>
          </Button>
        </div>

        <RequestsTable requests={requests} />
      </div>

      {/* Digital Receipt Modal */}
      <TransactionReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
