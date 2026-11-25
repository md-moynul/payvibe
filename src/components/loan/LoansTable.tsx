"use client";

import React from "react";
import { Button, Card, Chip } from "@heroui/react";
import {
  Landmark,
  FileText,
  CheckCircle2,
  XCircle,
  UserSearch,
} from "lucide-react";
import type { ILoan, TLoanStatus } from "@/types/loan.type";

interface ILoansTableProps {
  loans: ILoan[];
  showCustomerInfo?: boolean;
  canAssistLoan?: boolean;
  canDecideLoan?: boolean;
  isProcessing?: boolean;
  onViewUserInfo?: (loan: ILoan) => void;
  onReviewLoan?: (loan: ILoan) => void;
  onApproveLoan?: (loan: ILoan) => void;
  onRejectLoan?: (loan: ILoan) => void;
}

function getLoanStatusColor(status: TLoanStatus) {
  switch (status) {
    case "Approved":
    case "Active":
    case "Completed":
      return "success";
    case "Under Review":
      return "accent";
    case "Rejected":
      return "danger";
    default:
      return "warning";
  }
}

export default function LoansTable({
  loans,
  showCustomerInfo = false,
  canAssistLoan = false,
  canDecideLoan = false,
  isProcessing = false,
  onViewUserInfo,
  onReviewLoan,
  onApproveLoan,
  onRejectLoan,
}: ILoansTableProps) {
  const hasAnyAction =
    Boolean(onViewUserInfo) || canAssistLoan || canDecideLoan;

  if (loans.length === 0) {
    return (
      <Card className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Landmark className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium text-foreground">
          No loan applications found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {showCustomerInfo
            ? "Loan applications submitted by customers will appear here."
            : 'Click "Apply for Loan" above to submit your first application.'}
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
              {showCustomerInfo && <th className="px-5 py-3.5">Applicant</th>}
              <th className="px-5 py-3.5">Loan Type</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Duration</th>
              <th className="px-5 py-3.5">Remaining</th>
              <th className="px-5 py-3.5">Status</th>
              {hasAnyAction && (
                <th className="px-5 py-3.5 text-right">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loans.map((loan) => {
              const isFinalized =
                loan.status === "Approved" ||
                loan.status === "Active" ||
                loan.status === "Rejected" ||
                loan.status === "Completed";

              return (
                <tr key={loan.id} className="transition hover:bg-muted/30">
                  {showCustomerInfo && (
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-foreground">
                          {loan.customerName || "Customer"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {loan.customerEmail || ""}
                        </p>
                        {loan.staffNotes && (
                          <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                            Note: {loan.staffNotes}
                          </p>
                        )}
                      </div>
                    </td>
                  )}

                  <td className="px-5 py-4 font-semibold text-foreground">
                    {loan.loanType}
                  </td>

                  <td className="px-5 py-4 font-medium text-foreground">
                    ৳{Number(loan.requestedAmount ?? 0).toLocaleString("en-BD")}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {loan.durationMonths} months
                  </td>

                  <td className="px-5 py-4 text-foreground">
                    ৳
                    {Number(
                      loan.remainingBalance ?? loan.requestedAmount ?? 0,
                    ).toLocaleString("en-BD")}
                  </td>

                  <td className="px-5 py-4">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={getLoanStatusColor(loan.status)}
                      className="font-medium"
                    >
                      {loan.status}
                    </Chip>
                  </td>

                  {hasAnyAction && (
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                        {onViewUserInfo && (
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => onViewUserInfo(loan)}
                            className="gap-1.5 font-medium"
                          >
                            <UserSearch className="h-3.5 w-3.5" />
                            <span>View User Info</span>
                          </Button>
                        )}

                        {canAssistLoan && (
                          <Button
                            size="sm"
                            variant="outline"
                            isDisabled={isProcessing || isFinalized}
                            onPress={() => onReviewLoan?.(loan)}
                            className="gap-1.5 font-medium"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Review / Forward</span>
                          </Button>
                        )}

                        {canDecideLoan && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              isDisabled={isProcessing || isFinalized}
                              onPress={() => onApproveLoan?.(loan)}
                              className="gap-1.5 font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Approve</span>
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              isDisabled={isProcessing || isFinalized}
                              onPress={() => onRejectLoan?.(loan)}
                              className="gap-1.5 font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </Button>
                          </>
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
  );
}