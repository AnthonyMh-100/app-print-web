import { IoRefreshOutline } from "react-icons/io5";
import { cn } from "@/utils/cn";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <IoRefreshOutline
      aria-hidden="true"
      className={cn("animate-spin", className)}
    />
  );
}