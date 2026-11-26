"use client";

import React, { useState } from "react";
import {
  Button,
  Label,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
} from "@heroui/react";
import { X, XCircle } from "lucide-react";
import type { IDepositWithdrawalRequest } from "@/types/request.type";

interface IRejectRequestModalProps {
  requestItem: IDepositWithdrawalRequest | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirmReject: (payload: {
    id: string;
    rejectionReason: string;
  }) => Promise<void> | void;
}

export default function RejectRequestModal(props: IRejectRequestModalProps) {
  if (!props.requestItem) return null;
  return (
    <RejectRequestModalDialog
      key={props.requestItem.id}
      {...props}
      requestItem={props.requestItem}
    />
  );
}

function RejectRequestModalDialog({
  requestItem,
  isSubmitting = false,
  onClose,
  onConfirmReject,
}: IRejectRequestModalProps & { requestItem: IDepositWithdrawalRequest }) {
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!reason.trim()) {
      setErrorMessage("Please provide a reason for rejecting this request.");
      return;
    }

    await onConfirmReject({
      id: requestItem.id,
      rejectionReason: reason.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Reject {requestItem.type} Request
            </h2>
            <p className="text-xs text-muted-foreground">
              {requestItem.customerName || "Customer"} •{" "}
              <span className="font-mono">{requestItem.accountNumber}</span> • ৳
              {Number(requestItem.amount ?? 0).toLocaleString("en-BD")}
            </p>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Close modal"
            onPress={onClose}
            isDisabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {errorMessage && (
          <Alert status="danger">
            <AlertIndicator />
            <AlertContent>
              <AlertTitle>{errorMessage}</AlertTitle>
            </AlertContent>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Rejection Reason
            </Label>
            <textarea
              rows={3}
              required
              disabled={isSubmitting}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Insufficient account documentation, discrepancy in verification details..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              isDisabled={isSubmitting}
              onPress={onClose}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              isDisabled={isSubmitting}
              className="gap-1.5 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" color="current" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Confirm Rejection</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
