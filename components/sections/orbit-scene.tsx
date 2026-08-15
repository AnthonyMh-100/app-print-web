"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { BrandMark } from "@/components/header/brand-mark";
import { SATELLITES } from "@/constants/orbit";
import { cn } from "@/utils/cn";
import type { Satellite } from "@/interfaces/orbit";

function GiftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="4" x="3" y="8" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8h-4.5z" />
      <path d="M12 8h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z" />
    </svg>
  );
}

function SatelliteItem({ angle, radius, dot, label, href }: Satellite) {
  const style = { "--angle": angle, "--radius": radius } as CSSProperties;

  return (
    <div className="sat-pivot" style={style}>
      <Link href={href} className="satellite">
        <span className={cn("sat-dot", dot)} />
        {label}
      </Link>
    </div>
  );
}

export function OrbitScene() {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className="orbit-scene"
      animate={shouldReduce ? undefined : { y: [0, -10, 0] }}
      transition={
        shouldReduce
          ? undefined
          : { duration: 7, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-honey/20 blur-3xl"
      />
      <span
        className="dot"
        style={{
          width: 10,
          height: 10,
          background: "var(--color-honey)",
          top: 14,
          right: "8%",
        }}
      />
      <span
        className="dot"
        style={{
          width: 7,
          height: 7,
          background: "#fff",
          opacity: 0.5,
          bottom: 24,
          left: "4%",
        }}
      />
      <div className="orbit-ring orbit-ring-1" />
      <div className="orbit-ring orbit-ring-2" />

      <div className="koala-badge">
        <BrandMark variant="white" />
        <span className="gift-chip">
          <GiftIcon />
        </span>
      </div>

      <motion.div
        className="orbit-group"
        animate={shouldReduce ? undefined : { "--spin": "360deg" }}
        transition={
          shouldReduce
            ? undefined
            : { duration: 20, repeat: Infinity, ease: "linear" }
        }
      >
        {SATELLITES.map((satellite) => (
          <SatelliteItem key={satellite.label} {...satellite} />
        ))}
      </motion.div>
    </motion.div>
  );
}
