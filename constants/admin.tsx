import {
  IoAlbumsOutline,
  IoCubeOutline,
  IoGridOutline,
  IoReceiptOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import type {
  AdminNavItem,
  AdminOrder,
  BadgeTone,
  OrderStatusKey,
  PaymentMethodKey,
  PaymentStatusKey,
} from "@/interfaces/admin";
import { categoryBadgeColors } from "@/lib/schemas/category";

export const BADGE_TONES: Record<BadgeTone, string> = {
  blue: "bg-[#e6f1fb] text-[#0c447c]",
  honey: "bg-[#fff3dd] text-[#854f0b]",
  pink: "bg-[#fde5ee] text-[#8f1f4d]",
  turquoise: "bg-[#ddf6f3] text-[#0b6e63]",
  coral: "bg-[#ffedea] text-[#c8432c]",
  ink: "bg-ink text-white",
  neutral: "bg-canvas text-muted",
};

export const BADGE_COLOR_DOTS: Record<string, string> = {
  blue: "bg-[#1b5fa8]",
  honey: "bg-[#ffb648]",
  pink: "bg-[#f2568c]",
  turquoise: "bg-[#2ec4b6]",
  coral: "bg-[#ff6f59]",
};

export const CATEGORY_BADGE_OPTIONS: Array<{
  id: (typeof categoryBadgeColors)[number];
  label: string;
  swatchClass: string;
}> = [
  { id: "blue", label: "Azul", swatchClass: "bg-[#1b5fa8]" },
  { id: "honey", label: "Miel", swatchClass: "bg-[#ffb648]" },
  { id: "pink", label: "Rosa", swatchClass: "bg-[#f2568c]" },
  { id: "turquoise", label: "Turquesa", swatchClass: "bg-[#2ec4b6]" },
  { id: "coral", label: "Coral", swatchClass: "bg-[#ff6f59]" },
] as const;

export const ADMIN_NAV: AdminNavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: IoGridOutline },
  { id: "products", label: "Productos", href: "/admin/products", icon: IoCubeOutline },
  { id: "categories", label: "Categorías", href: "/admin/categories", icon: IoAlbumsOutline },
  { id: "orders", label: "Pedidos", href: "/admin/orders", icon: IoReceiptOutline },
  { id: "settings", label: "Configuración", href: "/admin/settings", icon: IoSettingsOutline },
];

export const ORDER_STATUS_META: Record<
  OrderStatusKey,
  { label: string; tone: BadgeTone }
> = {
  PENDING: { label: "Pendiente", tone: "honey" },
  CONFIRMED: { label: "Confirmado", tone: "blue" },
  IN_PRODUCTION: { label: "En producción", tone: "turquoise" },
  SHIPPED: { label: "Enviado", tone: "pink" },
  DELIVERED: { label: "Entregado", tone: "ink" },
  CANCELLED: { label: "Cancelado", tone: "coral" },
};

export const ADMIN_ORDERS: AdminOrder[] = [
  {
    id: "ORD-1042",
    customer: "María Gutiérrez",
    items: 2,
    total: 50,
    status: "DELIVERED",
    createdAt: "10/08/2026",
  },
  {
    id: "ORD-1043",
    customer: "Carlos Pérez",
    items: 1,
    total: 35,
    status: "IN_PRODUCTION",
    createdAt: "10/08/2026",
  },
  {
    id: "ORD-1044",
    customer: "Lucía Ramírez",
    items: 3,
    total: 90,
    status: "CONFIRMED",
    createdAt: "11/08/2026",
  },
  {
    id: "ORD-1045",
    customer: "Jorge Castillo",
    items: 1,
    total: 12,
    status: "PENDING",
    createdAt: "11/08/2026",
  },
  {
    id: "ORD-1046",
    customer: "Ana Torres",
    items: 4,
    total: 108,
    status: "SHIPPED",
    createdAt: "11/08/2026",
  },
];

export const STATUS_FILTERS: Array<{ id: OrderStatusKey | "ALL"; label: string }> = [
  { id: "ALL", label: "Todos" },
  { id: "PENDING", label: "Pendiente" },
  { id: "CONFIRMED", label: "Confirmado" },
  { id: "IN_PRODUCTION", label: "En producción" },
  { id: "SHIPPED", label: "Enviado" },
  { id: "DELIVERED", label: "Entregado" },
  { id: "CANCELLED", label: "Cancelado" },
];

export const PAYMENT_METHOD_META: Record<PaymentMethodKey, { label: string }> = {
  YAPE: { label: "Yape" },
  CASH_ON_DELIVERY: { label: "Al recibir" },
};

export const PAYMENT_STATUS_META: Record<
  PaymentStatusKey,
  { label: string; tone: BadgeTone }
> = {
  UNPAID: { label: "Sin pagar", tone: "honey" },
  PAID: { label: "Pagado", tone: "turquoise" },
};

export const PAYMENT_STATUS_FILTERS: Array<{
  id: PaymentStatusKey | "ALL";
  label: string;
}> = [
  { id: "ALL", label: "Todos" },
  { id: "UNPAID", label: "Sin pagar" },
  { id: "PAID", label: "Pagado" },
];
