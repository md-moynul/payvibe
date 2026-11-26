"use client";

import React from "react";
import { Button } from "@heroui/react";
import { UserPlus, RefreshCw, Shield } from "lucide-react";

interface IStaffHeaderProps {
  onOpenCreateModal: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  canManageStaff?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

export default function StaffHeader({
  onOpenCreateModal,
  onRefresh,
  isLoading = false,
  canManageStaff = true,
}: IStaffHeaderProps) {
  return (
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
  );
}
