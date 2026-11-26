"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent } from "@heroui/react";
import {
  ArrowLeftRight,
  ArrowUpDown,
  Landmark,
  Users,
  ArrowRight,
} from "lucide-react";

export default function StaffQuickActionsGrid() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex h-full flex-col justify-between gap-4 p-0">
          <div className="space-y-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">
              Customer Operations
            </h2>
            <p className="text-xs text-muted-foreground">
              Register customers, verify details, and open bank accounts.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onPress={() => router.push("/dashboard/admin/customers")}
            className="w-fit gap-1.5 font-medium"
          >
            <span>Manage Customers</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex h-full flex-col justify-between gap-4 p-0">
          <div className="space-y-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">
              Transactions
            </h2>
            <p className="text-xs text-muted-foreground">
              Search by ID, filter by type/date, and flag suspicious entries.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onPress={() => router.push("/dashboard/staff/transactions")}
            className="w-fit gap-1.5 font-medium"
          >
            <span>View Transactions</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex h-full flex-col justify-between gap-4 p-0">
          <div className="space-y-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ArrowUpDown className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">
              Deposit &amp; Withdrawals
            </h2>
            <p className="text-xs text-muted-foreground">
              Review customer deposit and withdrawal requests.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onPress={() => router.push("/dashboard/staff/requests")}
            className="w-fit gap-1.5 font-medium"
          >
            <span>Review Requests</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <CardContent className="flex h-full flex-col justify-between gap-4 p-0">
          <div className="space-y-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Landmark className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-foreground">
              Loan Assistance
            </h2>
            <p className="text-xs text-muted-foreground">
              Verify loan applications, add internal notes, and forward.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onPress={() => router.push("/dashboard/staff/loans")}
            className="w-fit gap-1.5 font-medium"
          >
            <span>Review Loans</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}