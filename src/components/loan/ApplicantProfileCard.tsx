"use client";

import React from "react";
import { Card, CardContent, Chip } from "@heroui/react";
import { User } from "lucide-react";
import type { IApplicantInfoPayload } from "@/types/loan.type";

interface IApplicantProfileCardProps {
  applicant: IApplicantInfoPayload["applicant"];
}

export default function ApplicantProfileCard({
  applicant,
}: IApplicantProfileCardProps) {
  return (
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
            color={applicant.kycVerified ? "success" : "warning"}
          >
            {applicant.kycVerified ? "KYC Verified" : "KYC Pending"}
          </Chip>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Full Name</p>
            <p className="font-semibold text-foreground">{applicant.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">
              {applicant.email || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium text-foreground">{applicant.phone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Profile Status</p>
            <p className="font-medium text-foreground">{applicant.status}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Monthly Income</p>
            <p className="font-semibold text-foreground">
              ৳{Number(applicant.monthlyIncome ?? 0).toLocaleString("en-BD")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Employment Status</p>
            <p className="font-medium text-foreground">
              {applicant.employmentStatus}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}