"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { User } from "next-auth";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { AUTH_ACTION_LABEL } from "@/constants/navigation";
import {
  ITEM_VARIANTS,
  LIST_VARIANTS,
  MOBILE_MENU_TRANSITION,
} from "@/constants/motion";
import { LogoutButton } from "./logout-button";

interface MobileMenuProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export function MobileMenu({
  user,
  isOpen,
  onClose,
  onOpenAuth,
  onLogout,
}: MobileMenuProps) {
  const shouldReduce = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          id="mobile-menu"
          key="mobile-menu"
          aria-label="Menú móvil"
          initial={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={
            shouldReduce ? { duration: 0.15 } : MOBILE_MENU_TRANSITION
          }
          className="overflow-hidden border-b border-line bg-paper nav:hidden"
        >
          <motion.ul
            variants={shouldReduce ? undefined : LIST_VARIANTS}
            initial={shouldReduce ? undefined : "hidden"}
            animate={shouldReduce ? undefined : "visible"}
            className="divide-y divide-line px-7 py-1"
          >
            <motion.li variants={shouldReduce ? undefined : ITEM_VARIANTS}>
              {user ? (
                <div className="flex items-center justify-between gap-3 px-1 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar
                      src={user.image}
                      alt={user.name}
                      name={user.name}
                      className="h-8 w-8"
                    />
                    <span className="truncate text-[15px] font-medium text-ink">
                      {user.name ?? user.email ?? "Usuario"}
                    </span>
                  </div>
                  <LogoutButton
                    onLogout={() => {
                      onClose();
                      onLogout();
                    }}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="group flex w-full items-center gap-3 px-1 py-3.5 text-left text-[15px] font-medium text-ink transition-colors duration-200 hover:text-blue"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue/10 transition-colors duration-200 group-hover:bg-blue/15">
                    <Icon
                      name="user"
                      width={16}
                      height={16}
                      className="h-4 w-4 text-blue transition-colors duration-200"
                    />
                  </span>
                  {AUTH_ACTION_LABEL}
                </button>
              )}
            </motion.li>
          </motion.ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
