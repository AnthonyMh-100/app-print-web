"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { User } from "next-auth";
import { IoChevronForwardOutline, IoLogOutOutline } from "react-icons/io5";
import { USER_MENU_LINKS, OWNER_MENU_LINKS } from "@/constants/user-menu";
import { LOGOUT_ACTION_LABEL } from "@/constants/navigation";
import { EASE } from "@/constants/motion";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

const MENU_TRANSITION = { duration: 0.18, ease: EASE };

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggle = () => setIsOpen((current) => !current);
  const close = () => setIsOpen(false);

  const links = user.kind === "owner" ? OWNER_MENU_LINKS : USER_MENU_LINKS;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={user.name ?? "Menú de usuario"}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full p-0 transition-all duration-200",
          isOpen
            ? "bg-canvas/50 shadow-sm"
            : "bg-white hover:bg-canvas",
        )}
      >
        <Avatar
          src={user.image}
          alt={user.name}
          name={user.name}
          className={cn(
            "h-7 w-7 transition-shadow",
            isOpen && "ring-2 ring-blue/20",
          )}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-100"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            initial={
              shouldReduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }
            }
            transition={MENU_TRANSITION}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-full z-120 mt-2 w-64 overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_24px_60px_rgba(33,42,58,0.22)]"
          >
            <div className="flex items-center gap-3 border-b border-line bg-linear-to-b from-canvas/70 to-transparent px-4 py-4">
              <Avatar
                src={user.image}
                alt={user.name}
                name={user.name}
                className="h-11 w-11"
              />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold leading-tight text-ink">
                  {user.name ?? "Usuario"}
                </p>
                {user.username && (
                  <p className="mt-0.5 truncate text-[12px] text-muted">
                    @{user.username}
                  </p>
                )}
                {user.email && (
                  <p className="mt-0.5 truncate text-[11.5px] text-muted/80">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            {links.length > 0 && (
              <nav className="p-2">
                {links.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={close}
                    role="menuitem"
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-ink transition-colors duration-200 hover:bg-canvas/70"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-muted transition-colors duration-200 group-hover:bg-blue/10 group-hover:text-blue">
                      <link.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="truncate">{link.label}</span>
                    <IoChevronForwardOutline
                      className="ml-auto h-3.5 w-3.5 shrink-0 text-muted/50 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            )}

            <div className="border-t border-line p-2">
              <button
                type="button"
                onClick={() => {
                  close();
                  onLogout();
                }}
                role="menuitem"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-coral-deep transition-colors duration-200 hover:bg-coral/5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-coral/10 text-coral-deep">
                  <IoLogOutOutline className="h-4 w-4" aria-hidden="true" />
                </span>
                {LOGOUT_ACTION_LABEL}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
