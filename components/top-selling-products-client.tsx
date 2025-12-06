"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Package, Calendar, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TopProduct {
    id: string;
    name: string;
    selling_price_per_ml: number;
    stock_ml: number;
    total_volume_sold: number;
    total_revenue: number;
    transaction_count: number;
}

interface TopSellingProductsClientProps {
    initialTopByVolume: TopProduct[];
    initialTopByRevenue: TopProduct[];
    onFetchData: (days: number, limit: number) => Promise<{ topByVolume: TopProduct[]; topByRevenue: TopProduct[] }>;
}

const PERIOD_OPTIONS = [
    { label: "Hari Ini", days: 1 },
    { label: "7 Hari", days: 7 },
    { label: "30 Hari", days: 30 },
    { label: "3 Bulan", days: 90 },
    { label: "6 Bulan", days: 180 },
    { label: "1 Tahun", days: 365 },
];

export function TopSellingProductsClient({
    initialTopByVolume,
    initialTopByRevenue,
    onFetchData
}: TopSellingProductsClientProps) {
    const [viewMode, setViewMode] = useState<"volume" | "revenue">("volume");
    const [selectedPeriod, setSelectedPeriod] = useState(30);
    const [topByVolume, setTopByVolume] = useState(initialTopByVolume);
    const [topByRevenue, setTopByRevenue] = useState(initialTopByRevenue);
    const [isPending, startTransition] = useTransition();

    // State for Dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [allTopByVolume, setAllTopByVolume] = useState<TopProduct[]>([]);
    const [allTopByRevenue, setAllTopByRevenue] = useState<TopProduct[]>([]);
    const [isLoadingAll, setIsLoadingAll] = useState(false);
    const [loadedPeriod, setLoadedPeriod] = useState<number>(0);


    const handlePeriodChange = (days: number) => {
        setSelectedPeriod(days);
        startTransition(async () => {
            const result = await onFetchData(days, 5);
            setTopByVolume(result.topByVolume);
            setTopByRevenue(result.topByRevenue);
        });
    };


    const loadAllData = useCallback(async (days: number) => {
        console.log('Loading all data for period:', days);
        setIsLoadingAll(true);
        try {
            const result = await onFetchData(days, 0); // 0 for no limit
            console.log('Loaded all data:', result);
            setAllTopByVolume(result.topByVolume);
            setAllTopByRevenue(result.topByRevenue);
            setLoadedPeriod(days);
        } catch (error) {
            console.error("Failed to load all data", error);
        } finally {
            setIsLoadingAll(false);
        }
    }, [onFetchData]);

    // Fetch all data when dialog opens or period changes while open
    useEffect(() => {
        console.log('useEffect triggered:', { isDialogOpen, selectedPeriod, loadedPeriod });
        if (isDialogOpen && loadedPeriod !== selectedPeriod) {
            console.log('Conditions met, loading all data...');
            loadAllData(selectedPeriod);
        }
    }, [isDialogOpen, selectedPeriod, loadedPeriod, loadAllData]);

    const currentData = viewMode === "volume" ? topByVolume : topByRevenue;
    const currentAllData = viewMode === "volume" ? allTopByVolume : allTopByRevenue;

    const renderProductItem = (product: TopProduct, index: number, isDialog: boolean = false) => (
        <div
            key={product.id}
            className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border-2 bg-card hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200 ${isDialog ? 'mb-3' : ''}`}
        >
            {/* Rank Badge */}
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-white shrink-0 ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                {index + 1}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm md:text-base line-clamp-1">
                    {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs md:text-sm text-muted-foreground">
                        {viewMode === "volume"
                            ? `${product.transaction_count} transaksi`
                            : `${product.total_volume_sold} ml terjual`
                        }
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                        {viewMode === "volume"
                            ? `Stok: ${product.stock_ml} ml`
                            : `${product.transaction_count} transaksi`
                        }
                    </span>
                </div>
            </div>

            {/* Metric */}
            <div className="text-right shrink-0">
                {viewMode === "volume" ? (
                    <>
                        <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" suppressHydrationWarning>
                            {new Intl.NumberFormat("id-ID").format(product.total_volume_sold)} ml
                        </div>
                        <span className="text-xs text-muted-foreground">Terjual</span>
                    </>
                ) : (
                    <>
                        <div className="text-base md:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" suppressHydrationWarning>
                            Rp {new Intl.NumberFormat("id-ID").format(product.total_revenue)}
                        </div>
                        <span className="text-xs text-muted-foreground">Revenue</span>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <Card className="border-2 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500" />

            <CardHeader className="pb-3 md:pb-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg md:text-xl">Produk Terlaris</CardTitle>
                                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                                    Top 5 produk dengan performa terbaik
                                </p>
                            </div>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20">
                                    Lihat Semua
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                                <DialogHeader>
                                    <DialogTitle>Peringkat Penjualan Produk Lengkap ({currentAllData.length} Produk)</DialogTitle>
                                    <DialogDescription>
                                        Menampilkan performa penjualan semua produk, termasuk yang belum terjual, dalam periode {selectedPeriod} hari terakhir.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex gap-2 bg-muted p-1 rounded-lg w-full sm:w-fit mb-4">
                                    <Button
                                        variant={viewMode === "volume" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("volume")}
                                        className={viewMode === "volume" ? "gradient-primary text-white flex-1 sm:flex-none" : "flex-1 sm:flex-none"}
                                    >
                                        <Package className="h-4 w-4 mr-2" />
                                        Per Volume (ml)
                                    </Button>
                                    <Button
                                        variant={viewMode === "revenue" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("revenue")}
                                        className={viewMode === "revenue" ? "gradient-primary text-white flex-1 sm:flex-none" : "flex-1 sm:flex-none"}
                                    >
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        Per Revenue
                                    </Button>
                                </div>

                                <div className="overflow-y-auto max-h-[60vh] pr-4 -mr-4">
                                    {isLoadingAll ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : currentAllData.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-12">Tidak ada data penjualan</p>
                                    ) : (
                                        <div className="space-y-3 pb-4">
                                            {currentAllData.map((product, index) => renderProductItem(product, index, true))}
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Period Filter */}
                    <div className="flex flex-wrap gap-2">
                        {PERIOD_OPTIONS.map((option) => (
                            <Button
                                key={option.days}
                                variant={selectedPeriod === option.days ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePeriodChange(option.days)}
                                disabled={isPending}
                                className={selectedPeriod === option.days ? "gradient-primary text-white" : ""}
                            >
                                <Calendar className="h-3 w-3 mr-1.5" />
                                {option.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 md:px-6 pb-4 md:pb-6 flex-1">
                <div className="space-y-4 h-full flex flex-col">
                    {/* View Mode Toggle (In-Card) */}
                    <div className="flex gap-2 bg-muted p-1 rounded-lg w-full sm:w-fit">
                        <Button
                            variant={viewMode === "volume" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("volume")}
                            className={viewMode === "volume" ? "gradient-primary text-white flex-1 sm:flex-none" : "flex-1 sm:flex-none"}
                        >
                            <Package className="h-4 w-4 mr-2" />
                            Per Volume (ml)
                        </Button>
                        <Button
                            variant={viewMode === "revenue" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("revenue")}
                            className={viewMode === "revenue" ? "gradient-primary text-white flex-1 sm:flex-none" : "flex-1 sm:flex-none"}
                        >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Per Revenue
                        </Button>
                    </div>

                    {/* Products List (Top 5) */}
                    <div className="space-y-3 relative flex-1">
                        {isPending && (
                            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {currentData.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">Belum ada data penjualan</p>
                        ) : (
                            <>
                                {currentData.map((product, index) => renderProductItem(product, index))}
                                <Button
                                    variant="ghost"
                                    className="w-full mt-2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setIsDialogOpen(true)}
                                >
                                    Lihat Semua Peringkat
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
