// app/lib/hooks/useCart.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId:  string;
  variantId?: string;
  name:       string;
  image:      string;
  price:      number;
  quantity:   number;
  sku?:       string;
}

interface CartStore {
  items:       CartItem[];
  addItem:     (item: CartItem) => void;
  removeItem:  (productId: string, variantId?: string) => void;
  updateQty:   (productId: string, variantId: string | undefined, qty: number) => void;
  clearCart:   () => void;
  totalItems:  () => number;
  totalPrice:  () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, item] }));
        }
      },

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),

      updateQty: (productId, variantId, qty) =>
        set((state) => ({
          items: qty <= 0
            ? state.items.filter(
                (i) => !(i.productId === productId && i.variantId === variantId)
              )
            : state.items.map((i) =>
                i.productId === productId && i.variantId === variantId
                  ? { ...i, quantity: qty }
                  : i
              ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems:  () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice:  () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "feelgood-cart" }  // persisted to localStorage
  )
);