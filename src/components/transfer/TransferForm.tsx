"use client";

import React from "react";
import {
  Button,
  Card,
  CardContent,
  Chip,
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
} from "@heroui/react";
import { Send, CreditCard, Sparkles, Lock } from "lucide-react";
import type { IAccount } from "@/types/account.type";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

interface ITransferFormProps {
  accounts: IAccount[];
  selectedAccount?: IAccount;
  onAccountChange: (id: string) => void;
  recipientAccountNumber: string;
  onRecipientChange: (value: string) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  pin: string;
  onPinChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  errorMessage: string | null;
  isTransferring: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function TransferForm({
  accounts,
  selectedAccount,
  onAccountChange,
  recipientAccountNumber,
  onRecipientChange,
  amount,
  onAmountChange,
  pin,
  onPinChange,
  description,
  onDescriptionChange,
  errorMessage,
  isTransferring,
  onSubmit,
  onCancel,
}: ITransferFormProps) {
  const handleAddQuickAmount = (val: number) => {
    const current = Number(amount) || 0;
    onAmountChange(String(current + val));
  };

  return (
    <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
      <CardContent className="space-y-6 p-0">
        {/* Form Title & Badge */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Send Money</h2>
              <p className="text-xs text-muted-foreground">
                Instant, zero-fee transfers within the PayVibe network.
              </p>
            </div>
          </div>
          <Chip size="sm" variant="soft" color="accent">
            Instant Transfer
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

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Source Account (if customer has more than 1) */}
          {accounts.length > 1 && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Source Account
              </Label>
              <select
                value={selectedAccount?.id ?? ""}
                onChange={(e) => onAccountChange(e.target.value)}
                disabled={isTransferring}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
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

          {/* Recipient Account Number */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Recipient Account Number
            </Label>
            <InputGroup className="w-full">
              <InputGroupPrefix className="text-muted-foreground">
                <CreditCard className="h-4 w-4" />
              </InputGroupPrefix>
              <InputGroupInput
                type="text"
                required
                disabled={isTransferring}
                value={recipientAccountNumber}
                onChange={(e) => onRecipientChange(e.target.value)}
                placeholder="e.g. PV-58610105"
                className="font-mono text-sm uppercase tracking-wide"
              />
            </InputGroup>
          </div>

          {/* Transfer Amount with InputGroup & Quick Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                Transfer Amount
              </Label>
              <span className="text-xs text-muted-foreground">
                Available:{" "}
                <strong className="text-foreground">
                  ৳{Number(selectedAccount?.balance ?? 0).toLocaleString("en-BD")}
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
                disabled={isTransferring}
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder="e.g. 1,000"
                className="font-medium"
              />
            </InputGroup>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                Quick:
              </span>
              {QUICK_AMOUNTS.map((val) => (
                <Button
                  key={val}
                  type="button"
                  size="sm"
                  variant="outline"
                  onPress={() => handleAddQuickAmount(val)}
                  className="h-7 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  +৳{val.toLocaleString("en-BD")}
                </Button>
              ))}
            </div>
          </div>

          {/* Security PIN */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                Security Transaction PIN
              </Label>
              <span className="text-xs text-muted-foreground">4–6 digits</span>
            </div>
            <InputGroup className="w-full">
              <InputGroupPrefix className="text-muted-foreground">
                <Lock className="h-4 w-4" />
              </InputGroupPrefix>
              <InputGroupInput
                type="password"
                inputMode="numeric"
                maxLength={6}
                required
                disabled={isTransferring}
                value={pin}
                onChange={(e) => onPinChange(e.target.value)}
                placeholder="••••"
                className="font-mono tracking-widest"
              />
            </InputGroup>
          </div>

          {/* Optional Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Note or Reference (Optional)
            </Label>
            <Input
              type="text"
              disabled={isTransferring}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="e.g. Family support, dinner split, rent"
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onPress={onCancel}
              className="font-medium"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              isDisabled={isTransferring}
              className="gap-2 font-medium"
            >
              {isTransferring ? (
                <>
                  <Spinner size="sm" color="current" />
                  <span>Processing Transfer...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Transfer Funds</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
