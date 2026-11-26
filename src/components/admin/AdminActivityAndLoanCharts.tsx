"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, Spinner } from "@heroui/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { FileText, Activity } from "lucide-react";
import type { ITransaction } from "@/types/transaction.type";
import type { ILoan } from "@/types/loan.type";
import ChartTimeframeToggle, { type TTimeframe } from "@/components/admin/ChartTimeframeToggle";

interface IAdminActivityAndLoanChartsProps {
  transactions: ITransaction[];
  loans: ILoan[];
  isLoading?: boolean;
}

interface ILoanStatItem {
  stage: string;
  count: number;
  color: string;
}

interface IDailyActivityItem {
  month: string;
  transactions: number;
  loans: number;
}

function getRollingDaysActivityMap(
  daysCount = 7,
  referenceDate = new Date(),
): Map<string, IDailyActivityItem> {
  const map = new Map<string, IDailyActivityItem>();
  const refTime = Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate(),
  );

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(refTime - i * 24 * 60 * 60 * 1000);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const day = d.getUTCDate();
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    map.set(key, {
      month: label,
      transactions: 0,
      loans: 0,
    });
  }

  return map;
}

interface ITooltipPayloadItem {
  color?: string;
  fill?: string;
  stroke?: string;
  name?: string;
  value?: number;
}

interface ICustomTooltipProps {
  active?: boolean;
  payload?: ITooltipPayloadItem[];
  label?: string;
}

function ActivityTooltip({ active, payload, label }: ICustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/80 bg-card/95 p-3.5 shadow-xl backdrop-blur-md">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>
        <div className="space-y-1.5">
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-foreground/85">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color || item.fill || item.stroke }}
                />
                {item.name}
              </span>
              <span className="font-bold text-foreground">
                {Number(item.value ?? 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function AdminActivityAndLoanCharts({
  transactions,
  loans,
  isLoading = false,
}: IAdminActivityAndLoanChartsProps) {
  const [velocityTimeframe, setVelocityTimeframe] = useState<TTimeframe>(7);

  const loanStats = useMemo<ILoanStatItem[]>(() => {
    let approvedOrActive = 0;
    let pendingOrReview = 0;
    let rejected = 0;
    let completed = 0;

    for (const loan of loans) {
      if (loan.status === "Approved" || loan.status === "Active") {
        approvedOrActive += 1;
      } else if (loan.status === "Pending" || loan.status === "Under Review") {
        pendingOrReview += 1;
      } else if (loan.status === "Rejected") {
        rejected += 1;
      } else if (loan.status === "Completed") {
        completed += 1;
      }
    }

    return [
      { stage: "Approved / Active", count: approvedOrActive, color: "#10b981" },
      { stage: "Pending / Review", count: pendingOrReview, color: "#f59e0b" },
      { stage: "Rejected", count: rejected, color: "#ef4444" },
      { stage: "Completed", count: completed, color: "#3b82f6" },
    ];
  }, [loans]);

  const totalLoans = loans.length;
  const approvedLoans = useMemo(
    () =>
      loans.filter((l) => l.status === "Approved" || l.status === "Active").length,
    [loans],
  );
  const approvalRate =
    totalLoans > 0 ? Math.round((approvedLoans / totalLoans) * 100) : 0;

  const dailyActivity = useMemo<IDailyActivityItem[]>(() => {
    let refDate = new Date();
    for (const txn of transactions) {
      if (txn.createdAt) {
        const d = new Date(txn.createdAt);
        if (!Number.isNaN(d.getTime()) && d > refDate) refDate = d;
      }
    }
    for (const loan of loans) {
      if (loan.createdAt) {
        const d = new Date(loan.createdAt);
        if (!Number.isNaN(d.getTime()) && d > refDate) refDate = d;
      }
    }

    const map = getRollingDaysActivityMap(velocityTimeframe, refDate);

    for (const txn of transactions) {
      if (!txn.createdAt) continue;
      const d = new Date(txn.createdAt);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      const item = map.get(key);
      if (item) item.transactions += 1;
    }

    for (const loan of loans) {
      if (!loan.createdAt) continue;
      const d = new Date(loan.createdAt);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      const item = map.get(key);
      if (item) item.loans += 1;
    }

    return Array.from(map.values());
  }, [transactions, loans, velocityTimeframe]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1. Loan Approval Pipeline */}
      <Card className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-200 hover:shadow-md">
        <CardContent className="space-y-4 p-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-indigo-500/10 p-1.5 text-indigo-600 dark:text-indigo-400">
                  <FileText className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-foreground">
                  Loan Portfolio &amp; Pipeline
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Breakdown of credit applications by lifecycle stage
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                {totalLoans} Total Loans
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {approvalRate}% Approved
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="md" color="accent" />
            </div>
          ) : loans.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
              No loan applications recorded yet.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={loanStats}
                  margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip content={<ActivityTooltip />} />
                  <Bar dataKey="count" name="Applications" radius={[8, 8, 0, 0]}>
                    {loanStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Banking Activity Velocity */}
      <Card className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-200 hover:shadow-md">
        <CardContent className="space-y-4 p-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
                  <Activity className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-foreground">
                  Banking Activity Velocity
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily frequency of transactions &amp; loans over the last {velocityTimeframe} days
              </p>
            </div>

            {/* Reusable Timeframe Toggle */}
            <ChartTimeframeToggle
              value={velocityTimeframe}
              onChange={setVelocityTimeframe}
              size="sm"
            />
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="md" color="accent" />
            </div>
          ) : dailyActivity.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
              No banking activity data available yet.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyActivity}
                  margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    interval={velocityTimeframe === 30 ? 3 : velocityTimeframe === 15 ? 1 : 0}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip content={<ActivityTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                    iconType="circle"
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    name="Transactions"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#ffffff", strokeWidth: 2, stroke: "#10b981" }}
                    activeDot={{ r: 6, fill: "#10b981" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="loans"
                    name="Loan Applications"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#ffffff", strokeWidth: 2, stroke: "#3b82f6" }}
                    activeDot={{ r: 6, fill: "#3b82f6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
