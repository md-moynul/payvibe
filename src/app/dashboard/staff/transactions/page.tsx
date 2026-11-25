"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
  toast,
} from "@heroui/react";
import TransactionFilters from "@/components/transaction/TransactionFilters";
import TransactionsTable from "@/components/transaction/TransactionsTable";
import TransactionReceiptModal from "@/components/transaction/TransactionReceiptModal";
import FlagTransactionModal from "@/components/transaction/FlagTransactionModal";
import {
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
} from "@/redux/features/transaction/transaction.api";
import type { ITransaction } from "@/types/transaction.type";

export default function StaffTransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const [selectedReceipt, setSelectedReceipt] = useState<ITransaction | null>(
    null,
  );
  const [transactionToFlag, setTransactionToFlag] =
    useState<ITransaction | null>(null);

  const { data, isLoading, isError, refetch } = useGetTransactionsQuery({
    search,
    type,
    status,
    from: fromDate || undefined,
    to: toDate || undefined,
    page,
    limit: 10,
  });

  const [updateTransaction, { isLoading: isUpdating }] =
    useUpdateTransactionMutation();

  const transactions = useMemo<ITransaction[]>(
    () => data?.data ?? [],
    [data],
  );
  const totalPages = data?.pagination?.totalPages ?? 1;

  const handleResetFilters = () => {
    setSearch("");
    setType("ALL");
    setStatus("ALL");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleConfirmFlag = async ({
    id,
    flagReason,
  }: {
    id: string;
    flagReason: string;
  }) => {
    try {
      const res = await updateTransaction({
        id,
        flagged: true,
        flagReason,
      }).unwrap();

      toast.success(res.message || "Transaction flagged for Admin review.");
      setTransactionToFlag(null);
      await refetch();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to flag transaction.";
      toast.danger(message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Transaction Monitoring &amp; Review
        </h1>
        <p className="text-sm text-muted-foreground">
          Search by Transaction ID, filter by type or date, inspect receipts,
          and flag suspicious activity.
        </p>
      </div>

      <TransactionFilters
        search={search}
        type={type}
        status={status}
        fromDate={fromDate}
        toDate={toDate}
        showStatusFilter
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

      {isLoading ? (
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading transactions...
          </span>
        </Card>
      ) : isError ? (
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Failed to load transactions</AlertTitle>
            <AlertDescription>
              Please verify your Bank Staff session permissions.
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : (
        <TransactionsTable
          transactions={transactions}
          canFlagTransaction
          isProcessing={isUpdating}
          page={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => setPage(nextPage)}
          onViewReceipt={(txn) => setSelectedReceipt(txn)}
          onFlagTransaction={(txn) => setTransactionToFlag(txn)}
        />
      )}

      <FlagTransactionModal
        transaction={transactionToFlag}
        isSubmitting={isUpdating}
        onClose={() => setTransactionToFlag(null)}
        onConfirmFlag={handleConfirmFlag}
      />

      <TransactionReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}