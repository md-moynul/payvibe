"use client";

import React, {  useState } from "react";
import {
  Button,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@heroui/react";
import { X, Snowflake, ShieldAlert } from "lucide-react";

// TODO: Connect Freeze action to PATCH /api/accounts/[id] or RTK Query status mutation

interface IFreezeAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
  customerEmail?: string;
  accountId?: string;
  onAccountFrozen?: () => void;
}

export default function FreezeAccountModal({
  isOpen,
  onClose,
  customerName = "",
  customerEmail = "",
  accountId = "",
  onAccountFrozen,
}: IFreezeAccountModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setReason("");
    setErrorMsg(null);
    onClose();
  };

  const handleConfirmFreeze = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const targetId = accountId || encodeURIComponent(customerEmail);
      const res = await fetch(`/api/accounts/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Frozen",
          reason: reason.trim() || "Account frozen by staff/admin",
        }),
      });

      const result = await res.json();
      if (!res.ok || !result?.success) {
        throw new Error(result?.message || "Failed to freeze bank account.");
      }

      setReason("");
      setErrorMsg(null);
      onAccountFrozen?.();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Freeze Bank Account
              </h2>
              <p className="text-xs text-muted-foreground">
                Temporarily freeze transactions for{" "}
                <span className="font-medium text-foreground">
                  {customerName || customerEmail}
                </span>
                .
              </p>
            </div>
          </div>

          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Close modal"
            onPress={handleClose}
            isDisabled={submitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {errorMsg && (
          <Alert status="danger">
            <AlertIndicator />
            <AlertContent>
              <AlertTitle>{errorMsg}</AlertTitle>
            </AlertContent>
          </Alert>
        )}

        <form onSubmit={handleConfirmFreeze} className="space-y-4">
          <Alert status="warning">
            <AlertIndicator />
            <AlertContent>
              <AlertDescription>
                Freezing an account temporarily pauses deposits, withdrawals, and
                fund transfers until reviewed and unfrozen by an authorized
                administrator or bank staff.
              </AlertDescription>
            </AlertContent>
          </Alert>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Reason for Freezing (Optional)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Pending verification or unusual transaction review..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onPress={handleClose}
              isDisabled={submitting}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger-soft"
              isDisabled={submitting}
              className="font-medium gap-2"
            >
              {submitting ? (
                <>
                  <Spinner size="sm" color="current" />
                  <span>Freezing...</span>
                </>
              ) : (
                <>
                  <Snowflake className="h-4 w-4" />
                  <span>Confirm Freeze</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
