"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/lib/types";
import { EditProductDialog } from "./edit-product-dialog";
import { DeleteProductAlert } from "./delete-product-alert";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "stock_ml",
    header: "Stock (ml)",
  },
  {
    accessorKey: "cost_price_per_ml",
    header: "Modal/ml (Rp)",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cost_price_per_ml"));
      const formatted = new Intl.NumberFormat("id-ID").format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "selling_price_per_ml",
    header: "Jual/ml (Rp)",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("selling_price_per_ml"));
      const formatted = new Intl.NumberFormat("id-ID").format(amount);
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <EditProductDialog product={product}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Edit
              </DropdownMenuItem>
            </EditProductDialog>
            <DeleteProductAlert productId={product.id}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DeleteProductAlert>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
