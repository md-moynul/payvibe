"use client";

import React, { useState } from "react";
import {
  Button,
  Chip,
  Avatar,
  AvatarFallback,
  TextArea,
  Label,
  Spinner,
} from "@heroui/react";
import { X, Send } from "lucide-react";
import type { ILoan } from "@/types/loan.type";

interface IStaffLoanReviewModalProps {
  loan: ILoan | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onForwardToAdmin: (payload: {
    id: string;
    staffNotes: string;
    status: "Under Review";
  }) => Promise<void> | void;
}

interface IStaffLoanReviewModalInnerProps {
  loan: ILoan;
  isSubmitting?: boolean;
  onClose: () => void;
  onForwardToAdmin: (payload: {
    id: string;
    staffNotes: string;
    status: "Under Review";
  }) => Promise<void> | void;
}

function StaffLoanReviewModalInner({
  loan,
  isSubmitting = false,
  onClose,
  onForwardToAdmin,
}: IStaffLoanReviewModalInnerProps) {
  const [staffNotes, setStaffNotes] = useState(loan.staffNotes ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    await onForwardToAdmin({
      id: loan.id,
      staffNotes: staffNotes.trim(),
      status: "Under Review",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="w-full max-w-lg space-y-5 rounded-2xl border border-border bg-background p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                Staff Loan Review & Verification
              </h2>
              <Chip size="sm" variant="soft" color="accent" className="font-semibold">
                Under Review
              </Chip>
            </div>
            <p className="text-xs text-muted-foreground">
              Verify customer information, add internal notes, and forward to Admin for final sanction.
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

        {/* Applicant Profile Summary */}
        <div className="space-y-3 rounded-2xl border border-border bg-muted/30 p-4 text-xs">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2.5">
              <Avatar size="sm" variant="soft" color="accent">
                <AvatarFallback className="text-xs font-bold">
                  {loan.customerName
                    ? loan.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "CU"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-foreground">
                  {loan.customerName || "Customer"}
                </p>
                <p className="text-muted-foreground">{loan.customerEmail || "N/A"}</p>
              </div>
            </div>
            <Chip size="sm" variant="soft" color="warning" className="font-semibold">
              {loan.status}
            </Chip>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 text-muted-foreground">
            <div>
              <span className="block text-[11px] font-medium text-muted-foreground">
                Loan Category
              </span>
              <strong className="text-foreground">{loan.loanType}</strong>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-muted-foreground">
                Requested Amount
              </span>
              <strong className="text-foreground">
                ৳{Number(loan.requestedAmount ?? 0).toLocaleString("en-BD")}
              </strong>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-muted-foreground">
                Tenure
              </span>
              <strong className="text-foreground">
                {loan.durationMonths} months
              </strong>
            </div>

            <div>
              <span className="block text-[11px] font-medium text-muted-foreground">
                Monthly Income
              </span>
              <strong className="text-foreground">
                ৳{Number(loan.monthlyIncome ?? 0).toLocaleString("en-BD")}
              </strong>
            </div>

            <div className="col-span-2">
              <span className="block text-[11px] font-medium text-muted-foreground">
                Employment Status
              </span>
              <strong className="text-foreground">
                {loan.employmentStatus || "N/A"}
              </strong>
            </div>

            {loan.description && (
              <div className="col-span-2 rounded-xl border border-border/60 bg-background/50 p-2.5">
                <span className="block text-[11px] font-medium text-muted-foreground">
                  Applicant Purpose / Remarks
                </span>
                <p className="mt-0.5 text-xs text-foreground italic">
                  &ldquo;{loan.description}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Internal Staff Verification Notes
            </Label>
            <TextArea
              rows={3}
              required
              disabled={isSubmitting}
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
              placeholder="e.g., Verified payslips and credit rating. Applicant is eligible for the requested amount. Forwarding for Admin authorization..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onPress={onClose}
              isDisabled={isSubmitting}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isDisabled={isSubmitting}
              className="gap-2 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" color="current" />
                  <span>Forwarding...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Forward to Admin</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StaffLoanReviewModal({
  loan,
  isSubmitting = false,
  onClose,
  onForwardToAdmin,
}: IStaffLoanReviewModalProps) {
  if (!loan) return null;

  return (
    <StaffLoanReviewModalInner
      key={loan.id}
      loan={loan}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onForwardToAdmin={onForwardToAdmin}
    />
  );
}
