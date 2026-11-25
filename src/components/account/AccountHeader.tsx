"use client";

import React from "react";
import { Button } from "@heroui/react";

interface IAccountHeaderProps {
  canCreateAccount: boolean;
  onOpenCreateModal: () => void;
}

export default function AccountHeader({
  canCreateAccount,
  onOpenCreateModal,
}: IAccountHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bank Accounts</h1>
        <p className="text-sm text-muted-foreground">
          Manage Savings, Current, and Business accounts, balances, and limits.
        </p>
      </div>

      {canCreateAccount && (
        <div className="flex items-center gap-2">
          <Button variant="primary" onPress={onOpenCreateModal}>
            Create Account
          </Button>
        </div>
      )}
    </div>
  );
}