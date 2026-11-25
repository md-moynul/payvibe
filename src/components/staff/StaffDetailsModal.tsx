"use client";

import React from "react";
import { Button, Chip, Avatar, AvatarFallback } from "@heroui/react";
import {
  X,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Hash,
  UserCheck,
  KeyRound,
  Pencil,
  BadgeCheck,
} from "lucide-react";
import type { IStaff } from "@/types/staff.type";

interface IStaffDetailsModalProps {
  staff: IStaff | null;
  onClose: () => void;
  onOpenEdit?: (staff: IStaff) => void;
}

export default function StaffDetailsModal({
  staff,
  onClose,
  onOpenEdit,
}: IStaffDetailsModalProps) {
  if (!staff) return null;

  const isActive = staff.status === "Active";
  const isSuspended = staff.status === "Suspended";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg space-y-5 rounded-2xl border border-border bg-background p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Avatar size="lg">
              <AvatarFallback className="text-sm font-bold">
                {staff.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "ST"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">
                  {staff.name}
                </h2>
                {isActive && (
                  <BadgeCheck className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Authorized Bank Operations Staff
              </p>
            </div>
          </div>

          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Close details modal"
            onPress={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Status and Role badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Chip size="sm" variant="soft" color="accent" className="font-medium">
            Role: {staff.role}
          </Chip>
          <Chip
            size="sm"
            variant="soft"
            color={
              isActive
                ? "success"
                : isSuspended
                  ? "danger"
                  : "warning"
            }
            className="font-medium"
          >
            Status: {staff.status}
          </Chip>
        </div>

        {/* Detailed Information Grid */}
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4 text-sm">
          <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2.5">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Work Email
            </span>
            <span className="font-medium text-foreground text-xs sm:text-sm">
              {staff.email}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2.5">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Phone Number
            </span>
            <span className="font-medium text-foreground text-xs sm:text-sm">
              {staff.phone || "Not specified"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-2.5">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Member Since
            </span>
            <span className="font-medium text-foreground text-xs sm:text-sm">
              {staff.createdAt ?? "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              System Staff ID
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {staff.id}
            </span>
          </div>
        </div>

        {/* Operational Authority Scope */}
        <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <KeyRound className="h-3.5 w-3.5 text-primary" />
            <span>Operational Permissions Scope</span>
          </div>
          <ul className="grid grid-cols-1 gap-1 text-xs text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center gap-1.5">
              <UserCheck className="h-3 w-3 text-emerald-500" />
              <span>Customer KYC verification</span>
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>Account registration</span>
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>Ledger & balance inquiry</span>
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>Branch customer support</span>
            </li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {onOpenEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onPress={() => {
                onClose();
                onOpenEdit(staff);
              }}
              className="gap-1.5 font-medium"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Staff Details</span>
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            size="sm"
            onPress={onClose}
            className="font-medium"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
