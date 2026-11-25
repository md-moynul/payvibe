"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@heroui/react";
import { Send, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import TransactionFilters from "@/components/transaction/TransactionFilters";
import TransactionsTable from "@/components/transaction/TransactionsTable";
import TransferFundsModal from "@/components/transaction/TransferFundsModal";
import TransactionReceiptModal from "@/components/transaction/TransactionReceiptModal";
import DepositWithdrawalModal from "@/components/request/DepositWithdrawalModal";
import RequestsTable from "@/components/request/RequestsTable";
import { useGetTransactionsQuery } from "@/redux/features/transaction/transaction.api";
import { useGetAccountsQuery } from "@/redux/features/account/account.api";
import { useGetRequestsQuery } from "@/redux/features/request/request.api";
import type { ITransaction } from "@/types/transaction.type";
import type { IAccount } from "@/types/account.type";
import type { TRequestType } from "@/types/request.type";

export default function CustomerTransactionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [requestModalState, setRequestModalState] = useState<{
    isOpen: boolean;
    defaultType: TRequestType;
  }>({
    isOpen: false,
    defaultType: "Deposit",
  });
  const [selectedReceipt, setSelectedReceipt] = useState<ITransaction | null>(
    null,
  );

  const { data: accountsData, refetch: refetchAccounts } =
    useGetAccountsQuery();
  const accounts = useMemo<IAccount[]>(
    () => (accountsData?.data as IAccount[] | undefined) ?? [],
    [accountsData],
  );

  const { data: requestsData, refetch: refetchRequests } =
    useGetRequestsQuery();
  const requests = useMemo(
    () => requestsData?.data ?? [],
    [requestsData],
  );

  const { data, isLoading, isError, refetch } = useGetTransactionsQuery({
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

  const handleResetFilters = () => {
    setSearch("");
    setType("ALL");
    setStatus("ALL");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleAfterAction = () => {
    refetch();
    refetchAccounts();
    refetchRequests();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Transactions &amp; Transfers
          </h1>
          <p className="text-sm text-muted-foreground">
            View your transaction history, transfer funds, submit deposit or
            withdrawal requests, and inspect receipts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onPress={() =>
              setRequestModalState({ isOpen: true, defaultType: "Deposit" })
            }
            className="gap-1.5 font-medium"
          >
            <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
            <span>Request Deposit</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onPress={() =>
              setRequestModalState({ isOpen: true, defaultType: "Withdrawal" })
            }
            className="gap-1.5 font-medium"
          >
            <ArrowUpRight className="h-4 w-4 text-amber-600" />
            <span>Request Withdrawal</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            onPress={() => setIsTransferOpen(true)}
            className="gap-2 font-medium"
          >
            <Send className="h-4 w-4" />
            <span>Transfer Funds</span>
          </Button>
        </div>
      </div>

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
      <div className="space-y-3 pt-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Deposit &amp; Withdrawal Requests
          </h2>
          <p className="text-xs text-muted-foreground">
            Track the approval status of your deposit and withdrawal requests.
          </p>
        </div>

        <RequestsTable requests={requests} />
      </div>

      <TransferFundsModal
        isOpen={isTransferOpen}
        accounts={accounts}
        onClose={() => setIsTransferOpen(false)}
        onSuccess={handleAfterAction}
      />

      <DepositWithdrawalModal
        isOpen={requestModalState.isOpen}
        accounts={accounts}
        defaultType={requestModalState.defaultType}
        onClose={() =>
          setRequestModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onSuccess={handleAfterAction}
      />

      <TransactionReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}