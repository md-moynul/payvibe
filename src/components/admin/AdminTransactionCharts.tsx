"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, Spinner } from "@heroui/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, ArrowDownLeft, ArrowUpRight, BarChart3 } from "lucide-react";
import type { ITransaction } from "@/types/transaction.type";
import ChartTimeframeToggle, { type TTimeframe } from "@/components/admin/ChartTimeframeToggle";

interface IAdminTransactionChartsProps {
  transactions: ITransaction[];
  isLoading?: boolean;
}

interface IPeriodMetric {
  dateKey: string;
  label: string;
  volume: number;
  deposits: number;
  withdrawals: number;
  count: number;
}

function getDayKey(date: Date): { key: string; label: string } {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const label = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return { key, label };
}

function getRollingDaysMap(
  daysCount = 7,
  referenceDate = new Date(),
): Map<string, IPeriodMetric> {
  const map = new Map<string, IPeriodMetric>();
  const refTime = Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate(),
  );

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(refTime - i * 24 * 60 * 60 * 1000);
    const { key, label } = getDayKey(d);
    map.set(key, {
      dateKey: key,
      label,
      volume: 0,
      deposits: 0,
      withdrawals: 0,
      count: 0,
    });
  }

  return map;
}

function computeRollingData(
  transactions: ITransaction[],
  daysCount: TTimeframe,
): IPeriodMetric[] {
  let refDate = new Date();
  for (const txn of transactions) {
    if (txn.createdAt) {
      const d = new Date(txn.createdAt);
      if (!Number.isNaN(d.getTime()) && d > refDate) {
        refDate = d;
      }
    }
  }

  const map = getRollingDaysMap(daysCount, refDate);

  for (const txn of transactions) {
    if (txn.status === "Failed" || !txn.createdAt) continue;
    const d = new Date(txn.createdAt);
    if (Number.isNaN(d.getTime())) continue;

    const { key } = getDayKey(d);
    const current = map.get(key);
    if (!current) continue;

    const amount = Number(txn.amount) || 0;
    current.volume += amount;
    current.count += 1;
    if (txn.type === "Deposit") {
      current.deposits += amount;
    } else if (txn.type === "Withdrawal") {
      current.withdrawals += amount;
    }
  }

  return Array.from(map.values());
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

function ModernTooltip({ active, payload, label }: ICustomTooltipProps) {
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
                ৳{Number(item.value ?? 0).toLocaleString("en-BD")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function AdminTransactionCharts({
  transactions,
  isLoading = false,
}: IAdminTransactionChartsProps) {
  // Separate, independent timeframe states for each chart
  const [flowTimeframe, setFlowTimeframe] = useState<TTimeframe>(7);
  const [volumeTimeframe, setVolumeTimeframe] = useState<TTimeframe>(7);

  // 1. Independent data for Cash Flow Momentum
  const flowChartData = useMemo<IPeriodMetric[]>(
    () => computeRollingData(transactions, flowTimeframe),
    [transactions, flowTimeframe],
  );

  const totalDeposits = useMemo(
    () => flowChartData.reduce((sum, item) => sum + item.deposits, 0),
    [flowChartData],
  );

  const totalWithdrawals = useMemo(
    () => flowChartData.reduce((sum, item) => sum + item.withdrawals, 0),
    [flowChartData],
  );

  const netCashFlow = totalDeposits - totalWithdrawals;

  // 2. Independent data for Transaction Volume
  const volumeChartData = useMemo<IPeriodMetric[]>(
    () => computeRollingData(transactions, volumeTimeframe),
    [transactions, volumeTimeframe],
  );

  const totalVolume = useMemo(
    () => volumeChartData.reduce((sum, item) => sum + item.volume, 0),
    [volumeChartData],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1. Cash Flow Momentum (Deposits vs Withdrawals) */}
      <Card className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-200 hover:shadow-md">
        <CardContent className="space-y-4 p-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Cash Flow Momentum
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily inflow vs outflow in ৳
              </p>
            </div>

            {/* Independent Timeframe Toggle for Cash Flow Momentum */}
            <ChartTimeframeToggle
              value={flowTimeframe}
              onChange={setFlowTimeframe}
              size="sm"
            />
          </div>

          {/* Clean Metrics Summary Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowDownLeft className="h-3 w-3" />
              ৳{totalDeposits.toLocaleString("en-BD")} In
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              <ArrowUpRight className="h-3 w-3" />
              ৳{totalWithdrawals.toLocaleString("en-BD")} Out
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                netCashFlow >= 0
                  ? "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              Net: {netCashFlow >= 0 ? "+" : "-"}৳
              {Math.abs(netCashFlow).toLocaleString("en-BD")}
            </span>
            <span className="ml-auto text-[11px] text-muted-foreground font-medium">
              Last {flowTimeframe} Days
            </span>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="md" color="accent" />
            </div>
          ) : flowChartData.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
              No deposit or withdrawal records available yet.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={flowChartData}
                  margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="flowDeposits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="flowWithdrawals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    interval={flowTimeframe === 30 ? 3 : flowTimeframe === 15 ? 1 : 0}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => (v >= 1000 ? `৳${v / 1000}k` : `৳${v}`)}
                  />
                  <Tooltip content={<ModernTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                    iconType="circle"
                  />
                  <Area
                    type="monotone"
                    dataKey="deposits"
                    name="Deposits (Inflow)"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: "#10b981", strokeWidth: 2, fill: "#ffffff" }}
                    activeDot={{ r: 6, fill: "#10b981" }}
                    fillOpacity={1}
                    fill="url(#flowDeposits)"
                  />
                  <Area
                    type="monotone"
                    dataKey="withdrawals"
                    name="Withdrawals (Outflow)"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: "#f59e0b", strokeWidth: 2, fill: "#ffffff" }}
                    activeDot={{ r: 6, fill: "#f59e0b" }}
                    fillOpacity={1}
                    fill="url(#flowWithdrawals)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Daily Transaction Volume */}
      <Card className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-200 hover:shadow-md">
        <CardContent className="space-y-4 p-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-500/10 p-1.5 text-blue-600 dark:text-blue-400">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Transaction Volume
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Settled ledger volume over the last {volumeTimeframe} days
              </p>
            </div>

            {/* Independent Timeframe Toggle for Transaction Volume */}
            <ChartTimeframeToggle
              value={volumeTimeframe}
              onChange={setVolumeTimeframe}
              size="sm"
            />
          </div>

          {/* Clean Metrics Summary Bar for Volume */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              Total Settled: ৳{totalVolume.toLocaleString("en-BD")}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Last {volumeTimeframe} Days
            </span>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="md" color="accent" />
            </div>
          ) : volumeChartData.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
              No transaction data available yet.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={volumeChartData}
                  margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="barVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    interval={volumeTimeframe === 30 ? 3 : volumeTimeframe === 15 ? 1 : 0}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => (v >= 1000 ? `৳${v / 1000}k` : `৳${v}`)}
                  />
                  <Tooltip content={<ModernTooltip />} />
                  <Bar
                    dataKey="volume"
                    name="Transaction Volume"
                    fill="url(#barVolume)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={volumeTimeframe === 30 ? 16 : volumeTimeframe === 15 ? 24 : 36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
