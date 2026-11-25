"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import LoansTable from "@/components/loan/LoansTable";
import StaffLoanReviewModal from "@/components/loan/StaffLoanReviewModal";
import {
  useGetLoansQuery,
  useReviewLoanMutation,
} from "@/redux/features/loan/loan.api";
import type { ILoan } from "@/types/loan.type";

export default function StaffLoansPage() {
  const router = useRouter();
  const [selectedLoan, setSelectedLoan] = useState<ILoan | null>(null);

  const { data, isLoading, isError } = useGetLoansQuery();
  const [reviewLoan, { isLoading: isSubmitting }] = useReviewLoanMutation();

  const loans = useMemo<ILoan[]>(() => data?.data ?? [], [data]);

  const handleForwardToAdmin = async ({
    id,
    staffNotes,
    status,
  }: {
    id: string;
    staffNotes: string;
    status: "Under Review";
  }) => {
    try {
      const result = await reviewLoan({
        id,
        staffNotes,
        status,
      }).unwrap();

      toast.success(
        result?.message || "Loan forwarded to Admin for approval.",
      );
      setSelectedLoan(null);
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to forward loan application.";
      toast.danger(message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Loan Assistance & Review
        </h1>
        <p className="text-sm text-muted-foreground">
          Review customer loan applications, add internal notes, and forward for
          Admin approval.
        </p>
      </div>

      {isLoading ? (
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading loan applications...
          </span>
        </Card>
      ) : isError ? (
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Failed to load loan applications</AlertTitle>
            <AlertDescription>
              Please verify your Bank Staff session permissions.
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : (
        <LoansTable
          loans={loans}
          showCustomerInfo
          canAssistLoan
          isProcessing={isSubmitting}
          onViewUserInfo={(loan) =>
            router.push(
              `/dashboard/loans/${encodeURIComponent(loan.id)}/applicant`,
            )
          }
          onReviewLoan={(loan) => setSelectedLoan(loan)}
        />
      )}

      <StaffLoanReviewModal
        loan={selectedLoan}
        isSubmitting={isSubmitting}
        onClose={() => setSelectedLoan(null)}
        onForwardToAdmin={handleForwardToAdmin}
      />
    </div>
  );
}