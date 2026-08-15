import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Slot } from "@/components/ui/slot";

type ButtonVariant = "primary" | "outline" | "soft" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-coral text-white shadow-[0_10px_22px_rgba(33,42,58,0.16)] hover:bg-coral-deep",
  outline: "border-[1.5px] border-blue text-blue-deep hover:bg-blue hover:text-white",
  soft: "bg-blue/10 text-blue-deep hover:bg-blue/15",
  ghost: "text-muted hover:bg-canvas hover:text-ink",
  danger: "bg-coral/10 text-coral-deep hover:bg-coral/20",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-5 py-2.5 text-[14px]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  asChild,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-[transform,background-color,border-color,color] duration-200 active:scale-[0.97]",
    VARIANTS[variant],
    SIZES[size],
    className,
  );

  if (asChild) {
    return <Slot className={classes} {...props} />;
  }

  return <button className={classes} {...props} />;
}
