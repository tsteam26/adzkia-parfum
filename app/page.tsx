import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sparkles, TrendingUp, Package, ShoppingCart } from "lucide-react";

export default async function Home() {
  // Server-side authentication check - will redirect before any rendering
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!error && user) {
        redirect("/dashboard");
      }
    } catch (error) {
      console.error("Error during authentication check:", error);
    }
  }

  // Render static HTML for unauthenticated users - no dynamic components
  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-64 h-64 md:w-96 md:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-64 h-64 md:w-96 md:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 md:w-96 md:h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center">
        {/* Navigation */}
        <nav className="w-full border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
          <div className="w-full max-w-7xl mx-auto flex justify-between items-center p-3 px-4 md:p-4 md:px-6">
            <div className="flex gap-2 items-center font-bold text-base md:text-xl">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl gradient-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:inline">
                Adzkia Parfum
              </span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent sm:hidden">
                Adzkia
              </span>
            </div>
            <div className="flex gap-2 md:gap-3">
              <a
                href="/auth/sign-up"
                className="px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium rounded-lg md:rounded-xl border border-border hover:bg-secondary transition-all duration-200"
              >
                Sign Up
              </a>
              <a
                href="/auth/login"
                className="px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium rounded-lg md:rounded-xl gradient-primary text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200"
              >
                Sign In
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col gap-8 md:gap-16 max-w-7xl w-full p-4 pt-8 md:p-8 md:pt-20">
          <div className="text-center space-y-4 md:space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs md:text-sm font-medium mb-4 md:mb-6">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                Modern POS System
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight px-2">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                Kelola Toko Parfum
              </span>
              <br />
              <span className="text-foreground">Dengan Mudah</span>
            </h1>

            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Sistem Point of Sale modern untuk mengelola inventori, penjualan, dan laporan toko parfum Anda dengan efisien dan profesional.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4 px-4">
              <a
                href="/auth/sign-up"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold rounded-xl gradient-primary text-white hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-105"
              >
                Mulai Sekarang
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold rounded-xl border-2 border-border hover:bg-secondary transition-all duration-200"
              >
                Masuk ke Dashboard
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 animate-slide-up px-2">
            <div className="group p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl gradient-primary flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Point of Sale</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Proses transaksi penjualan dengan cepat dan mudah menggunakan interface yang intuitif.
              </p>
            </div>

            <div className="group p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl gradient-secondary flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Manajemen Inventori</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Kelola stok parfum Anda dengan sistem tracking yang akurat dan real-time.
              </p>
            </div>

            <div className="group p-4 md:p-6 rounded-xl md:rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl gradient-accent flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Laporan & Analitik</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Dapatkan insight bisnis dengan laporan penjualan dan analitik yang komprehensif.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-border/50 py-6 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
            <p>© 2024 Adzkia Parfum. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}