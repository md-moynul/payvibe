"use client";

import React from "react";
import { Button, Chip } from "@heroui/react";
import { PlusCircle } from "lucide-react";

interface ICustomerLoansHeaderProps {
  onOpenApplyModal: () => void;
}

export default function CustomerLoansHeader({
  onOpenApplyModal,
}: ICustomerLoansHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Loans
          </h1>
          <Chip size="sm" variant="soft" color="accent" className="font-semibold">
            Instant Processing
          </Chip>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Apply for personal or business financing and monitor real-time approval & repayment status.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="primary"
          onPress={onOpenApplyModal}
          className="gap-2 font-medium shadow-sm transition hover:scale-[1.01]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Apply for Loan</span>
        </Button>
      </div>
    </div>
  );
}
