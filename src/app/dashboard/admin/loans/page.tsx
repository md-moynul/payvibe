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

        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((status) => {
            const active = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-muted-foreground hover:text-foreground"
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