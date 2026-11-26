"use client";

import React from "react";
import { Chip } from "@heroui/react";

interface IRequestHeaderProps {
  title: string;
  subtitle: string;
  portalBadge?: string;
  pendingCount: number;
  approvedCount?: number;
}

export default function RequestHeader({
  title,
  subtitle,
  portalBadge = "Review Portal",
  pendingCount,
  approvedCount,
}: IRequestHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <Chip
            size="sm"
            variant="soft"
            color="accent"
            className="font-semibold text-xs"
          >
            {portalBadge}
          </Chip>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip
          size="sm"
          variant="soft"
          color={pendingCount > 0 ? "warning" : "success"}
          className="font-medium text-xs"
        >
          {pendingCount} Pending Review
        </Chip>

        {typeof approvedCount === "number" && (
          <Chip
            size="sm"
            variant="soft"
            color="success"
            className="font-medium text-xs"
          >
            {approvedCount} Approved
          </Chip>
        )}
      </div>
    </div>
  );
}
