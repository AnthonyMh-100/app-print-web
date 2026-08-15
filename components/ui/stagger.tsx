"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { STAGGER_CONTAINER, EASE } from "@/constants/motion";
import { cn } from "@/utils/cn";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  trigger?: "inView" | "mount";
}

export function Stagger({
  children,
  className,
  once = true,
  trigger = "inView",
}: StaggerProps) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={cn(className)}>{children}</div>;
  }

  if (trigger === "mount") {
    return (
      <motion.div
        initial={{ y: 24, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    );
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