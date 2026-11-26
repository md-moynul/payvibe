"use client";

import { useMemo, useState } from "react";
import { toast } from "@heroui/react";
import type { IStaff } from "@/types/staff.type";
import StaffHeader from "./StaffHeader";
import StaffStatsGrid from "./StaffStatsGrid";
import StaffFilters from "./StaffFilters";
import StaffTable from "./StaffTable";
import StaffFormModal from "./StaffFormModal";
import StaffDetailsModal from "./StaffDetailsModal";
import {
  useGetStaffListQuery,
  useUpdateStaffMutation,
} from "@/redux/features/staff";
import { useAppSelector } from "@/redux/hook";
import { selectUserRole } from "@/redux/features/auth";
import { getRoleAccess } from "@/lib/role.helper";

export default function StaffView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<IStaff | null>(null);
  const [viewingStaff, setViewingStaff] = useState<IStaff | null>(null);

  const rawRole = useAppSelector(selectUserRole);
  const { canManageStaff } = getRoleAccess(rawRole);

  const { data, isLoading, isError, refetch } = useGetStaffListQuery();
  const [updateStaff, { isLoading: isUpdatingStaff }] =
    useUpdateStaffMutation();

  const staffList = useMemo(() => data?.data ?? [], [data?.data]);

  const filteredStaff = useMemo(() => {
    const list = staffList.filter((staff) => {
      // Status Filter
      if (statusFilter !== "all" && staff.status !== statusFilter) {
        return false;
      }

      // Role Filter
      if (roleFilter !== "all" && staff.role !== roleFilter) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = staff.name.toLowerCase().includes(q);
        const matchEmail = staff.email.toLowerCase().includes(q);
        const matchPhone = (staff.phone ?? "").toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return list.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
        );
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  }, [staffList, searchQuery, sortBy, statusFilter, roleFilter]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    sortBy !== "newest" ||
    statusFilter !== "all" ||
    roleFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    setStatusFilter("all");
    setRoleFilter("all");
  };

  const handleOpenCreateModal = () => {
    setEditingStaff(null);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingStaff(null);
  };

  const handleViewStaff = (staff: IStaff) => {
    setViewingStaff(staff);
  };

  const handleEditStaff = (staff: IStaff) => {
    setEditingStaff(staff);
    setIsFormModalOpen(true);
  };

  const handleToggleStaffStatus = async (staff: IStaff) => {
    if (isUpdatingStaff) return;

    const nextStatus = staff.status === "Active" ? "Suspended" : "Active";

    try {
      await updateStaff({
        id: staff.id,
        status: nextStatus,
      }).unwrap();

      toast.success(
        nextStatus === "Suspended"
          ? "Staff suspended successfully"
          : "Staff activated successfully",
      );
      await refetch();
    } catch (error) {
      console.error("Failed to update staff status:", error);
      toast.danger("Failed to update staff status");
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Page Header */}
      <StaffHeader
        onOpenCreateModal={handleOpenCreateModal}
        onRefresh={() => refetch()}
        isLoading={isLoading}
        canManageStaff={canManageStaff}
      />

      {/* 2. Modern 4-Card Metrics Grid */}
      <StaffStatsGrid staffList={staffList} isLoading={isLoading} />

      {/* 3. Dedicated Compact Filter Bar */}
      <StaffFilters
        search={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredStaff.length}
      />

      {/* 4. Staff Data Table */}
      {isError ? (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-sm text-rose-600 dark:text-rose-400">
          Failed to load bank staff. Please verify session permissions.
        </div>
      ) : (
        <StaffTable
          staffList={filteredStaff}
          isLoading={isLoading}
          onViewStaff={handleViewStaff}
          onEditStaff={handleEditStaff}
          onToggleStaffStatus={handleToggleStaffStatus}
          isUpdatingStatus={isUpdatingStaff}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* Modals */}
      <StaffFormModal
        isOpen={isFormModalOpen}
        editingStaff={editingStaff}
        onClose={handleCloseFormModal}
      />

      <StaffDetailsModal
        staff={viewingStaff}
        onClose={() => setViewingStaff(null)}
      />
    </section>
  );
}
