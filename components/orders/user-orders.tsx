"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IoBagOutline,
  IoReceiptOutline,
  IoSearchOutline,
} from "react-icons/io5";
import moment from "moment";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { DateFilter } from "@/components/ui/date-filter";
import { Badge } from "@/components/admin/ui/badge";
import { formatCurrency } from "@/lib/currency";
import {
  ORDER_STATUS_META,
  PAYMENT_METHOD_META,
  PAYMENT_STATUS_META,
} from "@/constants/admin";
import type {
  OrderStatusKey,
  PaymentMethodKey,
  PaymentStatusKey,
} from "@/interfaces/admin";
import type { MyOrder } from "@/actions/action-orders";
import { YapePayButton } from "@/components/payment/yape-pay-button";
import { SearchInput } from "@/components/admin/ui/search-input";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { useTableQuery } from "@/components/admin/ui/use-table-query";
import { useDebouncedValue } from "@/components/admin/ui/use-debounced-value";

interface UserOrdersProps {
  orders: MyOrder[];
  totalCount: number;
  page: number;
  totalPages: number;
  search: string;
  dateFrom: string;
  dateTo: string;
}

export function UserOrders({
  orders,
  totalCount,
  page,
  totalPages,
  search,
  dateFrom,
  dateTo,
}: UserOrdersProps) {
  const navigate = useTableQuery();
  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  useEffect(() => {
    if (debouncedSearch.trim().toLowerCase() !== search) {
      navigate({ q: debouncedSearch.trim() || null, page: "1" });
    }
  }, [debouncedSearch, search, navigate]);

  const handleDateChange = (field: "from" | "to", value: string) => {
    navigate({ [field]: value || null, page: "1" });
  };

  const clearFilters = () => {
    setSearchInput("");
    navigate({ q: null, from: null, to: null, page: "1" });
  };

  const hasFilters = Boolean(search || dateFrom || dateTo);
  const showEmptyState = totalCount === 0 && !hasFilters;
  const showNoResults = orders.length === 0 && !showEmptyState;
  const today = moment().format("YYYY-MM-DD");

  return (
    <main className="flex flex-1 flex-col bg-canvas">
      <section className="border-b border-line bg-paper py-12">
        <Container>
          <Reveal>
            <h1 className="font-disp text-[28px] font-bold text-ink">
              Mis pedidos
            </h1>
            <p className="mt-1 text-[14px] text-muted">
              Revisa el estado de tus pedidos realizados en la tienda.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="flex-1 py-10">
        <Container>
          {showEmptyState ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-line bg-paper p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                  <SearchInput
                    placeholder="Buscar por producto o N.º de pedido…"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    className="w-full lg:flex-1"
                    aria-label="Buscar pedidos"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-2">
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
                    {hasFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex shrink-0 items-center justify-center rounded-full border border-line px-4 py-2.5 text-[13px] font-semibold text-muted transition-colors duration-200 hover:border-blue/40 hover:text-ink"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-[12.5px] text-muted">
                  {totalCount === 1
                    ? "1 pedido encontrado"
                    : `${totalCount} pedidos encontrados`}
                </p>
              </div>

              {showNoResults ? (
                <NoResults onClear={clearFilters} />
              ) : (
                <>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                  <CatalogPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(nextPage) => navigate({ page: nextPage })}
                  />
                </>
              )}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}

function OrderCard({ order }: { order: MyOrder }) {
  const status = order.status as OrderStatusKey;
  const paymentMethod = order.paymentMethod as PaymentMethodKey;
  const paymentStatus = order.paymentStatus as PaymentStatusKey;
  const statusMeta = ORDER_STATUS_META[status];
  const paymentMeta = PAYMENT_STATUS_META[paymentStatus];
  const needsYapePayment =
    paymentMethod === "YAPE" && paymentStatus === "UNPAID";

  return (
    <Reveal>
      <article className="rounded-2xl border border-line bg-paper p-5 shadow-[0_4px_16px_rgba(33,42,58,0.06)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas text-blue-deep">
              <IoReceiptOutline className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[13px] font-bold text-ink">
                Pedido #{String(order.id).padStart(4, "0")}
              </p>
              <p className="text-[12px] text-muted">
                {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusMeta.tone} dot>
              {statusMeta.label}
            </Badge>
            <Badge tone={paymentMeta.tone} dot>
              {paymentMeta.label}
            </Badge>
          </div>
        </header>

        {needsYapePayment && (
          <p className="mt-3 rounded-xl bg-[#fff3dd] px-3 py-2 text-[12.5px] font-medium leading-snug text-honey-deep">
            Tu pedido no se tomará en cuenta hasta que pagues por Yape y el
            dueño confirme tu pago.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="min-w-0">
            <p className="text-[13px] text-muted">
              {order.itemCount}{" "}
              {order.itemCount === 1 ? "artículo" : "artículos"}
              <span aria-hidden="true"> · </span>
              {PAYMENT_METHOD_META[paymentMethod].label}
            </p>
            <ul className="mt-2 space-y-1">
              {order.products.map((product, index) => (
                <li
                  key={`${product.name}-${index}`}
                  className="flex items-center gap-2 text-[13px] text-ink"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue"
                    aria-hidden="true"
                  />
                  <span className="truncate">{product.name}</span>
                  <span className="ml-auto shrink-0 text-muted">
                    ×{product.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-[11.5px] uppercase tracking-wide text-muted">
                Total
              </p>
              <p className="font-disp text-[20px] font-bold text-ink">
                {formatCurrency(order.total)}
              </p>
            </div>
            {needsYapePayment && (
              <YapePayButton orderId={order.id} total={order.total} />
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-line bg-paper px-8 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas text-muted">
        <IoSearchOutline className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="text-[16px] font-semibold text-ink">
        No se encontraron pedidos
      </h2>
      <p className="text-[13px] leading-relaxed text-muted">
        Prueba ajustando la búsqueda o el rango de fechas.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-2 inline-flex items-center rounded-full bg-blue px-5 py-2.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-blue-deep"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <Reveal className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-line bg-paper px-8 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas text-muted">
        <IoBagOutline className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="text-[16px] font-semibold text-ink">
        Aún no tienes pedidos
      </h2>
      <p className="text-[13px] leading-relaxed text-muted">
        Explora el catálogo y haz tu primer pedido personalizado.
      </p>
      <Link
        href="/catalog"
        className="mt-2 inline-flex items-center rounded-full bg-blue px-5 py-2.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-blue-deep"
      >
        Ver catálogo
      </Link>
    </Reveal>
  );
}