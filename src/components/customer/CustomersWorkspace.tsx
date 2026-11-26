"use client";

import React, { useMemo, useState } from "react";
import { toast } from "@heroui/react";
import CustomerHeader from "@/components/customer/CustomerHeader";
import CustomerStatsGrid from "@/components/customer/CustomerStatsGrid";
import CustomerFilters from "@/components/customer/CustomerFilters";
import CustomersTable, {
  type ICustomerWithAccount,
} from "@/components/customer/CustomersTable";
import RegisterCustomerModal from "@/components/customer/RegisterCustomerModal";
import CreateAccountModal from "@/components/account/CreateAccountModal";
import FreezeAccountModal from "@/components/account/FreezeAccountModal";
import {
  useGetCustomersQuery,
  useUpdateCustomerKycMutation,
  useUpdateCustomerStatusMutation,
} from "@/redux/features/customer";
import { useUpdateAccountStatusMutation } from "@/redux/features/account";
import { useAppSelector } from "@/redux/hook";
import { selectUserRole } from "@/redux/features/auth";
import { getRoleAccess } from "@/lib/role.helper";
import type { IAccount } from "@/types/account.type";
import type { TCustomerStatus } from "@/types/customer.type";
import {
  Card,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@heroui/react";

export default function CustomersWorkspace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [kycFilter, setKycFilter] = useState("ALL");
  const [accountFilter, setAccountFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<ICustomerWithAccount | null>(null);
  const [accountModalMode, setAccountModalMode] = useState<"create" | "edit">(
    "create",
  );
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const [freezingCustomer, setFreezingCustomer] =
    useState<ICustomerWithAccount | null>(null);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);

  const rawRole = useAppSelector(selectUserRole);
  const { canApproveKyc } = getRoleAccess(rawRole);
  const canUpdateCustomerStatus = rawRole?.toLowerCase() === "admin";

  const { data, isLoading, isError, refetch } = useGetCustomersQuery();
  const [updateCustomerKyc, { isLoading: isUpdatingKyc }] =
    useUpdateCustomerKycMutation();
  const [updateCustomerStatus, { isLoading: isUpdatingStatus }] =
    useUpdateCustomerStatusMutation();
  const [updateAccountStatus, { isLoading: isUpdatingAccountStatus }] =
    useUpdateAccountStatusMutation();

  const isBusy = isUpdatingStatus || isUpdatingAccountStatus;

  const customers = useMemo<ICustomerWithAccount[]>(
    () => (data?.data ?? []) as ICustomerWithAccount[],
    [data],
  );

  const filteredCustomers = useMemo(() => {
    const list = customers.filter((item) => {
      // Status Filter
      if (statusFilter !== "ALL") {
        if (statusFilter === "FROZEN") {
          const isFrozen = item.accountStatus === "Frozen";
          if (!isFrozen) return false;
        } else if (item.status !== statusFilter) {
          return false;
        }
      }

      // KYC Verification Filter
      if (kycFilter === "VERIFIED" && !item.kycVerified) {
        return false;
      }
      if (kycFilter === "PENDING" && item.kycVerified) {
        return false;
      }

      // Account Status Filter
      const hasAccount = item.accountsCount > 0 || Boolean(item.accountId);
      const isAccountFrozen = item.accountStatus === "Frozen";
      if (accountFilter === "HAS_ACCOUNT" && !hasAccount) {
        return false;
      }
      if (accountFilter === "NO_ACCOUNT" && hasAccount) {
        return false;
      }
      if (
        accountFilter === "FROZEN_ACCOUNT" &&
        (!hasAccount || !isAccountFrozen)
      ) {
        return false;
      }
      if (
        accountFilter === "ACTIVE_ACCOUNT" &&
        (!hasAccount || isAccountFrozen)
      ) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = (item.name || "").toLowerCase().includes(q);
        const matchEmail = (item.email || "").toLowerCase().includes(q);
        const matchPhone = (item.phone || "").toLowerCase().includes(q);
        const matchId = (item.id || "").toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchId) {
          return false;
        }
      }

      return true;
    });

    // Sorting (Time, Balance, Name)
    return list.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.joinedAt || 0).getTime() -
          new Date(a.joinedAt || 0).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.joinedAt || 0).getTime() -
          new Date(b.joinedAt || 0).getTime()
        );
      }
      if (sortBy === "balance-high") {
        return (b.totalBalance || 0) - (a.totalBalance || 0);
      }
      if (sortBy === "balance-low") {
        return (a.totalBalance || 0) - (b.totalBalance || 0);
      }
      if (sortBy === "name-asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      return 0;
    });
  }, [
    customers,
    searchQuery,
    sortBy,
    kycFilter,
    accountFilter,
    statusFilter,
  ]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    sortBy !== "newest" ||
    kycFilter !== "ALL" ||
    accountFilter !== "ALL" ||
    statusFilter !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    setKycFilter("ALL");
    setAccountFilter("ALL");
    setStatusFilter("ALL");
  };

  const handleQuickCreateAccount = (customer: ICustomerWithAccount) => {
    setSelectedCustomer(customer);
    setAccountModalMode("create");
    setIsAccountModalOpen(true);
  };

  const handleEditAccount = (customer: ICustomerWithAccount) => {
    setSelectedCustomer(customer);
    setAccountModalMode("edit");
    setIsAccountModalOpen(true);
  };

  const handleFreezeAccount = async (customer: ICustomerWithAccount) => {
    if (isBusy) return;

    if (customer.accountStatus === "Frozen") {
      const targetAccountId = customer.accountId || customer.id;
      if (!targetAccountId) return;

      try {
        await updateAccountStatus({
          id: targetAccountId,
          status: "Active",
          reason: "Account unfrozen by admin/staff",
        }).unwrap();

        toast.success(`Account unfrozen for ${customer.name}`);
        refetch();
      } catch (error) {
        console.error("Failed to unfreeze account:", error);
        toast.danger("Failed to unfreeze account");
      }
      return;
    }

    setFreezingCustomer(customer);
    setIsFreezeModalOpen(true);
  };

  const handleApproveKyc = async (customer: ICustomerWithAccount) => {
    if (!canApproveKyc || isUpdatingKyc) return;

    try {
      const response = await updateCustomerKyc({
        id: customer.id,
        kycVerified: true,
      }).unwrap();

      toast.success(response.message || `KYC approved for ${customer.name}`);
    } catch (error) {
      console.error("Failed to approve customer KYC:", error);
      toast.danger("Failed to approve customer KYC");
    }
  };

  const handleUpdateCustomerStatus = async (
    customer: ICustomerWithAccount,
    status: TCustomerStatus,
  ) => {
    if (!canUpdateCustomerStatus || isBusy) return;
    if (customer.status === status) return;

    try {
      const response = await updateCustomerStatus({
        id: customer.id,
        status,
      }).unwrap();

      toast.success(
        response.message || `${customer.name}'s status updated to ${status}`,
      );
    } catch (error) {
      console.error("Failed to update customer status:", error);
      toast.danger("Failed to update customer status");
    }
  };

  const handleCloseAccountModal = () => {
    setIsAccountModalOpen(false);
    setSelectedCustomer(null);
    setAccountModalMode("create");
  };

  const handleCloseFreezeModal = () => {
    setIsFreezeModalOpen(false);
    setFreezingCustomer(null);
  };

  const editAccountData: IAccount | null =
    accountModalMode === "edit" && selectedCustomer
      ? {
          id: selectedCustomer.accountId || selectedCustomer.id,
          accountNumber: `PV-${selectedCustomer.id.slice(-8)}`,
          accountType: "Savings Account",
          balance: selectedCustomer.totalBalance,
          status: selectedCustomer.accountStatus ?? "Active",
          currency: "BDT",
          ownerId: selectedCustomer.id,
          ownerName: selectedCustomer.name,
          dailyLimit: 50000,
          maxSingleTransaction: 25000,
          minBalance: 500,
          createdAt: selectedCustomer.joinedAt,
        }
      : null;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <CustomerHeader
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
        portalBadge={rawRole === "admin" ? "Admin Portal" : "Bank Staff"}
      />

      {/* Modern 4-Card Metrics Grid */}
      <CustomerStatsGrid customers={customers} />

      {/* Comprehensive Compact Filter Bar */}
      <CustomerFilters
        search={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        kycFilter={kycFilter}
        onKycChange={setKycFilter}
        accountFilter={accountFilter}
        onAccountChange={setAccountFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredCustomers.length}
      />

      {/* Customers Table / Status Views */}
      {isLoading ? (
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading customers...
          </span>
        </Card>
      ) : isError ? (
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Failed to load customers</AlertTitle>
            <AlertDescription>
              Please verify your session permissions.
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : (
        <CustomersTable
          customers={filteredCustomers}
          canApproveKyc={canApproveKyc}
          isUpdatingKyc={isUpdatingKyc}
          canUpdateCustomerStatus={canUpdateCustomerStatus}
          isUpdatingStatus={isBusy}
          onQuickCreateAccount={handleQuickCreateAccount}
          onEditAccount={handleEditAccount}
          onFreezeAccount={handleFreezeAccount}
          onApproveKyc={handleApproveKyc}
          onUpdateCustomerStatus={handleUpdateCustomerStatus}
        />
      )}

      {/* Modal Actions */}
      <RegisterCustomerModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <CreateAccountModal
        isOpen={isAccountModalOpen}
        onClose={handleCloseAccountModal}
        mode={accountModalMode}
        defaultEmail={selectedCustomer?.email ?? ""}
        defaultCustomerId={selectedCustomer?.id ?? ""}
        editAccount={editAccountData}
        onSuccess={() => {
          refetch();
        }}
      />

      <FreezeAccountModal
        isOpen={isFreezeModalOpen}
        onClose={handleCloseFreezeModal}
        customerName={freezingCustomer?.name ?? ""}
        customerEmail={freezingCustomer?.email ?? ""}
        accountId={freezingCustomer?.accountId ?? freezingCustomer?.id ?? ""}
        onAccountFrozen={() => {
          refetch();
        }}
      />
    </div>
  );
}