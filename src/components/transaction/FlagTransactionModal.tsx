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
  TextArea,
  Label,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  Chip,
} from "@heroui/react";
import { X, Flag, AlertTriangle } from "lucide-react";
import type { ITransaction } from "@/types/transaction.type";

interface IFlagTransactionModalProps {
  transaction: ITransaction | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirmFlag: (payload: {
    id: string;
    flagReason: string;
  }) => Promise<void> | void;
}

interface IFlagTransactionModalInnerProps {
  transaction: ITransaction;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirmFlag: (payload: {
    id: string;
    flagReason: string;
  }) => Promise<void> | void;
}

function FlagTransactionModalInner({
  transaction,
  isSubmitting = false,
  onClose,
  onConfirmFlag,
}: IFlagTransactionModalInnerProps) {
  const [reason, setReason] = useState(transaction.flagReason ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!reason.trim()) {
      setErrorMessage("Please enter a reason for flagging this transaction.");
      return;
    }

    await onConfirmFlag({
      id: transaction.id,
      flagReason: reason.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-in fade-in duration-200">
      <Card className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between border-b border-border/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-foreground">
                  Flag Suspicious Transaction
                </CardTitle>
                <Chip size="sm" variant="soft" color="danger" className="text-xs font-semibold">
                  Compliance
                </Chip>
              </div>
              <CardDescription className="font-mono text-xs text-muted-foreground mt-0.5">
                {transaction.transactionId} • ৳
                {Number(transaction.amount ?? 0).toLocaleString("en-BD")}
              </CardDescription>
            </div>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Close modal"
            onPress={onClose}
            isDisabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-5">
            {errorMessage && (
              <Alert status="danger">
                <AlertIndicator />
                <AlertContent>
                  <AlertTitle>{errorMessage}</AlertTitle>
                </AlertContent>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Reason for Admin Review
              </Label>
              <TextArea
                rows={3}
                required
                disabled={isSubmitting}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Unusual high transfer amount, mismatched account activity, suspected fraud..."
                className="w-full resize-none"
              />
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-end gap-2.5 border-t border-border/60 p-5">
            <Button
              type="button"
              variant="outline"
              onPress={onClose}
              isDisabled={isSubmitting}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isDisabled={isSubmitting}
              className="gap-2 font-medium bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" color="current" />
                  <span>Flagging...</span>
                </>
              ) : (
                <>
                  <Flag className="h-4 w-4" />
                  <span>Flag for Admin</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function FlagTransactionModal({
  transaction,
  isSubmitting = false,
  onClose,
  onConfirmFlag,
}: IFlagTransactionModalProps) {
  if (!transaction) return null;

  return (
    <FlagTransactionModalInner
      key={transaction.id}
      transaction={transaction}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onConfirmFlag={onConfirmFlag}
    />
  );
}
