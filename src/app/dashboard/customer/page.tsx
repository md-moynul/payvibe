"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Chip, Spinner } from "@heroui/react";
import { Send, ArrowLeftRight, Landmark } from "lucide-react";
import CustomerAccountSwitcher from "@/components/account/CustomerAccountSwitcher";
import CustomerDashboardStats from "@/components/customer-dashboard/CustomerDashboardStats";
import CustomerRecentActivity from "@/components/customer-dashboard/CustomerRecentActivity";
import TransactionReceiptModal from "@/components/transaction/TransactionReceiptModal";
import { useGetAccountsQuery } from "@/redux/features/account/account.api";
import { useGetTransactionsQuery } from "@/redux/features/transaction/transaction.api";
import { useGetLoansQuery } from "@/redux/features/loan/loan.api";
import type { IAccount } from "@/types/account.type";
import type { ITransaction } from "@/types/transaction.type";
import type { ILoan } from "@/types/loan.type";

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<ITransaction | null>(
    null,
  );

  const { data: accountsData, isLoading: accountsLoading } =
    useGetAccountsQuery();
  const { data: txnsData, isLoading: txnsLoading } = useGetTransactionsQuery({
    page: 1,
    limit: 20,
  });
  const { data: loansData, isLoading: loansLoading } = useGetLoansQuery();

  const accounts = useMemo<IAccount[]>(
    () => (accountsData?.data as IAccount[] | undefined) ?? [],
    [accountsData],
  );
  const transactions = useMemo<ITransaction[]>(
    () => txnsData?.data ?? [],
    [txnsData],
  );
  const loans = useMemo<ILoan[]>(() => loansData?.data ?? [], [loansData]);

  const activeAccount = useMemo(
    () => accounts.find((acc) => acc.id === selectedAccountId) ?? accounts[0],
    [accounts, selectedAccountId],
  );

  const allAccountsTotalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + Number(acc.balance ?? 0), 0),
    [accounts],
  );

  const totalDeposits = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Deposit" && t.status !== "Failed")
        .reduce((sum, t) => sum + Number(t.amount ?? 0), 0),
    [transactions],
  );

  const totalWithdrawals = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Withdrawal" && t.status !== "Failed")
        .reduce((sum, t) => sum + Number(t.amount ?? 0), 0),
    [transactions],
  );

  const activeLoans = useMemo(
    () => loans.filter((l) => l.status === "Active" || l.status === "Approved"),
    [loans],
  );

  const remainingLoanBalance = useMemo(
    () =>
      activeLoans.reduce(
        (sum, l) => sum + Number(l.remainingBalance ?? l.requestedAmount ?? 0),
        0,
      ),
    [activeLoans],
  );

  const isLoading = accountsLoading || txnsLoading || loansLoading;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Customer Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your bank accounts, transfers, deposit/withdrawal requests,
            and loans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onPress={() =>
              router.push("/dashboard/customer/deposits-withdrawals")
            }
            className="gap-1.5 font-medium"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Deposit / Withdraw</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onPress={() => router.push("/dashboard/customer/loans")}
            className="gap-1.5 font-medium"
          >
            <Landmark className="h-4 w-4" />
            <span>Loans</span>
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

      {isLoading ? (
        <Card className="flex items-center justify-center rounded-2xl border border-border bg-card p-10">
          <Spinner size="md" color="accent" />
        </Card>
      ) : (
        <div className="space-y-6">
          {activeAccount && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card px-5 py-3.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Active Account:</span>
                <span className="font-mono font-semibold text-foreground">
                  {activeAccount.accountNumber}
                </span>
                <span>• {activeAccount.accountType}</span>
              </div>
              <Chip
                size="sm"
                variant="soft"
                color={activeAccount.status === "Active" ? "success" : "warning"}
              >
                {activeAccount.status}
              </Chip>
            </div>
          )}

          <CustomerAccountSwitcher
            accounts={accounts}
            selectedAccountId={activeAccount?.id ?? ""}
            onSelectAccount={setSelectedAccountId}
          />

          <CustomerDashboardStats
            balance={activeAccount?.balance ?? 0}
            allAccountsTotalBalance={allAccountsTotalBalance}
            hasMultipleAccounts={accounts.length > 1}
            totalDeposits={totalDeposits}
            totalWithdrawals={totalWithdrawals}
            activeLoansCount={activeLoans.length}
            remainingLoanBalance={remainingLoanBalance}
          />

          <CustomerRecentActivity
            transactions={transactions}
            loans={loans}
            onViewReceipt={(txn) => setSelectedReceipt(txn)}
          />
        </div>
      )}

      <TransactionReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}