import SalesHistory from "./client";

export const metadata = {
    title: "Riwayat Penjualan | Adzkia Parfum",
    description: "Lihat dan kelola riwayat transaksi penjualan",
};

export default function HistoryPage() {
    return (
        <div className="container mx-auto py-4 md:py-8 px-4 md:px-6 animate-fade-in">
            <div className="mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Riwayat Penjualan
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                    Pantau semua transaksi penjualan yang telah dilakukan
                </p>
            </div>

            <SalesHistory />
        </div>
    );
}
