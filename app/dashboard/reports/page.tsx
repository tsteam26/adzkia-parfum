import { getTransactions } from "@/lib/supabase/queries";
import { DataTable } from "../inventory/data-table"; // Re-using the data-table component
import { columns } from "./columns";

import { TransactionWithDetails } from "@/lib/types";

export default async function ReportsPage() {
  let transactions: TransactionWithDetails[] = [];
  let error = null;

  try {
    transactions = await getTransactions();
  } catch (e: any) {
    error = e;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Laporan Penjualan</h1>
      </div>
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}