"use client";

import { useMemo, useState } from "react";
import { toast } from "@heroui/react";
import type { IStaff } from "@/types/staff.type";
import StaffHeader from "./StaffHeader";
import StaffStatsGrid from "./StaffStatsGrid";
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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "suspended"
  >("all");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<IStaff | null>(null);
  const [viewingStaff, setViewingStaff] = useState<IStaff | null>(null);

  const rawRole = useAppSelector(selectUserRole);
  const { canManageStaff } = getRoleAccess(rawRole);

  const { data, isLoading, isError } = useGetStaffListQuery();
  const [updateStaff, { isLoading: isUpdatingStaff }] =
    useUpdateStaffMutation();

  const staffList = useMemo(() => data?.data ?? [], [data?.data]);

  const filteredStaff = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return staffList.filter((staff) => {
      if (statusFilter === "active" && staff.status !== "Active") return false;
      if (statusFilter === "suspended" && staff.status !== "Suspended")
        return false;

      if (!q) return true;
      return (
        staff.name.toLowerCase().includes(q) ||
        staff.email.toLowerCase().includes(q) ||
        (staff.phone ?? "").toLowerCase().includes(q)
      );
    });
  }, [staffList, searchQuery, statusFilter]);

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
    } catch (error) {
      console.error("Failed to update staff status:", error);
      toast.danger("Failed to update staff status");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Loading bank staff...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-sm text-rose-500">
        Failed to load bank staff.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <StaffHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenCreateModal={handleOpenCreateModal}
        canManageStaff={canManageStaff}
      />

      <StaffStatsGrid staffList={staffList} />

      <StaffTable
        staffList={filteredStaff}
        onViewStaff={handleViewStaff}
        onEditStaff={handleEditStaff}
        onToggleStaffStatus={handleToggleStaffStatus}
        isUpdatingStatus={isUpdatingStaff}
      />

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
