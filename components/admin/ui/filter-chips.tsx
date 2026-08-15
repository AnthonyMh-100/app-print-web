"use client";

import { IoCloseOutline } from "react-icons/io5";
import type { BadgeTone } from "@/interfaces/admin";
import { BADGE_COLOR_DOTS } from "@/constants/admin";
import { cn } from "@/utils/cn";

export interface FilterChipItem {
  id: string;
  label: string;
  tone?: BadgeTone;
}

interface FilterChipsProps {
  items: FilterChipItem[];
  onRemove: (id: string) => void;
  onClear?: () => void;
  className?: string;
}

export function FilterChips({ items, onRemove, onClear, className }: FilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas/70 py-1 pl-3 pr-1 text-[12px] font-semibold text-ink"
        >
          {chip.tone && (
            <span
              className={cn("h-1.5 w-1.5 shrink-0 rounded-full", BADGE_COLOR_DOTS[chip.tone])}
              aria-hidden="true"
            />
          )}
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.id)}
            aria-label={`Quitar filtro ${chip.label}`}
            className="flex h-5 w-5 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-paper hover:text-coral-deep"
          >
            <IoCloseOutline className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </span>
      ))}
      {onClear && items.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="text-[12px] font-semibold text-blue-deep transition-colors duration-200 hover:text-blue"
        >
          Limpiar todos
        </button>
      )}
    </div>
  );
}