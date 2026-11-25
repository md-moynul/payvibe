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
  Chip,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@heroui/react";
import { X, Printer, CheckCircle2, Copy, Check, ShieldCheck } from "lucide-react";
import type { ITransaction } from "@/types/transaction.type";

interface ITransactionReceiptModalProps {
  transaction: ITransaction | null;
  onClose: () => void;
}

export default function TransactionReceiptModal({
  transaction,
  onClose,
}: ITransactionReceiptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const handleCopyId = () => {
    if (!transaction.transactionId) return;
    navigator.clipboard.writeText(transaction.transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCompleted = transaction.status === "Completed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-in fade-in duration-200">
      <Card className="w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <CardHeader className="flex flex-row items-start justify-between border-b border-border/60 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <CardTitle className="text-base font-bold text-foreground">
                  Transaction Receipt
                </CardTitle>
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                PayVibe Digital Financial Network
              </CardDescription>
            </div>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Close receipt modal"
            onPress={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        {/* Receipt Content */}
        <CardContent className="space-y-4 p-5">
          {/* Main Amount Card */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/30 p-5 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Amount
            </span>
            <span className="mt-1 text-2xl font-black text-foreground tracking-tight">
              ৳{Number(transaction.amount ?? 0).toLocaleString("en-BD")}
            </span>
            <Chip
              size="sm"
              variant="soft"
              color={isCompleted ? "success" : "warning"}
              className="mt-2 font-semibold text-xs"
            >
              {transaction.status}
            </Chip>
          </div>

          {/* Key details list */}
          <div className="space-y-2.5 rounded-xl border border-border/60 p-4 text-xs">
            {/* Reference ID with copy button */}
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">Reference ID</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-foreground">
                  {transaction.transactionId}
                </span>
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copied ? "Copied!" : "Copy Transaction ID"}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Transaction Type */}
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">Transaction Type</span>
              <span className="font-semibold text-foreground">
                {transaction.type}
              </span>
            </div>

            {/* Sender Account */}
            {transaction.senderAccount && (
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Sender Account</span>
                <span className="font-mono font-medium text-foreground">
                  {transaction.senderAccount}
                </span>
              </div>
            )}

            {/* Receiver Account */}
            {transaction.receiverAccount && (
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Recipient Account</span>
                <span className="font-mono font-medium text-foreground">
                  {transaction.receiverAccount}
                </span>
              </div>
            )}

            {/* Timestamp */}
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground">Timestamp</span>
              <span className="font-medium text-foreground">
                {transaction.createdAt
                  ? new Date(transaction.createdAt).toLocaleString("en-BD", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"}
              </span>
            </div>

            {/* Note/Description if present */}
            {transaction.description && (
              <div className="pt-1">
                <span className="block text-[11px] text-muted-foreground">
                  Note / Remarks
                </span>
                <p className="mt-0.5 font-medium text-foreground">
                  {transaction.description}
                </p>
              </div>
            )}
          </div>
        </CardContent>

        {/* Footer actions with HeroUI Button */}
        <CardFooter className="flex items-center justify-end gap-2.5 border-t border-border/60 p-5">
          <Button
            type="button"
            variant="outline"
            onPress={() => window.print()}
            className="gap-1.5 font-medium"
          >
            <Printer className="h-4 w-4" />
            <span>Print Receipt</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            onPress={onClose}
            className="font-medium px-5"
          >
            Done
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
