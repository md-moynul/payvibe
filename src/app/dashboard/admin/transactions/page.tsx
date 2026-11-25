"use client";

import React, { useMemo, useState } from "react";
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
  toast,
} from "@heroui/react";
import { ShieldAlert, CheckCircle2, ArrowLeftRight, FlagOff } from "lucide-react";
import TransactionFilters from "@/components/transaction/TransactionFilters";
import TransactionsTable from "@/components/transaction/TransactionsTable";
import TransactionReceiptModal from "@/components/transaction/TransactionReceiptModal";
import FlagTransactionModal from "@/components/transaction/FlagTransactionModal";
import {
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
} from "@/redux/features/transaction/transaction.api";
import type { ITransaction } from "@/types/transaction.type";

export default function AdminTransactionsPage() {
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
  const totalRecords = data?.pagination?.total ?? transactions.length;

  const flaggedCount = useMemo(
    () =>
      transactions.filter((t) => Boolean(t.flagged || t.status === "Flagged"))
        .length,
    [transactions],
  );

  const pendingCount = useMemo(
    () => transactions.filter((t) => t.status === "Pending").length,
    [transactions],
  );

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

      toast.success(res.message || "Transaction flagged.");
      setTransactionToFlag(null);
      await refetch();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to flag transaction.";
      toast.danger(message);
    }
  };

  const handleUnflagTransaction = async (txn: ITransaction) => {
    if (isUpdating) return;
    try {
      await updateTransaction({
        id: txn.id,
        flagged: false,
        flagReason: "",
      }).unwrap();

      toast.success(`Flag cleared for ${txn.transactionId}.`);
      await refetch();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to clear flag.";
      toast.danger(message);
    }
  };

  const handleApproveTransaction = async (txn: ITransaction) => {
    if (isUpdating) return;
    try {
      const res = await updateTransaction({
        id: txn.id,
        status: "Completed",
        flagged: false,
      }).unwrap();

      toast.success(res.message || `Transaction ${txn.transactionId} approved.`);
      await refetch();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to approve transaction.";
      toast.danger(message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Admin Transaction Oversight
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor all banking transactions, review flagged items, and approve
            pending requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Chip size="sm" variant="soft" color="default" className="font-medium">
            Total Matched: {totalRecords}
          </Chip>
          <Chip size="sm" variant="soft" color="warning" className="font-medium">
            Pending (Page): {pendingCount}
          </Chip>
          <Chip size="sm" variant="soft" color="danger" className="font-medium">
            Flagged (Page): {flaggedCount}
          </Chip>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <CardContent className="flex items-center justify-between p-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Matched Transactions
              </p>
              <p className="mt-1.5 text-2xl font-bold text-foreground">
                {totalRecords}
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <CardContent className="flex items-center justify-between p-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Pending Approval
              </p>
              <p className="mt-1.5 text-2xl font-bold text-amber-600 dark:text-amber-400">
                {pendingCount}
              </p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <CardContent className="flex items-center justify-between p-0">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Flagged For Review
              </p>
              <p className="mt-1.5 text-2xl font-bold text-rose-600 dark:text-rose-400">
                {flaggedCount}
              </p>
            </div>
            <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
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
              Please verify your Admin session permissions.
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : (
        <div className="space-y-4">
          <TransactionsTable
            transactions={transactions}
            canFlagTransaction
            canApproveTransaction
            isProcessing={isUpdating}
            page={page}
            totalPages={totalPages}
            onPageChange={(nextPage) => setPage(nextPage)}
            onViewReceipt={(txn) => setSelectedReceipt(txn)}
            onFlagTransaction={(txn) => setTransactionToFlag(txn)}
            onApproveTransaction={handleApproveTransaction}
          />

          {/* Quick Unflag bar for any currently flagged transaction on this page */}
          {flaggedCount > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-5 py-3.5 text-xs">
              <span className="font-medium text-rose-600 dark:text-rose-400">
                Flagged transactions on this page can be reviewed and cleared:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {transactions
                  .filter((t) => Boolean(t.flagged || t.status === "Flagged"))
                  .map((flaggedTxn) => (
                    <Button
                      key={flaggedTxn.id}
                      size="sm"
                      variant="outline"
                      isDisabled={isUpdating}
                      onPress={() => handleUnflagTransaction(flaggedTxn)}
                      className="gap-1.5 font-medium"
                    >
                      <FlagOff className="h-3.5 w-3.5" />
                      <span>Unflag {flaggedTxn.transactionId}</span>
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </div>
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