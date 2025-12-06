import { getTopSellingProducts } from "@/lib/supabase/queries";
import { TopSellingProductsClient } from "./top-selling-products-client";

interface TopProduct {
    id: string;
    name: string;
    selling_price_per_ml: number;
    stock_ml: number;
    total_volume_sold: number;
    total_revenue: number;
    transaction_count: number;
}

export async function TopSellingProducts() {
    // Initial load with 30 days
    let initialData: any = { topByVolume: [], topByRevenue: [] };

    try {
        initialData = await getTopSellingProducts(30);
    } catch (error: any) {
        console.error("Error loading top products:", error.message);
    }

    // Server action for period change or load more
    async function handleFetchData(days: number, limit: number = 5): Promise<{ topByVolume: TopProduct[]; topByRevenue: TopProduct[] }> {
        "use server";
        try {
            return await getTopSellingProducts(days, limit);
        } catch (error: any) {
            console.error("Error loading top products:", error.message);
            return { topByVolume: [], topByRevenue: [] };
        }
    }

    return (
        <TopSellingProductsClient
            initialTopByVolume={initialData.topByVolume}
            initialTopByRevenue={initialData.topByRevenue}
            onFetchData={handleFetchData}
        />
    );
}
