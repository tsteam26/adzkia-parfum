import { getDashboardStats } from "@/lib/supabase/queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";

export async function StatsCards() {
  let totalSalesToday = 0;
  let totalTransactionsToday = 0;
  let lowStockCount = 0;

  try {
    const stats = await getDashboardStats();
    totalSalesToday = stats.totalSalesToday || 0;
    totalTransactionsToday = stats.totalTransactionsToday || 0;
    lowStockCount = stats.lowStockCount || 0;
  } catch (error: any) {
    console.error("Error loading dashboard stats:", error.message);
  }

  const statsData = [
    {
      title: "Total Penjualan Hari Ini",
      value: `Rp ${new Intl.NumberFormat("id-ID").format(totalSalesToday)}`,
      icon: DollarSign,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Jumlah Transaksi Hari Ini",
      value: `+${totalTransactionsToday}`,
      icon: ShoppingCart,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Produk Stok Menipis",
      value: lowStockCount.toString(),
      icon: Package,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
      change: lowStockCount > 0 ? "Perlu perhatian" : "Aman",
      changeType: lowStockCount > 0 ? ("warning" as const) : ("positive" as const),
    },
  ];

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 animate-slide-up">
      {statsData.map((stat, index) => (
        <Card
          key={stat.title}
          className="group relative overflow-hidden border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />

          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
            <CardTitle className="text-xs md:text-sm font-semibold text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${stat.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
          </CardHeader>

          <CardContent className="relative">
            <div className="flex flex-col gap-1 md:gap-2">
              <div className="text-2xl md:text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
              <div className="flex items-center gap-1 text-xs">
                {stat.changeType === "positive" && (
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                )}
                <span className={
                  stat.changeType === "positive"
                    ? "text-green-600 dark:text-green-400 font-medium"
                    : stat.changeType === "warning"
                      ? "text-orange-600 dark:text-orange-400 font-medium"
                      : "text-muted-foreground"
                }>
                  {stat.change}
                </span>
                {stat.changeType === "positive" && (
                  <span className="text-muted-foreground hidden sm:inline">dari kemarin</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

