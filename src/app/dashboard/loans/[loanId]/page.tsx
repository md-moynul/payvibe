"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@heroui/react";
import {
  ArrowLeft,
  User,
  Wallet,
  History,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface IApplicantInfoPayload {
  currentLoan: {
    id: string;
    loanType: string;
    requestedAmount: number;
    durationMonths: number;
    interestRate: number;
    totalPayable: number;
    monthlyInstallment: number;
    status: string;
    description: string;
    staffNotes: string;
    createdAt: string;
  };
  applicant: {
    name: string;
    email: string;
    phone: string;
    status: string;
    kycVerified: boolean;
    monthlyIncome: number;
    employmentStatus: string;
  };
  account: {
    accountNumber: string;
    accountType: string;
    balance: number;
    currency: string;
    status: string;
  } | null;
  lastLoan: {
    id: string;
    loanType: string;
    requestedAmount: number;
    totalPayable: number;
    remainingBalance: number;
    durationMonths: number;
    status: string;
    paidAmount: number;
    repaymentTimeliness:
      | "No Previous Loan"
      | "Timely Paid"
      | "Late / Missed Installment"
      | "Partially Paid / Active";
    createdAt: string;
  } | null;
}

export default function LoanApplicantDetailsPage() {
  const params = useParams<{ loanId: string }>();
  const router = useRouter();
  const loanId = params?.loanId ?? "";

  const [info, setInfo] = useState<IApplicantInfoPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loanId) return;
    let active = true;

    async function loadApplicantInfo() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/loans/${encodeURIComponent(loanId)}/applicant-info`,
          { cache: "no-store" },
        );
        const result = await res.json();
        if (!active) return;

        if (!res.ok || !result?.data) {
          setError(result?.message || "Failed to load user information.");
        } else {
          setInfo(result.data as IApplicantInfoPayload);
        }
      } catch {
        if (active) {
          setError("Failed to load user information.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadApplicantInfo();
    return () => {
      active = false;
    };
  }, [loanId]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          size="sm"
          variant="outline"
          aria-label="Go back"
          onPress={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Applicant &amp; Loan History Details
          </h1>
          <p className="text-xs text-muted-foreground">
            Loan Application ID: <span className="font-mono">{loanId}</span>
          </p>
        </div>
      </div>

      {loading ? (
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading applicant profile, account, and repayment history...
          </span>
        </Card>
      ) : error || !info ? (
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Unable to load details</AlertTitle>
            <AlertDescription>
              {error || "Applicant information not found."}
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 1. User Information */}
            <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <h2 className="text-base font-bold text-foreground">
                      User Information
                    </h2>
                  </div>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={info.applicant.kycVerified ? "success" : "warning"}
                  >
                    {info.applicant.kycVerified ? "KYC Verified" : "KYC Pending"}
                  </Chip>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-semibold text-foreground">
                      {info.applicant.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">
                      {info.applicant.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">
                      {info.applicant.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Profile Status
                    </p>
                    <p className="font-medium text-foreground">
                      {info.applicant.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Monthly Income
                    </p>
                    <p className="font-semibold text-foreground">
                      ৳
                      {Number(info.applicant.monthlyIncome ?? 0).toLocaleString(
                        "en-BD",
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Employment Status
                    </p>
                    <p className="font-medium text-foreground">
                      {info.applicant.employmentStatus}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Bank Account Details */}
            <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <CardContent className="space-y-4 p-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    <h2 className="text-base font-bold text-foreground">
                      Bank Account Details
                    </h2>
                  </div>
                  {info.account && (
                    <Chip
                      size="sm"
                      variant="soft"
                      color={
                        info.account.status === "Active" ? "success" : "danger"
                      }
                    >
                      {info.account.status}
                    </Chip>
                  )}
                </div>

                {!info.account ? (
                  <p className="text-sm text-muted-foreground">
                    No bank account found for this customer.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Account Number
                      </p>
                      <p className="font-mono font-semibold text-foreground">
                        {info.account.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Account Type
                      </p>
                      <p className="font-medium text-foreground">
                        {info.account.accountType}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-xs text-muted-foreground">
                        Current Balance
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        ৳
                        {Number(info.account.balance ?? 0).toLocaleString(
                          "en-BD",
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 3. Last Loan & Installment Timeliness */}
          <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <CardContent className="space-y-4 p-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  <h2 className="text-base font-bold text-foreground">
                    Last Loan &amp; Installment Repayment Check
                  </h2>
                </div>

                {info.lastLoan && (
                  <Chip
                    size="sm"
                    variant="soft"
                    color={
                      info.lastLoan.repaymentTimeliness === "Timely Paid"
                        ? "success"
                        : info.lastLoan.repaymentTimeliness ===
                            "Late / Missed Installment"
                          ? "danger"
                          : "warning"
                    }
                    className="font-medium"
                  >
                    {info.lastLoan.repaymentTimeliness}
                  </Chip>
                )}
              </div>

              {!info.lastLoan ? (
                <p className="text-sm text-muted-foreground">
                  This customer has no previous loan records.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last Loan Type
                      </p>
                      <p className="font-semibold text-foreground">
                        {info.lastLoan.loanType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Principal Amount
                      </p>
                      <p className="font-semibold text-foreground">
                        ৳
                        {Number(
                          info.lastLoan.requestedAmount ?? 0,
                        ).toLocaleString("en-BD")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total Paid So Far
                      </p>
                      <p className="font-semibold text-foreground">
                        ৳
                        {Number(info.lastLoan.paidAmount ?? 0).toLocaleString(
                          "en-BD",
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Remaining Balance
                      </p>
                      <p className="font-semibold text-foreground">
                        ৳
                        {Number(
                          info.lastLoan.remainingBalance ?? 0,
                        ).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-3 text-xs">
                    {info.lastLoan.repaymentTimeliness ===
                    "Late / Missed Installment" ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                        <span className="font-medium text-rose-600 dark:text-rose-400">
                          Previous loan shows late or missed installment
                          history.
                        </span>
                      </>
                    ) : info.lastLoan.repaymentTimeliness === "Timely Paid" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          Previous loan installments were paid timely and
                          completed.
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                        <span className="font-medium text-foreground">
                          Previous loan status: {info.lastLoan.status} —{" "}
                          {info.lastLoan.repaymentTimeliness}.
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}