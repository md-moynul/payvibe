"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Search, UserPlus, RefreshCw, X, Shield } from "lucide-react";

interface IStaffHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter?: "all" | "active" | "suspended";
  onStatusFilterChange?: (status: "all" | "active" | "suspended") => void;
  onOpenCreateModal: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  canManageStaff?: boolean;
}

export default function StaffHeader({
  searchQuery,
  onSearchChange,
  statusFilter = "all",
  onStatusFilterChange,
  onOpenCreateModal,
  onRefresh,
  isLoading = false,
  canManageStaff = true,
}: IStaffHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Staff Management
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
              <Shield className="h-3 w-3" />
              Role: bank-staff
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage bank staff credentials, monitor operator access, and authorize branch administrative personnel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onPress={onRefresh}
              isDisabled={isLoading}
              className="gap-1.5"
              aria-label="Refresh staff list"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin text-primary" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}

          {canManageStaff && (
            <Button
              variant="primary"
              size="sm"
              className="gap-2 shadow-sm font-medium"
              onPress={onOpenCreateModal}
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Bank Staff</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, work email, or phone..."
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-8 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5">
          {(
            [
              { id: "all", label: "All Staff" },
              { id: "active", label: "Active" },
              { id: "suspended", label: "Suspended" },
            ] as const
          ).map((filter) => {
            const isActive = statusFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onStatusFilterChange?.(filter.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
