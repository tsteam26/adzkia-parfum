"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Product } from "@/lib/types";
import { ProductGrid } from "./product-grid";
import { Cart } from "./cart";
import { useCartStore } from "@/lib/store/cart";

interface SalesClientProps {
  products: Product[];
  createTransaction: (cartItems: any, total: number) => Promise<any>;
}

export function SalesClient({ products, createTransaction }: SalesClientProps) {
  const [isPending, startTransition] = useTransition();
  const { items: cartItems, clearCart, getFinalTotal } = useCartStore();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Keranjang masih kosong!");
      return;
    }

    const total = getFinalTotal();

    startTransition(async () => {
      const result = await createTransaction(cartItems, total);
      if (result.success) {
        toast.success("Transaksi berhasil!");
        clearCart();
      } else {
        toast.error(`Error: ${result.message}`);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
      {/* Cart - appears first on mobile, second on desktop */}
      <div className="order-1 md:order-2">
        <Cart onCheckout={handleCheckout} isPending={isPending} />
      </div>

      {/* Product Grid - appears second on mobile, first on desktop */}
      <div className="md:col-span-2 order-2 md:order-1">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
