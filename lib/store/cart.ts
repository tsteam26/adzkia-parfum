import { create } from "zustand";
import { Product } from "../types";
import { toast } from "sonner";

export type CartItem = {
  product: Product;
  volume_ml: number;
  subtotal: number;
};

type CartState = {
  items: CartItem[];
  manualTotal: number | null;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateItemVolume: (productId: string, volume_ml: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  setManualTotal: (total: number | null) => void;
  resetManualTotal: () => void;
  getFinalTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  manualTotal: null,
  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // If item already exists, increase volume by 1ml
        const newVolume = existingItem.volume_ml + 1;
        if (newVolume > product.stock_ml) {
          toast.error(`Stok ${product.name} tidak mencukupi! Tersedia: ${product.stock_ml} ml`);
          return state;
        }

        return {
          items: state.items.map(item =>
            item.product.id === product.id
              ? {
                ...item,
                volume_ml: newVolume,
                subtotal: newVolume * item.product.selling_price_per_ml
              }
              : item
          )
        };
      }

      // Check if there's enough stock for the default volume
      if (product.stock_ml < 1) {
        toast.error(`Stok ${product.name} tidak mencukupi!`);
        return state;
      }

      const newItem: CartItem = {
        product,
        volume_ml: 1, // Default volume is now 1ml
        subtotal: 1 * product.selling_price_per_ml,
      };
      return { items: [...state.items, newItem] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
  updateItemVolume: (productId, volume_ml) =>
    set((state) => {
      // Make sure volume is at least 1ml
      const finalVolume = Math.max(1, volume_ml);

      const item = state.items.find(item => item.product.id === productId);
      if (!item) return state;

      if (finalVolume > item.product.stock_ml) {
        toast.error(`Volume ${item.product.name} melebihi stok yang tersedia!`);
        return state;
      }

      return {
        items: state.items.map((item) => {
          if (item.product.id === productId) {
            return {
              ...item,
              volume_ml: finalVolume,
              subtotal: finalVolume * item.product.selling_price_per_ml,
            };
          }
          return item;
        }),
      };
    }),
  clearCart: () => set({ items: [], manualTotal: null }),
  getCartTotal: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.subtotal, 0);
  },
  setManualTotal: (total) => set({ manualTotal: total }),
  resetManualTotal: () => set({ manualTotal: null }),
  getFinalTotal: () => {
    const state = get();
    return state.manualTotal !== null ? state.manualTotal : state.getCartTotal();
  }
}));
