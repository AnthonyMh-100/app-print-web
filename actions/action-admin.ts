"use server";

import { notFound } from "next/navigation";
import moment from "moment";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/currency";

import type { AdminProductsItem } from "@/components/admin/sections/admin-products";
import type { AdminProductsCategory } from "@/components/admin/sections/admin-products";
import type { AdminCategoriesItem } from "@/components/admin/sections/admin-categories";
import type { AdminDashboardLowStockItem } from "@/components/admin/sections/admin-dashboard";
import type { OrderStatusKey, PaymentMethodKey, PaymentStatusKey } from "@/interfaces/admin";

const ORDER_STATUS_KEYS: OrderStatusKey[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PRODUCTION",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const VALID_TRANSITIONS: Record<OrderStatusKey, OrderStatusKey[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PRODUCTION", "CANCELLED"],
  IN_PRODUCTION: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const ADMIN_PAGE_SIZE = 10;

export interface AdminProductsQuery {
  page?: number;
  search?: string;
  categoryIds?: number[];
}

export interface AdminOrdersQuery {
  page?: number;
  search?: string;
  statuses?: string[];
  payments?: string[];
  dateFrom?: string;
  dateTo?: string;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export async function getAdminDashboardData(
  query: { dateFrom?: string; dateTo?: string } = {},
): Promise<{
  totalProducts: number;
  activeProducts: number;
  categories: number;
  totalOrders: number;
  revenue: string;
  unpaidCount: number;
  unpaidAmount: string;
  lowStockProducts: AdminDashboardLowStockItem[];
}> {
  const dateFrom = moment(query.dateFrom, "YYYY-MM-DD", true).isValid()
    ? moment(query.dateFrom, "YYYY-MM-DD").startOf("day").toDate()
    : null;
  const dateTo = moment(query.dateTo, "YYYY-MM-DD", true).isValid()
    ? moment(query.dateTo, "YYYY-MM-DD").endOf("day").toDate()
    : null;

  const rangeWhere =
    dateFrom || dateTo
      ? {
          createdAt: {
            ...(dateFrom ? { gte: dateFrom } : {}),
            ...(dateTo ? { lte: dateTo } : {}),
          },
        }
      : {};

  const [products, categoryCount, totalOrders, revenueAggregate, unpaidAggregate, allProducts] =
    await Promise.all([
      prisma.product.findMany({
        select: { id: true, isActive: true },
      }),
      prisma.category.count(),
      prisma.order.count({ where: rangeWhere }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          paymentStatus: "PAID",
          status: { not: "CANCELLED" },
          ...rangeWhere,
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        _count: { _all: true },
        where: {
          paymentStatus: "UNPAID",
          status: { not: "CANCELLED" },
          ...rangeWhere,
        },
      }),
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          stock: true,
          cardColor: true,
          category: { select: { name: true } },
          images: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
        },
      }),
    ]);

  const lowStockProducts: AdminDashboardLowStockItem[] = allProducts
    .filter((product) => product.stock <= 8)
    .sort((a, b) => a.stock - b.stock)
    .map((product) => ({
      id: product.id,
      name: product.name,
      stock: product.stock,
      cardColor: product.cardColor,
      imageUrl: product.images[0]?.url ?? null,
      categoryName: product.category.name,
    }));

  return {
    totalProducts: products.length,
    activeProducts: products.filter((product) => product.isActive).length,
    categories: categoryCount,
    totalOrders,
    revenue: formatCurrency(Number(revenueAggregate._sum.total ?? 0)),
    unpaidCount: unpaidAggregate._count._all,
    unpaidAmount: formatCurrency(Number(unpaidAggregate._sum.total ?? 0)),
    lowStockProducts,
  };
}

export async function getAdminProducts(query: AdminProductsQuery = {}) {
  const page = Math.max(1, query.page ?? 1);
  const term = (query.search ?? "").trim().toLowerCase();
  const categoryIds = query.categoryIds ?? [];

  const where = {
    ...(term
      ? {
          OR: [
            { name: { contains: term, mode: "insensitive" as const } },
            { slug: { contains: term, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(categoryIds.length ? { categoryId: { in: categoryIds } } : {}),
  };

  const totalCount = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (safePage - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        stock: true,
        cardColor: true,
        isActive: true,
        isFeatured: true,
        category: { select: { id: true, name: true, badgeColor: true } },
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { url: true },
        },
        createdAt: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        badgeColor: true,
        _count: { select: { products: true } },
      },
    }),
  ]);

  const productItems: AdminProductsItem[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.basePrice),
    stock: product.stock,
    cardColor: product.cardColor,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    imageUrl: product.images[0]?.url ?? null,
    categoryId: product.category?.id ?? null,
    categoryName: product.category?.name ?? null,
    categoryBadgeColor: product.category?.badgeColor ?? null,
    createdAt: DATE_FORMATTER.format(product.createdAt),
  }));

  const categoryFilters: AdminProductsCategory[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    badgeColor: category.badgeColor ?? "blue",
    count: category._count.products,
  }));

  return {
    products: productItems,
    categories: categoryFilters,
    totalCount,
    page: safePage,
    totalPages,
    search: term,
    categoryIds,
  };
}

export async function getAdminCategories(): Promise<{
  categories: AdminCategoriesItem[];
}> {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      badgeColor: true,
      _count: { select: { products: true } },
      createdAt: true,
    },
  });

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      badgeColor: category.badgeColor,
      productsCount: category._count.products,
      createdAt: DATE_FORMATTER.format(category.createdAt),
    })),
  };
}

export async function getProductForEdit(id: string) {
  const productId = Number(id);

  const product = Number.isInteger(productId)
    ? await prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          basePrice: true,
          stock: true,
          cardColor: true,
          categoryId: true,
          isActive: true,
          isFeatured: true,
          images: {
            orderBy: { sortOrder: "asc" },
            select: { id: true, publicId: true, url: true, format: true },
          },
        },
      })
    : null;

  if (!product) notFound();

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.basePrice),
    stock: product.stock,
    cardColor: product.cardColor,
    categoryId: product.categoryId,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    images: product.images,
  };
}

export async function getCategoriesForForm() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });
}

export async function getCategoryForEdit(id: string) {
  const categoryId = Number(id);

  const category = Number.isInteger(categoryId)
    ? await prisma.category.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          badgeColor: true,
        },
      })
    : null;

  if (!category) notFound();

  return category;
}

export interface AdminOrderListItem {
  id: number;
  reference: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatusKey;
  paymentMethod: PaymentMethodKey;
  paymentStatus: PaymentStatusKey;
  createdAt: string;
}

export async function getAdminOrders(query: AdminOrdersQuery = {}) {
  const page = Math.max(1, query.page ?? 1);
  const term = (query.search ?? "").trim().toLowerCase();
  const statuses = (query.statuses ?? []).filter(
    (value): value is OrderStatusKey =>
      ORDER_STATUS_KEYS.includes(value as OrderStatusKey),
  );
  const payments = (query.payments ?? []).filter(
    (value): value is PaymentStatusKey =>
      value === "UNPAID" || value === "PAID",
  );
  const dateFrom = moment(query.dateFrom, "YYYY-MM-DD", true).isValid()
    ? moment(query.dateFrom, "YYYY-MM-DD").format("YYYY-MM-DD")
    : "";
  const dateTo = moment(query.dateTo, "YYYY-MM-DD", true).isValid()
    ? moment(query.dateTo, "YYYY-MM-DD").format("YYYY-MM-DD")
    : "";

  const numericMatch = term.replace(/\D/g, "");

  const where = {
    ...(statuses.length ? { status: { in: statuses } } : {}),
    ...(payments.length ? { paymentStatus: { in: payments } } : {}),
    ...(dateFrom || dateTo
      ? {
          createdAt: {
            ...(dateFrom
              ? { gte: moment(dateFrom, "YYYY-MM-DD").startOf("day").toDate() }
              : {}),
            ...(dateTo
              ? { lte: moment(dateTo, "YYYY-MM-DD").endOf("day").toDate() }
              : {}),
          },
        }
      : {}),
    ...(term
      ? {
          OR: [
            { user: { name: { contains: term, mode: "insensitive" as const } } },
            { user: { email: { contains: term, mode: "insensitive" as const } } },
            ...(numericMatch ? [{ id: Number(numericMatch) }] : []),
          ],
        }
      : {}),
  };

  const totalCount = await prisma.order.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const [orders, statusGroups, paymentGroups] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      select: {
        id: true,
        status: true,
        paymentMethod: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
        items: { select: { quantity: true } },
      },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.order.groupBy({ by: ["paymentStatus"], _count: { _all: true } }),
  ]);

  const orderItems: AdminOrderListItem[] = orders.map((order) => ({
    id: order.id,
    reference: `ORD-${String(order.id).padStart(4, "0")}`,
    customer: order.user.name ?? order.user.email ?? "Cliente",
    items: order.items.reduce((sum, item) => sum + item.quantity, 0),
    total: Number(order.total),
    status: order.status as OrderStatusKey,
    paymentMethod: order.paymentMethod as PaymentMethodKey,
    paymentStatus: order.paymentStatus as PaymentStatusKey,
    createdAt: order.createdAt.toISOString(),
  }));

  const statusCounts: Record<string, number> = {
    ALL: statusGroups.reduce((sum, group) => sum + group._count._all, 0),
    PENDING: 0,
    CONFIRMED: 0,
    IN_PRODUCTION: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  for (const group of statusGroups) {
    statusCounts[group.status] = group._count._all;
  }

  const paymentCounts: Record<string, number> = {
    ALL: paymentGroups.reduce((sum, group) => sum + group._count._all, 0),
    UNPAID: 0,
    PAID: 0,
  };

  for (const group of paymentGroups) {
    paymentCounts[group.paymentStatus] = group._count._all;
  }

  return {
    orders: orderItems,
    totalCount,
    page: safePage,
    totalPages,
    search: term,
    statuses,
    statusCounts,
    payments,
    paymentCounts,
    dateFrom,
    dateTo,
  };
}

export interface AdminOrderDetail {
  id: number;
  reference: string;
  status: OrderStatusKey;
  paymentMethod: PaymentMethodKey;
  paymentStatus: PaymentStatusKey;
  total: number;
  customer: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
  items: {
    productId: number | null;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    imageUrl: string | null;
  }[];
}

export async function getAdminOrderDetail(id: string) {
  const orderId = Number(id);

  if (!Number.isInteger(orderId) || orderId <= 0) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      total: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { name: true, email: true } },
      items: {
        orderBy: { id: "asc" },
        select: {
          productId: true,
          productName: true,
          quantity: true,
          unitPrice: true,
          total: true,
          product: {
            select: {
              images: {
                orderBy: { sortOrder: "asc" },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      },
    },
  });

  if (!order) return null;

  const detail: AdminOrderDetail = {
    id: order.id,
    reference: `ORD-${String(order.id).padStart(4, "0")}`,
    status: order.status as OrderStatusKey,
    paymentMethod: order.paymentMethod as PaymentMethodKey,
    paymentStatus: order.paymentStatus as PaymentStatusKey,
    total: Number(order.total),
    customer: {
      name: order.user.name ?? "Cliente",
      email: order.user.email,
    },
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
      imageUrl: item.product?.images[0]?.url ?? null,
    })),
  };

  return detail;
}

export async function updateOrderStatus(
  id: number,
  status: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "No autorizado." };

  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, error: "Pedido inválido." };
  }

  if (!ORDER_STATUS_KEYS.includes(status as OrderStatusKey)) {
    return { success: false, error: "Estado inválido." };
  }

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      items: { select: { productId: true, quantity: true } },
    },
  });

  if (!order) return { success: false, error: "Pedido no encontrado." };

  const current = order.status as OrderStatusKey;
  const target = status as OrderStatusKey;

  if (current === target) {
    return { success: false, error: "El pedido ya se encuentra en ese estado." };
  }

  if (!VALID_TRANSITIONS[current]?.includes(target)) {
    return {
      success: false,
      error: "No se puede pasar de este estado a ese estado.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (target === "CANCELLED" && order.paymentStatus === "PAID") {
        for (const item of order.items) {
          if (item.productId) {
            await tx.product.updateMany({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      }
      await tx.order.update({ where: { id }, data: { status: target } });
    });
    return { success: true };
  } catch {
    return { success: false, error: "No se pudo actualizar el pedido." };
  }
}

export async function updateOrderPaymentStatus(
  id: number,
  status: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "No autorizado." };

  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, error: "Pedido inválido." };
  }

  if (status !== "UNPAID" && status !== "PAID") {
    return { success: false, error: "Estado de pago inválido." };
  }

  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      items: { select: { productId: true, quantity: true } },
    },
  });

  if (!order) return { success: false, error: "Pedido no encontrado." };

  if (order.status === "CANCELLED") {
    return {
      success: false,
      error: "No se puede cambiar el pago de un pedido cancelado.",
    };
  }

  const target = status as PaymentStatusKey;

  if (order.paymentStatus === target) {
    return { success: false, error: "El pedido ya se encuentra en ese estado de pago." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (target === "PAID") {
        for (const item of order.items) {
          if (!item.productId) continue;
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { id: true, stock: true },
          });
          if (!product) {
            throw new Error("Un producto del pedido ya no está disponible.");
          }
          if (product.stock < item.quantity) {
            throw new Error(
              `No hay suficiente stock de uno de los productos del pedido. Quedan ${product.stock} unidades.`,
            );
          }
        }
        for (const item of order.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }
      } else {
        for (const item of order.items) {
          if (item.productId) {
            await tx.product.updateMany({
              where: { id: item.productId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
      }
      await tx.order.update({ where: { id }, data: { paymentStatus: target } });
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error && error.message !== "No se pudo actualizar el pago."
          ? error.message
          : "No se pudo actualizar el pago.",
    };
  }
}

export interface OrderPaymentBulkResult {
  id: number;
  reference: string;
  success: boolean;
  error?: string;
}

export async function markOrdersPaid(
  ids: number[],
): Promise<{ success: boolean; error?: string; results?: OrderPaymentBulkResult[] }> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "No autorizado." };

  const validIds = [...new Set(ids)].filter(
    (id) => Number.isInteger(id) && id > 0,
  );
  if (validIds.length === 0) {
    return { success: false, error: "Selecciona al menos un pedido." };
  }

  const results: OrderPaymentBulkResult[] = [];

  try {
    await prisma.$transaction(async (tx) => {
      for (const id of validIds) {
        const order = await tx.order.findUnique({
          where: { id },
          select: {
            id: true,
            status: true,
            paymentStatus: true,
            items: { select: { productId: true, quantity: true } },
          },
        });

        const reference = `ORD-${String(id).padStart(4, "0")}`;

        if (!order) {
          results.push({ id, reference, success: false, error: "Pedido no encontrado." });
          continue;
        }

        if (order.status === "CANCELLED") {
          results.push({ id, reference, success: false, error: "El pedido está cancelado." });
          continue;
        }

        if (order.paymentStatus === "PAID") {
          results.push({ id, reference, success: false, error: "Ya estaba pagado." });
          continue;
        }

        let stockError: string | null = null;

        for (const item of order.items) {
          if (!item.productId) continue;
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { id: true, stock: true },
          });
          if (!product) {
            stockError = "Un producto ya no está disponible.";
            break;
          }
          if (product.stock < item.quantity) {
            stockError = `Stock insuficiente de un producto (quedan ${product.stock}).`;
            break;
          }
        }

        if (stockError) {
          results.push({ id, reference, success: false, error: stockError });
          continue;
        }

        for (const item of order.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }

        await tx.order.update({
          where: { id },
          data: { paymentStatus: "PAID" },
        });

        results.push({ id, reference, success: true });
      }
    });
  } catch {
    return { success: false, error: "No se pudieron actualizar los pedidos." };
  }

  return { success: true, results };
}
