"use client";

import React, { useMemo } from "react";
import { Card, CardContent, Spinner } from "@heroui/react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { PieChart as PieChartIcon, PiggyBank, Landmark, Briefcase } from "lucide-react";

interface IAdminAccountDistributionChartProps {
  totalAccounts: number;
  savingsCount: number;
  currentCount: number;
  businessCount: number;
  isLoading?: boolean;
}

const SEGMENTS = [
  {
    name: "Savings Accounts",
    color: "#3b82f6",
    icon: PiggyBank,
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
  },
  {
    name: "Current Accounts",
    color: "#10b981",
    icon: Landmark,
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    name: "Business Accounts",
    color: "#8b5cf6",
    icon: Briefcase,
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/20",
  },
];

interface ICustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: {
      name: string;
      value: number;
      percentage: number;
      color: string;
    };
  }>;
}

function DonutTooltip({ active, payload }: ICustomTooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (!data) return null;
    return (
      <div className="rounded-xl border border-border/80 bg-card/95 p-3 shadow-xl backdrop-blur-md text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-foreground">{data.name}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-muted-foreground">
          <span>Total: <strong className="text-foreground">{data.value}</strong></span>
          <span>Share: <strong className="text-foreground">{data.percentage}%</strong></span>
        </div>
      </div>
    );
  }
  return null;
}

export default function AdminAccountDistributionChart({
  totalAccounts,
  savingsCount,
  currentCount,
  businessCount,
  isLoading = false,
}: IAdminAccountDistributionChartProps) {
  const chartData = useMemo(() => {
    return [
      {
        name: "Savings Accounts",
        value: savingsCount,
        percentage: totalAccounts
          ? Math.round((savingsCount / totalAccounts) * 100)
          : 0,
        color: "#3b82f6",
      },
      {
        name: "Current Accounts",
        value: currentCount,
        percentage: totalAccounts
          ? Math.round((currentCount / totalAccounts) * 100)
          : 0,
        color: "#10b981",
      },
      {
        name: "Business Accounts",
        value: businessCount,
        percentage: totalAccounts
          ? Math.round((businessCount / totalAccounts) * 100)
          : 0,
        color: "#8b5cf6",
      },
    ];
  }, [totalAccounts, savingsCount, currentCount, businessCount]);

  return (
    <Card className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-200 hover:shadow-md">
      <CardContent className="space-y-6 p-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/10 p-1.5 text-blue-600 dark:text-blue-400">
                <PieChartIcon className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Account Portfolio Distribution
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Portfolio composition across Savings, Current, and Business account tiers
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            {totalAccounts} Total Accounts
          </span>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="md" color="accent" />
          </div>
        ) : totalAccounts === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
            No bank accounts created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
            {/* Donut Chart */}
            <div className="relative h-64 w-full md:col-span-6 lg:col-span-5 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={96}
                    paddingAngle={4}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`donut-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Metrics in Donut */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {totalAccounts}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Total Accounts
                </span>
              </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1 md:col-span-6 lg:col-span-7">
              {chartData.map((item, idx) => {
                const conf = SEGMENTS[idx];
                const Icon = conf.icon;
                return (
                  <div
                    key={item.name}
                    className={`flex items-center justify-between rounded-xl border ${conf.border} bg-card/60 p-3.5 shadow-2xs transition-all hover:bg-card hover:shadow-xs`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-2 ${conf.bg} ${conf.text}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Active tier in PayVibe
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {item.value}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          ({item.percentage}%)
                        </span>
                      </p>
                      <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
