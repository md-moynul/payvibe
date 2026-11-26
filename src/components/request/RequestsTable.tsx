"use client";

import React from "react";
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  Chip,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@heroui/react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Info,
} from "lucide-react";
import type { IDepositWithdrawalRequest } from "@/types/request.type";

interface IRequestsTableProps {
  requests: IDepositWithdrawalRequest[];
  showCustomer?: boolean;
  canDecide?: boolean;
  isProcessing?: boolean;
  onApprove?: (reqItem: IDepositWithdrawalRequest) => void;
  onReject?: (reqItem: IDepositWithdrawalRequest) => void;
}

function getStatusColor(status: string) {
  switch (status) {
    case "Approved":
      return "success";
    case "Rejected":
      return "danger";
    default:
      return "warning";
  }
}

export default function RequestsTable({
  requests,
  showCustomer = false,
  canDecide = false,
  isProcessing = false,
  onApprove,
  onReject,
}: IRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <Card className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Clock className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-foreground">
          No deposit or withdrawal requests found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Requests will appear here once submitted.
        </p>
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {showCustomer && (
                <th className="px-5 py-3.5 whitespace-nowrap">Customer</th>
              )}
              <th className="px-5 py-3.5 whitespace-nowrap">Account</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Type</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Amount</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Date</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Status</th>
              {canDecide && (
                <th className="px-5 py-3.5 text-right whitespace-nowrap">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((item) => {
              const isPending = item.status === "Pending";
              const isDeposit = item.type === "Deposit";

              return (
                <tr key={item.id} className="transition hover:bg-muted/30">
                  {showCustomer && (
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <Avatar size="sm" variant="soft" color="accent">
                          <AvatarFallback className="font-bold text-xs">
                            {(item.customerName || "CU")
                              .split(" ")
                              .map((p) => p[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">
                            {item.customerName || "Customer"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.customerEmail || ""}
                          </p>
                        </div>
                      </div>
                    </td>
                  )}

                  <td className="px-5 py-4 whitespace-nowrap min-w-[140px]">
                    <span className="font-mono text-xs font-semibold text-foreground select-all">
                      {item.accountNumber || "—"}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Chip
                        size="sm"
                        variant="soft"
                        color={isDeposit ? "success" : "warning"}
                        className="font-medium gap-1 px-2.5"
                      >
                        {isDeposit ? (
                          <ArrowDownLeft className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                        )}
                        <span>{item.type}</span>
                      </Chip>

                      {item.description && (
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="cursor-help rounded-full p-0.5 text-muted-foreground/60 hover:bg-muted hover:text-foreground">
                              <Info className="h-3.5 w-3.5" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-xs">
                            {item.description}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-bold text-foreground whitespace-nowrap">
                    <span
                      className={
                        isDeposit
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }
                    >
                      {isDeposit ? "+" : "-"}৳
                      {Number(item.amount ?? 0).toLocaleString("en-BD")}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString("en-BD", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Chip
                        size="sm"
                        variant="soft"
                        color={getStatusColor(item.status)}
                        className="font-medium"
                      >
                        {item.status}
                      </Chip>

                      {item.status === "Rejected" && item.rejectionReason && (
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="cursor-help text-rose-600 hover:text-rose-700 dark:text-rose-400">
                              <Info className="h-3.5 w-3.5" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-xs text-rose-600">
                            Reason: {item.rejectionReason}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </td>

                  {canDecide && (
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          isDisabled={isProcessing || !isPending}
                          onPress={() => onApprove?.(item)}
                          className="gap-1.5 font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          isDisabled={isProcessing || !isPending}
                          onPress={() => onReject?.(item)}
                          className="gap-1.5 font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </Button>
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
  );
}
