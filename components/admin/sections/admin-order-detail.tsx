"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment";
import {
  IoArrowBackOutline,
  IoCheckmarkCircleOutline,
  IoChevronForwardOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoReceiptOutline,
} from "react-icons/io5";
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
import { formatCurrency } from "@/lib/currency";
import { updateOrderPaymentStatus, updateOrderStatus } from "@/actions/action-admin";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "../ui/page-header";
import { Card, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ProductThumb } from "../ui/product-thumb";
import type { AdminOrderDetail } from "@/actions/action-admin";

const NEXT_FLOW: Record<OrderStatusKey, OrderStatusKey | null> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "IN_PRODUCTION",
  IN_PRODUCTION: "SHIPPED",
  SHIPPED: "DELIVERED",
  DELIVERED: null,
  CANCELLED: null,
};

interface AdminOrderDetailProps {
  order: AdminOrderDetail;
}

export function AdminOrderDetail({ order }: AdminOrderDetailProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isPaymentPending, startPaymentTransition] = useTransition();
  const [cancelOpen, setCancelOpen] = useState(false);

  const status = order.status as OrderStatusKey;
  const meta = ORDER_STATUS_META[status];
  const nextStatus = NEXT_FLOW[status];

  const paymentMethod = order.paymentMethod as PaymentMethodKey;
  const paymentStatus = order.paymentStatus as PaymentStatusKey;
  const paymentMeta = PAYMENT_STATUS_META[paymentStatus];

  const markPaid = () => {
    startPaymentTransition(async () => {
      const result = await updateOrderPaymentStatus(order.id, "PAID");
      if (result.success) {
        showToast("success", "Pago confirmado");
        router.refresh();
      } else {
        showToast("error", result.error ?? "No se pudo actualizar el pago");
      }
    });
  };

  const advance = () => {
    if (!nextStatus) return;
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, nextStatus);
      if (result.success) {
        showToast("success", "Estado actualizado");
        router.refresh();
      } else {
        showToast("error", result.error ?? "No se pudo actualizar el pedido");
      }
    });
  };

  const cancel = () => {
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, "CANCELLED");
      if (result.success) {
        showToast("success", "Pedido cancelado");
        setCancelOpen(false);
        router.refresh();
      } else {
        showToast("error", result.error ?? "No se pudo cancelar el pedido");
      }
    });
  };

  const isFinal = status === "DELIVERED" || status === "CANCELLED";

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Pedido ${order.reference}`}
        description={`Creado el ${moment(order.createdAt).format("DD/MM/YYYY HH:mm")}`}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">
              <IoArrowBackOutline className="h-4 w-4" aria-hidden="true" />
              Volver a pedidos
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader
          title="Estado del pedido"
          description={meta.label}
          action={<Badge tone={meta.tone} dot>{meta.label}</Badge>}
        />
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          {nextStatus ? (
            <Button size="sm" onClick={advance} disabled={isPending}>
              <IoChevronForwardOutline className="h-4 w-4" aria-hidden="true" />
              {isPending ? "Actualizando…" : `Avanzar a ${ORDER_STATUS_META[nextStatus].label}`}
            </Button>
          ) : (
            <p className="text-[13px] text-muted">
              {status === "CANCELLED"
                ? "Este pedido fue cancelado."
                : "Este pedido ya fue entregado."}
            </p>
          )}
          {!isFinal && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setCancelOpen(true)}
              disabled={isPending}
            >
              Cancelar pedido
            </Button>
          )}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Productos" description="Detalle de los ítems del pedido." />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-canvas/60 text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">
                <tr>
                  <th className="px-6 py-3.5">Producto</th>
                  <th className="px-6 py-3.5">Precio</th>
                  <th className="px-6 py-3.5">Cant.</th>
                  <th className="px-6 py-3.5 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {order.items.map((item) => (
                  <tr key={`${item.productId}-${item.productName}`} className="hover:bg-canvas/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ProductThumb
                          name={item.productName}
                          imageUrl={item.imageUrl}
                          className="h-10 w-10"
                        />
                        <span className="text-[13.5px] font-semibold text-ink">
                          {item.productName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-6 py-4 text-muted">×{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-semibold text-ink">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Pago" />
            <div className="space-y-3 px-6 py-5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted">Método</span>
                <span className="font-semibold text-ink">
                  {PAYMENT_METHOD_META[paymentMethod].label}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted">Estado</span>
                <Badge tone={paymentMeta.tone} dot>
                  {paymentMeta.label}
                </Badge>
              </div>
              {paymentStatus === "UNPAID" && (
                <>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={markPaid}
                    disabled={isPaymentPending}
                  >
                    <IoCheckmarkCircleOutline className="h-4 w-4" aria-hidden="true" />
                    {isPaymentPending ? "Actualizando…" : "Marcar como pagado"}
                  </Button>
                  <p className="text-[12px] leading-snug text-muted">
                    Al confirmar el pago se descuenta el stock de los productos.
                  </p>
                </>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Cliente" />
            <div className="flex items-start gap-3 px-6 py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canvas text-blue-deep">
                <IoPersonOutline className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-ink">{order.customer.name}</p>
                <p className="truncate text-[12.5px] text-muted">{order.customer.email}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Resumen" />
            <div className="space-y-3 px-6 py-5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted">Productos</span>
                <span className="font-semibold text-ink">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted">Última actualización</span>
                <span className="font-semibold text-ink">
                  {moment(order.updatedAt).format("DD/MM/YYYY HH:mm")}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-3">
                <span className="text-[13px] font-medium text-muted">Total</span>
                <span className="flex items-center gap-1.5 font-disp text-[20px] font-bold text-ink">
                  <IoReceiptOutline className="h-4 w-4 text-muted" aria-hidden="true" />
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {cancelOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-order-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => !isPending && setCancelOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 id="cancel-order-title" className="font-disp text-[17px] font-bold text-ink">
                Cancelar pedido
              </h3>
              <button
                type="button"
                onClick={() => setCancelOpen(false)}
                disabled={isPending}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink"
              >
                <IoCloseOutline className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              ¿Seguro que deseas cancelar el pedido{" "}
              <strong className="text-ink">{order.reference}</strong>? El stock
              solo se restaura si el pedido ya fue pagado. Esta acción no se
              puede deshacer.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelOpen(false)}
                disabled={isPending}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold text-muted transition-colors hover:bg-canvas hover:text-ink"
              >
                Volver
              </button>
              <Button variant="danger" size="sm" onClick={cancel} disabled={isPending}>
                {isPending ? "Cancelando…" : "Sí, cancelar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
