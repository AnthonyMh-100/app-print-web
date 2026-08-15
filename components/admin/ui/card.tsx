import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-paper shadow-[0_4px_16px_rgba(33,42,58,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4",
        className,
      )}
    >
      <div>
        <h3 className="font-disp text-[16px] font-semibold leading-tight text-ink">{title}</h3>
        {description && <p className="mt-0.5 text-[12.5px] text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
