# Adzkia Parfum - Aplikasi Manajemen Toko Parfum Isi Ulang

Aplikasi berbasis web untuk manajemen toko parfum isi ulang. Fokus utama adalah pencatatan transaksi (POS), manajemen stok bibit parfum (dalam mililiter/gram), dan visualisasi data penjualan (laporan laba rugi sederhana).

## Fitur Utama

- **Dashboard**: Ringkasan cepat penjualan harian, jumlah transaksi, dan produk stok menipis
- **Point of Sales (POS)**: Sistem kasir untuk mencatat transaksi penjualan
- **Manajemen Inventori**: CRUD data produk parfum dengan stok dalam ml
- **Laporan**: Histori transaksi dan perhitungan laba rugi

## Teknologi yang Digunakan

- **Frontend**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + Shadcn UI
- **Backend & Auth**: Supabase (PostgreSQL, Auth, Row Level Security)
- **State Management**: React Query (TanStack Query) untuk data server, Zustand untuk state lokal
- **Visualization**: Recharts untuk grafik

## Instalasi

1. Clone repository ini
2. Install dependencies: `npm install`
3. Buat file `.env.local` berdasarkan `.env.example`
4. Setup database Supabase sesuai skema di `database.sql`
5. Jalankan aplikasi: `npm run dev`

## Konfigurasi Supabase

1. Buat proyek Supabase baru
2. Buat tabel-tabel sesuai skema di `database.sql`
3. Tambahkan environment variables di `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Struktur Database

- `profiles`: Data pengguna (toko)
- `products`: Data bibit parfum (nama, stok, harga)
- `transactions`: Data transaksi penjualan
- `transaction_items`: Detail item dalam transaksi

## Fitur Tambahan

- Row Level Security (RLS) untuk isolasi data antar pengguna
- Otomatisasi pengurangan stok setelah transaksi
- Sistem keranjang belanja dengan validasi stok
- Laporan laba berdasarkan perbedaan harga jual dan modal

## Rencana Pengembangan

- Integrasi pembayaran digital (QRIS)
- Manajemen pelanggan
- Fitur notifikasi stok menipis
- Laporan grafik yang lebih lengkap