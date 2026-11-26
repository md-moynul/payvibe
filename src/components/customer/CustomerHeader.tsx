"use client";

import React from "react";
import { Button, Chip } from "@heroui/react";
import { UserPlus } from "lucide-react";

interface ICustomerHeaderProps {
  onOpenRegisterModal: () => void;
  portalBadge?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export default function CustomerHeader({
  onOpenRegisterModal,
  portalBadge,
}: ICustomerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Customer Management
          </h1>
          {portalBadge && (
            <Chip size="sm" variant="soft" color="accent">
              {portalBadge}
            </Chip>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Search customers, verify profiles, and register new customer accounts.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          type="button"
          variant="primary"
          onPress={onOpenRegisterModal}
          className="font-medium gap-2 shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register Customer</span>
        </Button>
      </div>
    </div>
  );
}
