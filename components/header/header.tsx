"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "next-auth";
import { logoutUser } from "@/actions/action-auth";
import { Ribbon } from "@/components/ui/ribbon";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { AuthModal } from "@/components/auth/auth-modal";
import { HeaderActions } from "./header-actions";
import { HeaderLogo } from "./header-logo";
import { MobileMenu } from "./mobile-menu";

interface HeaderProps {
  user: User | null;
  brandName?: string;
}

export function Header({ user, brandName }: HeaderProps) {
  const { isOpen, toggle, close } = useMobileMenu();
  const [authOpen, setAuthOpen] = useState(false);
  const router = useRouter();

  const openAuth = () => setAuthOpen(true);

  const handleLogout = async () => {
    await logoutUser();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/94 backdrop-blur-[6px]">
      <div className="mx-auto flex w-full max-w-295 flex-wrap items-center justify-between px-5 py-3.5">
        <HeaderLogo brandName={brandName} />
        <HeaderActions
          user={user}
          menuOpen={isOpen}
          onToggleMenu={toggle}
          onOpenAuth={openAuth}
          onLogout={handleLogout}
        />
      </div>
      <Ribbon />
      <MobileMenu
        user={user}
        isOpen={isOpen}
        onClose={close}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
      />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}
