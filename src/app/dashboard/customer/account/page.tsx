"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Send, ArrowLeftRight, History } from "lucide-react";
import CustomerAccountSwitcher from "@/components/account/CustomerAccountSwitcher";
import CustomerAccountOverviewCards from "@/components/account/CustomerAccountOverviewCards";
import CustomerAccountDetailsCard from "@/components/account/CustomerAccountDetailsCard";
import { useGetAccountsQuery } from "@/redux/features/account/account.api";
import type { IAccount } from "@/types/account.type";

export default function CustomerAccountPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetAccountsQuery();

  const accounts = useMemo<IAccount[]>(
    () => (data?.data as IAccount[] | undefined) ?? [],
    [data],
  );

  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  const activeAccount = useMemo(
    () => accounts.find((acc) => acc.id === selectedAccountId) ?? accounts[0],
    [accounts, selectedAccountId],
  );

  const totalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + Number(acc.balance ?? 0), 0),
    [accounts],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Bank Account
          </h1>
          <p className="text-sm text-muted-foreground">
            View your account number, type, balance, status, and transaction
            limits.
          </p>
        </div>

        {activeAccount && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onPress={() => router.push("/dashboard/customer/transactions")}
              className="gap-1.5 font-medium"
            >
              <History className="h-4 w-4" />
              <span>Transactions</span>
            </Button>

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
              variant="primary"
              onPress={() => router.push("/dashboard/customer/transfers")}
              className="gap-1.5 font-medium"
            >
              <Send className="h-4 w-4" />
              <span>Transfer Funds</span>
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading your bank account details...
          </span>
        </Card>
      ) : isError ? (
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Failed to load bank account</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-3">
              <span>Unable to fetch your account information right now.</span>
              <Button size="sm" variant="outline" onPress={() => refetch()}>
                Retry
              </Button>
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : accounts.length === 0 || !activeAccount ? (
        <Card className="rounded-2xl border border-dashed border-border bg-card p-10 text-center space-y-2">
          <p className="text-sm font-semibold text-foreground">
            No bank account linked yet
          </p>
          <p className="text-xs text-muted-foreground">
            Once your KYC is verified, Bank Staff or Admin can open your bank
            account.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          <CustomerAccountSwitcher
            accounts={accounts}
            selectedAccountId={activeAccount.id}
            onSelectAccount={setSelectedAccountId}
          />

          <CustomerAccountOverviewCards
            account={activeAccount}
            totalBalance={totalBalance}
          />

          <CustomerAccountDetailsCard account={activeAccount} />
        </div>
      )}
    </div>
  );
}