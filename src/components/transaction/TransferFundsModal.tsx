"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  InputGroup,
  InputGroupPrefix,
  InputGroupInput,
  Label,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  Spinner,
  Chip,
  toast,
} from "@heroui/react";
import { X, Send, Wallet, CreditCard } from "lucide-react";
import { useTransferFundsMutation } from "@/redux/features/transaction/transaction.api";
import type { IAccount } from "@/types/account.type";

interface ITransferFundsModalProps {
  isOpen: boolean;
  accounts: IAccount[];
  onClose: () => void;
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export default function TransferFundsModal({
  isOpen,
  accounts,
  onClose,
  onSuccess,
}: ITransferFundsModalProps) {
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || "");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [transferFunds, { isLoading }] = useTransferFundsMutation();

  if (!isOpen) return null;

  const currentAccountId = fromAccountId || accounts[0]?.id || "";
  const selectedAccount =
    accounts.find((a) => a.id === currentAccountId) || accounts[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericAmount = Number(amount);
    if (
      !recipientAccountNumber.trim() ||
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      setErrorMessage("Please enter a valid recipient account and amount.");
      return;
    }

    if (selectedAccount && numericAmount > selectedAccount.balance) {
      setErrorMessage(
        `Insufficient balance. Available: ৳${selectedAccount.balance.toLocaleString("en-BD")}`,
      );
      return;
    }

    if (!/^\d{4,6}$/.test(pin.trim())) {
      setErrorMessage("Please enter your 4–6 digit security PIN.");
      return;
    }

    try {
      const res = await transferFunds({
        fromAccountId: currentAccountId,
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
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to transfer funds. Please check details and try again.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-in fade-in duration-200">
      <Card className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <CardHeader className="flex flex-row items-start justify-between p-6 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-bold text-foreground">
                Transfer Funds
              </CardTitle>
              <Chip size="sm" variant="soft" color="accent" className="font-semibold text-xs">
                Instant Transfer
              </Chip>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Send money securely to any verified PayVibe account holder.
            </CardDescription>
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
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-6 pt-2">
            {/* Error Alert */}
            {errorMessage && (
              <Alert status="danger">
                <AlertIndicator />
                <AlertContent>
                  <AlertTitle>{errorMessage}</AlertTitle>
                </AlertContent>
              </Alert>
            )}

            {/* Source Account */}
            {accounts.length > 1 ? (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Debit Account
                </Label>
                <select
                  value={currentAccountId}
                  onChange={(e) => setFromAccountId(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition cursor-pointer"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountNumber} ({acc.accountType} — ৳
                      {acc.balance.toLocaleString("en-BD")})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {/* Balance Preview Card */}
            {selectedAccount && (
              <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <div>
                    <span className="block text-[11px] font-medium text-muted-foreground">
                      Available Balance
                    </span>
                    <span className="font-bold text-foreground">
                      {selectedAccount.accountNumber} ({selectedAccount.accountType})
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">
                  ৳{Number(selectedAccount.balance ?? 0).toLocaleString("en-BD")}
                </span>
              </div>
            )}

            {/* Recipient Account Number with HeroUI InputGroup */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Recipient Account Number
              </Label>
              <InputGroup className="w-full">
                <InputGroupPrefix>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </InputGroupPrefix>
                <InputGroupInput
                  type="text"
                  required
                  disabled={isLoading}
                  value={recipientAccountNumber}
                  onChange={(e) => setRecipientAccountNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. PV-10293847"
                  className="uppercase font-mono"
                />
              </InputGroup>
            </div>

            {/* Amount with HeroUI InputGroup and Quick Amount Chips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">
                  Transfer Amount (৳)
                </Label>
                <span className="text-[11px] text-muted-foreground">No transfer fees</span>
              </div>
              <InputGroup className="w-full">
                <InputGroupPrefix>
                  <span className="text-sm font-bold text-muted-foreground">৳</span>
                </InputGroupPrefix>
                <InputGroupInput
                  type="number"
                  min={1}
                  step="any"
                  required
                  disabled={isLoading}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                />
              </InputGroup>
              {/* Quick amount chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {QUICK_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setAmount(String(val))}
                    className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-primary/10 hover:text-primary transition"
                  >
                    +৳{val.toLocaleString("en-BD")}
                  </button>
                ))}
              </div>
            </div>

            {/* PIN with HeroUI Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Transaction Security PIN
              </Label>
              <Input
                type="password"
                inputMode="numeric"
                maxLength={6}
                required
                disabled={isLoading}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-6 digit PIN"
                className="w-full tracking-widest font-mono"
              />
            </div>

            {/* Reference / Note with HeroUI Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Reference / Note (Optional)
              </Label>
              <Input
                type="text"
                disabled={isLoading}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Office rent, bill payment..."
                className="w-full"
              />
            </div>
          </CardContent>

          {/* Footer actions with HeroUI Button */}
          <CardFooter className="flex items-center justify-end gap-2.5 p-6 pt-0">
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
                  <span>Processing Transfer...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Money</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
