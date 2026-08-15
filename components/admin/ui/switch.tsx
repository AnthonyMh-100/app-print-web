import { cn } from "@/utils/cn";

interface SwitchProps {
  checked: boolean;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function Switch({ checked, label, disabled, onClick }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
        checked ? "bg-blue" : "bg-line",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-[22px]" : "translate-x-[2px]",
        )}
      />
    </button>
  );
}
