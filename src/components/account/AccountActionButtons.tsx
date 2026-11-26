"use client";

import React from "react";
import { Button } from "@heroui/react";
import { Eye, Sliders, Snowflake, CheckCircle2 } from "lucide-react";
import type { IAccount } from "@/types/account.type";

interface IAccountActionButtonsProps {
  account: IAccount;
  isAdmin: boolean;
  canFreeze: boolean;
  isTogglingFreeze?: boolean;
  onViewDetails: (account: IAccount) => void;
  onEditLimits?: (account: IAccount) => void;
  onToggleFreeze?: (account: IAccount) => void;
}

export default function AccountActionButtons({
  account,
  isAdmin,
  canFreeze,
  isTogglingFreeze = false,
  onViewDetails,
  onEditLimits,
  onToggleFreeze,
}: IAccountActionButtonsProps) {
  const isFrozen = account.status === "Frozen";

  return (
    <div className="inline-flex items-center justify-end gap-1.5 whitespace-nowrap">
      {/* 1. View Details (Available for all roles) */}
      <Button
        size="sm"
        variant="outline"
        onPress={() => onViewDetails(account)}
        className="h-8 gap-1.5 text-xs font-medium rounded-xl border-border/70 hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
        <span>View Details</span>
      </Button>

      {/* 2. Configure Limits (Admin exclusive) */}
      {isAdmin && onEditLimits && (
        <Button
          size="sm"
          variant="outline"
          onPress={() => onEditLimits(account)}
          className="h-8 gap-1.5 text-xs font-medium rounded-xl border-border/70 hover:bg-muted/50 transition-colors cursor-pointer text-blue-600 dark:text-blue-400"
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Limits</span>
        </Button>
      )}

      {/* 3. Freeze / Unfreeze (Admin or Staff) */}
      {canFreeze && onToggleFreeze && (
        <Button
          size="sm"
          variant="outline"
          isDisabled={isTogglingFreeze}
          onPress={() => onToggleFreeze(account)}
          className={`h-8 gap-1.5 text-xs font-medium rounded-xl border-border/70 transition-colors cursor-pointer ${
            isFrozen
              ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
              : "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
          }`}
        >
          {isFrozen ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Unfreeze</span>
            </>
          ) : (
            <>
              <Snowflake className="h-3.5 w-3.5" />
              <span>Freeze</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
