"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { REVEAL_TRANSITION } from "@/constants/motion";
import { cn } from "@/utils/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function Reveal({ children, className, delay = 0, once = true }: RevealProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 1, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ ...REVEAL_TRANSITION, delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
