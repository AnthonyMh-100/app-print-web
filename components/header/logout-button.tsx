"use client";

import { motion, useReducedMotion } from "motion/react";
import { IoLogOutOutline } from "react-icons/io5";
import { LOGOUT_ACTION_LABEL } from "@/constants/navigation";
import { cn } from "@/utils/cn";

interface LogoutButtonProps {
  onLogout: () => void;
  className?: string;
}

export function LogoutButton({ onLogout, className }: LogoutButtonProps) {
  const shouldReduce = useReducedMotion();
  const press = shouldReduce ? undefined : { scale: 0.95 };

  return (
    <motion.button
      type="button"
      whileTap={press}
      onClick={onLogout}
      aria-label={LOGOUT_ACTION_LABEL}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-line px-2.5 py-2 text-[12.5px] font-medium text-ink transition-colors duration-200 hover:border-coral hover:bg-coral/5 hover:text-coral min-[560px]:px-3",
        className,
      )}
    >
      <IoLogOutOutline size={15} aria-hidden="true" />
      <span className="hidden min-[1152px]:inline">{LOGOUT_ACTION_LABEL}</span>
    </motion.button>
  );
}
