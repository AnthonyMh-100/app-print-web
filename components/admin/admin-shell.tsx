"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { AdminSectionId, BusinessIdentity } from "@/interfaces/admin";
import { ADMIN_NAV } from "@/constants/admin";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

function getActiveId(pathname: string): AdminSectionId {
  if (pathname === "/admin" || pathname === "/admin/") return "dashboard";
  if (pathname.startsWith("/admin/products")) return "products";
  if (pathname.startsWith("/admin/categories")) return "categories";
  if (pathname.startsWith("/admin/orders")) return "orders";
  if (pathname.startsWith("/admin/settings")) return "settings";
  return "dashboard";
}

export function AdminShell({
  children,
  business,
}: {
  children: ReactNode;
  business: BusinessIdentity;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const activeId = getActiveId(pathname ?? "/admin");
  const title =
    ADMIN_NAV.find((item) => item.id === activeId)?.label ?? "Admin";

  return (
    <div className="min-h-screen bg-canvas">
      <AdminSidebar
        business={business}
        activeId={activeId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <AdminTopbar
          business={business}
          title={title}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="mx-auto w-full max-w-360 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-line px-6 py-4 text-center text-[12px] text-muted">
          Panel de administración · {new Date().getFullYear()} · {business.name}
        </footer>
      </div>
    </div>
  );
}