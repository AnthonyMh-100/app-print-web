import type { IconType } from "react-icons";
import type { BadgeTone } from "@/interfaces/admin";
import { cn } from "@/utils/cn";
import { Card } from "./card";

const CHIP_TONES: Record<BadgeTone, string> = {
  blue: "bg-[#e6f1fb] text-[#0c447c]",
  honey: "bg-[#fff3dd] text-[#854f0b]",
  pink: "bg-[#fde5ee] text-[#8f1f4d]",
  turquoise: "bg-[#ddf6f3] text-[#0b6e63]",
  coral: "bg-[#ffedea] text-[#c8432c]",
  ink: "bg-ink text-white",
  neutral: "bg-canvas text-muted",
};

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  icon: IconType;
  tone: BadgeTone;
}

export function StatCard({ label, value, delta, icon: Icon, tone }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-muted">
            {label}
          </p>
          <p className="mt-1.5 truncate font-disp text-[24px] font-bold leading-none text-ink">
            {value}
          </p>
          {delta && <p className="mt-2 text-[12px] text-muted">{delta}</p>}
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            CHIP_TONES[tone],
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}
