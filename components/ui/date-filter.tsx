"use client";

import { IoCalendarOutline } from "react-icons/io5";

interface DateFilterProps {
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}

export function DateFilter({ label, value, min, max, onChange }: DateFilterProps) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="relative">
        <IoCalendarOutline
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="date"
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-full border border-line bg-paper py-2 pl-9 pr-4 text-[13.5px] text-ink transition-[border-color,box-shadow] focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10"
        />
      </span>
    </label>
  );
}