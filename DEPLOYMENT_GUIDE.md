# Panduan Deployment - Adzkia Parfum POS

## Masalah Login/Signup Tidak Berfungsi Setelah Deployment

Jika fitur login dan signup tidak berfungsi setelah deployment, kemungkinan besar masalahnya adalah **environment variables tidak terkonfigurasi dengan benar** di platform deployment Anda.

## Solusi: Konfigurasi Environment Variables

### 1. Dapatkan Credentials Supabase Anda

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Pergi ke **Settings** > **API**
4. Salin nilai berikut:
   - **Project URL** (untuk `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 2. Tambahkan Environment Variables di Platform Deployment

Tergantung platform deployment yang Anda gunakan, ikuti panduan berikut:

#### **Vercel**

1. Buka project Anda di [Vercel Dashboard](https://vercel.com/dashboard)
2. Pergi ke **Settings** > **Environment Variables**
3. Tambahkan variabel berikut:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Klik **Save**
5. **Redeploy** aplikasi Anda

#### **Netlify**

1. Buka site Anda di [Netlify Dashboard](https://app.netlify.com)
2. Pergi ke **Site settings** > **Environment variables**
3. Klik **Add a variable**
4. Tambahkan:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Klik **Save**
6. Trigger **new deployment**

#### **Railway**

1. Buka project Anda di [Railway Dashboard](https://railway.app)
2. Pilih service Anda
3. Pergi ke **Variables** tab
4. Tambahkan:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Deployment akan otomatis restart

#### **Platform Lain**

Untuk platform deployment lainnya, cari dokumentasi tentang "environment variables" atau "config vars" dan tambahkan kedua variabel di atas.

### 3. Verifikasi Environment Variables

Setelah menambahkan environment variables dan redeploy:

1. Buka aplikasi Anda di browser
2. Buka **Developer Console** (F12)
3. Coba login atau signup
4. Jika masih ada error, periksa console untuk pesan error yang lebih detail

## Checklist Troubleshooting

- [ ] Environment variables sudah ditambahkan di platform deployment
- [ ] Nama variabel **PERSIS** seperti yang tertulis (case-sensitive)
- [ ] Nilai URL Supabase benar (format: `https://xxx.supabase.co`)
- [ ] Nilai Anon Key benar (string panjang yang dimulai dengan `eyJ...`)
- [ ] Sudah redeploy aplikasi setelah menambahkan env vars
- [ ] Sudah clear cache browser dan coba lagi

## Testing Lokal

Untuk testing di lokal, pastikan file `.env.local` Anda berisi:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**PENTING:** File `.env.local` tidak akan ter-deploy ke production. Anda harus mengkonfigurasi environment variables di platform deployment secara terpisah.

## Konfigurasi Supabase

Pastikan juga di Supabase:

1. **Authentication** sudah diaktifkan
2. **Email provider** sudah dikonfigurasi (jika menggunakan email auth)
3. **Site URL** di Supabase settings sudah diset ke URL production Anda
4. **Redirect URLs** sudah ditambahkan:
   - `https://your-domain.com/auth/callback`
   - `https://your-domain.com/protected`

## Masih Bermasalah?

Jika masih bermasalah setelah mengikuti panduan di atas:

1. Periksa **browser console** untuk error messages
2. Periksa **deployment logs** di platform Anda
3. Pastikan build berhasil tanpa error
4. Coba test dengan incognito/private browsing mode

## Kontak

Jika masih ada masalah, silakan hubungi developer atau buka issue di repository.
