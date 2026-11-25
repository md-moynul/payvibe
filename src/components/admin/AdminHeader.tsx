"use client";

import React from "react";
import { Button } from "@heroui/react";
import { RefreshCw, UserPlus, PlusCircle } from "lucide-react";

interface IAdminHeaderProps {
  userName?: string | null;
  isLoading?: boolean;
  onRefresh: () => void;
  onOpenRegisterModal: () => void;
  onOpenCreateAccountModal: () => void;
}

export default function AdminHeader({
  userName,
  isLoading,
  onRefresh,
  onOpenRegisterModal,
  onOpenCreateAccountModal,
}: IAdminHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Admin Command Center
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Operations
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Welcome back,{" "}
          <span className="font-semibold text-foreground">
            {userName || "Administrator"}
          </span>
          . Real-time overview of PayVibe accounts, liquidity, and customer network.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onPress={onRefresh}
          isDisabled={isLoading}
          className="gap-1.5"
          aria-label="Refresh data"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin text-primary" : ""}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onPress={onOpenRegisterModal}
          className="gap-1.5"
        >
          <UserPlus className="h-4 w-4 text-primary" />
          <span>Register Customer</span>
        </Button>

        <Button
          variant="primary"
          size="sm"
          onPress={onOpenCreateAccountModal}
          className="gap-1.5 shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Open Account</span>
        </Button>
      </div>
    </div>
  );
}
