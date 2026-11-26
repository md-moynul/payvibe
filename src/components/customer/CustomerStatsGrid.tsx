"use client";

import React from "react";
import { Card, CardContent } from "@heroui/react";
import { Users, UserCheck, ShieldAlert, Wallet } from "lucide-react";

// TODO: Move IDummyCustomer / ICustomer interface to a shared types file (e.g., @/types/customer.type)
export interface IDummyCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive" | "Flagged";
  kycVerified: boolean;
  accountsCount: number;
  totalBalance: number;
  joinedAt: string;
}

interface ICustomerStatsGridProps {
  customers: IDummyCustomer[];
}

export default function CustomerStatsGrid({
  customers,
}: ICustomerStatsGridProps) {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (c) => c.status === "Active" && c.kycVerified,
  ).length;
  const pendingKycCount = customers.filter((c) => !c.kycVerified).length;
  const combinedBalance = customers.reduce(
    (sum, item) => sum + item.totalBalance,
    0,
  );

  const stats = [
    {
      label: "Total Customers",
      value: totalCustomers.toString(),
      subtext: "Registered customer profiles",
      icon: Users,
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Active Customers",
      value: activeCustomers.toString(),
      subtext: "Verified & banking active",
      icon: UserCheck,
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending KYC",
      value: pendingKycCount.toString(),
      subtext:
        pendingKycCount === 1
          ? "1 profile needs review"
          : `${pendingKycCount} profiles need review`,
      icon: ShieldAlert,
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Combined Balance",
      value: `৳${combinedBalance.toLocaleString("en-BD")}`,
      subtext: "Across customer accounts",
      icon: Wallet,
      badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md"
          >
            <CardContent className="flex flex-row items-center gap-3.5 p-0">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.badgeClass}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-muted-foreground truncate">
                  {item.label}
                </span>
                <span className="block text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  {item.value}
                </span>
                <span className="block text-[11px] text-muted-foreground/80 truncate">
                  {item.subtext}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
