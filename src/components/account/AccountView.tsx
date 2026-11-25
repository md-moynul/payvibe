"use client";

import React, { useState } from "react";
import AccountHeader from "./AccountHeader";
import ActiveAccountCard from "./ActiveAccountCard";
import AccountListGrid from "./AccountListGrid";
import CreateAccountModal from "./CreateAccountModal";
import type { IAccount } from "@/types/account.type";

// TODO: Replace mockAccounts & selectedId with Redux selectors (selectAccounts, selectSelectedAccountId, selectUserRole) and useAppDispatch
export default function AccountView() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("acc-1");

  const mockAccounts: IAccount[] = [
    {
      id: "acc-1",
      accountNumber: "PV-8821-001",
      accountType: "Savings Account",
      balance: 125000,
      status: "Active",
      currency: "BDT",
      ownerId: "user-1",
      ownerName: "Demo Customer",
      dailyLimit: 50000,
      maxSingleTransaction: 25000,
      minBalance: 1000,
      createdAt: "2026-01-01",
    },
    {
      id: "acc-2",
      accountNumber: "PV-8821-002",
      accountType: "Current Account",
      balance: 340500,
      status: "Active",
      currency: "BDT",
      ownerId: "user-1",
      ownerName: "Demo Customer",
      dailyLimit: 200000,
      maxSingleTransaction: 100000,
      minBalance: 5000,
      createdAt: "2026-01-02",
    },
    {
      id: "acc-3",
      accountNumber: "PV-8821-003",
      accountType: "Business Account",
      balance: 950000,
      status: "Frozen",
      currency: "BDT",
      ownerId: "user-1",
      ownerName: "Demo Customer",
      dailyLimit: 500000,
      maxSingleTransaction: 250000,
      minBalance: 10000,
      createdAt: "2026-01-03",
    },
  ];

  const activeAccount =
    mockAccounts.find((acc) => acc.id === selectedId) ?? mockAccounts[0];

  // TODO: Derive role from auth selector ("admin", "bank staff", "customer")
  const role = "admin";
  const canCreateAccount = role === "admin" || role === "bank staff";
  const isAdmin = role === "admin";

  const handleSelectAccount = (accountId: string) => {
    // TODO: Dispatch selectAccount(accountId)
    setSelectedId(accountId);
  };

  const handleToggleFreeze = (accountId: string) => {
    // TODO: Dispatch freeze/unfreeze mutation or slice action
    console.log("Toggle freeze:", accountId);
  };

  const handleUpdateLimits = (accountId: string) => {
    // TODO: Open limits modal / dispatch updateAccountLimits
    console.log("Update limits:", accountId);
  };

  const handleDownloadStatement = (accountId: string) => {
    // TODO: Trigger statement export
    console.log("Download statement:", accountId);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AccountHeader
        canCreateAccount={canCreateAccount}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {activeAccount && (
        <ActiveAccountCard
          account={activeAccount}
          isAdmin={isAdmin}
          onToggleFreeze={handleToggleFreeze}
          onUpdateLimits={handleUpdateLimits}
          onDownloadStatement={handleDownloadStatement}
        />
      )}

      <AccountListGrid
        accounts={mockAccounts}
        selectedAccountId={activeAccount?.id ?? null}
        onSelectAccount={handleSelectAccount}
      />

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </section>
  );
}