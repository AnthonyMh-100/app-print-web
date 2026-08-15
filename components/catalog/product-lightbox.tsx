"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  IoChevronBack,
  IoChevronForward,
  IoCloseOutline,
} from "react-icons/io5";
import { EASE } from "@/constants/motion";
import type { CatalogProduct } from "@/interfaces/catalog";

interface ProductLightboxProps {
  product: CatalogProduct;
  initialIndex?: number;
  onClose: () => void;
}

const FADE_TRANSITION = { duration: 0.22, ease: EASE };

export function ProductLightbox({
  product,
  initialIndex = 0,
  onClose,
}: ProductLightboxProps) {
  const shouldReduce = useReducedMotion();
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const images = useMemo(
    () => product.images.filter((url) => typeof url === "string" && url.length > 0),
    [product.images],
  );

  const showNav = images.length > 1;
  const safeIndex = showNav
    ? Math.min(Math.max(index, 0), images.length - 1)
    : 0;

  const goTo = useCallback(
    (next: number) => {
      if (!showNav) return;
      const target = (next + images.length) % images.length;
      setDirection(next > safeIndex ? 1 : -1);
      setIndex(target);
    },
    [showNav, images.length, safeIndex],
  );

  const goNext = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);
  const goPrev = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (!showNav) return;
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, showNav, goNext, goPrev]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const slideVariants = useMemo(
    () => ({
      enter: (dir: number) => ({
        opacity: 0,
        x: shouldReduce ? 0 : dir > 0 ? 60 : -60,
        scale: shouldReduce ? 1 : 0.96,
      }),
      center: { opacity: 1, x: 0, scale: 1 },
      exit: (dir: number) => ({
        opacity: 0,
        x: shouldReduce ? 0 : dir > 0 ? -60 : 60,
        scale: shouldReduce ? 1 : 0.96,
      }),
    }),
    [shouldReduce],
  );

  const thumbVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.08 + i * 0.04, duration: 0.3, ease: EASE },
    }),
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Galería de ${product.name}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={FADE_TRANSITION}
        className="fixed inset-0 z-140 flex flex-col bg-ink/85 backdrop-blur-[6px]"
        onClick={onClose}
      >
        <div className="flex w-full items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5">
          <div className="min-w-0">
            <h2 className="truncate font-disp text-[17px] font-bold text-white">
              {product.name}
            </h2>
            {product.category && (
              <p className="mt-0.5 text-[12px] text-white/55">
                {product.category.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {showNav && (
              <span className="select-none rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold tabular-nums text-white/80">
                {safeIndex + 1} / {images.length}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar galería"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
            >
              <IoCloseOutline className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-20">
          {showNav && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Imagen anterior"
                className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white/25 active:scale-90 sm:left-5 sm:h-11 sm:w-11"
              >
                <IoChevronBack className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Imagen siguiente"
                className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:bg-white/25 active:scale-90 sm:right-5 sm:h-11 sm:w-11"
              >
                <IoChevronForward className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}

          <AnimatePresence
            custom={direction}
            mode="popLayout"
            initial={false}
          >
            <motion.div
              key={images[safeIndex]}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: EASE }}
              className="flex h-full w-full items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[safeIndex]}
                alt={`${product.name} — imagen ${safeIndex + 1}`}
                className="max-h-full max-w-full rounded-2xl object-contain shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex w-full justify-center px-4 pb-5 pt-4 sm:pb-7">
          {showNav ? (
            <motion.div
              initial="hidden"
              animate="visible"
              className="flex max-w-full gap-2.5 overflow-x-auto pb-1"
            >
              {images.map((image, i) => {
                const active = i === safeIndex;
                return (
                  <motion.button
                    key={image}
                    type="button"
                    custom={i}
                    variants={thumbVariants}
                    onClick={(event) => {
                      event.stopPropagation();
                      setDirection(i > safeIndex ? 1 : -1);
                      setIndex(i);
                    }}
                    aria-label={`Ver imagen ${i + 1}`}
                    aria-current={active ? "true" : undefined}
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-paper transition-all duration-200 sm:h-16 sm:w-16"
                    style={{
                      borderColor: active
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.18)",
                      scale: active ? 1 : 0.88,
                      opacity: active ? 1 : 0.65,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <p className="select-none rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-medium text-white/70">
              {product.description ?? "Producto personalizable."}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}