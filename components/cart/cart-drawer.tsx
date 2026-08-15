"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { useCartStore } from "@/lib/cart-store";
import { createOrder } from "@/actions/action-orders";
import { getPublicBusinessData } from "@/actions/action-business";
import { formatCurrency } from "@/lib/currency";
import { EASE } from "@/constants/motion";
import { useToast } from "@/components/ui/toast";
import { QuantityControl } from "@/components/ui/quantity-control";
import { YapeQrModal } from "@/components/payment/yape-qr-modal";
import type { YapeOrderInfo } from "@/components/payment/yape-qr-modal";

const DRAWER_TRANSITION = { duration: 0.3, ease: EASE };
const FADE_TRANSITION = { duration: 0.2, ease: EASE };

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const shouldReduce = useReducedMotion();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [yapeOrder, setYapeOrder] = useState<YapeOrderInfo | null>(null);

  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpenRef.current) closeCart();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeCart]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const { count, total } = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const itemTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return { count: itemCount, total: itemTotal };
  }, [items]);

  const handleCheckout = async () => {
    if (isSubmitting || items.length === 0) return;
    setIsSubmitting(true);

    const result = await createOrder(items, "YAPE");
    setIsSubmitting(false);

    if (!result.success) {
      showToast("error", result.error);
      return;
    }

    const business = await getPublicBusinessData();
    const qrSrc = business.yapeQrUrl || "/QR.jpeg";

    clearCart();
    closeCart();
    setYapeOrder({
      id: result.data.id,
      total,
      qrSrc,
      number: business.yapeNumber,
    });
    showToast("success", "Pedido creado — escanea el QR para pagar");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="cart-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE_TRANSITION}
              onClick={closeCart}
              className="fixed inset-0 z-100 bg-ink/45 backdrop-blur-[2px]"
              aria-hidden="true"
            />

            <motion.aside
              key="cart-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Carrito de compras"
              initial={shouldReduce ? { opacity: 0 } : { x: "100%", opacity: 1 }}
              animate={shouldReduce ? { opacity: 1 } : { x: 0, opacity: 1 }}
              exit={shouldReduce ? { opacity: 0 } : { x: "100%", opacity: 1 }}
              transition={DRAWER_TRANSITION}
              className="fixed inset-y-0 right-0 z-110 flex w-full max-w-105 flex-col bg-paper shadow-[0_0_60px_rgba(33,42,58,0.25)]"
            >
              <header className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <h2 className="font-disp text-[19px] font-bold leading-tight text-ink">
                    Tu carrito
                  </h2>
                  <p className="text-[12px] text-muted">
                    {count > 0
                      ? `${count} ${count === 1 ? "artículo" : "artículos"}`
                      : "Comienza a agregar productos"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  aria-label="Cerrar carrito"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors duration-200 hover:border-blue hover:text-blue"
                >
                  <IoClose className="h-4.5 w-4.5" aria-hidden="true" />
                </button>
              </header>

              {items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas text-muted">
                    <IoTrashOutline className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="text-[14px] font-semibold text-ink">
                    Tu carrito está vacío
                  </p>
                  <p className="max-w-65 text-[12.5px] leading-relaxed text-muted">
                    Explora el catálogo y elige tus productos personalizados.
                  </p>
                  <Link
                    href="/catalog"
                    onClick={closeCart}
                    className="mt-2 inline-flex items-center rounded-full bg-blue px-5 py-2.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-blue-deep"
                  >
                    Ver catálogo
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <CartLine
                          key={item.productId}
                          productId={item.productId}
                        />
                      ))}
                    </ul>
                  </div>

                  <footer className="space-y-3 border-t border-line px-5 py-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-muted">
                        Subtotal
                      </span>
<span className="font-disp text-[19px] font-bold text-ink">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <p className="text-[12px] leading-snug text-muted">
                    Al confirmar tu pedido se mostrará el QR de Yape. Tu pedido
                    no se tomará en cuenta hasta que pagues y el dueño confirme
                    tu pago.
                  </p>
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-blue py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-blue-deep disabled:pointer-events-none disabled:opacity-60"
                    >
                      {isSubmitting ? "Creando pedido…" : "Crear pedido"}
                    </button>
                  </footer>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {yapeOrder && <YapeQrModal order={yapeOrder} onClose={() => setYapeOrder(null)} />}
    </>
  );
}

function CartLine({ productId }: { productId: number }) {
  const item = useCartStore((state) =>
    state.items.find((i) => i.productId === productId),
  );
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (!item) return null;

  return (
    <li className="flex gap-3 rounded-2xl border border-line bg-paper p-3">
      <span
        className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl"
        style={{
          background: `linear-gradient(160deg, ${item.cardColor ?? "#e6f1fb"} 0%, #ffffff 130%)`,
        }}
      >
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-disp text-[20px] font-bold text-blue-deep">
            {item.name.slice(0, 1)}
          </span>
        )}
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-semibold text-ink">
              {item.name}
            </p>
            {item.categoryName && (
              <p className="truncate text-[11.5px] text-muted">
                {item.categoryName}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeItem(productId)}
            aria-label={`Quitar ${item.name}`}
            className="shrink-0 text-muted transition-colors duration-200 hover:text-coral-deep"
          >
            <IoTrashOutline className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <QuantityControl
            quantity={item.quantity}
            onChange={(quantity) => updateQuantity(productId, quantity)}
          />
          <span className="text-[13.5px] font-bold text-ink">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </li>
  );
}
