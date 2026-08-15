"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { User } from "next-auth";
import Link from "next/link";
import { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { AUTH_ACTION_LABEL } from "@/constants/navigation";
import { USER_MENU_LINKS, OWNER_MENU_LINKS } from "@/constants/user-menu";
import { cn } from "@/utils/cn";
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
  const [accountOpen, setAccountOpen] = useState(false);
  const links = user?.kind === "owner" ? OWNER_MENU_LINKS : USER_MENU_LINKS;

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
                <div>
                  <div className="flex items-center justify-between gap-3 px-1 py-3.5">
                    <button
                      type="button"
                      onClick={() => setAccountOpen((current) => !current)}
                      aria-expanded={accountOpen}
                      aria-haspopup="menu"
                      className="group flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas transition-colors duration-200 group-hover:bg-blue/10">
                        <Avatar
                          src={user.image}
                          alt={user.name}
                          name={user.name}
                          className="h-8 w-8"
                        />
                      </span>
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="truncate text-[15px] font-medium text-ink">
                          {user.name ?? user.email ?? "Usuario"}
                        </span>
                        <IoChevronDownOutline
                          className={cn(
                            "h-4 w-4 shrink-0 text-muted transition-transform duration-200",
                            accountOpen && "rotate-180",
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                    <LogoutButton
                      onLogout={() => {
                        onClose();
                        onLogout();
                      }}
                    />
                  </div>
                  <AnimatePresence initial={false}>
                    {accountOpen && links.length > 0 && (
                      <motion.ul
                        role="menu"
                        initial={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={shouldReduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="overflow-hidden pb-1"
                      >
                        {links.map((link) => (
                          <li key={link.id} role="none">
                            <Link
                              href={link.href}
                              role="menuitem"
                              onClick={onClose}
                              className="group flex items-center gap-3 px-1 py-3 text-left text-[15px] font-medium text-ink transition-colors duration-200 hover:text-blue"
                            >
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas text-muted transition-colors duration-200 group-hover:bg-blue/10 group-hover:text-blue">
                                <link.icon className="h-4 w-4" aria-hidden="true" />
                              </span>
                              <span className="truncate">{link.label}</span>
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
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
