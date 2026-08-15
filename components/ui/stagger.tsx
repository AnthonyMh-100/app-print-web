"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { STAGGER_CONTAINER } from "@/constants/motion";
import { cn } from "@/utils/cn";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
}

export function Stagger({ children, className, once = true }: StaggerProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
