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
import { Search, RotateCcw, X, ChevronDown } from "lucide-react";

const REQUEST_TYPES = [
  { label: "All Types", value: "ALL" },
  { label: "Deposit", value: "Deposit" },
  { label: "Withdrawal", value: "Withdrawal" },
];

const REQUEST_STATUSES = [
  { label: "All Statuses", value: "ALL" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

interface IRequestFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  filteredCount?: number;
}

export default function RequestFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  statusFilter,
  onStatusChange,
  onReset,
  hasActiveFilters,
  filteredCount,
}: IRequestFiltersProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card p-2.5 sm:p-3 shadow-sm">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        {/* Search by Customer / Account (Flex-1) */}
        <div className="relative flex-1">
          <InputGroup className="w-full">
            <InputGroupPrefix>
              <Search className="h-4 w-4 text-muted-foreground" />
            </InputGroupPrefix>
            <InputGroupInput
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search customer name, email, or account number..."
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

        {/* Request Type Selector */}
        <div className="relative w-full sm:w-44">
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            aria-label="Filter by request type"
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-9 text-xs font-medium text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {REQUEST_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Approval Status Selector */}
        <div className="relative w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by approval status"
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-9 text-xs font-medium text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {REQUEST_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Reset Filters Button */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onPress={onReset}
          isDisabled={!hasActiveFilters}
          className="h-10 gap-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-foreground shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
          {hasActiveFilters && typeof filteredCount === "number" && (
            <span className="ml-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              {filteredCount}
            </span>
          )}
        </Button>
      </div>
    </Card>
  );
}
