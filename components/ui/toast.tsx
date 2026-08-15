"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  IoCheckmarkCircleOutline,
  IoClose,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { EASE } from "@/constants/motion";
import { cn } from "@/utils/cn";

type ToastType = "success" | "error";

interface ToastItemData {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 4000;
const TOAST_TRANSITION = { duration: 0.22, ease: EASE };

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast debe usarse dentro de <ToastProvider>");
  }

  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const nextToastIdRef = useRef(0);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    nextToastIdRef.current += 1;
    const id = nextToastIdRef.current;
    setToasts((current) => [...current, { id, type, message }]);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-6 left-1/2 z-120 flex w-[calc(100%-2rem)] max-w-100 -translate-x-1/2 flex-col items-center gap-2"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastCard
              key={toast.id}
              toast={toast}
              onDismiss={() => dismissToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItemData;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const autoDismissTimer = window.setTimeout(onDismiss, TOAST_DURATION_MS);
    return () => window.clearTimeout(autoDismissTimer);
  }, [onDismiss]);

  const Icon =
    toast.type === "success" ? IoCheckmarkCircleOutline : IoCloseCircleOutline;
  const iconClassName =
    toast.type === "success" ? "text-green-500" : "text-coral";

  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={TOAST_TRANSITION}
      className="pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-line bg-paper px-4 py-3 shadow-[0_14px_30px_rgba(33,42,58,0.18)]"
    >
      <Icon
        className={cn("mt-0.5 shrink-0 text-[20px]", iconClassName)}
        aria-hidden="true"
      />
      <p className="flex-1 text-[14px] font-medium leading-snug text-ink">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar notificación"
        className="shrink-0 text-muted transition-colors duration-200 hover:text-ink"
      >
        <IoClose size={16} aria-hidden="true" />
      </button>
    </motion.div>
  );
}
