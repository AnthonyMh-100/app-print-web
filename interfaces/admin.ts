import type { IconType } from "react-icons";

export type AdminSectionId =
  | "dashboard"
  | "products"
  | "categories"
  | "orders"
  | "settings";

export interface BusinessIdentity {
  name: string;
  ownerName: string | null;
  email: string;
}

export type BadgeTone =
  | "blue"
  | "honey"
  | "pink"
  | "turquoise"
  | "coral"
  | "ink"
  | "neutral";

export type OrderStatusKey =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethodKey = "YAPE" | "CASH_ON_DELIVERY";

export type PaymentStatusKey = "UNPAID" | "PAID";

export interface AdminNavItem {
  id: AdminSectionId;
  label: string;
  href: string;
  icon: IconType;
}

export interface AdminStat {
  id: string;
  label: string;
  value: string;
  delta?: string;
  icon: IconType;
  tone: BadgeTone;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge: BadgeTone;
  productsCount: number;
  createdAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  stock: number;
  active: boolean;
  featured: boolean;
  color: string;
  icon: IconType;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatusKey;
  createdAt: string;
}
