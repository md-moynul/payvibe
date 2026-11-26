"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, Chip } from "@heroui/react";
import { ArrowRight, Receipt, Landmark, Clock, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import type { ITransaction } from "@/types/transaction.type";
import type { ILoan } from "@/types/loan.type";

interface ICustomerRecentActivityProps {
  transactions: ITransaction[];
  loans: ILoan[];
  onViewReceipt: (txn: ITransaction) => void;
}

export default function CustomerRecentActivity({
  transactions,
  loans,
  onViewReceipt,
}: ICustomerRecentActivityProps) {
  const router = useRouter();
  const recentTxns = transactions.slice(0, 5);
  const activeOrPendingLoans = loans.slice(0, 4);

  const getTxnTypeBadge = (type: string) => {
    switch (type) {
      case "Deposit":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <ArrowDownLeft className="h-3 w-3" />
            Deposit
          </span>
        );
      case "Withdrawal":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <ArrowUpRight className="h-3 w-3" />
            Withdrawal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            <ArrowLeftRight className="h-3 w-3" />
            {type}
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
      {/* 1. Recent Transactions (Spans 2 columns) */}
      <Card className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:shadow-md lg:col-span-2">
        <CardContent className="space-y-4 p-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Recent Transactions
              </h2>
              <p className="text-xs text-muted-foreground">
                Latest activity across your account
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onPress={() => router.push("/dashboard/customer/transactions")}
              className="gap-1.5 text-xs font-medium"
            >
              <span>All Transactions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {recentTxns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Clock className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs text-muted-foreground">
                No recent transactions found.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60 text-sm">
              {recentTxns.map((txn) => (
                <div
                  key={txn.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 px-2 -mx-2 rounded-xl transition-colors hover:bg-muted/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {txn.transactionId}
                      </span>
                      {getTxnTypeBadge(txn.type)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {txn.description ||
                        (txn.createdAt
                          ? new Date(txn.createdAt).toLocaleDateString("en-BD", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">
                      ৳{Number(txn.amount ?? 0).toLocaleString("en-BD")}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onPress={() => onViewReceipt(txn)}
                      className="gap-1 text-xs"
                    >
                      <Receipt className="h-3.5 w-3.5" />
                      <span>Receipt</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Active & Recent Loans (Clean self-start card with zero dead gap) */}
      <Card className="self-start rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:shadow-md">
        <CardContent className="space-y-4 p-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400">
                <Landmark className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Loans</h2>
                <p className="text-[11px] text-muted-foreground">Active & applied</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onPress={() => router.push("/dashboard/customer/loans")}
              className="text-xs font-medium"
            >
              Manage
            </Button>
          </div>

          {activeOrPendingLoans.length === 0 ? (
            <div className="space-y-3 py-6 text-center">
              <div className="inline-flex rounded-full bg-muted/60 p-3 text-muted-foreground">
                <Landmark className="h-6 w-6" />
              </div>
              <p className="text-xs text-muted-foreground">
                No loan applications yet.
              </p>
              <Button
                size="sm"
                variant="primary"
                onPress={() => router.push("/dashboard/customer/loans")}
                className="text-xs font-medium"
              >
                Apply for Loan
              </Button>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border/60 text-sm">
                {activeOrPendingLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between gap-2 py-3 px-2 -mx-2 rounded-xl transition-colors hover:bg-muted/30"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {loan.loanType}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Remaining:{" "}
                        <span className="font-medium text-foreground">
                          ৳
                          {Number(
                            loan.remainingBalance ?? loan.requestedAmount ?? 0,
                          ).toLocaleString("en-BD")}
                        </span>
                      </p>
                    </div>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={
                        loan.status === "Active" || loan.status === "Approved"
                          ? "success"
                          : loan.status === "Rejected"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {loan.status}
                    </Chip>
                  </div>
                ))}
              </div>

              {/* Loan Summary Footer */}
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3.5 py-2.5 text-xs">
                <span className="text-muted-foreground font-medium">Total Loan Balance</span>
                <span className="font-bold text-foreground">
                  ৳{activeOrPendingLoans
                    .reduce(
                      (sum, l) =>
                        sum + Number(l.remainingBalance ?? l.requestedAmount ?? 0),
                      0,
                    )
                    .toLocaleString("en-BD")}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}