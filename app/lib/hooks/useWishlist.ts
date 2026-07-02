// app/lib/hooks/useWishlist.ts
import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

interface WishlistItem {
  _id: string;
  name: string;
  slug: string;
  images: { url: string }[];
  basePrice: number;
  salePrice?: number;
  avgRating: number;
  reviewCount: number;
  stock: number;
}

interface WishlistStore {
  items:      WishlistItem[];
  loaded:     boolean;
  loading:    boolean;
  fetchWishlist: () => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  toggle:     (productId: string) => Promise<void>;
}

export const useWishlist = create<WishlistStore>((set, get) => ({
  items:   [],
  loaded:  false,
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/api/wishlist");
      set({ items: data.data, loaded: true });
    } catch {
      // Not logged in or error — leave wishlist empty
      set({ items: [], loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  isWishlisted: (productId) => {
    return get().items.some((item) => item._id === productId);
  },

  toggle: async (productId) => {
    const isCurrentlyWishlisted = get().isWishlisted(productId);

    // Optimistic update — instant UI feedback before server confirms
    if (isCurrentlyWishlisted) {
      set((state) => ({ items: state.items.filter((i) => i._id !== productId) }));
    }

    try {
      if (isCurrentlyWishlisted) {
        await axios.delete(`/api/wishlist/${productId}`);
        toast.success("Removed from wishlist");
      } else {
        await axios.post("/api/wishlist", { productId });
        toast.success("Added to wishlist");
        // Refetch to get full product details for the newly added item
        await get().fetchWishlist();
      }
    } catch (err: any) {
      // Roll back optimistic update on failure
      await get().fetchWishlist();
      if (err.response?.status === 401) {
        toast.error("Please login to use wishlist");
      } else {
        toast.error("Something went wrong");
      }
    }
  },
}));