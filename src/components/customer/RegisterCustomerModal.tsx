"use client";

import React, { useState } from "react";
import { Button, Spinner, toast } from "@heroui/react";
import { X, UserPlus } from "lucide-react";
import type { IDummyCustomer } from "./CustomerStatsGrid";
import {
  useRegisterCustomerMutation,
  addCustomer,
  setCustomerError,
} from "@/redux/features/customer";
import { useAppDispatch } from "@/redux/hook";

interface IRegisterCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer?: (newCustomer: IDummyCustomer) => void;
}

export default function RegisterCustomerModal({
  isOpen,
  onClose,
  onAddCustomer,
}: IRegisterCustomerModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const [registerCustomer, { isLoading }] = useRegisterCustomerMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    dispatch(setCustomerError(null));

    try {
      const response = await registerCustomer({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        pin: pin.trim(),
      }).unwrap();

      const createdCustomer: IDummyCustomer = response.data;

      dispatch(addCustomer(createdCustomer));
      onAddCustomer?.(createdCustomer);

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setPin("");
      setShowPassword(false);
      setShowPin(false);
      toast.success("Customer registered successfully");
      onClose();
    } catch (err: unknown) {
      const apiError = err as { data?: { message?: string }; message?: string };
      const message =
        apiError?.data?.message ||
        apiError?.message ||
        "Failed to register customer.";
      setErrorMsg(message);
      toast.danger(message);
      dispatch(setCustomerError(message));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Register New Customer
            </h2>
            <p className="text-xs text-muted-foreground">
              Create a customer profile before opening a bank account.
            </p>
          </div>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Close modal"
            onPress={onClose}
            isDisabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
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
              placeholder="e.g., Tanvir Ahmed"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tanvir@example.com"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1711-000000"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Temporary Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Transaction PIN
                </label>
                <button
                  type="button"
                  onClick={() => setShowPin((prev) => !prev)}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  {showPin ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPin ? "text" : "password"}
                required
                minLength={4}
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="4-6 digits"
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onPress={onClose}
              isDisabled={isLoading}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isDisabled={isLoading}
              className="font-medium gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" color="current" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Save Customer</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}