import { Metadata } from "next";
import { CustomersClient } from "./customers-client";

export const metadata: Metadata = {
    title: "Pelanggan | Adzkia Parfum",
    description: "Kelola data pelanggan",
};

export default function CustomersPage() {
    return (
        <div className="container mx-auto py-3 md:py-6 px-3 md:px-4">
            <div className="mb-4 md:mb-6">
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 md:mb-2">
                    Pelanggan
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                    Kelola data pelanggan dan riwayat pembelian mereka
                </p>
            </div>
            <CustomersClient />
        </div>
    );
}
