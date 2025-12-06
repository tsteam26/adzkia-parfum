"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { SalesClient } from "./sales-client";
import { createTransaction } from "../actions";
import { toast } from "sonner";

export default function PointOfSale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Point of Sale (POS)</h1>
      <SalesClient
        products={products}
        createTransaction={createTransaction}
      />
    </div>
  );
}