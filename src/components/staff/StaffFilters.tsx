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
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Suspended", value: "Suspended" },
  { label: "Inactive", value: "Inactive" },
];

const ROLE_OPTIONS = [
  { label: "All Roles", value: "all" },
  { label: "Bank Staff", value: "bank-staff" },
  { label: "Admin", value: "admin" },
];

interface IStaffFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  filteredCount?: number;
}

export default function StaffFilters({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  onReset,
  hasActiveFilters,
}: IStaffFiltersProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card p-2.5 sm:p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search Input (Flex-1 fills remaining space) */}
        <div className="relative min-w-[220px] flex-1">
          <InputGroup className="w-full">
            <InputGroupPrefix>
              <Search className="h-4 w-4 text-muted-foreground" />
            </InputGroupPrefix>
            <InputGroupInput
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search staff by name, work email, or phone..."
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

        {/* Sort Selector */}
        <div className="relative min-w-[150px] flex-1 sm:flex-initial sm:w-48">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort staff members"
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

        {/* Status Filter */}
        <div className="relative min-w-[140px] flex-1 sm:flex-initial sm:w-40">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by staff status"
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Role Filter */}
        <div className="relative min-w-[130px] flex-1 sm:flex-initial sm:w-36">
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            aria-label="Filter by access role"
            className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-3.5 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {ROLE_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>

        {/* Reset Button */}
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
