# ⚠️ PENTING: Setup Database Customers

## Langkah 1: Cek Apakah Tabel Sudah Ada

1. Buka **Supabase Dashboard**
2. Pilih project Anda
3. Klik **Table Editor** di sidebar kiri
4. Cari tabel bernama **`customers`**

### Jika tabel `customers` BELUM ADA:

Lanjut ke **Langkah 2** di bawah.

### Jika tabel `customers` SUDAH ADA:

Lewati Langkah 2, langsung ke **Langkah 3** untuk test.

---

## Langkah 2: Buat Tabel Customers

1. Di Supabase Dashboard, klik **SQL Editor** di sidebar
2. Klik **New query**
3. Copy SEMUA kode di bawah ini:

```sql
-- Create Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid REFERENCES profiles(id),
  name text NOT NULL,
  address text,
  total_purchases numeric DEFAULT 0
);

-- Enable RLS for customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- RLS policies for customers
CREATE POLICY "Users can view their own customers"
  ON customers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own customers"
  ON customers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own customers"
  ON customers FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own customers"
  ON customers FOR DELETE
  USING (user_id = auth.uid());
```

4. Paste ke SQL Editor
5. Klik **Run** (atau tekan Ctrl+Enter)
6. Tunggu sampai muncul pesan "Success"

---

## Langkah 3: Verifikasi Tabel

1. Kembali ke **Table Editor**
2. Refresh halaman (F5)
3. Cari tabel **`customers`**
4. Klik tabel tersebut
5. Pastikan ada kolom:
   - ✅ `id` (uuid)
   - ✅ `created_at` (timestamptz)
   - ✅ `updated_at` (timestamptz)
   - ✅ `user_id` (uuid)
   - ✅ `name` (text)
   - ✅ `address` (text)
   - ✅ `total_purchases` (numeric)

---

## Langkah 4: Test Aplikasi

1. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

2. Buka browser: `http://localhost:3000`

3. Login ke dashboard

4. Klik menu **Pelanggan** di sidebar

5. Test fitur-fitur:
   - ✅ **Tambah pelanggan baru**
   - ✅ **Search pelanggan**
   - ✅ **Edit pelanggan** (klik icon pensil)
   - ✅ **Hapus pelanggan** (klik icon tempat sampah)

---

## 🔍 Troubleshooting

### Jika fitur Edit/Hapus tidak berfungsi:

1. **Buka Developer Console** (F12)
2. Klik tab **Console**
3. Coba klik tombol Edit atau Hapus
4. Lihat apakah ada error merah
5. Screenshot error tersebut dan kirim ke developer

### Error yang mungkin muncul:

#### Error: "Failed to fetch"
- **Penyebab**: Tabel belum dibuat di Supabase
- **Solusi**: Ulangi Langkah 2

#### Error: "Unauthorized" atau "401"
- **Penyebab**: Belum login atau session expired
- **Solusi**: Logout dan login kembali

#### Error: "RLS policy violation"
- **Penyebab**: RLS policies belum dibuat
- **Solusi**: Jalankan ulang SQL di Langkah 2 (bagian CREATE POLICY)

#### Error: "relation customers does not exist"
- **Penyebab**: Tabel customers belum dibuat
- **Solusi**: Jalankan SQL di Langkah 2

---

## 📝 Catatan

- Pastikan Anda sudah login ke aplikasi
- Setiap user hanya bisa melihat data pelanggan mereka sendiri
- Data tersimpan permanen di Supabase
- Fitur edit dan hapus sudah diupdate untuk Next.js 15

---

## ✅ Checklist Setup

- [ ] Tabel `customers` sudah dibuat di Supabase
- [ ] RLS policies sudah aktif
- [ ] Aplikasi berjalan dengan `npm run dev`
- [ ] Sudah login ke dashboard
- [ ] Menu Pelanggan bisa diakses
- [ ] Bisa tambah pelanggan baru
- [ ] Bisa search pelanggan
- [ ] Bisa edit pelanggan ✨ (BARU DIPERBAIKI)
- [ ] Bisa hapus pelanggan ✨ (BARU DIPERBAIKI)
