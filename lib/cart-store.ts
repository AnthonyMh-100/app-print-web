"use client";

import { create } from "zustand";
import type { CartItem, CartSummary } from "@/interfaces/cart";

interface AddToCartInput {
  productId: number;
  slug: string;
  name: string;
  price: number;
  cardColor: string | null;
  imageUrl: string | null;
  categoryName: string | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: AddToCartInput, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getSummary: () => CartSummary;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        };
      }

      return {
        items: [...state.items, { ...item, quantity }],
      };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.productId !== productId) };
      }

      return {
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i,
        ),
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),

  clearCart: () => set({ items: [] }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  getSummary: () => {
    const { items } = get();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { count, total };
  },
}));
