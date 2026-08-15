"use client";

import { IoLogOutOutline, IoStorefrontOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ADMIN_NAV } from "@/constants/admin";
import type {
  AdminNavItem,
  AdminSectionId,
  BusinessIdentity,
} from "@/interfaces/admin";
import { logoutUser } from "@/actions/action-auth";
import { cn } from "@/utils/cn";
import { Avatar } from "@/components/ui/avatar";
import { BrandMark } from "@/components/header/brand-mark";

interface AdminSidebarProps {
  business: BusinessIdentity;
  activeId: AdminSectionId;
  isOpen: boolean;
  onClose: () => void;
}

function NavItem({
  item,
  active,
  onNavigate,
}: {
  item: AdminNavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors duration-200",
        active
          ? "bg-[#e6f1fb] text-blue-deep"
          : "text-muted hover:bg-canvas hover:text-ink",
      )}
    >
      <Icon
        className={cn(
          "h-4.5 w-4.5 shrink-0",
          active ? "text-blue" : "text-muted group-hover:text-ink",
        )}
        aria-hidden="true"
      />
      {item.label}
      {active && (
        <span
          className="ml-auto h-2 w-2 rounded-full bg-blue"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

export function AdminSidebar({
  business,
  activeId,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-paper transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
          <BrandMark size={36} />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-disp text-[16px] font-bold text-blue-deep">
              {business.name}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
              Panel admin
            </p>
          </div>
        </div>

        <nav
          className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
          aria-label="Navegación admin"
        >
          <p className="px-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted">
            Contenido
          </p>
          {ADMIN_NAV.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={activeId === item.id}
              onNavigate={onClose}
            />
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted transition-colors duration-200 hover:bg-canvas hover:text-ink"
          >
            <IoStorefrontOutline className="h-4.5 w-4.5" aria-hidden="true" />
            Ver tienda
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-muted transition-colors duration-200 hover:bg-coral/10 hover:text-coral-deep"
          >
            <IoLogOutOutline className="h-4.5 w-4.5" aria-hidden="true" />
            Cerrar sesión
          </button>
          <div className="mt-2 flex items-center gap-3 rounded-lg bg-canvas px-3 py-2.5">
            <Avatar src={null} name={business.ownerName ?? business.name} className="h-8 w-8" />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[12.5px] font-semibold text-ink">
                {business.ownerName ?? business.name}
              </p>
              <p className="truncate text-[11px] text-muted">{business.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/45 lg:hidden"
        />
      )}
    </>
  );
}
