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
import {
  useGetLoansQuery,
  useDecideLoanMutation,
} from "@/redux/features/loan/loan.api";
import type { ILoan, TLoanStatus } from "@/types/loan.type";

const STATUS_FILTERS: ("All" | TLoanStatus)[] = [
  "All",
  "Pending",
  "Under Review",
  "Active",
  "Rejected",
];

export default function AdminLoansPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<"All" | TLoanStatus>("All");

  const { data, isLoading, isError } = useGetLoansQuery();
  const [decideLoan, { isLoading: isProcessing }] = useDecideLoanMutation();

  const loans = useMemo<ILoan[]>(() => data?.data ?? [], [data]);

  const filteredLoans = useMemo(() => {
    if (statusFilter === "All") return loans;
    return loans.filter((loan) => loan.status === statusFilter);
  }, [loans, statusFilter]);

  const handleApproveLoan = async (loan: ILoan) => {
    if (isProcessing) return;
    try {
      const res = await decideLoan({
        id: loan.id,
        status: "Approved",
      }).unwrap();
      toast.success(res.message || "Loan approved and disbursed.");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to approve loan.";
      toast.danger(message);
    }
  };

  const handleRejectLoan = async (loan: ILoan) => {
    if (isProcessing) return;
    try {
      const res = await decideLoan({
        id: loan.id,
        status: "Rejected",
      }).unwrap();
      toast.success(res.message || "Loan application rejected.");
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to reject loan.";
      toast.danger(message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Loan Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Review staff notes, approve eligible loans with disbursement, or
            reject applications.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter loans by status"
          className="inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border/80 bg-card p-1 shadow-2xs"
        >
          {STATUS_FILTERS.map((status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setStatusFilter(status)}
                className={`cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1 text-xs transition-all duration-200 outline-none ${
                  isSelected
                    ? "bg-blue-500 font-semibold text-white shadow-xs"
                    : "font-medium text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
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
            <AlertTitle>Failed to load loans</AlertTitle>
            <AlertDescription>
              Please verify your Admin session permissions.
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : (
        <LoansTable
          loans={filteredLoans}
          showCustomerInfo
          canDecideLoan
          isProcessing={isProcessing}
          onViewUserInfo={(loan) =>
            router.push(
              `/dashboard/loans/${encodeURIComponent(loan.id)}/applicant`,
            )
          }
          onApproveLoan={handleApproveLoan}
          onRejectLoan={handleRejectLoan}
        />
      )}
    </div>
  );
}