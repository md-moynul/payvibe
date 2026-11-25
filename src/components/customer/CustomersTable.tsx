"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, Button, Chip, Card } from "@heroui/react";
import {
  Mail,
  Phone,
  PlusCircle,
  Eye,
  Pencil,
  Snowflake,
} from "lucide-react";
import type { IDummyCustomer } from "./CustomerStatsGrid";
import type { TAccountStatus } from "@/types/account.type";

// TODO: Add customer details view / status toggle / verify KYC actions for Admin & Bank Staff
// TODO: Add pagination support when connected to real customer list API

export interface ICustomerWithAccount extends IDummyCustomer {
  accountId?: string;
  accountStatus?: TAccountStatus;
}

interface ICustomersTableProps {
  customers: ICustomerWithAccount[];
  onQuickCreateAccount?: (customer: ICustomerWithAccount) => void;
  onEditAccount?: (customer: ICustomerWithAccount) => void;
  onFreezeAccount?: (customer: ICustomerWithAccount) => void;
}

export default function CustomersTable({
  customers,
  onQuickCreateAccount,
  onEditAccount,
  onFreezeAccount,
}: ICustomersTableProps) {
  const router = useRouter();

  if (customers.length === 0) {
    return (
      <Card className="border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm font-medium text-foreground">
          No matching customers found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try a different search keyword or register a new customer.
        </p>
      </Card>
    );
  }

  const handleViewDetails = (customer: ICustomerWithAccount) => {
    const targetRouteId = customer.accountId || customer.id;
    router.push(`/dashboard/admin/accounts/${targetRouteId}`);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Contact</th>
              <th className="px-5 py-3.5">Verification</th>
              <th className="px-5 py-3.5">Total Balance</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => {
              const hasBankAccount =
                customer.accountsCount > 0 || Boolean(customer.accountId);
              const isFrozen = customer.accountStatus === "Frozen";

              return (
                <tr key={customer.id} className="transition hover:bg-muted/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm" variant="soft" color="accent">
                        <AvatarFallback className="font-bold text-xs">
                          {customer.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined {customer.joinedAt}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={customer.kycVerified ? "success" : "warning"}
                      className="font-medium"
                    >
                      {customer.kycVerified ? "Verified" : "Pending"}
                    </Chip>
                  </td>

                  <td className="px-5 py-4 font-semibold text-foreground">
                    ৳{customer.totalBalance.toLocaleString("en-BD")}
                  </td>

                  <td className="px-5 py-4">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={
                        customer.status === "Active"
                          ? "success"
                          : customer.status === "Flagged"
                            ? "danger"
                            : "default"
                      }
                      className="font-medium"
                    >
                      {customer.status}
                    </Chip>
                  </td>

                  <td className="px-5 py-4 text-right">
                    {/* TODO: Pass selected customer email/id into CreateAccountModal so account creation links to this customer */}
                    {hasBankAccount ? (
                      <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => handleViewDetails(customer)}
                          className="gap-1.5 font-medium"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Details</span>
                        </Button>

                        {/* TODO: Wire Edit action to EditAccountModal / account update mutation */}
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => onEditAccount?.(customer)}
                          className="gap-1.5 font-medium"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Button>

                        {/* TODO: Wire Freeze action to account status update API (PATCH /api/accounts/[id]) */}
                        <Button
                          size="sm"
                          variant="outline"
                          isDisabled={isFrozen}
                          onPress={() => onFreezeAccount?.(customer)}
                          className="gap-1.5 font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
                        >
                          <Snowflake className="h-3.5 w-3.5" />
                          <span>{isFrozen ? "Frozen" : "Freeze"}</span>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() => onQuickCreateAccount?.(customer)}
                        className="gap-1.5 font-medium"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Open Account</span>
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}