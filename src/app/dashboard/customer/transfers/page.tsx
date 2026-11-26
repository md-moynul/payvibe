"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import TransferHeader from "@/components/transfer/TransferHeader";
import TransferForm from "@/components/transfer/TransferForm";
import TransferAccountSummary from "@/components/transfer/TransferAccountSummary";
import RecentTransfersCard from "@/components/transfer/RecentTransfersCard";
import TransactionReceiptModal from "@/components/transaction/TransactionReceiptModal";
import {
  useGetTransactionsQuery,
  useTransferFundsMutation,
} from "@/redux/features/transaction/transaction.api";
import { useGetAccountsQuery } from "@/redux/features/account/account.api";
import type { IAccount } from "@/types/account.type";
import type { ITransaction } from "@/types/transaction.type";

export default function CustomerTransfersPage() {
  const router = useRouter();

  const {
    data: accountsData,
    isLoading: accountsLoading,
    refetch: refetchAccounts,
  } = useGetAccountsQuery();

  const accounts = useMemo<IAccount[]>(
    () => (accountsData?.data as IAccount[] | undefined) ?? [],
    [accountsData],
  );

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ITransaction | null>(
    null,
  );

  const [transferFunds, { isLoading: isTransferring }] =
    useTransferFundsMutation();

  const { data: txnsData, refetch: refetchTxns } = useGetTransactionsQuery({
    type: "Transfer",
    page: 1,
    limit: 5,
  });

  const recentTransfers = useMemo<ITransaction[]>(
    () => txnsData?.data ?? [],
    [txnsData],
  );

  const activeAccountId = selectedAccountId || accounts[0]?.id || "";

  const selectedAccount = useMemo(
    () => accounts.find((acc) => acc.id === activeAccountId) ?? accounts[0],
    [accounts, activeAccountId],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericAmount = Number(amount);
    if (!recipientAccountNumber.trim()) {
      setErrorMessage("Please enter a valid recipient account number.");
      return;
    }

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage("Please enter a valid transfer amount.");
      return;
    }

    if (selectedAccount && numericAmount > selectedAccount.balance) {
      setErrorMessage(
        `Insufficient balance. Available: ৳${selectedAccount.balance.toLocaleString("en-BD")}`,
      );
      return;
    }

    if (!/^\d{4,6}$/.test(pin.trim())) {
      setErrorMessage("Please enter your 4–6 digit transaction PIN.");
      return;
    }

    try {
      const res = await transferFunds({
        fromAccountId: selectedAccount?.id || "",
        recipientAccountNumber: recipientAccountNumber.trim().toUpperCase(),
        amount: numericAmount,
        pin: pin.trim(),
        description: description.trim(),
      }).unwrap();

      toast.success(res.message || "Transfer completed successfully.");
      setRecipientAccountNumber("");
      setAmount("");
      setPin("");
      setDescription("");
      await Promise.all([refetchAccounts(), refetchTxns()]);
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to transfer funds.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <TransferHeader
        onBack={() => router.push("/dashboard/customer/transactions")}
      />

      {accountsLoading ? (
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading your bank account...
          </span>
        </Card>
      ) : accounts.length === 0 ? (
        <Alert status="warning">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>No bank account found</AlertTitle>
            <AlertDescription>
              An active bank account is required before initiating a transfer.
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Main Transfer Form Component */}
          <TransferForm
            accounts={accounts}
            selectedAccount={selectedAccount}
            onAccountChange={setSelectedAccountId}
            recipientAccountNumber={recipientAccountNumber}
            onRecipientChange={setRecipientAccountNumber}
            amount={amount}
            onAmountChange={setAmount}
            pin={pin}
            onPinChange={setPin}
            description={description}
            onDescriptionChange={setDescription}
            errorMessage={errorMessage}
            isTransferring={isTransferring}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard/customer/transactions")}
          />

          {/* Right Column: Account Balance & Security Component */}
          <TransferAccountSummary selectedAccount={selectedAccount} />
        </div>
      )}

      {/* Recent Transfers History Component */}
      <RecentTransfersCard
        transfers={recentTransfers}
        onViewReceipt={(txn) => setSelectedReceipt(txn)}
        onViewAll={() => router.push("/dashboard/customer/transactions")}
      />

      {/* Digital Receipt Modal */}
      <TransactionReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
