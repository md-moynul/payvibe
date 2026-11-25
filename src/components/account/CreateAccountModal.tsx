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
import { X, Landmark, Save } from "lucide-react";
import type { IAccount, TAccountType } from "@/types/account.type";
import {
  useCreateAccountMutation,
  useUpdateAccountLimitsMutation,
} from "@/redux/features/account";

interface ICreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  defaultEmail?: string;
  defaultCustomerId?: string;
  editAccount?: (IAccount & { ownerEmail?: string }) | null;
  onSuccess?: () => void;
}

interface IAccountFormInnerProps {
  onClose: () => void;
  mode: "create" | "edit";
  defaultEmail: string;
  defaultCustomerId: string;
  editAccount: (IAccount & { ownerEmail?: string }) | null;
  onSuccess?: () => void;
}

function AccountFormInner({
  onClose,
  mode,
  defaultEmail,
  defaultCustomerId,
  editAccount,
  onSuccess,
}: IAccountFormInnerProps) {
  const isEditMode = mode === "edit" && Boolean(editAccount);

  const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();
  const [updateAccountLimits, { isLoading: isUpdatingLimits }] =
    useUpdateAccountLimitsMutation();

  const submitting = isCreating || isUpdatingLimits;

  const [ownerEmail, setOwnerEmail] = useState(
    editAccount?.ownerEmail ?? defaultEmail,
  );
  const [accountType, setAccountType] = useState<TAccountType>(
    editAccount?.accountType ?? "Savings Account",
  );
  const [initialBalance, setInitialBalance] = useState(
    editAccount ? String(editAccount.balance) : "1000",
  );
  const [minBalance, setMinBalance] = useState(
    editAccount?.minBalance ? String(editAccount.minBalance) : "500",
  );
  const [dailyLimit, setDailyLimit] = useState(
    editAccount?.dailyLimit ? String(editAccount.dailyLimit) : "50000",
  );
  const [maxSingleTransaction, setMaxSingleTransaction] = useState(
    editAccount?.maxSingleTransaction
      ? String(editAccount.maxSingleTransaction)
      : "25000",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      if (isEditMode && editAccount) {
        await updateAccountLimits({
          id: editAccount.id,
          minBalance: Number(minBalance),
          dailyLimit: Number(dailyLimit),
          maxSingleTransaction: Number(maxSingleTransaction),
        }).unwrap();
      } else {
        await createAccount({
          ...(defaultCustomerId ? { customerId: defaultCustomerId } : {}),
          ownerEmail: ownerEmail.trim().toLowerCase(),
          accountType,
          initialBalance: Number(initialBalance),
          minBalance: Number(minBalance),
          dailyLimit: Number(dailyLimit),
          maxSingleTransaction: Number(maxSingleTransaction),
        }).unwrap();
      }

      onSuccess?.();
      toast.success(
        isEditMode
          ? "Account limits updated successfully"
          : "Bank account created successfully",
      );
      onClose();
    } catch (err: unknown) {
      const apiMessage =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: { message?: unknown } }).data?.message ===
          "string"
          ? (err as { data: { message: string } }).data.message
          : null;

      const message =
        apiMessage ||
        (err instanceof Error ? err.message : "Something went wrong.");
      setErrorMsg(message);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {isEditMode ? "Update Account Limits" : "Create Bank Account"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isEditMode
              ? `Updating limits for ${editAccount?.accountNumber ?? ""}`
              : "Open a new bank account for a registered customer."}
          </p>
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          aria-label="Close modal"
          onPress={onClose}
          isDisabled={submitting}
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
            Customer Email
          </label>
          <input
            type="email"
            required
            disabled={isEditMode}
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            placeholder="customer@example.com"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground">
            Account Type
          </label>
          <select
            disabled={isEditMode}
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as TAccountType)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="Savings Account">Savings Account</option>
            <option value="Current Account">Current Account</option>
            <option value="Business Account">Business Account</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              {isEditMode ? "Current Balance (৳)" : "Initial Balance (৳)"}
            </label>
            <input
              type="number"
              min={0}
              required
              disabled={isEditMode}
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Minimum Balance (৳)
            </label>
            <input
              type="number"
              min={0}
              required
              value={minBalance}
              onChange={(e) => setMinBalance(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Daily Limit (৳)
            </label>
            <input
              type="number"
              min={100}
              required
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Max Single Txn (৳)
            </label>
            <input
              type="number"
              min={100}
              required
              value={maxSingleTransaction}
              onChange={(e) => setMaxSingleTransaction(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onPress={onClose}
            isDisabled={submitting}
            className="font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isDisabled={submitting}
            className="font-medium gap-2"
          >
            {submitting ? (
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
                <Landmark className="h-4 w-4" />
                <span>Create Account</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function CreateAccountModal({
  isOpen,
  onClose,
  mode = "create",
  defaultEmail = "",
  defaultCustomerId = "",
  editAccount = null,
  onSuccess,
}: ICreateAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <AccountFormInner
        key={editAccount ? `edit-${editAccount.id}` : "new"}
        onClose={onClose}
        mode={mode}
        defaultEmail={defaultEmail}
        defaultCustomerId={defaultCustomerId}
        editAccount={editAccount}
        onSuccess={onSuccess}
      />
    </div>
  );
}