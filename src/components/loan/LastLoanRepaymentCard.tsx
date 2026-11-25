"use client";

import React from "react";
import { Card, CardContent, Chip } from "@heroui/react";
import { History, CheckCircle2, AlertTriangle } from "lucide-react";
import type { IApplicantInfoPayload } from "@/types/loan.type";

interface ILastLoanRepaymentCardProps {
  lastLoan: IApplicantInfoPayload["lastLoan"];
}

export default function LastLoanRepaymentCard({
  lastLoan,
}: ILastLoanRepaymentCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <CardContent className="space-y-4 p-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <h2 className="text-base font-bold text-foreground">
              Last Loan &amp; Installment Repayment Check
            </h2>
          </div>

          {lastLoan && (
            <Chip
              size="sm"
              variant="soft"
              color={
                lastLoan.repaymentTimeliness === "Timely Paid"
                  ? "success"
                  : lastLoan.repaymentTimeliness === "Late / Missed Installment"
                    ? "danger"
                    : "warning"
              }
              className="font-medium"
            >
              {lastLoan.repaymentTimeliness}
            </Chip>
          )}
        </div>

        {!lastLoan ? (
          <p className="text-sm text-muted-foreground">
            This customer has no previous loan records.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Last Loan Type</p>
                <p className="font-semibold text-foreground">
                  {lastLoan.loanType}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Principal Amount
                </p>
                <p className="font-semibold text-foreground">
                  ৳{Number(lastLoan.requestedAmount ?? 0).toLocaleString("en-BD")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Total Paid So Far
                </p>
                <p className="font-semibold text-foreground">
                  ৳{Number(lastLoan.paidAmount ?? 0).toLocaleString("en-BD")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Remaining Balance
                </p>
                <p className="font-semibold text-foreground">
                  ৳{Number(lastLoan.remainingBalance ?? 0).toLocaleString("en-BD")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-3 text-xs">
              {lastLoan.repaymentTimeliness ===
              "Late / Missed Installment" ? (
                <>
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span className="font-medium text-rose-600 dark:text-rose-400">
                    Previous loan shows late or missed installment history.
                  </span>
                </>
              ) : lastLoan.repaymentTimeliness === "Timely Paid" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    Previous loan installments were paid timely and completed.
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600" />
                  <span className="font-medium text-foreground">
                    Previous loan status: {lastLoan.status} —{" "}
                    {lastLoan.repaymentTimeliness}.
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}