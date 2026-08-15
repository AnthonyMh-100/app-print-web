"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { STAGGER_ITEM } from "@/constants/motion";
import { cn } from "@/utils/cn";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={STAGGER_ITEM} className={cn(className)}>
      {children}
    </motion.div>
  );
}
