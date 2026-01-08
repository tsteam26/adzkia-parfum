# ✅ Deployment Checklist - Adzkia Parfum POS

Gunakan checklist ini untuk memastikan deployment berjalan lancar.

## 📋 Pre-Deployment

### Konfigurasi Supabase
- [ ] Project Supabase sudah dibuat
- [ ] Database tables sudah dibuat (jalankan `database.sql`)
- [ ] Row Level Security (RLS) sudah diaktifkan
- [ ] Authentication > Email provider sudah enabled
- [ ] Sudah punya Project URL dan Anon Key

### Kode & Dependencies
- [ ] Semua perubahan sudah di-commit ke Git
- [ ] `npm install` berhasil tanpa error
- [ ] `npm run build` berhasil tanpa error
- [ ] Tidak ada TypeScript errors
- [ ] `.env.local` sudah dikonfigurasi untuk testing lokal

## 🚀 Deployment

### Platform Hosting (Pilih salah satu)

#### Vercel
- [ ] Project sudah di-push ke GitHub/GitLab/Bitbucket
- [ ] Import project di Vercel
- [ ] Environment variables sudah ditambahkan:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Build & deployment berhasil
- [ ] Domain sudah dikonfigurasi (jika custom domain)

#### Netlify
- [ ] Project sudah di-push ke Git
- [ ] Import site di Netlify
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Environment variables sudah ditambahkan:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Build & deployment berhasil
- [ ] Domain sudah dikonfigurasi (jika custom domain)

#### Railway
- [ ] Project sudah di-push ke GitHub
- [ ] New project di Railway
- [ ] Connect GitHub repository
- [ ] Environment variables sudah ditambahkan:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deployment berhasil
- [ ] Domain sudah tersedia

## ⚙️ Post-Deployment

### Konfigurasi Supabase (PENTING!)
- [ ] Buka Supabase Dashboard > Authentication > URL Configuration
- [ ] Set **Site URL** ke URL production (contoh: `https://adzkia-parfum.vercel.app`)
- [ ] Tambahkan **Redirect URLs**:
  - [ ] `https://your-domain.com/**`
  - [ ] `https://your-domain.com/auth/callback`
  - [ ] `https://your-domain.com/protected`
  - [ ] `http://localhost:3000/**` (untuk development)
- [ ] Save changes

### Testing
- [ ] Buka website di browser
- [ ] Hard refresh (Ctrl+Shift+R atau Cmd+Shift+R)
- [ ] Test halaman utama loading dengan benar
- [ ] Test signup:
  - [ ] Form signup muncul
  - [ ] Bisa input email & password
  - [ ] Submit berhasil
  - [ ] Email konfirmasi diterima (cek spam folder)
- [ ] Test login:
  - [ ] Form login muncul
  - [ ] Bisa input email & password
  - [ ] Login berhasil
  - [ ] Redirect ke dashboard
- [ ] Test fitur utama:
  - [ ] Dashboard loading dengan benar
  - [ ] POS berfungsi
  - [ ] Bisa tambah produk
  - [ ] Bisa buat transaksi
  - [ ] Laporan muncul

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (jika ada Mac)
- [ ] Mobile browser (Chrome Mobile/Safari iOS)

### Performance
- [ ] PageSpeed Insights score > 80
- [ ] Lighthouse score > 80
- [ ] Images loading dengan cepat
- [ ] No console errors di production

## 🐛 Troubleshooting

### Jika Login/Signup Tidak Berfungsi:
1. [ ] Cek browser console (F12) untuk error messages
2. [ ] Verifikasi environment variables di hosting platform
3. [ ] Pastikan nama variabel PERSIS (case-sensitive)
4. [ ] Redeploy setelah menambahkan env vars
5. [ ] Cek Site URL dan Redirect URLs di Supabase
6. [ ] Clear browser cache dan coba lagi
7. [ ] Test di incognito/private mode

### Jika Build Gagal:
1. [ ] Cek build logs di platform hosting
2. [ ] Pastikan `npm run build` berhasil di lokal
3. [ ] Cek TypeScript errors
4. [ ] Pastikan semua dependencies terinstall
5. [ ] Cek Node.js version compatibility

### Jika Database Error:
1. [ ] Cek apakah tables sudah dibuat
2. [ ] Cek RLS policies
3. [ ] Cek Supabase service status
4. [ ] Verifikasi connection string

## 📝 Notes

**Platform yang digunakan:** _________________

**URL Production:** _________________

**Tanggal Deployment:** _________________

**Environment Variables Configured:** ✅ / ❌

**Supabase URL Configuration Done:** ✅ / ❌

**Testing Completed:** ✅ / ❌

---

## 🎉 Deployment Berhasil!

Jika semua checklist di atas sudah ✅, selamat! Aplikasi Anda sudah live dan siap digunakan.

### Next Steps:
- [ ] Share URL ke tim/client
- [ ] Setup monitoring (optional)
- [ ] Setup backup database (optional)
- [ ] Dokumentasikan credentials di tempat aman
- [ ] Setup custom domain (jika belum)

---

**Butuh bantuan?** Lihat:
- [FIX_LOGIN_SIGNUP.md](./FIX_LOGIN_SIGNUP.md) - Panduan fix login/signup
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Panduan deployment lengkap
- [README.md](./README.md) - Dokumentasi utama
