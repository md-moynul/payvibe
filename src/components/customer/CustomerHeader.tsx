"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Search, UserPlus } from "lucide-react";

// TODO: Add debounced search or status/verification filter dropdown if needed

interface ICustomerHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenRegisterModal: () => void;
}

export default function CustomerHeader({
  searchQuery,
  onSearchChange,
  onOpenRegisterModal,
}: ICustomerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Customer Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Search customers, verify profiles, and register new customer accounts.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64"
          />
        </div>

        {/* TODO: Restrict or label Register Customer action based on Admin / Bank Staff permissions */}
        <Button
          type="button"
          variant="primary"
          onPress={onOpenRegisterModal}
          className="font-medium gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register Customer</span>
        </Button>
      </div>
    </div>
  );
}