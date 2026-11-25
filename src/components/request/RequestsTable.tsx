"use client";

import React from "react";
import { Button, Card, Chip } from "@heroui/react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
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
      <Card className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Clock className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-foreground">
          No deposit or withdrawal requests
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
              {showCustomer && <th className="px-5 py-3.5">Customer</th>}
              <th className="px-5 py-3.5">Account</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Status</th>
              {canDecide && <th className="px-5 py-3.5 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((item) => {
              const isPending = item.status === "Pending";

              return (
                <tr key={item.id} className="transition hover:bg-muted/30">
                  {showCustomer && (
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">
                        {item.customerName || "Customer"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.customerEmail || ""}
                      </p>
                    </td>
                  )}

                  <td className="px-5 py-4 font-mono text-xs text-foreground">
                    {item.accountNumber || "—"}
                  </td>

                  <td className="px-5 py-4 font-semibold text-foreground">
                    <div>
                      <span>{item.type}</span>
                      {item.description && (
                        <p className="text-xs font-normal text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      {item.status === "Rejected" && item.rejectionReason && (
                        <p className="text-xs font-normal text-rose-600 dark:text-rose-400">
                          Reason: {item.rejectionReason}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 font-bold text-foreground">
                    ৳{Number(item.amount ?? 0).toLocaleString("en-BD")}
                  </td>

                  <td className="px-5 py-4">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={getStatusColor(item.status)}
                      className="font-medium"
                    >
                      {item.status}
                    </Chip>
                  </td>

                  {canDecide && (
                    <td className="px-5 py-4 text-right">
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