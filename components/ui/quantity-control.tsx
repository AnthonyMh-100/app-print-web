"use client";

import { cn } from "@/utils/cn";

interface QuantityControlProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityControl({
  quantity,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityControlProps) {
  const decrement = () => {
    if (quantity > min) onChange(quantity - 1);
  };
  const increment = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-paper p-0.5",
        className,
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={quantity <= min}
        aria-label="Disminuir cantidad"
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink disabled:pointer-events-none disabled:opacity-40"
      >
        –
      </button>
      <span className="w-6 text-center text-[13px] font-semibold text-ink">
        {quantity}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={quantity >= max}
        aria-label="Aumentar cantidad"
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink disabled:pointer-events-none disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
