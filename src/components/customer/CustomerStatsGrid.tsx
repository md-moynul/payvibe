"use client";

import React from "react";
import { Card } from "@heroui/react";
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
  // TODO: Replace client-side dummy calculations with live backend summary / Redux selector data when wired
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "Active").length;
  const flaggedOrInactive = customers.filter(
    (c) => c.status !== "Active",
  ).length;
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
      subtext: "Verified & eligible for banking",
      icon: UserCheck,
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Needs Review",
      value: flaggedOrInactive.toString(),
      subtext: "Inactive or flagged profiles",
      icon: ShieldAlert,
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Combined Balance",
      value: `৳${combinedBalance.toLocaleString("en-BD")}`,
      subtext: "Across customer bank accounts",
      icon: Wallet,
      badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="p-5 border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40 rounded-2xl flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
              <div className={`rounded-xl p-2.5 ${item.badgeClass} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.subtext}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
