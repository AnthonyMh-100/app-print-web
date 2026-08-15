"use client";

import { useCallback, useEffect, useState } from "react";

interface UseMobileMenu {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useMobileMenu(): UseMobileMenu {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  return { isOpen, open, close, toggle };
}
