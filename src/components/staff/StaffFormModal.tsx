"use client";

import React, { useState } from "react";
import {
  Button,
  Spinner,
  Alert,
  AlertIndicator,
  AlertContent,
  AlertTitle,
  toast,
} from "@heroui/react";
import { X, UserPlus, Save } from "lucide-react";
import type { IStaff, TStaffStatus } from "@/types/staff.type";
import {
  useCreateStaffMutation,
  useUpdateStaffMutation,
} from "@/redux/features/staff";

interface IStaffFormModalProps {
  isOpen: boolean;
  editingStaff?: IStaff | null;
  onClose: () => void;
  onCreated?: (newStaff: IStaff) => void;
  onUpdated?: (updatedStaff: IStaff) => void;
}

interface IStaffFormInnerProps {
  editingStaff?: IStaff | null;
  onClose: () => void;
  onCreated?: (newStaff: IStaff) => void;
  onUpdated?: (updatedStaff: IStaff) => void;
}

function getApiErrorMessage(err: unknown, fallback: string): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "data" in err &&
    typeof (err as { data?: { message?: unknown } }).data?.message === "string"
  ) {
    return (err as { data: { message: string } }).data.message;
  }
  return err instanceof Error ? err.message : fallback;
}

function StaffFormInner({
  editingStaff,
  onClose,
  onCreated,
  onUpdated,
}: IStaffFormInnerProps) {
  const isEditMode = Boolean(editingStaff);

  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();

  const [name, setName] = useState(editingStaff?.name ?? "");
  const [email, setEmail] = useState(editingStaff?.email ?? "");
  const [phone, setPhone] = useState(editingStaff?.phone ?? "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<TStaffStatus>(
    editingStaff?.status ?? "Active",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isBusy = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setErrorMsg("Full name is required.");
      return;
    }

    if (isEditMode && editingStaff) {
      try {
        const response = await updateStaff({
          id: editingStaff.id,
          name: trimmedName,
          phone: trimmedPhone,
          status,
        }).unwrap();

        onUpdated?.(response.data);
        toast.success(response.message || "Staff details updated successfully");
        onClose();
      } catch (err: unknown) {
        setErrorMsg(getApiErrorMessage(err, "Failed to update staff details."));
      }
      return;
    }

    if (!trimmedEmail || password.length < 6) {
      setErrorMsg("Please provide valid email and password (min 6 chars).");
      return;
    }

    try {
      const response = await createStaff({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password,
        role: "bank-staff",
      }).unwrap();

      onCreated?.(response.data);
      toast.success(response.message || "Bank staff created successfully");
      onClose();
    } catch (err: unknown) {
      setErrorMsg(getApiErrorMessage(err, "Failed to create bank staff."));
    }
  };

  return (
    <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-background p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {isEditMode ? "Edit Bank Staff" : "Add Bank Staff"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isEditMode
              ? `Update profile info or access status for ${editingStaff?.email}`
              : "Create a new staff account with bank-staff role access."}
          </p>
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          aria-label="Close modal"
          onPress={onClose}
          isDisabled={isBusy}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {errorMsg && (
        <Alert status="danger">
          <AlertIndicator />
          <AlertContent>
            <AlertTitle>{errorMsg}</AlertTitle>
          </AlertContent>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., moynul islam"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">
            Work Email
          </label>
          <input
            type="email"
            required
            disabled={isEditMode}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@payvibe.com"
            className={`w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary ${
              isEditMode ? "cursor-not-allowed opacity-60" : ""
            }`}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880 1700-000000"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {!isEditMode ? (
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Initial Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TStaffStatus)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onPress={onClose}
            isDisabled={isBusy}
            className="font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isDisabled={isBusy}
            className="gap-2 font-medium"
          >
            {isBusy ? (
              <>
                <Spinner size="sm" color="current" />
                <span>{isEditMode ? "Saving..." : "Creating..."}</span>
              </>
            ) : isEditMode ? (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Create Staff</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function StaffFormModal({
  isOpen,
  editingStaff,
  onClose,
  onCreated,
  onUpdated,
}: IStaffFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <StaffFormInner
        key={editingStaff?.id ?? "create-staff"}
        editingStaff={editingStaff}
        onClose={onClose}
        onCreated={onCreated}
        onUpdated={onUpdated}
      />
    </div>
  );
}