import { create } from "zustand";
import api from "@/lib/axios";
import type { Wishlist } from "@/types";

interface WishlistState {
  wishlists: Wishlist[];
  count: number;
  isLoading: boolean;
  fetchWishlists: () => Promise<void>;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlists: [],
  count: 0,
  isLoading: false,

  fetchWishlists: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/wishlists");
      const wishlists: Wishlist[] = res.data;
      set({ wishlists, count: wishlists.length });
    } catch (error) {
      console.error("Failed to fetch wishlists", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToWishlist: async (productId: number) => {
    try {
      const res = await api.post("/wishlists", { product_id: productId });
      // The API returns the new wishlist item.
      // Refresh the list to get full nested product details if needed, 
      // or just call fetchWishlists. For simplicity, let's fetch again.
      await get().fetchWishlists();
    } catch (error) {
      console.error("Failed to add to wishlist", error);
      throw error;
    }
  },

  removeFromWishlist: async (productId: number) => {
    try {
      await api.delete(`/wishlists/${productId}`);
      const updatedWishlists = get().wishlists.filter(
        (w) => w.product_id !== productId
      );
      set({ wishlists: updatedWishlists, count: updatedWishlists.length });
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
      throw error;
    }
  },

  clearWishlist: () => {
    set({ wishlists: [], count: 0 });
  },
}));
