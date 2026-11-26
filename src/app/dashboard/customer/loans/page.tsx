"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
  toast,
} from "@heroui/react";
import CustomerLoansHeader from "@/components/loan/CustomerLoansHeader";
import LoansTable from "@/components/loan/LoansTable";
import ApplyLoanModal from "@/components/loan/ApplyLoanModal";
import LoanScheduleModal from "@/components/loan/LoanScheduleModal";
import {
  useGetLoansQuery,
  useRepayLoanMutation,
} from "@/redux/features/loan/loan.api";
import { useGetTransactionsQuery } from "@/redux/features/transaction/transaction.api";
import type { ILoan } from "@/types/loan.type";
import type { ITransaction } from "@/types/transaction.type";

const REPAYMENT_START_DAY = 1;
const REPAYMENT_END_DAY = 10;

function getRepaymentWindowInfo(now: Date = new Date()) {
  const day = now.getDate();
  const isOpen = day >= REPAYMENT_START_DAY && day <= REPAYMENT_END_DAY;

  if (isOpen) {
    return {
      isOpen: true,
      message: `Installment payment window is open (${REPAYMENT_START_DAY}st – ${REPAYMENT_END_DAY}th of every month).`,
    };
  }

  const nextWindowDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    REPAYMENT_START_DAY,
  );
  const nextDateStr = nextWindowDate.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return {
    isOpen: false,
    message: `Loan installments can only be paid between the ${REPAYMENT_START_DAY}st and ${REPAYMENT_END_DAY}th of each month. Next repayment window opens on ${nextDateStr}.`,
  };
}

export default function CustomerLoansPage() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedScheduleLoan, setSelectedScheduleLoan] =
    useState<ILoan | null>(null);

  const repaymentWindow = useMemo(() => getRepaymentWindowInfo(), []);

  const { data, isLoading, isError, refetch } = useGetLoansQuery();
  const { data: transactionsData } = useGetTransactionsQuery({
    page: 1,
    limit: 100,
  });
  const [repayLoan, { isLoading: isRepaying }] = useRepayLoanMutation();

  const loans = useMemo<ILoan[]>(() => data?.data ?? [], [data]);
  const transactions = useMemo<ITransaction[]>(
    () => transactionsData?.data ?? [],
    [transactionsData],
  );

  const handleRepayInstallment = async (loan: ILoan) => {
    if (isRepaying) return;

    if (!repaymentWindow.isOpen) {
      toast.warning(repaymentWindow.message);
      return;
    }

    try {
      const res = await repayLoan({
        id: loan.id,
        amount: loan.monthlyInstallment,
      }).unwrap();
      toast.success(res.message || "Installment paid successfully.");
      await refetch();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to repay installment.";
      toast.danger(message);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <CustomerLoansHeader onOpenApplyModal={() => setIsApplyOpen(true)} />

      {!repaymentWindow.isOpen && (
        <Alert status="warning">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Installment Payment Window Closed</AlertTitle>
            <AlertDescription>{repaymentWindow.message}</AlertDescription>
          </AlertContent>
        </Alert>
      )}

      {isLoading ? (
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading your loans...
          </span>
        </Card>
      ) : isError ? (
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Failed to load loans</AlertTitle>
            <AlertDescription>
              Please check your session and try again.
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : (
        <LoansTable
          loans={loans}
          canRepayLoan
          isRepaymentWindowOpen={repaymentWindow.isOpen}
          isProcessing={isRepaying}
          onViewSchedule={(loan) => setSelectedScheduleLoan(loan)}
          onRepayLoan={handleRepayInstallment}
        />
      )}

      <ApplyLoanModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />

      <LoanScheduleModal
        isOpen={Boolean(selectedScheduleLoan)}
        loan={selectedScheduleLoan}
        transactions={transactions}
        onClose={() => setSelectedScheduleLoan(null)}
      />
    </div>
  );
}