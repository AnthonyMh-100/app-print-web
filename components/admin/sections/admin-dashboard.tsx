"use client";

import { useState } from "react";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  IoAlbumsOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoChevronForwardOutline,
  IoCubeOutline,
  IoReceiptOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { StatCard } from "../ui/stat-card";
import { PageHeader } from "../ui/page-header";
import { Card, CardHeader } from "../ui/card";
import { ProductThumb } from "../ui/product-thumb";
import { Pagination } from "../ui/pagination";
import { DateFilter } from "@/components/ui/date-filter";
import { useTableQuery } from "../ui/use-table-query";
import type { BadgeTone } from "@/interfaces/admin";

export interface AdminDashboardStatsItem {
  id: string;
  label: string;
  value: string;
  delta?: string;
  icon: Parameters<typeof StatCard>[0]["icon"];
  tone: BadgeTone;
}

export interface AdminDashboardLowStockItem {
  id: number;
  name: string;
  stock: number;
  cardColor: string | null;
  imageUrl: string | null;
  categoryName: string;
}

interface AdminDashboardProps {
  totalProducts: number;
  activeProducts: number;
  categories: number;
  totalOrders: number;
  revenue: string;
  unpaidCount: number;
  unpaidAmount: string;
  lowStockProducts: AdminDashboardLowStockItem[];
}

const STOCK_PAGE_SIZE = 6;

export function AdminDashboard({
  totalProducts,
  activeProducts,
  categories,
  totalOrders,
  revenue,
  unpaidCount,
  unpaidAmount,
  lowStockProducts,
}: AdminDashboardProps) {
  const navigate = useTableQuery();
  const searchParams = useSearchParams();
  const [stockPage, setStockPage] = useState(1);

  const today = moment().format("YYYY-MM-DD");
  const dateFrom = searchParams.get("from") ?? "";
  const dateTo = searchParams.get("to") ?? "";

  const hasRange = Boolean(dateFrom || dateTo);

  const handleDateChange = (field: "from" | "to", value: string) => {
    navigate({ [field]: value || null });
  };

  const clearRange = () => {
    navigate({ from: null, to: null });
  };

  const stockPages = Math.max(
    1,
    Math.ceil(lowStockProducts.length / STOCK_PAGE_SIZE),
  );
  const currentStockPage = Math.min(stockPage, stockPages);
  const pageStock = lowStockProducts.slice(
    (currentStockPage - 1) * STOCK_PAGE_SIZE,
    currentStockPage * STOCK_PAGE_SIZE,
  );
  const stockFrom =
    lowStockProducts.length === 0
      ? 0
      : (currentStockPage - 1) * STOCK_PAGE_SIZE + 1;
  const stockTo = Math.min(
    currentStockPage * STOCK_PAGE_SIZE,
    lowStockProducts.length,
  );

  const stats: AdminDashboardStatsItem[] = [
    {
      id: "products",
      label: "Productos",
      value: String(totalProducts),
      delta: `${activeProducts} activos`,
      icon: IoCubeOutline,
      tone: "blue",
    },
    {
      id: "categories",
      label: "Categorías",
      value: String(categories),
      delta: "Todas activas",
      icon: IoAlbumsOutline,
      tone: "pink",
    },
    {
      id: "orders",
      label: "Pedidos",
      value: String(totalOrders),
      delta: hasRange ? "En el rango seleccionado" : "Registrados",
      icon: IoReceiptOutline,
      tone: "turquoise",
    },
    {
      id: "revenue",
      label: "Ingresos",
      value: revenue,
      delta: hasRange ? "Pagados en el rango" : "Pedidos pagados",
      icon: IoCashOutline,
      tone: "honey",
    },
    {
      id: "unpaid",
      label: "Por cobrar",
      value: unpaidAmount,
      delta: `${unpaidCount} pedidos sin pagar`,
      icon: IoWalletOutline,
      tone: "coral",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Métricas generales de tu tienda."
        actions={
          <>
            <DateFilter
              label="Desde"
              value={dateFrom}
              max={dateTo || today}
              onChange={(value) => handleDateChange("from", value)}
            />
            <DateFilter
              label="Hasta"
              value={dateTo}
              min={dateFrom || undefined}
              max={today}
              onChange={(value) => handleDateChange("to", value)}
            />
            {hasRange && (
              <button
                type="button"
                onClick={clearRange}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-muted transition-colors duration-200 hover:border-blue/40 hover:text-ink"
              >
                Limpiar
              </button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader
          title="Stock bajo"
          description="Productos con 8 unidades o menos."
          action={
            lowStockProducts.length > 0 ? (
              <span className="rounded-full bg-coral/10 px-2.5 py-1 text-[11.5px] font-semibold text-coral-deep">
                {lowStockProducts.length} por reponer
              </span>
            ) : undefined
          }
        />
        {lowStockProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ddf6f3] text-turquoise-deep">
              <IoCheckmarkCircleOutline
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>
            <p className="text-[13.5px] font-semibold text-ink">
              Todo el stock está en buen estado
            </p>
            <p className="text-[12.5px] text-muted">
              Ningún producto tiene 8 unidades o menos.
            </p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-line">
              {pageStock.map((product) => {
                const urgent = product.stock === 0;
                const barClass = urgent ? "bg-coral" : "bg-[#ffb648]";
                const barWidth = Math.min(100, (product.stock / 8) * 100);
                return (
                  <li key={product.id}>
                    <div className="flex items-center gap-3 px-5 py-3.5">
                      <ProductThumb
                        name={product.name}
                        cardColor={product.cardColor}
                        imageUrl={product.imageUrl}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-semibold text-ink">
                          {product.name}
                        </p>
                        <p className="text-[11.5px] text-muted">
                          {product.categoryName}
                        </p>
                        <div
                          className="mt-1.5 h-1 max-w-40 overflow-hidden rounded-full bg-canvas"
                          role="img"
                          aria-label={`${product.name}: ${product.stock} unidades`}
                        >
                          <div
                            className={`h-full rounded-full ${barClass}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={
                          urgent
                            ? "shrink-0 text-[12.5px] font-bold text-coral-deep"
                            : "shrink-0 text-[12.5px] font-semibold text-honey-deep"
                        }
                      >
                        {urgent ? "Agotado" : `${product.stock} uds.`}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            {lowStockProducts.length > STOCK_PAGE_SIZE && (
              <Pagination
                currentPage={currentStockPage}
                totalPages={stockPages}
                totalItems={lowStockProducts.length}
                from={stockFrom}
                to={stockTo}
                itemLabel="productos"
                onPageChange={setStockPage}
              />
            )}
            <div className="px-3 pb-3">
              <Link
                href="/admin/products"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-[12.5px] font-semibold text-blue-deep transition-colors hover:bg-[#e6f1fb]"
              >
                Ir a productos
                <IoChevronForwardOutline
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
