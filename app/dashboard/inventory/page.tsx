import { getProducts } from "@/lib/supabase/queries";
import { Product } from "@/lib/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AddProductDialog } from "./add-product-dialog";
import { Suspense } from "react";

async function InventoryContent() {
  let products: Product[] = [];
  let error = null;

  try {
    products = await getProducts();
  } catch (e: any) {
    error = e;
  }

  return (
    <>
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <DataTable columns={columns} data={products} />
    </>
  );
}

export default function InventoryPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventori Produk</h1>
        <AddProductDialog />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <InventoryContent />
      </Suspense>
    </div>
  );
}