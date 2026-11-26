"use client";

import React, { useMemo } from "react";
import { Button, Chip } from "@heroui/react";
import {
  X,
  CalendarClock,
  CheckCircle2,
  Clock,
  ReceiptText,
} from "lucide-react";
import type { ILoan } from "@/types/loan.type";
import type { ITransaction } from "@/types/transaction.type";

interface ILoanScheduleModalProps {
  isOpen: boolean;
  loan: ILoan | null;
  transactions: ITransaction[];
  onClose: () => void;
}

interface IScheduleRow {
  installmentNo: number;
  dueDate: string;
  amount: number;
  status: "Paid" | "Upcoming";
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LoanScheduleModal({
  isOpen,
  loan,
  transactions,
  onClose,
}: ILoanScheduleModalProps) {
  const repaymentHistory = useMemo(() => {
    if (!loan) return [];
    return transactions.filter((txn) => {
      if (txn.type !== "Loan Repayment") return false;
      const desc = (txn.description || "").toLowerCase();
      return (
        desc.includes(loan.id.toLowerCase()) ||
        desc.includes((loan.loanType || "").toLowerCase())
      );
    });
  }, [loan, transactions]);

  const scheduleRows = useMemo<IScheduleRow[]>(() => {
    if (!loan) return [];
    const duration = Math.max(1, Number(loan.durationMonths || 12));
    const totalPayable = Number(
      loan.totalPayable ?? loan.requestedAmount ?? 0,
    );
    const remaining = Math.max(0, Number(loan.remainingBalance ?? totalPayable));
    const emi =
      Number(loan.monthlyInstallment) > 0
        ? Number(loan.monthlyInstallment)
        : Math.round((totalPayable / duration) * 100) / 100;

    const paidAmount = Math.max(0, totalPayable - remaining);
    const paidInstallmentsCount =
      loan.status === "Completed" || remaining === 0
        ? duration
        : emi > 0
          ? Math.min(duration, Math.floor((paidAmount + 0.01) / emi))
          : 0;

    const baseDate = loan.createdAt ? new Date(loan.createdAt) : new Date();
    const validBase = Number.isNaN(baseDate.getTime())
      ? new Date()
      : baseDate;

    const rows: IScheduleRow[] = [];
    for (let i = 1; i <= duration; i++) {
      const due = new Date(validBase);
      due.setMonth(due.getMonth() + i);

      rows.push({
        installmentNo: i,
        dueDate: formatDate(due.toISOString()),
        amount: emi,
        status: i <= paidInstallmentsCount ? "Paid" : "Upcoming",
      });
    }
    return rows;
  }, [loan]);

  if (!isOpen || !loan) return null;

  const totalPayable = Number(loan.totalPayable ?? loan.requestedAmount ?? 0);
  const remaining = Math.max(0, Number(loan.remainingBalance ?? totalPayable));
  const paidTotal = Math.max(0, totalPayable - remaining);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Repayment Schedule &amp; History
              </h2>
              <p className="text-xs text-muted-foreground">
                {loan.loanType} • {loan.durationMonths} Months • Status:{" "}
                <span className="font-semibold text-foreground">
                  {loan.status}
                </span>
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onPress={onClose}
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-3.5">
            <p className="text-xs text-muted-foreground">Total Payable</p>
            <p className="mt-1 text-base font-bold text-foreground">
              ৳{totalPayable.toLocaleString("en-BD")}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5">
            <p className="text-xs text-muted-foreground">Total Paid</p>
            <p className="mt-1 text-base font-bold text-emerald-600 dark:text-emerald-400">
              ৳{paidTotal.toLocaleString("en-BD")}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-3.5">
            <p className="text-xs text-muted-foreground">Remaining Balance</p>
            <p className="mt-1 text-base font-bold text-amber-600 dark:text-amber-400">
              ৳{remaining.toLocaleString("en-BD")}
            </p>
          </div>
        </div>

        {/* Installment Schedule Table */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-semibold text-foreground">
            Installment Schedule ({scheduleRows.length} Installments)
          </h3>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead className="sticky top-0 border-b border-border bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5">#</th>
                  <th className="px-4 py-2.5">Due Date</th>
                  <th className="px-4 py-2.5">Installment</th>
                  <th className="px-4 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {scheduleRows.map((row) => (
                  <tr key={row.installmentNo} className="hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      Installment {row.installmentNo}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {row.dueDate}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-foreground">
                      ৳{row.amount.toLocaleString("en-BD")}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Chip
                        size="sm"
                        variant="soft"
                        color={row.status === "Paid" ? "success" : "warning"}
                      >
                        <span className="inline-flex items-center gap-1">
                          {row.status === "Paid" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {row.status}
                        </span>
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Repayment History */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <ReceiptText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Repayment Transaction History
            </h3>
          </div>

          {repaymentHistory.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              No installment payments recorded for this loan yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5">Transaction ID</th>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Amount Paid</th>
                    <th className="px-4 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {repaymentHistory.map((txn) => (
                    <tr key={txn.id} className="hover:bg-muted/20">
                      <td className="px-4 py-2.5 font-mono text-xs text-foreground">
                        {txn.transactionId}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        {formatDate(txn.createdAt)}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        ৳{Number(txn.amount ?? 0).toLocaleString("en-BD")}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Chip size="sm" variant="soft" color="success">
                          {txn.status}
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border pt-4">
          <Button type="button" variant="outline" onPress={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}