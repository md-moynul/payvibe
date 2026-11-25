"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Label,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  Spinner,
  toast,
} from "@heroui/react";
import { X, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useCreateRequestMutation } from "@/redux/features/request/request.api";
import type { IAccount } from "@/types/account.type";
import type { TRequestType } from "@/types/request.type";

interface IDepositWithdrawalModalProps {
  isOpen: boolean;
  accounts: IAccount[];
  defaultType?: TRequestType;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DepositWithdrawalModal({
  isOpen,
  accounts,
  defaultType = "Deposit",
  onClose,
  onSuccess,
}: IDepositWithdrawalModalProps) {
  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState<TRequestType>(defaultType);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createRequest, { isLoading }] = useCreateRequestMutation();

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  if (!isOpen) return null;

  const selectedAccount = accounts.find((acc) => acc.id === accountId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage("Please enter a valid positive amount.");
      return;
    }

    try {
      const res = await createRequest({
        accountId: accountId || accounts[0]?.id,
        type,
        amount: numericAmount,
        description: description.trim(),
      }).unwrap();

      toast.success(res.message || `${type} request submitted.`);
      setAmount("");
      setDescription("");
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to submit request.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {type === "Deposit" ? "Request Deposit" : "Request Withdrawal"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Submit a {type.toLowerCase()} request for Staff or Admin approval.
            </p>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Close modal"
            onPress={onClose}
            isDisabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {errorMessage && (
          <Alert status="danger">
            <AlertIndicator />
            <AlertContent>
              <AlertTitle>{errorMessage}</AlertTitle>
            </AlertContent>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">
              Request Type
            </Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TRequestType)}
              disabled={isLoading}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="Deposit">Deposit</option>
              <option value="Withdrawal">Withdrawal</option>
            </select>
          </div>

          {accounts.length > 1 && (
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">
                Target Account
              </Label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} ({acc.accountType} — ৳
                    {acc.balance.toLocaleString("en-BD")})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedAccount && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-xs">
              <span className="text-muted-foreground">Current Balance</span>
              <span className="font-bold text-foreground">
                ৳{Number(selectedAccount.balance ?? 0).toLocaleString("en-BD")}
              </span>
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">
              Amount (৳)
            </Label>
            <Input
              type="number"
              min={1}
              step="any"
              required
              disabled={isLoading}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="2000"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">
              Description (Optional)
            </Label>
            <Input
              type="text"
              disabled={isLoading}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cash deposit / ATM withdrawal request..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onPress={onClose}
              isDisabled={isLoading}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isDisabled={isLoading}
              className="gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" color="current" />
                  <span>Submitting...</span>
                </>
              ) : type === "Deposit" ? (
                <>
                  <ArrowDownLeft className="h-4 w-4" />
                  <span>Submit Deposit</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Submit Withdrawal</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}