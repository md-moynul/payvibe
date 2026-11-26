"use client";

import React from "react";
import {
  Card,
  CardContent,
  Button,
  Label,
  Input,
  InputGroup,
  InputGroupPrefix,
  InputGroupInput,
  InputGroupSuffix,
} from "@heroui/react";
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
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Top Header of Filter Bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Filter Transactions
            </span>
            {hasActiveFilters && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                Active Filter
              </span>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onPress={onReset}
            isDisabled={!hasActiveFilters}
            className="h-7 gap-1.5 font-medium text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Filters</span>
          </Button>
        </div>

        {/* Filters Grid */}
        <div
          className={`grid grid-cols-1 gap-3.5 sm:grid-cols-2 ${
            showStatusFilter ? "lg:grid-cols-5" : "lg:grid-cols-4"
          }`}
        >
          {/* Search Txn ID with HeroUI InputGroup */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Search Transaction ID
            </Label>
            <InputGroup className="w-full">
              <InputGroupPrefix>
                <Search className="h-4 w-4 text-muted-foreground" />
              </InputGroupPrefix>
              <InputGroupInput
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="TXN-..., PV-..."
                className="h-10 font-medium"
              />
              {search && (
                <InputGroupSuffix>
                  <button
                    type="button"
                    onClick={() => onSearchChange("")}
                    className="rounded p-0.5 text-muted-foreground hover:text-foreground transition"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </InputGroupSuffix>
              )}
            </InputGroup>
          </div>

          {/* Transaction Type Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Transaction Type
            </Label>
            <div className="relative flex items-center">
              <select
                value={type}
                onChange={(e) => onTypeChange(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-9 text-sm font-medium text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {TRANSACTION_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* (Optional) Status Filter */}
          {showStatusFilter && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Audit Status
              </Label>
              <div className="relative flex items-center">
                <select
                  value={status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-9 text-sm font-medium text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {TRANSACTION_STATUSES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}

          {/* From Date with HeroUI Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              From Date
            </Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* To Date with HeroUI Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              To Date
            </Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
