"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import { updateProduct } from "./actions";
import { Product } from "@/lib/types";

interface EditProductDialogProps {
  product: Product;
  children: React.ReactNode;
}

export function EditProductDialog({
  product,
  children,
}: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (values: any) => {
    startTransition(async () => {
      const result = await updateProduct(product.id, values);
      if (result.success) {
        setOpen(false);
        toast.success("Produk berhasil diperbarui!");
      } else {
        toast.error(`Error: ${result.message}`);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
          <DialogDescription>
            Ubah detail produk di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
