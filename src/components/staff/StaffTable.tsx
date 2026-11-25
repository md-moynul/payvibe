"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Chip,
  Avatar,
  AvatarFallback,
  Spinner,
} from "@heroui/react";
import {
  Mail,
  Phone,
  Eye,
  Pencil,
  Ban,
  CheckCircle2,
  Calendar,
  Users,
} from "lucide-react";
import type { IStaff } from "@/types/staff.type";

interface IStaffTableProps {
  staffList: IStaff[];
  isLoading?: boolean;
  onViewStaff: (staff: IStaff) => void;
  onEditStaff: (staff: IStaff) => void;
  onToggleStaffStatus: (staff: IStaff) => void;
  isUpdatingStatus?: boolean;
}

export default function StaffTable({
  staffList,
  isLoading = false,
  onViewStaff,
  onEditStaff,
  onToggleStaffStatus,
  isUpdatingStatus = false,
}: IStaffTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 p-5">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Bank Staff Personnel Directory
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Operational personnel authorized with the bank-staff role
          </CardDescription>
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          Showing <span className="font-bold text-foreground">{staffList.length}</span> members
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center text-sm text-muted-foreground">
            <Spinner size="md" color="current" />
            <span>Loading bank staff records...</span>
          </div>
        ) : staffList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-center">
            <div className="rounded-2xl bg-muted/50 p-4 text-muted-foreground">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                No bank staff found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No staff members match the current search or status filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Staff Member</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Access Role</th>
                  <th className="px-5 py-3.5">Account Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {staffList.map((staff) => {
                  const isActive = staff.status === "Active";
                  const isSuspended = staff.status === "Suspended";

                  return (
                    <tr
                      key={staff.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      {/* Name & Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar size="sm">
                            <AvatarFallback className="font-semibold text-xs">
                              {staff.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "ST"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground leading-snug">
                              {staff.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                              <Calendar className="h-3 w-3" />
                              <span>Joined {staff.createdAt ?? "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{staff.email}</span>
                          </div>
                          {staff.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5" />
                              <span>{staff.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <Chip
                          size="sm"
                          variant="soft"
                          color="accent"
                          className="font-medium text-xs"
                        >
                          {staff.role}
                        </Chip>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
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
                          className="font-medium text-xs"
                        >
                          {staff.status}
                        </Chip>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1 text-xs font-medium"
                            onPress={() => onViewStaff(staff)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Details</span>
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1 text-xs font-medium"
                            onPress={() => onEditStaff(staff)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            isDisabled={isUpdatingStatus}
                            className={`h-8 gap-1 text-xs font-medium ${
                              isActive
                                ? "text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                                : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                            }`}
                            onPress={() => onToggleStaffStatus(staff)}
                          >
                            {isActive ? (
                              <>
                                <Ban className="h-3.5 w-3.5" />
                                <span>Suspend</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Activate</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
