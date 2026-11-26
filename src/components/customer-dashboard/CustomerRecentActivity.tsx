"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, Chip } from "@heroui/react";
import { ArrowRight, Receipt, Landmark } from "lucide-react";
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

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Recent Transactions */}
      <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
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
            <p className="py-6 text-center text-xs text-muted-foreground">
              No recent transactions found.
            </p>
          ) : (
            <div className="divide-y divide-border text-sm">
              {recentTxns.map((txn) => (
                <div
                  key={txn.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {txn.transactionId}
                      </span>
                      <Chip size="sm" variant="soft" color="default">
                        {txn.type}
                      </Chip>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {txn.description ||
                        (txn.createdAt
                          ? new Date(txn.createdAt).toLocaleDateString("en-BD")
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

      {/* Active & Recent Loans */}
      <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <CardContent className="space-y-4 p-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">Loans</h2>
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
            <div className="space-y-2 py-6 text-center">
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
            <div className="divide-y divide-border text-sm">
              {activeOrPendingLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between gap-2 py-3"
                >
                  <div>
                    <p className="font-semibold text-foreground">
                      {loan.loanType}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Remaining: ৳
                      {Number(
                        loan.remainingBalance ?? loan.requestedAmount ?? 0,
                      ).toLocaleString("en-BD")}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}