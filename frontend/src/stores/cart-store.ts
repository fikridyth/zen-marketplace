"use client";

import { create } from "zustand";
import api from "@/lib/axios";
import type { CartItem, CartResponse } from "@/types";
import { toast } from "sonner";

interface CartState {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCartStore: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemCount: 0,
  totalPrice: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get<CartResponse>("/cart");
      set({
        items: response.data.cart_items,
        itemCount: response.data.count,
        totalPrice: response.data.total,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      if (error.response?.status !== 401) {
        console.error("Failed to fetch cart", error);
      }
    }
  },

  addToCart: async (productId: number, quantity: number) => {
    try {
      await api.post("/cart", { product_id: productId, quantity });
      toast.success("Added to cart");
      await get().fetchCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
      throw error;
    }
  },

  updateQuantity: async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    const previousState = {
      items: get().items,
      itemCount: get().itemCount,
      totalPrice: get().totalPrice
    };

    const itemIndex = previousState.items.findIndex(i => i.id === cartItemId);
    if (itemIndex === -1) return;
    
    const item = previousState.items[itemIndex];
    let finalQuantity = quantity;

    if (finalQuantity > item.product.stock) {
      toast.error(`Only ${item.product.stock} items left in stock`);
      finalQuantity = item.product.stock;
    }
    
    if (finalQuantity === item.quantity) return; // No change needed

    const newItems = [...previousState.items];
    const diff = finalQuantity - item.quantity;
    newItems[itemIndex] = { ...item, quantity: finalQuantity };
    
    // Optimistic UI update
    set({
      items: newItems,
      itemCount: previousState.itemCount + diff,
      totalPrice: previousState.totalPrice + (diff * Number(item.product.price))
    });

    try {
      await api.put(`/cart/${cartItemId}`, { quantity: finalQuantity });
    } catch (error: any) {
      // Rollback on error
      set(previousState);
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  },

  removeItem: async (cartItemId: number) => {
    const previousState = {
      items: get().items,
      itemCount: get().itemCount,
      totalPrice: get().totalPrice
    };

    const itemToRemove = previousState.items.find(i => i.id === cartItemId);
    if (!itemToRemove) return;

    const newItems = previousState.items.filter(i => i.id !== cartItemId);
    
    // Optimistic UI update
    set({
      items: newItems,
      itemCount: previousState.itemCount - itemToRemove.quantity,
      totalPrice: previousState.totalPrice - (itemToRemove.quantity * Number(itemToRemove.product.price))
    });

    try {
      await api.delete(`/cart/${cartItemId}`);
      toast.success("Item removed from cart");
    } catch (error: any) {
      // Rollback on error
      set(previousState);
      toast.error("Failed to remove item");
    }
  },

  clearCartStore: () => {
    set({ items: [], itemCount: 0, totalPrice: 0, isLoading: false });
  },
}));
