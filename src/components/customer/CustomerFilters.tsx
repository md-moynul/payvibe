"use client";

import React from "react";
import {
  Card,
  Button,
  InputGroup,
  InputGroupPrefix,
  InputGroupInput,
  InputGroupSuffix,
} from "@heroui/react";
import { Search, RotateCcw, X, ChevronDown, ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Newest Joined", value: "newest" },
  { label: "Oldest Joined", value: "oldest" },
  { label: "Balance: High to Low", value: "balance-high" },
  { label: "Balance: Low to High", value: "balance-low" },
  { label: "Name: A to Z", value: "name-asc" },
];

const KYC_STATUSES = [
  { label: "All Verification", value: "ALL" },
  { label: "Verified (KYC)", value: "VERIFIED" },
  { label: "Pending KYC", value: "PENDING" },
];

const ACCOUNT_STATUSES = [
  { label: "All Accounts", value: "ALL" },
  { label: "Frozen Accounts", value: "FROZEN_ACCOUNT" },
  { label: "Active Accounts", value: "ACTIVE_ACCOUNT" },
  { label: "Has Bank Account", value: "HAS_ACCOUNT" },
  { label: "No Account Yet", value: "NO_ACCOUNT" },
];

const CUSTOMER_STATUSES = [
  { label: "All Statuses", value: "ALL" },
  { label: "Active", value: "Active" },
  { label: "Account Frozen", value: "FROZEN" },
  { label: "Inactive", value: "Inactive" },
  { label: "Flagged", value: "Flagged" },
];

interface ICustomerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  kycFilter: string;
  onKycChange: (value: string) => void;
  accountFilter: string;
  onAccountChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  filteredCount?: number;
}

export default function CustomerFilters({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  kycFilter,
  onKycChange,
  accountFilter,
  onAccountChange,
  statusFilter,
  onStatusChange,
  onReset,
  hasActiveFilters,
}: ICustomerFiltersProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card p-2.5 sm:p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search by Customer Name / Email / Phone / ID (Flex-1 fills remaining width) */}
        <div className="relative min-w-[220px] flex-1">
          <InputGroup className="w-full">
            <InputGroupPrefix>
              <Search className="h-4 w-4 text-muted-foreground" />
            </InputGroupPrefix>
            <InputGroupInput
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email, phone, or ID..."
              className="h-10 text-xs font-medium"
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

        {/* Time & Balance Sort Selector */}
        <div className="relative min-w-[150px] flex-1 sm:flex-initial sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort customers"
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-8 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {SORT_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* KYC Verification Selector */}
        <div className="relative min-w-[140px] flex-1 sm:flex-initial sm:w-40">
          <select
            value={kycFilter}
            onChange={(e) => onKycChange(e.target.value)}
            aria-label="Filter by verification status"
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {KYC_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Bank Account Selector */}
        <div className="relative min-w-[140px] flex-1 sm:flex-initial sm:w-40">
          <select
            value={accountFilter}
            onChange={(e) => onAccountChange(e.target.value)}
            aria-label="Filter by bank account status"
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {ACCOUNT_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Customer Status Selector */}
        <div className="relative min-w-[120px] flex-1 sm:flex-initial sm:w-36">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by customer status"
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {CUSTOMER_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Reset Filters Button */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onPress={onReset}
          isDisabled={!hasActiveFilters}
          className="h-10 shrink-0 gap-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-foreground ml-auto sm:ml-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
          {hasActiveFilters && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1 text-[10px] font-bold text-primary">
              Active
            </span>
          )}
        </Button>
      </div>
    </Card>
  );
}
