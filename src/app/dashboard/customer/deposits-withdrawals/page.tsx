"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@heroui/react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Clock,
} from "lucide-react";
import RequestsTable from "@/components/request/RequestsTable";
import { useGetRequestsQuery } from "@/redux/features/request/request.api";

export default function DepositsWithdrawalsChoicePage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetRequestsQuery();
  const requests = useMemo(() => data?.data ?? [], [data]);

  // Quick stats calculation
  const stats = useMemo(() => {
    let depositTotal = 0;
    let withdrawalTotal = 0;
    let pendingCount = 0;

    for (const req of requests) {
      if (req.status === "Approved") {
        if (req.type === "Deposit") depositTotal += req.amount;
        if (req.type === "Withdrawal") withdrawalTotal += req.amount;
      } else if (req.status === "Pending") {
        pendingCount += 1;
      }
    }

    return { depositTotal, withdrawalTotal, pendingCount };
  }, [requests]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Deposits &amp; Withdrawals
            </h1>
            <Chip size="sm" variant="soft" color="accent" className="font-semibold text-xs">
              Account Operations
            </Chip>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Initiate funds deposit or withdrawal requests and monitor verification status.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onPress={() =>
              router.push("/dashboard/customer/deposits-withdrawals/withdrawals")
            }
            className="gap-2 font-medium"
          >
            <ArrowUpRight className="h-4 w-4 text-amber-500" />
            <span>Withdraw</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            onPress={() =>
              router.push("/dashboard/customer/deposits-withdrawals/deposits")
            }
            className="gap-2 font-medium"
          >
            <ArrowDownLeft className="h-4 w-4" />
            <span>Deposit Funds</span>
          </Button>
        </div>
      </div>

      {/* Metrics Highlights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <CardContent className="flex items-center gap-3.5 p-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground">
                Total Approved Deposits
              </span>
              <span className="text-xl font-bold text-foreground tracking-tight">
                ৳{stats.depositTotal.toLocaleString("en-BD")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <CardContent className="flex items-center gap-3.5 p-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground">
                Total Approved Withdrawals
              </span>
              <span className="text-xl font-bold text-foreground tracking-tight">
                ৳{stats.withdrawalTotal.toLocaleString("en-BD")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <CardContent className="flex items-center gap-3.5 p-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs font-medium text-muted-foreground">
                Pending Verification
              </span>
              <span className="text-xl font-bold text-foreground tracking-tight">
                {stats.pendingCount} {stats.pendingCount === 1 ? "Request" : "Requests"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Gateway Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Deposit Card */}
        <Card className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-emerald-500/50 hover:shadow-md">
          <CardContent className="flex h-full flex-col justify-between gap-5 p-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ArrowDownLeft className="h-6 w-6" />
                </div>
                <Chip size="sm" variant="soft" color="success" className="font-semibold text-xs">
                  Zero Fee
                </Chip>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Deposit Money
                </h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Request to add funds directly into your active checking or savings account. Once authorized by bank staff, funds are immediately credited.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              onPress={() =>
                router.push("/dashboard/customer/deposits-withdrawals/deposits")
              }
              className="w-full gap-2 font-medium sm:w-fit"
            >
              <span>Initiate Deposit</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Withdrawal Card */}
        <Card className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-amber-500/50 hover:shadow-md">
          <CardContent className="flex h-full flex-col justify-between gap-5 p-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
                <Chip size="sm" variant="soft" color="warning" className="font-semibold text-xs">
                  Verified Only
                </Chip>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Withdraw Funds
                </h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Submit a withdrawal request to access cash from your available bank balance, subject to branch operational hours and daily security limits.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onPress={() =>
                router.push(
                  "/dashboard/customer/deposits-withdrawals/withdrawals",
                )
              }
              className="w-full gap-2 font-medium sm:w-fit"
            >
              <span>Initiate Withdrawal</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Request History Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Request Activity History
            </h2>
            <p className="text-xs text-muted-foreground">
              Complete history of all your submitted deposit and cash withdrawal requests.
            </p>
          </div>
          <Chip size="sm" variant="soft" color="default" className="font-semibold text-xs">
            {requests.length} {requests.length === 1 ? "Record" : "Records"}
          </Chip>
        </div>

        {isLoading ? (
          <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-12 text-center">
            <Spinner size="md" color="accent" />
            <span className="text-sm text-muted-foreground font-medium">
              Loading request records...
            </span>
          </Card>
        ) : isError ? (
          <Alert status="danger">
            <AlertIndicator />
            <AlertContent>
              <AlertTitle>Failed to load requests</AlertTitle>
              <AlertDescription>
                Please check your network session and try again.
              </AlertDescription>
            </AlertContent>
          </Alert>
        ) : (
          <RequestsTable requests={requests} />
        )}
      </div>
    </div>
  );
}
