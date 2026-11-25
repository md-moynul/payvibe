"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  TextArea,
  Label,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  Spinner,
  Chip,
  toast,
} from "@heroui/react";
import { X, Landmark, Calculator } from "lucide-react";
import { useApplyLoanMutation } from "@/redux/features/loan/loan.api";
import {
  calculateLoanSummary,
  getDefaultInterestRateByType,
} from "@/lib/loan.helper";

interface IApplyLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LOAN_TYPES = [
  "Personal Loan",
  "Home Loan",
  "Business Loan",
  "Auto Loan",
  "Education Loan",
];

const EMPLOYMENT_STATUSES = [
  "Salaried",
  "Self-Employed",
  "Business Owner",
  "Freelancer",
  "Other",
];

const TENURE_OPTIONS = [
  { label: "6 Months", value: "6" },
  { label: "12 Months", value: "12" },
  { label: "18 Months", value: "18" },
];

export default function ApplyLoanModal({
  isOpen,
  onClose,
  onSuccess,
}: IApplyLoanModalProps) {
  const [loanType, setLoanType] = useState(LOAN_TYPES[0]);
  const [requestedAmount, setRequestedAmount] = useState("");
  const [durationMonths, setDurationMonths] = useState("12");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState(
    EMPLOYMENT_STATUSES[0],
  );
  const [description, setDescription] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [applyLoan, { isLoading }] = useApplyLoanMutation();

  const loanBreakdown = useMemo(() => {
    const amount = Number(requestedAmount);
    const months = Number(durationMonths);
    if (!amount || !months || amount <= 0 || months <= 0) return null;

    const rate = getDefaultInterestRateByType(loanType);
    return calculateLoanSummary({
      principal: amount,
      annualInterestRate: rate,
      durationMonths: months,
    });
  }, [loanType, requestedAmount, durationMonths]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const amountNum = Number(requestedAmount);
    const durationNum = Number(durationMonths);
    const incomeNum = Number(monthlyIncome);

    if (
      !loanType ||
      Number.isNaN(amountNum) ||
      amountNum <= 0 ||
      ![6, 12, 18].includes(durationNum) ||
      Number.isNaN(incomeNum) ||
      incomeNum < 0
    ) {
      setErrorMessage(
        "Please enter valid loan amount, select a valid tenure (6, 12, or 18 months), and enter monthly income.",
      );
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage(
        "You must agree to the Loan Terms & Conditions before submitting.",
      );
      return;
    }

    try {
      const res = await applyLoan({
        loanType,
        requestedAmount: amountNum,
        durationMonths: durationNum,
        monthlyIncome: incomeNum,
        employmentStatus,
        description: description.trim(),
      }).unwrap();

      toast.success(res.message || "Loan application submitted successfully.");
      setRequestedAmount("");
      setDurationMonths("12");
      setMonthlyIncome("");
      setDescription("");
      setAcceptedTerms(false);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to submit loan application. Please try again.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="max-h-[92vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                Apply for a Loan
              </h2>
              <Chip
                size="sm"
                variant="soft"
                color="accent"
                className="font-medium"
              >
                Financing
              </Chip>
            </div>
            <p className="text-xs text-muted-foreground">
              Submit your financing request for verification by Bank Staff and
              administrative approval.
            </p>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Close modal"
            onPress={onClose}
            isDisabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <Alert status="danger">
            <AlertIndicator />
            <AlertContent>
              <AlertTitle>{errorMessage}</AlertTitle>
            </AlertContent>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Loan Category
              </Label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              >
                {LOAN_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type} ({getDefaultInterestRateByType(type)}% p.a.)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Employment Status
              </Label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              >
                {EMPLOYMENT_STATUSES.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Requested Amount (৳)
              </Label>
              <Input
                type="number"
                min={1000}
                step="any"
                required
                disabled={isLoading}
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                placeholder="50000"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Tenure (Months)
              </Label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              >
                {TENURE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Monthly Income (৳)
              </Label>
              <Input
                type="number"
                min={0}
                step="any"
                required
                disabled={isLoading}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="35000"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Total Payable & Monthly Installment Breakdown */}
          {loanBreakdown && (
            <div className="space-y-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs">
              <div className="flex items-center justify-between text-primary">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Calculator className="h-3.5 w-3.5" />
                  <span>Repayment Summary</span>
                </span>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold">
                  {loanBreakdown.annualInterestRate}% Annual Interest
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-primary/15 pt-2 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Total Interest
                  </p>
                  <p className="font-semibold text-foreground">
                    ৳{loanBreakdown.totalInterest.toLocaleString("en-BD")}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Total Payable
                  </p>
                  <p className="font-bold text-foreground">
                    ৳{loanBreakdown.totalPayable.toLocaleString("en-BD")}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[11px] text-muted-foreground">
                    Monthly Installment
                  </p>
                  <p className="font-bold text-primary">
                    ৳{loanBreakdown.monthlyInstallment.toLocaleString("en-BD")} / mo
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Application Purpose / Remarks
            </Label>
            <TextArea
              rows={3}
              disabled={isLoading}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the objective of the loan (e.g., home renovation, education fees, business expansion)..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition resize-none"
            />
          </div>

          {/* Terms & Conditions Checkbox + Link */}
          <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <input
              type="checkbox"
              required
              disabled={isLoading}
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
            />
            <span className="leading-relaxed">
              I confirm that the above details are accurate and I agree to the{" "}
              <Link
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-2 hover:opacity-80"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and repayment schedule of PayVibe Bank.
            </span>
          </label>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onPress={onClose}
              isDisabled={isLoading}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isDisabled={isLoading || !acceptedTerms}
              className="gap-2 font-medium"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" color="current" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Landmark className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}