"use client";

import React from "react";
import { Card, Button } from "@heroui/react";
import { Search, RotateCcw, ChevronDown, X, Filter } from "lucide-react";

interface ITransactionFiltersProps {
  search: string;
  type: string;
  status: string;
  fromDate: string;
  toDate: string;
  showStatusFilter?: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onReset: () => void;
}

const TRANSACTION_TYPES = [
  { label: "All Types", value: "ALL" },
  { label: "Transfer", value: "Transfer" },
  { label: "Deposit", value: "Deposit" },
  { label: "Withdrawal", value: "Withdrawal" },
  { label: "Loan Repayment", value: "Loan Repayment" },
  { label: "Loan Disbursement", value: "Loan Disbursement" },
];

const TRANSACTION_STATUSES = [
  { label: "All Statuses", value: "ALL" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "Flagged", value: "Flagged" },
  { label: "Failed", value: "Failed" },
];

export default function TransactionFilters({
  search,
  type,
  status,
  fromDate,
  toDate,
  showStatusFilter = false,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  onReset,
}: ITransactionFiltersProps) {
  const hasActiveFilters =
    Boolean(search) ||
    type !== "ALL" ||
    status !== "ALL" ||
    Boolean(fromDate) ||
    Boolean(toDate);

  return (
    <Card className="rounded-2xl border border-border/70 bg-card p-3 shadow-xs transition-all duration-200">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Filter Icon Anchor with Active Indicator */}
        <div className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
          <Filter className="h-4 w-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-card animate-pulse" />
          )}
        </div>

        {/* Search Transaction ID */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Transaction ID..."
            className="h-9 w-full rounded-xl border border-border/80 bg-background pl-9 pr-8 text-xs font-medium text-foreground outline-none transition placeholder:text-muted-foreground/60 hover:border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Transaction Type Dropdown */}
        <div className="relative w-full sm:w-44 shrink-0">
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="h-9 w-full appearance-none rounded-xl border border-border/80 bg-background pl-3 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            {TRANSACTION_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* (Optional) Audit Status Filter */}
        {showStatusFilter && (
          <div className="relative w-full sm:w-36 shrink-0">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-9 w-full appearance-none rounded-xl border border-border/80 bg-background pl-3 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {TRANSACTION_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          </div>
        )}

        {/* From Date */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
          <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
            From:
          </span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="h-9 w-full sm:w-36 rounded-xl border border-border/80 bg-background px-2.5 text-xs font-medium text-foreground outline-none transition hover:border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          />
        </div>

        {/* To Date */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0">
          <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
            To:
          </span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="h-9 w-full sm:w-36 rounded-xl border border-border/80 bg-background px-2.5 text-xs font-medium text-foreground outline-none transition hover:border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          />
        </div>

        {/* Reset Button */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onPress={onReset}
          isDisabled={!hasActiveFilters}
          className={`h-9 shrink-0 gap-1.5 font-medium text-xs rounded-xl border-border/70 transition-all ${
            hasActiveFilters
              ? "text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10 cursor-pointer shadow-2xs"
              : "text-muted-foreground opacity-40 cursor-not-allowed"
          }`}
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </Button>
      </div>
    </Card>
  );
}
