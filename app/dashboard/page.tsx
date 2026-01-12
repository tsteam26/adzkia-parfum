import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { getSalesTrend } from "@/lib/supabase/queries";
import { StatsCards } from "./stats-cards";
import { SalesChart } from "./sales-chart";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { TopSellingProducts } from "@/components/top-selling-products";

async function SalesChartContent() {
  let salesTrendData: { name: string; total: number }[] = [];

  try {
    salesTrendData = await getSalesTrend();
  } catch (error: any) {
    console.error("Error loading sales trend:", error.message);
    salesTrendData = [];
  }

  return <SalesChart data={salesTrendData} />;
}

async function DashboardContent() {
  return (
    <div className="container mx-auto py-4 md:py-8 px-4 md:px-6 space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Selamat datang kembali! Berikut ringkasan bisnis Anda hari ini.
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      }>
        <StatsCards />
      </Suspense>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Sales Chart */}
        <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500" />
          <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg md:text-xl">Tren Penjualan</CardTitle>
                <CardDescription className="text-xs md:text-sm">Performa penjualan 7 hari terakhir</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-4 md:px-6 pb-4 md:pb-6">
            <Suspense fallback={
              <div className="h-64 md:h-80 rounded-lg bg-muted animate-pulse" />
            }>
              <SalesChartContent />
            </Suspense>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Suspense fallback={
          <div className="h-96 rounded-2xl bg-muted animate-pulse" />
        }>
          <TopSellingProducts />
        </Suspense>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  // Check if user is authenticated
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    // Redirect to login if user is not authenticated
    redirect("/auth/login");
  }

  return (
    <Suspense fallback={
      <div className="container mx-auto py-4 md:py-8 px-4 md:px-6">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="h-32 w-32 mx-auto rounded-full bg-muted animate-pulse mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}