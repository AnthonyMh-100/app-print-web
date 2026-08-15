"use client";

import { motion, useReducedMotion } from "motion/react";
import type { User } from "next-auth";
import {
  AUTH_ACTION_LABEL,
  CART_ACTION_LABEL,
} from "@/constants/navigation";
import { ACTION_BUTTON_CLASSES } from "@/constants/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import { useCartStore } from "@/lib/cart-store";
import { UserMenu } from "./user-menu";

interface HeaderActionsProps {
  user: User | null;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export function HeaderActions({
  user,
  menuOpen,
  onToggleMenu,
  onOpenAuth,
  onLogout,
}: HeaderActionsProps) {
  const shouldReduce = useReducedMotion();
  const press = shouldReduce ? undefined : { scale: 0.95 };
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const openCart = useCartStore((state) => state.openCart);

  return (
    <div className="flex items-center gap-2 min-[560px]:gap-3.5">
      <div className="hidden nav:flex">
        {user ? (
          <UserMenu user={user} onLogout={onLogout} />
        ) : (
          <motion.button
            type="button"
            whileTap={press}
            onClick={onOpenAuth}
            className={ACTION_BUTTON_CLASSES}
            aria-label={AUTH_ACTION_LABEL}
          >
            <Icon name="user" width={16} height={16} />
            <span className="hidden min-[560px]:inline">
              {AUTH_ACTION_LABEL}
            </span>
          </motion.button>
        )}
      </div>

      <motion.button
        type="button"
        whileTap={press}
        onClick={openCart}
        className={ACTION_BUTTON_CLASSES}
        aria-label={CART_ACTION_LABEL}
      >
        <Icon name="cart" width={16} height={16} />
        <span
          className={cn(
            "flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-coral px-1 text-[11px] font-bold text-white",
            cartCount === 0 && "bg-line text-muted",
          )}
        >
          {cartCount}
        </span>
      </motion.button>

      <motion.button
        type="button"
        whileTap={shouldReduce ? undefined : { scale: 0.9 }}
        onClick={onToggleMenu}
        className="flex h-4.5 w-6 flex-col justify-between nav:hidden"
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <span
          className={cn(
            "h-0.5 w-full rounded-full bg-ink transition-transform duration-300 ease-out",
            menuOpen && "translate-y-2 rotate-45",
          )}
        />
        <span
          className={cn(
            "h-0.5 w-full rounded-full bg-ink transition-opacity duration-200",
            menuOpen && "opacity-0",
          )}
        />
        <span
          className={cn(
            "h-0.5 w-full rounded-full bg-ink transition-transform duration-300 ease-out",
            menuOpen && "-translate-y-2 -rotate-45",
          )}
        />
      </motion.button>
    </div>
  );
}
