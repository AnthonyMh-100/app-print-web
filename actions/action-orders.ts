"use server";

import moment from "moment";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { CartItem } from "@/interfaces/cart";
import type { PaymentMethodKey, PaymentStatusKey } from "@/interfaces/admin";

type CreateOrderResult =
  | { success: true; data: { id: number } }
  | { success: false; error: string };

class OrderCreationError extends Error {}

export interface MyOrder {
  id: number;
  status: string;
  paymentMethod: PaymentMethodKey;
  paymentStatus: PaymentStatusKey;
  total: number;
  createdAt: string;
  itemCount: number;
  products: {
    name: string;
    quantity: number;
  }[];
}

const USER_ORDERS_PAGE_SIZE = 5;

const PAYMENT_METHOD_KEYS: PaymentMethodKey[] = ["YAPE"];

export interface MyOrdersQuery {
  search?: string;
  page?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface MyOrdersResult {
  orders: MyOrder[];
  totalCount: number;
  page: number;
  totalPages: number;
  search: string;
  dateFrom: string;
  dateTo: string;
}

export async function getMyOrders(
  query: MyOrdersQuery = {},
): Promise<MyOrdersResult | null> {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!session?.user || !Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  const page = Math.max(1, query.page ?? 1);
  const term = (query.search ?? "").trim().toLowerCase();
  const dateFrom = moment(query.dateFrom, "YYYY-MM-DD", true).isValid()
    ? moment(query.dateFrom, "YYYY-MM-DD").format("YYYY-MM-DD")
    : "";
  const dateTo = moment(query.dateTo, "YYYY-MM-DD", true).isValid()
    ? moment(query.dateTo, "YYYY-MM-DD").format("YYYY-MM-DD")
    : "";
  const numericMatch = term.replace(/\D/g, "");

  const where = {
    userId,
    ...(term
      ? {
          OR: [
            ...(numericMatch ? [{ id: Number(numericMatch) }] : []),
            {
              items: {
                some: {
                  productName: { contains: term, mode: "insensitive" as const },
                },
              },
            },
          ],
        }
      : {}),
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
  };

  const totalCount = await prisma.order.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / USER_ORDERS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (safePage - 1) * USER_ORDERS_PAGE_SIZE,
    take: USER_ORDERS_PAGE_SIZE,
    select: {
      id: true,
      status: true,
      paymentMethod: true,
      paymentStatus: true,
      total: true,
      createdAt: true,
      items: { select: { productName: true, quantity: true } },
    },
  });

  return {
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      paymentMethod: order.paymentMethod as PaymentMethodKey,
      paymentStatus: order.paymentStatus as PaymentStatusKey,
      total: Number(order.total),
      createdAt: order.createdAt.toISOString(),
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      products: order.items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
      })),
    })),
    totalCount,
    page: safePage,
    totalPages,
    search: term,
    dateFrom,
    dateTo,
  };
}

export async function createOrder(
  items: CartItem[],
  paymentMethod: PaymentMethodKey = "YAPE",
): Promise<CreateOrderResult> {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!session?.user || !Number.isInteger(userId) || userId <= 0) {
    return { success: false, error: "Inicia sesión para crear tu pedido." };
  }

  if (items.length === 0) {
    return { success: false, error: "Tu carrito está vacío." };
  }

  if (!PAYMENT_METHOD_KEYS.includes(paymentMethod)) {
    return { success: false, error: "Método de pago inválido." };
  }

  const orderItems = items.map((item) => ({
    productId: item.productId,
    productName: item.name,
    quantity: item.quantity,
    unitPrice: item.price.toString(),
    total: (item.price * item.quantity).toString(),
  }));

  const total = orderItems.reduce(
    (sum, item) => sum + Number(item.total),
    0,
  );

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of orderItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true },
        });

        if (!product) {
          throw new OrderCreationError(
            `El producto "${item.productName}" ya no está disponible.`,
          );
        }

        if (product.stock < item.quantity) {
          throw new OrderCreationError(
            `No hay suficiente stock de "${item.productName}". Quedan ${product.stock} unidades.`,
          );
        }
      }

      return tx.order.create({
        data: {
          userId,
          paymentMethod,
          total: total.toString(),
          items: { create: orderItems },
        },
        select: { id: true },
      });
    });

    return { success: true, data: { id: order.id } };
  } catch (error) {
    if (error instanceof OrderCreationError) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "No se pudo crear el pedido. Inténtalo de nuevo.",
    };
  }
}
