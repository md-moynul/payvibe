"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
  Button,
  toast,
} from "@heroui/react";
import {
  Wallet,
  Landmark,
  Snowflake,
  Search,
  RotateCcw,
  X,
  ChevronDown,
  Filter,
} from "lucide-react";
import AccountHeader from "./AccountHeader";
import AccountsTable from "./AccountsTable";
import CreateAccountModal from "./CreateAccountModal";
import type { IAccount, TAccountStatus, TAccountType } from "@/types/account.type";
import {
  useGetAccountsQuery,
  useUpdateAccountStatusMutation,
} from "@/redux/features/account";
import { useAppSelector } from "@/redux/hook";
import { selectUserRole } from "@/redux/features/auth";
import { getRoleAccess } from "@/lib/role.helper";

const ACCOUNT_TYPE_OPTIONS: { label: string; value: "ALL" | TAccountType }[] = [
  { label: "All Account Types", value: "ALL" },
  { label: "Savings Account", value: "Savings Account" },
  { label: "Current Account", value: "Current Account" },
  { label: "Business Account", value: "Business Account" },
];

const ACCOUNT_STATUS_OPTIONS: { label: string; value: "ALL" | TAccountStatus }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Active", value: "Active" },
  { label: "Frozen", value: "Frozen" },
  { label: "Inactive", value: "Inactive" },
];

export default function AccountView() {
  const router = useRouter();
  const rawRole = useAppSelector(selectUserRole);
  const { isAdmin, canManageAccounts, canCreateAccount, canFreezeAccount } =
    getRoleAccess(rawRole);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | TAccountType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TAccountStatus>("ALL");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLimitAccount, setEditingLimitAccount] =
    useState<IAccount | null>(null);

  const { data, isLoading, isError, refetch } = useGetAccountsQuery();
  const [updateAccountStatus, { isLoading: isTogglingFreeze }] =
    useUpdateAccountStatusMutation();

  const accounts: IAccount[] = useMemo(() => data?.data ?? [], [data]);

  // Summary Metrics
  const stats = useMemo(() => {
    const totalCount = accounts.length;
    const activeCount = accounts.filter((a) => a.status === "Active").length;
    const frozenCount = accounts.filter((a) => a.status === "Frozen").length;
    const totalBalance = accounts.reduce(
      (sum, a) => sum + Number(a.balance ?? 0),
      0,
    );

    return { totalCount, activeCount, frozenCount, totalBalance };
  }, [accounts]);

  // Filtered Accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // Type Filter
      if (typeFilter !== "ALL" && acc.accountType !== typeFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== "ALL" && acc.status !== statusFilter) {
        return false;
      }

      // Search Filter (Account Number, Customer/Owner Name, Customer Email)
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchNumber = (acc.accountNumber || "").toLowerCase().includes(q);
        const matchName = (acc.customerName || acc.ownerName || "")
          .toLowerCase()
          .includes(q);
        const matchEmail = (acc.customerEmail || acc.ownerId || "")
          .toLowerCase()
          .includes(q);

        if (!matchNumber && !matchName && !matchEmail) {
          return false;
        }
      }

      return true;
    });
  }, [accounts, typeFilter, statusFilter, search]);

  const hasActiveFilters =
    Boolean(search) || typeFilter !== "ALL" || statusFilter !== "ALL";

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
  };

  // Navigate to Dynamic Route based on user role
  const handleViewDetails = (account: IAccount) => {
    let rolePrefix = "/dashboard/admin/accounts";
    if (rawRole === "bank-staff") {
      rolePrefix = "/dashboard/staff/accounts";
    } else if (rawRole === "customer") {
      rolePrefix = "/dashboard/customer/accounts";
    }
    router.push(`${rolePrefix}/${encodeURIComponent(account.id)}`);
  };

  // Toggle Freeze Status
  const handleToggleFreeze = async (account: IAccount) => {
    if (isTogglingFreeze) return;
    const nextStatus: TAccountStatus =
      account.status === "Frozen" ? "Active" : "Frozen";

    try {
      await updateAccountStatus({
        id: account.id,
        status: nextStatus,
        reason:
          nextStatus === "Frozen"
            ? "Account frozen by administrative staff"
            : "Account unfrozen by administrative staff",
      }).unwrap();
      toast.success(
        nextStatus === "Frozen"
          ? `Account ${account.accountNumber} has been frozen.`
          : `Account ${account.accountNumber} has been unfrozen.`,
      );
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to update account freeze status.";
      toast.danger(message);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <AccountHeader
          canCreateAccount={canCreateAccount}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-12 text-center shadow-xs">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading bank accounts ledger...
          </span>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <AccountHeader
          canCreateAccount={canCreateAccount}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Failed to load bank accounts</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4 mt-1">
              <span>Please verify your session authorization and retry.</span>
              <Button size="sm" variant="outline" onPress={() => refetch()}>
                Retry
              </Button>
            </AlertDescription>
          </AlertContent>
        </Alert>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Page Header */}
      <AccountHeader
        canCreateAccount={canCreateAccount}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* 2. Top Metric Highlights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Liquidity */}
        <Card className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-md">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all duration-300 group-hover:bg-blue-500/20 pointer-events-none" />
          <div className="relative space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                Total Reserves
              </span>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Total Ledger Liquidity
              </p>
              <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                ৳{stats.totalBalance.toLocaleString("en-BD")}
              </div>
            </div>
            <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
              Combined balance across all accounts
            </div>
          </div>
        </Card>

        {/* Total Accounts */}
        <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                All Ledgers
              </span>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                <Landmark className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Total Accounts
              </p>
              <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {stats.totalCount}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  accounts
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
              Registered Savings, Current &amp; Business
            </div>
          </div>
        </Card>

        {/* Active Accounts */}
        <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Operational
              </span>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Active Accounts
              </p>
              <div className="mt-1 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {stats.activeCount}
              </div>
            </div>
            <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
              Ready for transfers and debit activity
            </div>
          </div>
        </Card>

        {/* Frozen Accounts */}
        <Card className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                Restricted
              </span>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                <Snowflake className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Frozen Accounts
              </p>
              <div className="mt-1 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {stats.frozenCount}
              </div>
            </div>
            <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
              Temporarily locked by staff or compliance
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Compact Filter Bar */}
      <Card className="rounded-2xl border border-border/70 bg-card p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Icon Pill */}
          <div className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-2 ring-card animate-pulse" />
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by account number, owner name, or email..."
              className="h-9 w-full rounded-xl border border-border/80 bg-background pl-9 pr-8 text-xs font-medium text-foreground outline-none transition placeholder:text-muted-foreground/60 hover:border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Account Type Filter */}
          <div className="relative w-full sm:w-44 shrink-0">
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as "ALL" | TAccountType)
              }
              aria-label="Filter by account type"
              className="h-9 w-full appearance-none rounded-xl border border-border/80 bg-background pl-3 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-36 shrink-0">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | TAccountStatus)
              }
              aria-label="Filter by account status"
              className="h-9 w-full appearance-none rounded-xl border border-border/80 bg-background pl-3 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              {ACCOUNT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          </div>

          {/* Reset Filters */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onPress={handleResetFilters}
            isDisabled={!hasActiveFilters}
            className={`h-9 shrink-0 gap-1.5 font-medium text-xs rounded-xl border-border/70 transition-all ${
              hasActiveFilters
                ? "text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/10 cursor-pointer shadow-2xs"
                : "text-muted-foreground opacity-40 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </Button>
        </div>
      </Card>

      {/* 4. Accounts Table */}
      <AccountsTable
        accounts={filteredAccounts}
        isAdmin={isAdmin}
        canFreeze={canFreezeAccount || canManageAccounts}
        isTogglingFreeze={isTogglingFreeze}
        onViewDetails={handleViewDetails}
        onEditLimits={(acc) => setEditingLimitAccount(acc)}
        onToggleFreeze={handleToggleFreeze}
      />

      {/* 5. Create Account Modal */}
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* 6. Edit Limits Modal */}
      <CreateAccountModal
        isOpen={Boolean(editingLimitAccount)}
        mode="edit"
        editAccount={editingLimitAccount}
        onClose={() => setEditingLimitAccount(null)}
      />
    </section>
  );
}
