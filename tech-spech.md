Tentu, ini adalah ide yang sangat bagus\! Menggunakan **Next.js (App Router)** dengan **Supabase** adalah kombinasi "Modern Stack" yang sangat powerful, cepat, dan hemat biaya (bahkan gratis untuk skala awal). **Shadcn UI** akan membuat tampilan aplikasi Anda terlihat sangat profesional dan bersih.

Berikut adalah **Technical Specification Document (Tech Spec)** lengkap untuk aplikasi "Perfume Refill POS & Management" Anda.

-----

# Technical Specification: Aplikasi Pembukuan Parfum Isi Ulang

## 1\. Ikhtisar Proyek (Project Overview)

Aplikasi berbasis web untuk manajemen toko parfum isi ulang. Fokus utama adalah pencatatan transaksi (POS), manajemen stok bibit parfum (dalam mililiter/gram), dan visualisasi data penjualan (laporan laba rugi sederhana).

**Tech Stack:**

  * **Frontend:** Next.js 14+ (App Router, TypeScript).
  * **Styling & UI:** Tailwind CSS + Shadcn UI (Radix Primitives).
  * **Backend & Auth:** Supabase (PostgreSQL, Auth, Row Level Security).
  * **State Management:** React Query (TanStack Query) untuk data server, Zustand (opsional) untuk state keranjang belanja lokal.
  * **Visualization:** Recharts (standard library untuk grafik di ekosistem React).

-----

## 2\. Fitur Utama (Key Features)

### A. Dashboard (Halaman Utama)

  * **Ringkasan Cepat:** Kartu statistik menampilkan Total Penjualan Hari Ini, Jumlah Transaksi, dan Stok Menipis.
  * **Grafik Tren:** Grafik batang/garis yang menunjukkan penjualan 7 hari terakhir.
  * 
### B. Point of Sales (Kasir)

  * **Pilih Produk:** Interface grid/list untuk memilih bibit parfum.
  * **Input Varian/Volume:** Input berapa mililiter (ml) yang dibeli (misal: 30ml, 50ml, 100ml) atau memilih ukuran botol standar.
  * **Keranjang Belanja:** List item sementara sebelum checkout.
  * **Kalkulasi Harga:** Otomatis menghitung harga berdasarkan (`harga_per_ml` \* `volume`) + `harga_botol` (jika ada).
  * **Checkout:** Simpan transaksi ke database dan kurangi stok otomatis.

### C. Manajemen Inventori (Produk & Stok)

  * **Database Bibit:** CRUD (Create, Read, Update, Delete) data parfum.
  * **Manajemen Stok:** Input stok awal dalam satuan mililiter (ml).
  * **Harga:** Setting harga jual per ml dan harga modal per ml (untuk hitung profit).

### D. Laporan (Reporting)

  * **Riwayat Transaksi:** Tabel log penjualan lengkap dengan tanggal dan jam.
  * **Laporan Laba:** Menghitung `(Harga Jual - Harga Modal)` untuk melihat keuntungan bersih.

-----

## 3\. Database Schema (PostgreSQL via Supabase)

Desain database ini mengutamakan relasi antara produk dan transaksi.

### Tabel 1: `profiles` (Standard Supabase)

Menyimpan data user (pemilik toko).

  * `id`: uuid (Primary Key, references auth.users)
  * `store_name`: text
  * `created_at`: timestamp

### Tabel 2: `products` (Bibit Parfum)

Menyimpan data bibit parfum.

  * `id`: uuid (Primary Key)
  * `name`: text (Contoh: "Baccarat Rouge 540", "Sauvage")
  * `sku`: text (Opsional, kode unik)
  * `stock_ml`: numeric (Sisa stok dalam ml. Contoh: 500.0)
  * `cost_price_per_ml`: integer (Harga modal per ml)
  * `selling_price_per_ml`: integer (Harga jual per ml)
  * `is_active`: boolean (Default: true)

### Tabel 3: `bottles` (Opsi Botol - Opsional)

Jika Anda menjual botol secara terpisah atau ingin charge harga botol.

  * `id`: uuid
  * `name`: text (Contoh: "Botol Kaca 30ml", "Botol Plastik 50ml")
  * `price`: integer
  * `stock`: integer

### Tabel 4: `transactions` (Header Transaksi)

Mencatat satu kejadian pembelian.

  * `id`: uuid
  * `user_id`: uuid (Foreign Key ke profiles)
  * `total_amount`: integer (Total rupiah transaksi)
  * `payment_method`: text (Tunai/QRIS/Transfer)
  * `created_at`: timestamp (Waktu transaksi)

### Tabel 5: `transaction_items` (Detail Transaksi)

Mencatat detail apa saja yang dibeli dalam satu transaksi.

  * `id`: uuid
  * `transaction_id`: uuid (Foreign Key ke transactions)
  * `product_id`: uuid (Foreign Key ke products)
  * `bottle_id`: uuid (Opsional, jika ada charge botol)
  * `volume_ml`: numeric (Jumlah ml yang dibeli, misal: 30)
  * `price_at_transaction`: integer (Harga saat beli, untuk menjaga data history jika harga produk berubah di masa depan)
  * `subtotal`: integer

-----

## 4\. SQL Quick Setup (Untuk Supabase SQL Editor)

Anda bisa menyalin kode ini langsung ke SQL Editor di dashboard Supabase Anda untuk membuat tabel dasarnya:

```sql
-- Create Products Table
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  stock_ml numeric default 0,
  cost_price_per_ml numeric default 0,
  selling_price_per_ml numeric default 0
);

-- Create Transactions Table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  total_amount numeric default 0,
  payment_method text default 'cash'
);

-- Create Transaction Items Table
create table transaction_items (
  id uuid default gen_random_uuid() primary key,
  transaction_id uuid references transactions(id) on delete cascade,
  product_id uuid references products(id),
  volume_ml numeric not null,
  subtotal numeric not null
);

-- (Optional) Trigger Function untuk Mengurangi Stok Otomatis saat Transaksi dibuat
create or replace function deduct_stock()
returns trigger as $$
begin
  update products
  set stock_ml = stock_ml - new.volume_ml
  where id = new.product_id;
  return new;
end;
$$ language plpgsql;

create trigger tr_deduct_stock
after insert on transaction_items
for each row execute function deduct_stock();
```

-----

## 5\. UI/UX & Komponen Shadcn yang Disarankan

Untuk mempercepat pengembangan, gunakan komponen Shadcn berikut:

1.  **Data Table:** Sangat krusial untuk halaman **Inventory** dan **Riwayat Transaksi**. Fitur sorting dan filtering bawaan Shadcn sangat berguna.
2.  **Dialog (Modal):** Gunakan untuk form "Tambah Produk Baru" atau detail transaksi agar user tidak perlu berpindah halaman.
3.  **Card:** Untuk membungkus statistik di Dashboard.
4.  **Form + React Hook Form + Zod:** Untuk validasi input (misal: harga tidak boleh negatif).
5.  **Combobox / Select:** Untuk memilih parfum saat di halaman Kasir (Searchable dropdown).
6.  **Toast:** Notifikasi sukses saat "Transaksi Berhasil Disimpan".

-----

## 6\. Struktur Folder Next.js (Saran)

```text
app/
├── (auth)/             # Route group untuk Login/Register
│   └── login/
├── dashboard/        # Dashboard layout yang ada Sidebar/Header
│   ├── layout.tsx      # Sidebar menu ada di sini
│   ├── page.tsx        # Dashboard (Stats & Charts)
│   ├── inventory/      # CRUD Produk
│   │   └── page.tsx
│   ├── sales/          # Halaman Kasir (POS)
│   │   └── page.tsx
│   └── reports/        # Halaman Laporan
│       └── page.tsx
├── api/                # Jika butuh route handlers custom
└── layout.tsx
```

-----

## 7\. Langkah Pengembangan (Roadmap)

1.  **Fase 1: Setup & Database:**
      * Inisialisasi Next.js + Shadcn.
      * Setup Supabase Project & Table Creation.
      * Buat halaman Inventory (Bisa tambah/edit/hapus parfum).
2.  **Fase 2: Fitur Kasir (POS):**
      * Buat interface untuk memilih produk.
      * Logic keranjang belanja.
      * Integrasi tombol "Bayar" dengan Supabase (Insert ke `transactions` & `transaction_items`).
3.  **Fase 3: Dashboard & Visualisasi:**
      * Query data penjualan.
      * Pasang grafik menggunakan Recharts.
4.  **Fase 4: Polish:**
      * Authentication (Login/Protect Routes).
      * Deployment ke Vercel.

**Langkah selanjutnya yang bisa saya lakukan untuk Anda:**
Apakah Anda ingin saya buatkan **kode awal (boilerplate) untuk halaman Kasir (POS)** menggunakan komponen Shadcn dan logika keranjang belanjanya?