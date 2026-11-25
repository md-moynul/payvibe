"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import ApplicantProfileCard from "@/components/loan/ApplicantProfileCard";
import ApplicantAccountCard from "@/components/loan/ApplicantAccountCard";
import LastLoanRepaymentCard from "@/components/loan/LastLoanRepaymentCard";
import type { IApplicantInfoPayload } from "@/types/loan.type";

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
            <ApplicantProfileCard applicant={info.applicant} />
            <ApplicantAccountCard account={info.account} />
          </div>

          <LastLoanRepaymentCard lastLoan={info.lastLoan} />
        </>
      )}
    </div>
  );
}