"use client";

import React from "react";
import {
  Button,
  Card,
  Chip,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@heroui/react";
import {
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Landmark,
  Flag,
  CheckCircle2,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import type { ITransaction } from "@/types/transaction.type";

interface ITransactionsTableProps {
  transactions: ITransaction[];
  canFlagTransaction?: boolean;
  canApproveTransaction?: boolean;
  isProcessing?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (nextPage: number) => void;
  onViewReceipt?: (txn: ITransaction) => void;
  onFlagTransaction?: (txn: ITransaction) => void;
  onApproveTransaction?: (txn: ITransaction) => void;
}

function getStatusChipColor(
  status: string,
  flagged?: boolean,
): "success" | "warning" | "danger" | "default" {
  if (flagged || status === "Flagged") return "danger";
  switch (status) {
    case "Completed":
      return "success";
    case "Pending":
      return "warning";
    case "Failed":
    case "Reversed":
      return "danger";
    default:
      return "default";
  }
}

function getTypeBadgeConfig(type: string) {
  switch (type) {
    case "Transfer":
      return {
        color: "accent" as const,
        icon: ArrowLeftRight,
        label: "Transfer",
      };
    case "Deposit":
      return {
        color: "success" as const,
        icon: ArrowDownLeft,
        label: "Deposit",
      };
    case "Withdrawal":
      return {
        color: "warning" as const,
        icon: ArrowUpRight,
        label: "Withdrawal",
      };
    case "Loan Repayment":
      return {
        color: "accent" as const,
        icon: CreditCard,
        label: "Loan Repayment",
      };
    case "Loan Disbursement":
      return {
        color: "success" as const,
        icon: Landmark,
        label: "Disbursement",
      };
    default:
      return {
        color: "default" as const,
        icon: ArrowLeftRight,
        label: type || "Transaction",
      };
  }
}

export default function TransactionsTable({
  transactions,
  canFlagTransaction = false,
  canApproveTransaction = false,
  isProcessing = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  onViewReceipt,
  onFlagTransaction,
  onApproveTransaction,
}: ITransactionsTableProps) {
  const hasActions =
    Boolean(onViewReceipt) || canFlagTransaction || canApproveTransaction;

  if (transactions.length === 0) {
    return (
      <Card className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <ArrowLeftRight className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-foreground">
          No transactions found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try adjusting your search query, transaction type, or date filters.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border/70 bg-muted/25 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3.5 whitespace-nowrap">Txn ID</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Type</th>
                <th className="px-5 py-3.5 whitespace-nowrap">From / To</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Amount</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Date</th>
                <th className="px-5 py-3.5 whitespace-nowrap">Status</th>
                {hasActions && (
                  <th className="px-5 py-3.5 text-right whitespace-nowrap">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {transactions.map((txn) => {
                const isFlagged = Boolean(
                  txn.flagged || txn.status === "Flagged",
                );
                const typeConfig = getTypeBadgeConfig(txn.type);
                const TypeIcon = typeConfig.icon;
                const isDeposit = txn.type === "Deposit" || txn.type === "Loan Disbursement";
                const isWithdrawal = txn.type === "Withdrawal";

                return (
                  <tr key={txn.id} className="transition-colors hover:bg-muted/20">
                    {/* Txn ID */}
                    <td className="px-5 py-4 whitespace-nowrap min-w-[155px]">
                      <div className="whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-foreground tracking-tight whitespace-nowrap inline-block select-all">
                          {txn.transactionId}
                        </span>
                        {isFlagged && txn.flagReason && (
                          <p className="mt-0.5 font-sans text-xs text-rose-600 dark:text-rose-400">
                            Flag: {txn.flagReason}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Type - Styled Chip with Tooltip for description */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Chip
                          size="sm"
                          variant="soft"
                          color={typeConfig.color}
                          className="font-medium gap-1 px-2.5"
                        >
                          <TypeIcon className="h-3 w-3 shrink-0" />
                          <span>{typeConfig.label}</span>
                        </Chip>
                        {txn.description && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="cursor-help rounded-full p-0.5 text-muted-foreground/60 hover:bg-muted hover:text-foreground">
                                <Info className="h-3.5 w-3.5" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs text-xs">
                              {txn.description}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </td>

                    {/* From / To */}
                    <td className="px-5 py-4 text-xs whitespace-nowrap">
                      <div className="space-y-1">
                        {txn.senderAccount && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-muted-foreground w-8">From:</span>
                            <span className="font-mono font-semibold text-foreground bg-muted/40 px-1.5 py-0.5 rounded-md">
                              {txn.senderAccount}
                            </span>
                          </div>
                        )}
                        {txn.receiverAccount && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-muted-foreground w-8">To:</span>
                            <span className="font-mono font-semibold text-foreground bg-muted/40 px-1.5 py-0.5 rounded-md">
                              {txn.receiverAccount}
                            </span>
                          </div>
                        )}
                        {!txn.senderAccount && !txn.receiverAccount && (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`font-bold ${
                          isDeposit
                            ? "text-emerald-600 dark:text-emerald-400"
                            : isWithdrawal
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-foreground"
                        }`}
                      >
                        {isDeposit ? "+" : isWithdrawal ? "-" : ""}৳{Number(txn.amount ?? 0).toLocaleString("en-BD")}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-xs whitespace-nowrap">
                      {txn.createdAt ? (
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">
                            {new Date(txn.createdAt).toLocaleDateString("en-BD", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {new Date(txn.createdAt).toLocaleTimeString("en-BD", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Chip
                        size="sm"
                        variant="soft"
                        color={getStatusChipColor(txn.status, isFlagged)}
                        className="font-medium"
                      >
                        {isFlagged && txn.status !== "Flagged"
                          ? `${txn.status} • Flagged`
                          : txn.status}
                      </Chip>
                    </td>

                    {/* Action */}
                    {hasActions && (
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {onViewReceipt && (
                            <Button
                              size="sm"
                              variant="outline"
                              onPress={() => onViewReceipt(txn)}
                              className="h-8 gap-1.5 font-medium text-xs rounded-xl border-border/70 hover:bg-muted/50 cursor-pointer"
                            >
                              <Receipt className="h-3.5 w-3.5" />
                              <span>Receipt</span>
                            </Button>
                          )}

                          {canFlagTransaction && (
                            <Button
                              size="sm"
                              variant="outline"
                              isDisabled={isProcessing || isFlagged}
                              onPress={() => onFlagTransaction?.(txn)}
                              className="h-8 gap-1.5 font-medium text-xs rounded-xl text-rose-600 hover:text-rose-700 dark:text-rose-400"
                            >
                              <Flag className="h-3.5 w-3.5" />
                              <span>{isFlagged ? "Flagged" : "Flag"}</span>
                            </Button>
                          )}

                          {canApproveTransaction && txn.status === "Pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              isDisabled={isProcessing}
                              onPress={() => onApproveTransaction?.(txn)}
                              className="h-8 gap-1.5 font-medium text-xs rounded-xl text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Approve</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Page <strong className="text-foreground">{page}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              isDisabled={page <= 1}
              onPress={() => onPageChange(page - 1)}
              className="h-8 gap-1 font-medium rounded-xl border-border/70"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              isDisabled={page >= totalPages}
              onPress={() => onPageChange(page + 1)}
              className="h-8 gap-1 font-medium rounded-xl border-border/70"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
