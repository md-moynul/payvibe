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
} from "@heroui/react";
import CustomerLoansHeader from "@/components/loan/CustomerLoansHeader";
import LoansTable from "@/components/loan/LoansTable";
import ApplyLoanModal from "@/components/loan/ApplyLoanModal";
import { useGetLoansQuery } from "@/redux/features/loan/loan.api";
import type { ILoan } from "@/types/loan.type";

export default function CustomerLoansPage() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useGetLoansQuery();
  const loans = useMemo<ILoan[]>(() => data?.data ?? [], [data]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <CustomerLoansHeader onOpenApplyModal={() => setIsApplyOpen(true)} />

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
        <LoansTable loans={loans} />
      )}

      <ApplyLoanModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
}