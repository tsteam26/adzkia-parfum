import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ShoppingCart, History, ArrowRight } from "lucide-react";

export default function SalesDashboard() {
  return (
    <div className="container mx-auto py-4 md:py-8 px-4 md:px-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Manajemen Penjualan
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Kelola penjualan dan riwayat transaksi toko Anda
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl">
        {/* POS Card */}
        <Link href="/dashboard/sales/pos" className="group">
          <Card className="h-full border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden relative">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="relative pb-3 md:pb-4">
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <CardTitle className="text-xl md:text-2xl group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Point of Sale (POS)
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Buat transaksi penjualan baru dengan interface yang mudah dan cepat
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                <span>Mulai Transaksi</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* History Card */}
        <Link href="/dashboard/sales/history" className="group">
          <Card className="h-full border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden relative">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="relative pb-3 md:pb-4">
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <History className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <CardTitle className="text-xl md:text-2xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Riwayat Penjualan
              </CardTitle>
              <CardDescription className="text-sm md:text-base">
                Lihat dan kelola semua transaksi yang telah dilakukan
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                <span>Lihat Riwayat</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}