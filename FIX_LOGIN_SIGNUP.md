# 🔧 Cara Memperbaiki Login & Signup Setelah Deployment

## ❌ Masalah

Fitur login dan signup tidak berfungsi setelah deployment. Ini biasanya terjadi karena **environment variables tidak terkonfigurasi** di platform hosting Anda.

## ✅ Solusi Cepat

### Langkah 1: Dapatkan Credentials Supabase

1. Buka https://app.supabase.com
2. Login dan pilih project Anda
3. Klik **Settings** (ikon gear) di sidebar kiri
4. Klik **API**
5. Salin dua nilai ini:
   - **Project URL** (contoh: `https://abcdefgh.supabase.co`)
   - **anon public** key (string panjang yang dimulai dengan `eyJ...`)

### Langkah 2: Tambahkan ke Platform Deployment

Pilih platform yang Anda gunakan:

<details>
<summary><b>📦 Vercel</b></summary>

1. Buka https://vercel.com/dashboard
2. Pilih project Anda
3. Klik **Settings** tab
4. Klik **Environment Variables** di sidebar
5. Tambahkan variabel baru:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** URL Supabase Anda (dari langkah 1)
   - Pilih **Production**, **Preview**, dan **Development**
   - Klik **Save**
6. Tambahkan variabel kedua:
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Anon key Anda (dari langkah 1)
   - Pilih **Production**, **Preview**, dan **Development**
   - Klik **Save**
7. Klik **Deployments** tab
8. Klik titik tiga (...) pada deployment terakhir
9. Klik **Redeploy**

</details>

<details>
<summary><b>🌐 Netlify</b></summary>

1. Buka https://app.netlify.com
2. Pilih site Anda
3. Klik **Site configuration** > **Environment variables**
4. Klik **Add a variable**
5. Tambahkan:
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** URL Supabase Anda
   - Pilih **All scopes**
   - Klik **Create variable**
6. Klik **Add a variable** lagi
7. Tambahkan:
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Anon key Anda
   - Pilih **All scopes**
   - Klik **Create variable**
8. Klik **Deploys** tab
9. Klik **Trigger deploy** > **Deploy site**

</details>

<details>
<summary><b>🚂 Railway</b></summary>

1. Buka https://railway.app
2. Pilih project Anda
3. Klik service/app Anda
4. Klik tab **Variables**
5. Klik **New Variable**
6. Tambahkan:
   - **Variable:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** URL Supabase Anda
7. Klik **New Variable** lagi
8. Tambahkan:
   - **Variable:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Anon key Anda
9. Railway akan otomatis redeploy

</details>

<details>
<summary><b>☁️ Platform Lain</b></summary>

Cari menu "Environment Variables", "Config Vars", atau "Settings" di dashboard hosting Anda, lalu tambahkan kedua variabel di atas.

</details>

### Langkah 3: Verifikasi

1. Tunggu deployment selesai (biasanya 1-5 menit)
2. Buka website Anda
3. Tekan **Ctrl+Shift+R** (Windows) atau **Cmd+Shift+R** (Mac) untuk hard refresh
4. Coba login atau signup
5. Jika masih error, buka **Developer Console** (F12) untuk melihat error detail

## 🧪 Testing di Lokal

Untuk testing di komputer lokal:

1. Buat file `.env.local` di root project (jika belum ada)
2. Isi dengan:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Ganti `your-project` dan `your-anon-key-here` dengan nilai dari Supabase
4. Jalankan: `npm run check-env` untuk verifikasi
5. Jika OK, jalankan: `npm run dev`

## ⚙️ Konfigurasi Supabase

Pastikan juga di Supabase dashboard:

1. **Authentication** > **Providers** > **Email** sudah enabled
2. **Authentication** > **URL Configuration**:
   - **Site URL:** `https://your-domain.com` (URL production Anda)
   - **Redirect URLs:** Tambahkan:
     - `https://your-domain.com/**`
     - `http://localhost:3000/**` (untuk development)

## 🔍 Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"
- Environment variables belum ditambahkan atau salah nama
- Pastikan nama **PERSIS** seperti di atas (case-sensitive)
- Sudah redeploy setelah menambahkan env vars?

### Error: "Invalid API key"
- Anon key salah atau expired
- Cek lagi di Supabase dashboard
- Pastikan copy-paste dengan benar (tidak ada spasi di awal/akhir)

### Login berhasil tapi redirect error
- Periksa URL configuration di Supabase
- Pastikan Site URL dan Redirect URLs sudah benar

### Masih tidak bisa?
1. Clear browser cache dan cookies
2. Coba di incognito/private mode
3. Periksa browser console (F12) untuk error
4. Periksa deployment logs di platform hosting

## 📚 Dokumentasi Lengkap

Lihat file `DEPLOYMENT_GUIDE.md` untuk panduan lebih detail.

## ✅ Checklist

- [ ] Sudah dapat URL dan Anon Key dari Supabase
- [ ] Sudah tambahkan environment variables di platform hosting
- [ ] Sudah redeploy aplikasi
- [ ] Sudah set Site URL di Supabase
- [ ] Sudah tambahkan Redirect URLs di Supabase
- [ ] Sudah clear cache browser
- [ ] Sudah test login/signup

---

**Masih bermasalah?** Buka issue atau hubungi developer.
