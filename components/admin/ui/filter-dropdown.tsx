"use client";

import { useEffect, useRef, useState } from "react";
import { IoChevronDownOutline, IoFilterOutline } from "react-icons/io5";
import type { BadgeTone } from "@/interfaces/admin";
import { BADGE_COLOR_DOTS } from "@/constants/admin";
import { cn } from "@/utils/cn";

export interface FilterOption {
  id: string;
  label: string;
  tone?: BadgeTone;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  selected,
  onChange,
  className,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((selectedId) => selectedId !== id)
        : [...selected, id],
    );
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40 active:scale-[0.97]",
          selected.length > 0
            ? "border-blue bg-[#e6f1fb] text-blue-deep"
            : "border-line bg-paper text-ink hover:border-blue/40",
        )}
      >
        <IoFilterOutline className="h-4 w-4 shrink-0" aria-hidden="true" />
        {label}
        {selected.length > 0 && (
          <span className="rounded-full bg-blue px-1.5 text-[10.5px] font-bold leading-4 text-white">
            {selected.length}
          </span>
        )}
        <IoChevronDownOutline
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-line bg-paper p-2 shadow-[0_16px_40px_rgba(33,42,58,0.16)]"
        >
          <ul className="max-h-72 space-y-0.5 overflow-y-auto">
            {options.map((option) => {
              const checked = selected.includes(option.id);
              const dotColor = option.tone ? BADGE_COLOR_DOTS[option.tone] : undefined;
              return (
                <li key={option.id}>
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(option.id)}
                      className="h-4 w-4 shrink-0 accent-blue"
                    />
                    {dotColor && (
                      <span
                        className={cn("h-2 w-2 shrink-0 rounded-full", dotColor)}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-[13px] font-medium",
                        checked ? "text-ink" : "text-muted",
                      )}
                    >
                      {option.label}
                    </span>
                    {typeof option.count === "number" && (
                      <span className="shrink-0 text-[11px] font-semibold text-muted">
                        {option.count}
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}