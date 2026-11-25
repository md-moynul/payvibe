"use client";

import { useState } from "react";
import AccountHeader from "./AccountHeader";
import ActiveAccountCard from "./ActiveAccountCard";
import AccountListGrid from "./AccountListGrid";
import CreateAccountModal from "./CreateAccountModal";
import type { IAccount } from "@/types/account.type";
import {
  selectAccount,
  useGetAccountsQuery,
  useUpdateAccountStatusMutation,
} from "@/redux/features/account";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { selectSelectedAccountId } from "@/redux/features/account/account.selector";
import { getRoleAccess } from "@/lib/role.helper";
import { selectUserRole } from "@/redux/features/auth";
import { toast } from "@heroui/react";

// TODO: Replace hardcoded role with auth selector (e.g., selectUserRole) and wire limits/statement handlers
export default function AccountView() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLimitAccount, setEditingLimitAccount] =
    useState<IAccount | null>(null);
  const selectedId = useAppSelector(selectSelectedAccountId);

  const { data, isLoading, isError } = useGetAccountsQuery();
  const dispatch = useAppDispatch();
  const [updateAccountStatus, { isLoading: isTogglingFreeze }] =
    useUpdateAccountStatusMutation();

  const accounts: IAccount[] = data?.data ?? [];
  const activeAccount =
    accounts.find((acc) => acc.id === selectedId) ?? accounts[0];

  const rawRole = useAppSelector(selectUserRole);
  const { canCreateAccount, isAdmin } = getRoleAccess(rawRole);

  const handleSelectAccount = (accountId: string) => {
    dispatch(selectAccount(accountId));
  };

  const handleToggleFreeze = async (accountId: string) => {
    if (isTogglingFreeze) return;

    const target = accounts.find((acc) => acc.id === accountId);
    if (!target) return;

    const nextStatus = target.status === "Frozen" ? "Active" : "Frozen";

    try {
      await updateAccountStatus({
        id: accountId,
        status: nextStatus,
        reason:
          nextStatus === "Frozen"
            ? "Account frozen by staff/admin"
            : "Account unfrozen by staff/admin",
      }).unwrap();
      toast.success("Account status updated successfully");
    } catch (error) {
      console.error("Failed to toggle freeze status:", error);
      toast.danger("Failed to update account status");
    }
  };

 const handleUpdateLimits = (accountId: string) => {
  const target = accounts.find((acc) => acc.id === accountId) ?? null;
  setEditingLimitAccount(target);
};

  const handleDownloadStatement = () => {
    // TODO: Trigger statement export for accountId
    toast.success("this feature is not implemented yet");
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Loading accounts...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-sm text-rose-500">
        Failed to load accounts.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
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
        accounts={accounts}
        selectedAccountId={activeAccount?.id ?? null}
        onSelectAccount={handleSelectAccount}
      />

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <CreateAccountModal
        isOpen={Boolean(editingLimitAccount)}
        mode="edit"
        editAccount={editingLimitAccount}
        onClose={() => setEditingLimitAccount(null)}
      />
    </section>
  );
}
