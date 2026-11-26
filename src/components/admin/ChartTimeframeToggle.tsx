"use client";

import React from "react";

export type TTimeframe = 7 | 15 | 30;

export interface ITimeframeOption {
  label: string;
  value: TTimeframe;
}

export const DEFAULT_TIMEFRAME_OPTIONS: ITimeframeOption[] = [
  { label: "7 Days", value: 7 },
  { label: "15 Days", value: 15 },
  { label: "30 Days", value: 30 },
];

interface IChartTimeframeToggleProps {
  value: TTimeframe;
  onChange: (value: TTimeframe) => void;
  options?: ITimeframeOption[];
  className?: string;
  size?: "sm" | "xs";
}

export default function ChartTimeframeToggle({
  value,
  onChange,
  options = DEFAULT_TIMEFRAME_OPTIONS,
  className = "",
  size = "xs",
}: IChartTimeframeToggleProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-border/80 bg-card p-0.5 shadow-2xs ${className}`}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full transition-all duration-200 cursor-pointer ${
              size === "xs"
                ? "px-2.5 py-0.5 text-[11px]"
                : "px-3 py-1 text-xs"
            } ${
              active
                ? "bg-blue-500 text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40 font-medium"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
