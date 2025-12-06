"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TransactionWithDetails } from "@/lib/types";

// Helper function to calculate profit for a single transaction
const calculateProfit = (transaction: TransactionWithDetails) => {
  if (!transaction.transaction_items) return 0;

  return transaction.transaction_items.reduce((totalProfit, item: any) => {
    if (!item.products || !item.products.cost_price_per_ml) return totalProfit;  // Handle missing data
    const itemCost = item.volume_ml * item.products.cost_price_per_ml;
    const itemProfit = item.subtotal - itemCost;
    return totalProfit + itemProfit;
  }, 0);
};

export const columns: ColumnDef<TransactionWithDetails>[] = [
  {
    accessorKey: "id",
    header: "ID Transaksi",
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        {row.getValue<string>("id")?.slice(0, 8) || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Tanggal",
    cell: ({ row }) => {
      const dateValue = row.getValue("created_at");
      if (!dateValue || typeof dateValue !== 'string') return <div>N/A</div>;

      const date = new Date(dateValue);
      // Check if the date is valid
      if (isNaN(date.getTime())) return <div>N/A</div>;

      const formatted = date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "total_amount",
    header: "Total (Rp)",
    cell: ({ row }) => {
      const amountValue = row.getValue("total_amount");
      const amount = typeof amountValue === 'number' ? amountValue : 0;
      const formatted = new Intl.NumberFormat("id-ID").format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "profit",
    header: "Laba (Rp)",
    cell: ({ row }) => {
      const profit = calculateProfit(row.original);
      const formatted = new Intl.NumberFormat("id-ID").format(profit);
      return <div className="font-medium text-green-600">{formatted}</div>;
    },
  },
  {
    accessorKey: "transaction_items",
    header: "Detail Barang",
    cell: ({ row }) => {
      const items = row.original.transaction_items as any[] || [];
      if (!items || items.length === 0) return <div>-</div>;

      return (
        <ul className="list-disc list-inside">
          {items.map((item: any, index: number) => (
            <li key={index}>
              {item.products?.name || "Produk Tidak Dikenal"} ({item.volume_ml}ml)
            </li>
          ))}
        </ul>
      );
    },
  },
];
