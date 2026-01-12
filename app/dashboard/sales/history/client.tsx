"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteTransaction } from "../actions";
import { TransactionWithDetails } from "@/lib/types";
import { History, Trash2, Search, Calendar, CreditCard, Banknote, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SalesHistory() {
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions", { cache: 'no-store' });
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Gagal memuat riwayat penjualan");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      return;
    }

    try {
      const result = await deleteTransaction(id);
      if (result.success) {
        toast.success("Transaksi berhasil dihapus");
        setTransactions(transactions.filter(t => t.id !== id));
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Terjadi kesalahan saat menghapus transaksi");
    }
  };

  const filteredTransactions = transactions.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.transaction_items?.some(item => item.products?.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote className="h-4 w-4" />;
      case 'transfer': return <CreditCard className="h-4 w-4" />;
      case 'qris': return <QrCode className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari ID transaksi atau nama produk..."
          className="pl-10 h-12 text-base rounded-xl border-2 focus:border-purple-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-2xl border-2 border-dashed">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-lg mb-1">Tidak ada riwayat penjualan</p>
              <p className="text-sm text-muted-foreground">
                Belum ada transaksi yang dilakukan atau tidak ditemukan hasil pencarian
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="group overflow-hidden border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Left Side: Info */}
                  <div className="flex-1 p-4 md:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                          <History className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">#{transaction.id.substring(0, 8)}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(transaction.created_at).toLocaleString('id-ID', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </div>
                        </div>
                      </div>

                      <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                        {getPaymentIcon(transaction.payment_method)}
                        <span className="capitalize">{transaction.payment_method}</span>
                      </Badge>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      {transaction.transaction_items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.products?.name || 'Produk dihapus'}
                            <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded">
                              {item.volume_ml}ml
                            </span>
                          </span>
                          <span className="font-medium">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Total & Actions */}
                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 p-4 md:p-6 bg-muted/30 md:border-l border-t md:border-t-0 md:w-48 shrink-0">
                    <div className="text-left md:text-center">
                      <p className="text-sm text-muted-foreground mb-1">Total Transaksi</p>
                      <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" suppressHydrationWarning>
                        Rp {transaction.total_amount.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}