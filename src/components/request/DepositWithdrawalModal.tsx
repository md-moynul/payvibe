"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Label,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
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

export default function DepositWithdrawalModal(
  props: IDepositWithdrawalModalProps,
) {
  if (!props.isOpen) return null;
  return (
    <DepositWithdrawalModalDialog
      key={`${props.defaultType}-${props.isOpen}`}
      {...props}
    />
  );
}

function DepositWithdrawalModalDialog({
  accounts,
  defaultType = "Deposit",
  onClose,
  onSuccess,
}: IDepositWithdrawalModalProps) {
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [type, setType] = useState<TRequestType>(defaultType);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createRequest, { isLoading }] = useCreateRequestMutation();

  const activeAccountId = selectedAccountId || accounts[0]?.id || "";
  const selectedAccount =
    accounts.find((acc) => acc.id === activeAccountId) ?? accounts[0];

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
        accountId: activeAccountId,
        type,
        amount: numericAmount,
        description: description.trim(),
      }).unwrap();

      toast.success(res.message || `${type} request submitted.`);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        `Failed to submit ${type.toLowerCase()} request.`;
      setErrorMessage(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-in fade-in duration-200">
      <Card className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between p-6 pb-3">
          <CardTitle className="text-lg font-bold text-foreground">
            Request {type}
          </CardTitle>
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
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6 pt-0">
            {errorMessage && (
              <Alert status="danger">
                <AlertIndicator />
                <AlertContent>
                  <AlertTitle>{errorMessage}</AlertTitle>
                </AlertContent>
              </Alert>
            )}

            {/* Type selector toggle */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setType("Deposit")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
                  type === "Deposit"
                    ? "bg-card text-emerald-600 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ArrowDownLeft className="h-4 w-4" />
                <span>Deposit</span>
              </button>
              <button
                type="button"
                onClick={() => setType("Withdrawal")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
                  type === "Withdrawal"
                    ? "bg-card text-amber-600 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ArrowUpRight className="h-4 w-4" />
                <span>Withdrawal</span>
              </button>
            </div>

            {/* Account Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Account
              </Label>
              <select
                value={activeAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} ({acc.accountType} — ৳
                    {Number(acc.balance ?? 0).toLocaleString("en-BD")})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Balance Notice */}
            {selectedAccount && (
              <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Current Balance:</span>
                  <span className="font-semibold text-foreground">
                    ৳{Number(selectedAccount.balance ?? 0).toLocaleString("en-BD")}
                  </span>
                </div>
                {type === "Withdrawal" && (
                  <div className="flex justify-between text-[11px]">
                    <span>Required Min Balance:</span>
                    <span>
                      ৳{Number(selectedAccount.minBalance ?? 0).toLocaleString("en-BD")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Amount input */}
            <div className="space-y-1.5">
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
                className="w-full"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Description / Reference (Optional)
              </Label>
              <Input
                type="text"
                disabled={isLoading}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Salary, ATM, branch cash..."
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                isDisabled={isLoading}
                onPress={onClose}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isDisabled={isLoading}
                className="font-medium"
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" color="current" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Request</span>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
