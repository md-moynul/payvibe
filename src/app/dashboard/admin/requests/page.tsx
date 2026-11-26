"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
  toast,
} from "@heroui/react";
import RequestHeader from "@/components/request/RequestHeader";
import RequestStatsGrid from "@/components/request/RequestStatsGrid";
import RequestFilters from "@/components/request/RequestFilters";
import RequestsTable from "@/components/request/RequestsTable";
import RejectRequestModal from "@/components/request/RejectRequestModal";
import {
  useGetRequestsQuery,
  useDecideRequestMutation,
} from "@/redux/features/request/request.api";
import type { IDepositWithdrawalRequest } from "@/types/request.type";

export default function AdminRequestsPage() {
  const [requestToReject, setRequestToReject] =
    useState<IDepositWithdrawalRequest | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data, isLoading, isError, refetch } = useGetRequestsQuery();
  const [decideRequest, { isLoading: isDeciding }] = useDecideRequestMutation();

  const requests = useMemo(() => data?.data ?? [], [data]);

  // Metric counts
  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === "Pending").length,
    [requests],
  );
  const approvedCount = useMemo(
    () => requests.filter((r) => r.status === "Approved").length,
    [requests],
  );
  const depositCount = useMemo(
    () => requests.filter((r) => r.type === "Deposit").length,
    [requests],
  );
  const withdrawalCount = useMemo(
    () => requests.filter((r) => r.type === "Withdrawal").length,
    [requests],
  );

  // Filtered requests for the table
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (typeFilter !== "ALL" && r.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchName = (r.customerName || "").toLowerCase().includes(q);
        const matchEmail = (r.customerEmail || "").toLowerCase().includes(q);
        const matchAcc = (r.accountNumber || "").toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchAcc) return false;
      }
      return true;
    });
  }, [requests, typeFilter, statusFilter, search]);

  const hasActiveFilters =
    Boolean(search) || typeFilter !== "ALL" || statusFilter !== "ALL";

  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
  };

  const handleApprove = async (item: IDepositWithdrawalRequest) => {
    if (isDeciding) return;
    try {
      const res = await decideRequest({
        id: item.id,
        status: "Approved",
      }).unwrap();
      toast.success(res.message || `${item.type} request approved.`);
      await refetch();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to approve request.";
      toast.danger(message);
    }
  };

  const handleConfirmReject = async ({
    id,
    rejectionReason,
  }: {
    id: string;
    rejectionReason: string;
  }) => {
    if (isDeciding) return;
    try {
      const res = await decideRequest({
        id,
        status: "Rejected",
        rejectionReason,
      }).unwrap();
      toast.success(res.message || "Request rejected.");
      setRequestToReject(null);
      await refetch();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to reject request.";
      toast.danger(message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Reusable Header */}
      <RequestHeader
        title="Admin Deposit & Withdrawal Approvals"
        subtitle="Oversee all customer deposit and withdrawal requests and approve or reject pending items."
        portalBadge="Admin Portal"
        pendingCount={pendingCount}
        approvedCount={approvedCount}
      />

      {/* Reusable 4-Card Summary Grid with Approved metric */}
      <RequestStatsGrid
        pendingCount={pendingCount}
        depositCount={depositCount}
        withdrawalCount={withdrawalCount}
        approvedCount={approvedCount}
        showApproved
      />

      {/* Reusable Search & Filter Controls */}
      <RequestFilters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredRequests.length}
      />

      {/* Requests Table */}
      {isLoading ? (
        <Card className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
          <Spinner size="md" color="accent" />
          <span className="text-sm text-muted-foreground">
            Loading requests...
          </span>
        </Card>
      ) : isError ? (
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>Failed to load requests</AlertTitle>
            <AlertDescription>
              Please verify your Admin session permissions.
            </AlertDescription>
          </AlertContent>
        </Alert>
      ) : (
        <RequestsTable
          requests={filteredRequests}
          showCustomer
          canDecide
          isProcessing={isDeciding}
          onApprove={handleApprove}
          onReject={(item) => setRequestToReject(item)}
        />
      )}

      {/* Reject Modal */}
      <RejectRequestModal
        requestItem={requestToReject}
        isSubmitting={isDeciding}
        onClose={() => setRequestToReject(null)}
        onConfirmReject={handleConfirmReject}
      />
    </div>
  );
}
