"use client";

import { IoMenuOutline } from "react-icons/io5";
import { Avatar } from "@/components/ui/avatar";
import type { BusinessIdentity } from "@/interfaces/admin";

interface AdminTopbarProps {
  title: string;
  business: BusinessIdentity;
  onOpenSidebar: () => void;
}

export function AdminTopbar({ title, business, onOpenSidebar }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur-[6px]">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Abrir menú"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink lg:hidden"
        >
          <IoMenuOutline className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
            Admin / {title}
          </p>
          <h2 className="truncate font-disp text-[17px] font-bold leading-tight text-ink">
            {title}
          </h2>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar src={null} name={business.ownerName ?? business.name} className="h-9 w-9" />
            <div className="hidden leading-tight xl:block">
              <p className="text-[12.5px] font-semibold text-ink">
                {business.ownerName ?? business.name}
              </p>
              <p className="text-[11px] text-muted">Dueño</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
