"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Input,
  InputGroup,
  InputGroupPrefix,
  InputGroupInput,
  Label,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
  toast,
} from "@heroui/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Wallet,
  ShieldAlert,
  Clock,
  Sparkles,
} from "lucide-react";
import { useGetAccountsQuery } from "@/redux/features/account/account.api";
import { useCreateRequestMutation } from "@/redux/features/request/request.api";
import type { IAccount } from "@/types/account.type";

export default function WithdrawalPage() {
  const router = useRouter();
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: accountsData,
    isLoading: accountsLoading,
    refetch: refetchAccounts,
  } = useGetAccountsQuery();

  const accounts = useMemo<IAccount[]>(
    () => (accountsData?.data as IAccount[] | undefined) ?? [],
    [accountsData],
  );

  const [createRequest, { isLoading: isSubmitting }] =
    useCreateRequestMutation();

  const activeAccountId = selectedAccountId || accounts[0]?.id || "";

  const selectedAccount = useMemo(
    () => accounts.find((acc) => acc.id === activeAccountId) ?? accounts[0],
    [accounts, activeAccountId],
  );

  const balance = Number(selectedAccount?.balance ?? 0);
  const minBalance = Number(selectedAccount?.minBalance ?? 0);
  const maxWithdrawable = Math.max(0, balance - minBalance);

  const numericAmount = Number(amount) || 0;
  const isOverBalance = numericAmount > balance;
  const isBreachingMin = balance - numericAmount < minBalance;

  const handleSetQuickPercentage = (ratio: number) => {
    const val = Math.floor(maxWithdrawable * ratio);
    setAmount(String(val > 0 ? val : ""));
  };

  const handleAddQuickAmount = (val: number) => {
    const current = Number(amount) || 0;
    setAmount(String(current + val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (numericAmount <= 0) {
      setErrorMessage("Please enter a valid withdrawal amount.");
      return;
    }

    if (numericAmount > balance) {
      setErrorMessage(
        `Withdrawal amount exceeds available account balance (৳${balance.toLocaleString("en-BD")}).`,
      );
      return;
    }

    if (isBreachingMin) {
      setErrorMessage(
        `This withdrawal would breach your minimum account balance requirement (৳${minBalance.toLocaleString("en-BD")}). Maximum withdrawable: ৳${maxWithdrawable.toLocaleString("en-BD")}.`,
      );
      return;
    }

    try {
      const res = await createRequest({
        accountId: selectedAccount?.id,
        type: "Withdrawal",
        amount: numericAmount,
        description: description.trim(),
      }).unwrap();

      toast.success(res.message || "Withdrawal request submitted successfully.");
      setAmount("");
      setDescription("");
      await refetchAccounts();
      router.push("/dashboard/customer/deposits-withdrawals");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to submit withdrawal request.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          size="sm"
          variant="outline"
          aria-label="Back to deposits & withdrawals"
          onPress={() => router.push("/dashboard/customer/deposits-withdrawals")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Withdraw Funds
          </h1>
          <p className="text-sm text-muted-foreground">
            Submit a withdrawal request to transfer cash out of your PayVibe bank
            account.
          </p>
        </div>
      </div>

      {accountsLoading ? (
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading your bank accounts...
          </span>
        </Card>
      ) : !selectedAccount ? (
        <Alert status="warning">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>No bank account found</AlertTitle>
          </AlertContent>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {/* Main Withdrawal Form Card */}
          <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <CardContent className="space-y-6 p-0">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Withdrawal Request Form
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Reviewed and processed during bank hours.
                    </p>
                  </div>
                </div>
                <Chip size="sm" variant="soft" color="warning">
                  Staff Approval Required
                </Chip>
              </div>

              {errorMessage && (
                <Alert status="danger">
                  <AlertIndicator />
                  <AlertContent>
                    <AlertTitle>{errorMessage}</AlertTitle>
                  </AlertContent>
                </Alert>
              )}

              {numericAmount > 0 && isBreachingMin && !errorMessage && (
                <Alert status="warning">
                  <AlertIndicator />
                  <AlertContent>
                    <AlertTitle>Minimum Balance Alert</AlertTitle>
                    <AlertDescription className="text-xs">
                      This withdrawal will bring your balance below the required
                      minimum (৳{minBalance.toLocaleString("en-BD")}). Max
                      withdrawable: ৳{maxWithdrawable.toLocaleString("en-BD")}.
                    </AlertDescription>
                  </AlertContent>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Account Selection */}
                {accounts.length > 1 && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Select Source Account
                    </Label>
                    <select
                      value={selectedAccount.id}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.accountNumber} ({acc.accountType} — ৳
                          {Number(acc.balance ?? 0).toLocaleString("en-BD")})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Amount Input with InputGroup */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-foreground">
                      Withdrawal Amount
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      Max withdrawable:{" "}
                      <strong className="text-foreground">
                        ৳{maxWithdrawable.toLocaleString("en-BD")}
                      </strong>
                    </span>
                  </div>

                  <InputGroup className="w-full">
                    <InputGroupPrefix className="font-semibold text-muted-foreground">
                      ৳
                    </InputGroupPrefix>
                    <InputGroupInput
                      type="number"
                      min={1}
                      step="any"
                      required
                      disabled={isSubmitting}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 2,000"
                      className="font-medium"
                    />
                  </InputGroup>

                  {/* Quick Percentage and Amount Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <Sparkles className="h-3 w-3 text-primary" />
                      Quick:
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onPress={() => handleAddQuickAmount(1000)}
                      className="h-7 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      +৳1,000
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onPress={() => handleAddQuickAmount(5000)}
                      className="h-7 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      +৳5,000
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onPress={() => handleSetQuickPercentage(0.5)}
                      className="h-7 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      50%
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onPress={() => handleSetQuickPercentage(1)}
                      className="h-7 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Max
                    </Button>
                  </div>
                </div>

                {/* Optional Note / Reference */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Description or Reason (Optional)
                  </Label>
                  <Input
                    type="text"
                    disabled={isSubmitting}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Branch cash withdrawal / Personal expense"
                    className="w-full"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onPress={() =>
                      router.push("/dashboard/customer/deposits-withdrawals")
                    }
                    className="font-medium w-full"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    isDisabled={isSubmitting || isOverBalance}
                    className="gap-2 font-medium w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" color="current" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpRight className="h-4 w-4" />
                        <span>Submit Withdrawal Request</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right Column: Account Balance & Policies */}
          <div className="space-y-6">
            {/* Account Card */}
            <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <CardHeader className="p-0 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    Source Account
                  </span>
                </div>
                <Chip
                  size="sm"
                  variant="soft"
                  color={
                    selectedAccount.status === "Active" ? "success" : "danger"
                  }
                >
                  {selectedAccount.status}
                </Chip>
              </CardHeader>

              <CardContent className="space-y-3 p-0">
                <div>
                  <p className="font-mono text-xs font-medium text-muted-foreground">
                    {selectedAccount.accountNumber}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">
                    ৳{balance.toLocaleString("en-BD")}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/40 p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Min Balance Required</span>
                    <span className="font-semibold text-foreground">
                      ৳{minBalance.toLocaleString("en-BD")}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Max Single Txn</span>
                    <span className="font-semibold text-foreground">
                      ৳
                      {Number(
                        selectedAccount.maxSingleTransaction ?? 25000,
                      ).toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Withdrawal Guidelines Card */}
            <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <CardHeader className="p-0 pb-3 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-bold text-foreground">
                  Withdrawal Policies &amp; Security
                </span>
              </CardHeader>

              <CardContent className="space-y-2.5 p-0 text-xs text-muted-foreground leading-relaxed">
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>
                    Withdrawal requests are processed by bank operators after
                    identity and balance verification.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Accounts must maintain their minimum balance (৳
                    {minBalance.toLocaleString("en-BD")}) after withdrawal.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
