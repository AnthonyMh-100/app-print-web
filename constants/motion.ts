import type { Variants } from "motion/react";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const MOBILE_MENU_TRANSITION = {
  duration: 0.3,
  ease: EASE,
} as const;

export const LIST_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.06 },
  },
};

export const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 1, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: EASE } },
};

export const REVEAL_TRANSITION = {
  duration: 0.6,
  ease: EASE,
} as const;

export const STAGGER_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

export const STAGGER_ITEM: Variants = {
  hidden: { opacity: 1, y: 28 },
  visible: { opacity: 1, y: 0, transition: REVEAL_TRANSITION },
};
