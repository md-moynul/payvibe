"use client";

import React from "react";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

interface ITransferHeaderProps {
  onBack: () => void;
}

export default function TransferHeader({ onBack }: ITransferHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        isIconOnly
        size="sm"
        variant="outline"
        aria-label="Back to transactions"
        onPress={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Fund Transfer
        </h1>
        <p className="text-sm text-muted-foreground">
          Transfer money to another PayVibe account holder with instant PIN
          verification.
        </p>
      </div>
    </div>
  );
}
