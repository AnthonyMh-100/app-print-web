"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import moment from "moment";
import { IoCloseOutline } from "react-icons/io5";
import {
  ORDER_STATUS_META,
  PAYMENT_METHOD_META,
  PAYMENT_STATUS_FILTERS,
  PAYMENT_STATUS_META,
  STATUS_FILTERS,
} from "@/constants/admin";
import type {
  OrderStatusKey,
  PaymentMethodKey,
  PaymentStatusKey,
} from "@/interfaces/admin";
import { formatCurrency } from "@/lib/currency";
import {
  markOrdersPaid,
  updateOrderPaymentStatus,
} from "@/actions/action-admin";
import type { AdminOrderListItem } from "@/actions/action-admin";
import { DateFilter } from "@/components/ui/date-filter";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "../ui/page-header";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { SearchInput } from "../ui/search-input";
import { FilterDropdown } from "../ui/filter-dropdown";
import { FilterChips } from "../ui/filter-chips";
import { Pagination } from "../ui/pagination";
import { Table, TBody, TD, TH, THead, TR } from "../ui/table";
import { Switch } from "../ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { useTableQuery } from "../ui/use-table-query";
import { useDebouncedValue } from "../ui/use-debounced-value";

interface AdminOrdersProps {
  orders: AdminOrderListItem[];
  totalCount: number;
  page: number;
  totalPages: number;
  search: string;
  statuses: string[];
  statusCounts: Record<string, number>;
  payments: string[];
  paymentCounts: Record<string, number>;
  dateFrom: string;
  dateTo: string;
}

const PAGE_SIZE = 10;

export function AdminOrders({
  orders,
  totalCount,
  page,
  totalPages,
  search,
  statuses,
  statusCounts,
  payments,
  paymentCounts,
  dateFrom,
  dateTo,
}: AdminOrdersProps) {
  const navigate = useTableQuery();
  const router = useRouter();
  const { showToast } = useToast();
  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, 300);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isBulkPending, startBulkTransition] = useTransition();
  const [prevOrders, setPrevOrders] = useState(orders);

  if (prevOrders !== orders) {
    setPrevOrders(orders);
    setSelectedIds([]);
    setConfirmOpen(false);
  }

  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  useEffect(() => {
    if (debouncedSearch.trim().toLowerCase() !== search) {
      navigate({ q: debouncedSearch.trim() || null, page: "1" });
    }
  }, [debouncedSearch, search, navigate]);

  const handleStatusChange = (ids: string[]) => {
    navigate({ status: ids.length ? ids.join(",") : null, page: "1" });
  };

  const handlePaymentChange = (ids: string[]) => {
    navigate({ payment: ids.length ? ids.join(",") : null, page: "1" });
  };

  const handleDateFromChange = (value: string) => {
    navigate({ from: value || null, page: "1" });
  };

  const handleDateToChange = (value: string) => {
    navigate({ to: value || null, page: "1" });
  };

  const handleRemoveChip = (id: string) => {
    if (id === "from") {
      navigate({ from: null, page: "1" });
    } else if (id === "to") {
      navigate({ to: null, page: "1" });
    } else if (statuses.includes(id)) {
      handleStatusChange(statuses.filter((value) => value !== id));
    } else if (payments.includes(id)) {
      handlePaymentChange(payments.filter((value) => value !== id));
    }
  };

  const clearAll = () => {
    navigate({ status: null, payment: null, from: null, to: null, page: "1" });
  };

  const filterChips = [
    ...statuses.map((id) => ({
      id,
      label: ORDER_STATUS_META[id as OrderStatusKey].label,
      tone: ORDER_STATUS_META[id as OrderStatusKey].tone,
    })),
    ...payments.map((id) => ({
      id,
      label: PAYMENT_STATUS_META[id as PaymentStatusKey].label,
      tone: PAYMENT_STATUS_META[id as PaymentStatusKey].tone,
    })),
    ...(dateFrom
      ? [{ id: "from", label: `Desde ${moment(dateFrom).format("DD/MM/YYYY")}` }]
      : []),
    ...(dateTo
      ? [{ id: "to", label: `Hasta ${moment(dateTo).format("DD/MM/YYYY")}` }]
      : []),
  ];
  const hasFilters = filterChips.length > 0;

  const visibleIds = orders.map((order) => order.id);
  const allSelected =
    orders.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : visibleIds);
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  };

  const handleBulkConfirm = () => {
    if (isBulkPending) return;
    setConfirmOpen(false);

    startBulkTransition(async () => {
      const result = await markOrdersPaid(selectedIds);

      if (result.success) {
        const ok = result.results?.filter((item) => item.success).length ?? 0;
        const failed = (result.results?.length ?? 0) - ok;
        if (failed > 0) {
          const first = result.results?.find((item) => !item.success);
          showToast(
            "error",
            `${ok} marcados, ${failed} con error${first ? ` — ${first.error}` : ""}`,
          );
        } else {
          showToast("success", `${ok} pedidos marcados como pagados`);
        }
        router.refresh();
      } else {
        showToast("error", result.error ?? "No se pudieron actualizar los pedidos");
      }
    });
  };

  const from = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Pedidos"
        description="Consulta y gestiona los pedidos de tus clientes."
      />

      <div className="rounded-2xl border border-line bg-paper p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <SearchInput
            placeholder="Buscar pedido o cliente…"
            className="w-full sm:w-80"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Estado"
              selected={statuses}
              onChange={handleStatusChange}
              options={STATUS_FILTERS.filter((filter) => filter.id !== "ALL").map((filter) => ({
                id: filter.id,
                label: filter.label,
                tone: ORDER_STATUS_META[filter.id as OrderStatusKey].tone,
                count: statusCounts[filter.id] ?? 0,
              }))}
            />
            <FilterDropdown
              label="Pago"
              selected={payments}
              onChange={handlePaymentChange}
              options={PAYMENT_STATUS_FILTERS.filter((filter) => filter.id !== "ALL").map(
                (filter) => ({
                  id: filter.id,
                  label: filter.label,
                  tone: PAYMENT_STATUS_META[filter.id as PaymentStatusKey].tone,
                  count: paymentCounts[filter.id] ?? 0,
                }),
              )}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end lg:ml-auto">
            <DateFilter
              label="Desde"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={handleDateFromChange}
            />
            <DateFilter
              label="Hasta"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={handleDateToChange}
            />
          </div>
        </div>
        {hasFilters && (
          <FilterChips
            items={filterChips}
            onRemove={handleRemoveChip}
            onClear={clearAll}
            className="mt-3"
          />
        )}
      </div>

      <Card>
        {selectedIds.length > 0 && orders.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[#e6f1fb]/60 px-6 py-3">
            <p className="text-[13px] font-semibold text-blue-deep">
              {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "pedido seleccionado" : "pedidos seleccionados"}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-muted transition-colors hover:bg-paper hover:text-ink"
              >
                <IoCloseOutline className="h-3.5 w-3.5" aria-hidden="true" />
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-blue px-4 py-1.5 text-[12.5px] font-semibold text-white transition-colors duration-200 hover:bg-blue-deep"
              >
                Marcar como pagado
              </button>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-[14px] font-semibold text-ink">
              No hay pedidos
            </p>
            <p className="mt-1 text-[12.5px] text-muted">
              {totalCount === 0
                ? "Aún no se han registrado pedidos."
                : "Ningún pedido coincide con la búsqueda o el filtro actual."}
            </p>
          </div>
        ) : (
          <Table>
            <THead>
              <tr>
                <TH className="w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Seleccionar todos los pedidos de esta página"
                    className="h-4 w-4 accent-blue"
                  />
                </TH>
                <TH>Pedido</TH>
                <TH>Cliente</TH>
                <TH>Productos</TH>
                <TH>Total</TH>
                <TH>Estado</TH>
                <TH>Pago</TH>
                <TH>Fecha</TH>
              </tr>
            </THead>
            <TBody>
              {orders.map((order) => {
                const meta = ORDER_STATUS_META[order.status as OrderStatusKey];
                const paymentMethod = order.paymentMethod as PaymentMethodKey;
                return (
                  <TR key={order.id}>
                    <TD>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleOne(order.id)}
                        aria-label={`Seleccionar ${order.reference}`}
                        className="h-4 w-4 accent-blue"
                      />
                    </TD>
                    <TD>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-blue-deep transition-colors hover:text-blue"
                      >
                        {order.reference}
                      </Link>
                    </TD>
                    <TD className="text-ink">{order.customer}</TD>
                    <TD className="text-muted">
                      {order.items} {order.items === 1 ? "producto" : "productos"}
                    </TD>
                    <TD className="font-semibold text-ink">
                      {formatCurrency(order.total)}
                    </TD>
                    <TD>
                      <Badge tone={meta.tone} dot>
                        {meta.label}
                      </Badge>
                    </TD>
                    <TD>
                      <div className="space-y-1">
                        <PaymentStatusSwitch order={order} />
                        <p className="text-[11.5px] text-muted">
                          {PAYMENT_METHOD_META[paymentMethod].label}
                        </p>
                      </div>
                    </TD>
                    <TD className="text-muted">{moment(order.createdAt).format("DD/MM/YYYY HH:mm")}</TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}

        {totalCount > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            from={from}
            to={to}
            itemLabel="pedidos"
            onPageChange={(nextPage) => navigate({ page: String(nextPage) })}
          />
        )}
      </Card>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/45 p-4"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bulk-paid-title"
            className="w-full max-w-sm rounded-3xl bg-paper p-6 shadow-[0_20px_60px_rgba(33,42,58,0.3)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="bulk-paid-title"
              className="font-disp text-[17px] font-bold text-ink"
            >
              Marcar como pagado
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              ¿Marcar{" "}
              <strong className="text-ink">
                {selectedIds.length}{" "}
                {selectedIds.length === 1 ? "pedido" : "pedidos"}
              </strong>{" "}
              como pagados? Se descontará el stock de sus productos.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={isBulkPending}
                className="rounded-full px-4 py-2 text-[13px] font-semibold text-muted transition-colors hover:bg-canvas hover:text-ink"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleBulkConfirm}
                disabled={isBulkPending}
                className="inline-flex items-center gap-2 rounded-full bg-blue px-5 py-2 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-blue-deep disabled:cursor-wait disabled:opacity-75"
              >
                {isBulkPending && <Spinner className="h-3.5 w-3.5" />}
                Confirmar pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentStatusSwitch({ order }: { order: AdminOrderListItem }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();

  const checked = order.paymentStatus === "PAID";
  const disabled = order.status === "CANCELLED";

  const toggle = () => {
    if (disabled || isPending) return;
    const target = checked ? "UNPAID" : "PAID";

    startTransition(async () => {
      const result = await updateOrderPaymentStatus(order.id, target);
      if (result.success) {
        showToast(
          "success",
          target === "PAID" ? "Pago confirmado" : "Pago desmarcado",
        );
        router.refresh();
      } else {
        showToast("error", result.error ?? "No se pudo actualizar el pago");
      }
    });
  };

  return (
    <div className="flex items-center gap-2" aria-busy={isPending}>
      <Switch
        checked={checked}
        label={`Pago del ${order.reference}`}
        disabled={disabled || isPending}
        onClick={toggle}
      />
      <span
        className={`text-[11.5px] font-medium ${
          checked ? "text-turquoise-deep" : "text-muted"
        }`}
      >
        {checked ? "Pagado" : "Sin pagar"}
      </span>
    </div>
  );
}