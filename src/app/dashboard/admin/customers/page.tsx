"use client";

import React, { useMemo, useState } from "react";
import { toast } from "@heroui/react";
import CustomerHeader from "@/components/customer/CustomerHeader";
import CustomerStatsGrid from "@/components/customer/CustomerStatsGrid";
import CustomersTable, {
  type ICustomerWithAccount,
} from "@/components/customer/CustomersTable";
import RegisterCustomerModal from "@/components/customer/RegisterCustomerModal";
import CreateAccountModal from "@/components/account/CreateAccountModal";
import FreezeAccountModal from "@/components/account/FreezeAccountModal";
import {
  useGetCustomersQuery,
  useUpdateCustomerKycMutation,
} from "@/redux/features/customer";
import { useAppSelector } from "@/redux/hook";
import { selectUserRole } from "@/redux/features/auth";
import { getRoleAccess } from "@/lib/role.helper";
import type { IAccount } from "@/types/account.type";
import {
  Card,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
} from "@heroui/react";

// TODO: Fetch real account object by customer/accountId when opening Edit mode instead of placeholder defaults

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
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

  const { data, isLoading, isError, refetch } = useGetCustomersQuery();
  const [updateCustomerKyc, { isLoading: isUpdatingKyc }] =
    useUpdateCustomerKycMutation();

  const customers = useMemo<ICustomerWithAccount[]>(
    () => (data?.data ?? []) as ICustomerWithAccount[],
    [data],
  );

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q),
    );
  }, [customers, searchQuery]);

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

  const handleFreezeAccount = (customer: ICustomerWithAccount) => {
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

      toast.success(
        response.message || `KYC approved for ${customer.name}`,
      );
    } catch (error) {
      console.error("Failed to approve customer KYC:", error);
      toast.danger("Failed to approve customer KYC");
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
      <CustomerHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
      />

      <CustomerStatsGrid customers={customers} />

      {isLoading ? (
        <Card className="rounded-2xl border border-border bg-card p-10 text-center flex flex-col items-center justify-center gap-3">
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
          onQuickCreateAccount={handleQuickCreateAccount}
          onEditAccount={handleEditAccount}
          onFreezeAccount={handleFreezeAccount}
          onApproveKyc={handleApproveKyc}
        />
      )}

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