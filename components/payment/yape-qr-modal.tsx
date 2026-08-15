"use client";

import { useEffect } from "react";
import { IoCloseOutline, IoQrCodeOutline } from "react-icons/io5";
import { formatCurrency } from "@/lib/currency";
import { Badge } from "@/components/admin/ui/badge";

export interface YapeOrderInfo {
  id: number;
  total: number;
  qrSrc: string;
  number?: string | null;
}

interface YapeQrModalProps {
  order: YapeOrderInfo;
  onClose: () => void;
}

export function YapeQrModal({ order, onClose }: YapeQrModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="yape-qr-title"
      className="fixed inset-0 z-130 flex items-center justify-center bg-ink/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-3xl bg-paper shadow-[0_20px_60px_rgba(33,42,58,0.3)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas text-blue-deep">
              <IoQrCodeOutline className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3
                id="yape-qr-title"
                className="font-disp text-[17px] font-bold leading-tight text-ink"
              >
                Paga con Yape
              </h3>
              <p className="text-[12px] text-muted">
                Pedido #{String(order.id).padStart(4, "0")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <IoCloseOutline className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex flex-col items-center px-6 py-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={order.qrSrc}
            alt="Código QR de Yape"
            className="h-48 w-48 rounded-2xl border border-line bg-paper object-contain p-2"
          />
          {order.number && (
            <p className="mt-4 text-[13px] font-semibold text-ink">
              {order.number}
            </p>
          )}

          <div className="mt-4 flex w-full items-center justify-between rounded-2xl bg-canvas px-4 py-3">
            <span className="text-[13px] text-muted">Monto a pagar</span>
            <span className="font-disp text-[20px] font-bold text-ink">
              {formatCurrency(order.total)}
            </span>
          </div>

          <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
            Escanea el QR con la app de Yape y paga el monto exacto.{" "}
            <strong className="text-ink">
              Tu pedido no se tomará en cuenta
            </strong>{" "}
            hasta que el dueño confirme tu pago.
          </p>

          <div className="mt-4">
            <Badge tone="honey" dot>
              Pedido pendiente de pago
            </Badge>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-full bg-blue py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-blue-deep"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
