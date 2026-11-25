"use client";

import React, { useMemo, useState } from "react";
import { Alert, AlertIndicator, AlertContent, AlertTitle, toast } from "@heroui/react";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth";
import {
  useGetAccountsQuery,
  useUpdateAccountStatusMutation,
} from "@/redux/features/account";
import { useGetCustomersQuery } from "@/redux/features/customer";
import type { IAccount } from "@/types/account.type";
import type { ICustomerWithAccount } from "@/components/customer/CustomersTable";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import RecentAccountsTable from "@/components/admin/RecentAccountsTable";
import RecentCustomersTable from "@/components/admin/RecentCustomersTable";
import AdminQuickHub from "@/components/admin/AdminQuickHub";
import RegisterCustomerModal from "@/components/customer/RegisterCustomerModal";
import CreateAccountModal from "@/components/account/CreateAccountModal";
import FreezeAccountModal from "@/components/account/FreezeAccountModal";

export default function AdminDashboardPage() {
  const user = useAppSelector(selectCurrentUser);

  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [prefillCustomerId, setPrefillCustomerId] = useState<string>("");
  const [prefillEmail, setPrefillEmail] = useState<string>("");

  const [freezingTarget, setFreezingTarget] = useState<{
    id: string;
    email: string;
    name: string;
  } | null>(null);

  // Data Queries
  const {
    data: accountsData,
    isLoading: isAccountsLoading,
    isError: isAccountsError,
    refetch: refetchAccounts,
  } = useGetAccountsQuery();

  const {
    data: customersData,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    refetch: refetchCustomers,
  } = useGetCustomersQuery();

  const [updateAccountStatus, { isLoading: isUpdatingStatus }] =
    useUpdateAccountStatusMutation();

  const accounts: IAccount[] = useMemo(
    () => accountsData?.data ?? [],
    [accountsData],
  );

  const customers: ICustomerWithAccount[] = useMemo(
    () => (customersData?.data ?? []) as ICustomerWithAccount[],
    [customersData],
  );

  // Aggregated Metrics
  const totalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0),
    [accounts],
  );

  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((a) => a.status === "Active").length;
  const frozenAccounts = accounts.filter((a) => a.status === "Frozen").length;

  const totalCustomers = customers.length;
  const verifiedCustomers = customers.filter((c) => c.kycVerified).length;
  const pendingKYC = totalCustomers - verifiedCustomers;

  // Account Type Distribution
  const savingsCount = accounts.filter(
    (a) => a.accountType === "Savings Account",
  ).length;
  const currentCount = accounts.filter(
    (a) => a.accountType === "Current Account",
  ).length;
  const businessCount = accounts.filter(
    (a) => a.accountType === "Business Account",
  ).length;

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchAccounts(), refetchCustomers()]);
      toast.success("Dashboard data refreshed");
    } catch {
      toast.danger("Failed to refresh dashboard data");
    }
  };

  const handleOpenAccountForCustomer = (customer: ICustomerWithAccount) => {
    setPrefillCustomerId(customer.id);
    setPrefillEmail(customer.email);
    setIsCreateAccountOpen(true);
  };

  const handleToggleFreezeStatus = async (account: IAccount) => {
    if (isUpdatingStatus) return;

    if (account.status === "Active") {
      setFreezingTarget({
        id: account.id,
        email: account.ownerName || account.accountNumber,
        name: account.ownerName || "Account Holder",
      });
      return;
    }

    try {
      await updateAccountStatus({
        id: account.id,
        status: "Active",
        reason: "Unfrozen by administrator",
      }).unwrap();
      toast.success(`Account ${account.accountNumber} has been activated`);
    } catch (err) {
      console.error(err);
      toast.danger("Failed to activate account");
    }
  };

  const isLoading = isAccountsLoading || isCustomersLoading;
  const hasError = isAccountsError || isCustomersError;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header with Actions */}
      <AdminHeader
        userName={user?.name}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenCreateAccountModal={() => {
          setPrefillCustomerId("");
          setPrefillEmail("");
          setIsCreateAccountOpen(true);
        }}
      />

      {/* Error Notice */}
      {hasError && (
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>
              Failed to load some dashboard statistics. Please click refresh to retry.
            </AlertTitle>
          </AlertContent>
        </Alert>
      )}

      {/* 2. Top Executive Metrics Grid */}
      <AdminStatsGrid
        totalBalance={totalBalance}
        totalAccounts={totalAccounts}
        activeAccounts={activeAccounts}
        frozenAccounts={frozenAccounts}
        totalCustomers={totalCustomers}
        verifiedCustomers={verifiedCustomers}
        pendingKYC={pendingKYC}
        isLoading={isLoading}
      />

      {/* 3. Main Body: Tables + Quick Hub */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left (2 Cols on lg): Recent Accounts & Recent Customers */}
        <div className="space-y-8 lg:col-span-2">
          <RecentAccountsTable
            accounts={accounts}
            isLoading={isLoading}
            onToggleFreeze={handleToggleFreezeStatus}
          />

          <RecentCustomersTable
            customers={customers}
            isLoading={isLoading}
            onOpenAccountForCustomer={handleOpenAccountForCustomer}
          />
        </div>

        {/* Right (1 Col on lg): Distribution, Shortcuts, Security */}
        <AdminQuickHub
          totalAccounts={totalAccounts}
          savingsCount={savingsCount}
          currentCount={currentCount}
          businessCount={businessCount}
        />
      </div>

      {/* Modals */}
      <RegisterCustomerModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onAddCustomer={() => {
          refetchCustomers();
          toast.success("Customer profile created successfully");
        }}
      />

      <CreateAccountModal
        isOpen={isCreateAccountOpen}
        onClose={() => {
          setIsCreateAccountOpen(false);
          setPrefillCustomerId("");
          setPrefillEmail("");
        }}
        defaultCustomerId={prefillCustomerId}
        defaultEmail={prefillEmail}
        onSuccess={() => {
          refetchAccounts();
          refetchCustomers();
        }}
      />

      {freezingTarget && (
        <FreezeAccountModal
          isOpen={Boolean(freezingTarget)}
          accountId={freezingTarget.id}
          customerEmail={freezingTarget.email}
          customerName={freezingTarget.name}
          onClose={() => setFreezingTarget(null)}
          onAccountFrozen={() => {
            refetchAccounts();
            setFreezingTarget(null);
          }}
        />
      )}
    </div>
  );
}
