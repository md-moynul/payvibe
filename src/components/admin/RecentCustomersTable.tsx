"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Chip,
  Avatar,
  AvatarFallback,
  Spinner,
} from "@heroui/react";
import { ArrowRight, PlusCircle } from "lucide-react";
import type { ICustomerWithAccount } from "@/components/customer/CustomersTable";

interface IRecentCustomersTableProps {
  customers: ICustomerWithAccount[];
  isLoading?: boolean;
  onOpenAccountForCustomer: (customer: ICustomerWithAccount) => void;
}

export default function RecentCustomersTable({
  customers,
  isLoading,
  onOpenAccountForCustomer,
}: IRecentCustomersTableProps) {
  const router = useRouter();

  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 p-5">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Recent Customer Profiles
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Registered customer profiles eligible for banking services
          </CardDescription>
        </div>
        <Link
          href="/dashboard/admin/customers"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <span>Manage all customers</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-10 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Spinner size="md" />
            <span>Loading customer profiles...</span>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No customers registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">KYC Status</th>
                  <th className="px-5 py-3">Bank Balance</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {customers.slice(0, 5).map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback className="font-semibold text-xs">
                            {customer.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase() || "CU"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">
                            {customer.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Chip
                        size="sm"
                        variant="soft"
                        color={customer.kycVerified ? "success" : "warning"}
                        className="font-medium"
                      >
                        {customer.kycVerified ? "Verified" : "Pending"}
                      </Chip>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-foreground">
                      ৳{customer.totalBalance.toLocaleString("en-BD")}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {customer.accountsCount > 0 ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onPress={() => router.push("/dashboard/admin/accounts")}
                          className="h-8 text-xs font-medium"
                        >
                          <span>{customer.accountsCount} Account(s)</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => onOpenAccountForCustomer(customer)}
                          className="h-8 text-xs font-medium text-primary border-primary/30"
                        >
                          <PlusCircle className="h-3.5 w-3.5 mr-1" />
                          <span>Open Account</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
