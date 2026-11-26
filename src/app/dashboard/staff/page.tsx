"use client";

import React, { useMemo } from "react";
import { Card, Chip, Spinner } from "@heroui/react";
import StaffOverviewStatsGrid from "@/components/staff/StaffOverviewStatsGrid";
import StaffQuickActionsGrid from "@/components/staff/StaffQuickActionsGrid";
import { useGetTransactionsQuery } from "@/redux/features/transaction/transaction.api";
import { useGetRequestsQuery } from "@/redux/features/request/request.api";
import { useGetLoansQuery } from "@/redux/features/loan/loan.api";

export default function StaffDashboardPage() {
  const { data: txnsData, isLoading: txnsLoading } = useGetTransactionsQuery({
    page: 1,
    limit: 10,
  });
  const { data: requestsData, isLoading: requestsLoading } =
    useGetRequestsQuery();
  const { data: loansData, isLoading: loansLoading } = useGetLoansQuery();

  const transactions = useMemo(() => txnsData?.data ?? [], [txnsData]);
  const requests = useMemo(() => requestsData?.data ?? [], [requestsData]);
  const loans = useMemo(() => loansData?.data ?? [], [loansData]);

  const pendingRequestsCount = useMemo(
    () => requests.filter((r) => r.status === "Pending").length,
    [requests],
  );

  const reviewLoansCount = useMemo(
    () =>
      loans.filter(
        (l) => l.status === "Pending" || l.status === "Under Review",
      ).length,
    [loans],
  );

  const flaggedTxnsCount = useMemo(
    () =>
      transactions.filter((t) => Boolean(t.flagged || t.status === "Flagged"))
        .length,
    [transactions],
  );

  const isLoading = txnsLoading || requestsLoading || loansLoading;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Bank Staff Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Oversee customer operations, transactions, deposit/withdrawal
            requests, and loan reviews.
          </p>
        </div>

        <Chip size="sm" variant="soft" color="accent" className="font-medium">
          Role: Bank Staff
        </Chip>
      </div>

      {isLoading ? (
        <Card className="flex items-center justify-center rounded-2xl border border-border bg-card p-10">
          <Spinner size="md" color="accent" />
        </Card>
      ) : (
        <StaffOverviewStatsGrid
          pendingRequestsCount={pendingRequestsCount}
          reviewLoansCount={reviewLoansCount}
          recentTransactionsCount={
            txnsData?.pagination?.total ?? transactions.length
          }
          flaggedTxnsCount={flaggedTxnsCount}
        />
      )}

      <StaffQuickActionsGrid />
    </div>
  );
}