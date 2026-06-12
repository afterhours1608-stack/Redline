# PRD — Mercedes Benz Truck Apparel Store
**Product Requirements Document**
Version 1.0 | Juni 2026

---

## 1. Ringkasan Eksekutif

### 1.1 Visi Produk
Membangun platform e-commerce khusus yang menjual kaos dan merchandise bertema truk Mercedes-Benz untuk komunitas pengemudi truk, mekanik, dan penggemar otomotif berat di Indonesia — dengan pengalaman belanja yang modern, cepat, dan mudah di mobile maupun desktop.

### 1.2 Inspirasi & Referensi
- **Referensi utama:** [stay-loaded.com](https://stay-loaded.com) — e-commerce apparel khusus komunitas trucker Amerika
- **Adaptasi lokal:** Bahasa Indonesia, metode pembayaran lokal (QRIS, transfer bank, e-wallet), pengiriman lokal (JNE, J&T, Sicepat)

### 1.3 Target Pengguna
| Segmen | Deskripsi |
|--------|-----------|
| Pengemudi truk MB | Sopir truk Mercedes-Benz (Actros, Axor, Atego) jarak jauh |
| Mekanik & bengkel | Teknisi spesialis truk berat Mercedes-Benz |
| Komunitas otomotif berat | Penggemar truk dan kendaraan niaga berat |
| Pemilik armada | Perusahaan logistik yang ingin merchandise branding internal |

---

## 2. Arsitektur Sistem

```
┌─────────────────────────────────────────────┐
│              FRONTEND (Next.js / React)      │
│  Landing Page  │  Product Pages  │  Checkout │
└────────────────┬────────────────────────────┘
                 │ REST API / GraphQL
┌────────────────▼────────────────────────────┐
│              BACKEND (Node.js / Laravel)     │
│  Product API  │  Order API  │  Auth API      │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│         DATABASE & SERVICES                  │
│  PostgreSQL  │  Cloudinary  │  Payment GW    │
└─────────────────────────────────────────────┘
```

### 2.1 Opsi Stack Teknologi

**Opsi A — Full Custom (Fleksibel, Biaya Tinggi)**
- Frontend: Next.js 14 + Tailwind CSS
- Backend: Node.js + Express / Laravel 11
- Database: PostgreSQL
- Storage: Cloudinary (gambar produk)
- Payment: Midtrans / Xendit

**Opsi B — Headless CMS (Direkomendasikan untuk MVP)**
- Platform: Shopify (seperti referensi stay-loaded.com)
- Tema: Custom Shopify theme
- Payment: Midtrans plugin Shopify
- CMS: Shopify Admin (built-in)

**Opsi C — Open Source E-commerce**
- Platform: WooCommerce (WordPress) atau Medusa.js
- Hosting: VPS / Niagahoster / Hostinger
- Payment: Midtrans / Duitku

> **Rekomendasi:** Opsi B (Shopify) untuk go-to-market cepat, atau Opsi A jika ingin full kontrol dan ownership data.

---

## 3. Struktur Halaman & Fitur

### 3.1 Landing Page / Storefront

#### Hero Section
- **Headline utama:** Bold, tagline bertema budaya truk MB Indonesia
  - Contoh: *"Built for the Road. Worn with Pride."* / *"Gaya Sopir, Jiwa Actros."*
- **Background:** Video loop atau foto dramatis truk MB di jalan tol / pegunungan
- **CTA button:** "Belanja Sekarang" → arahkan ke katalog produk
- **Announcement bar:** Promo free ongkir, flash sale, atau kode diskon

#### Navigasi Utama
```
Logo | Kaos | Hoodie | Topi | Aksesori | Sale | [Search] [Cart] [Login]
```
- Mega-menu kategori (desktop)
- Hamburger menu (mobile)
- Cart icon dengan badge jumlah item
- Search bar dengan autocomplete

#### Koleksi Unggulan
- Grid produk 2–4 kolom (responsive)
- Badge "Terlaris", "Baru", "Limited Edition"
- Quick-add to cart langsung dari grid
- Hover zoom efek pada gambar produk

#### Kategori Section
- Visual cards per kategori: Kaos Pria, Kaos Wanita, Kaos Anak, Hoodie, Topi, Aksesori
- Masing-masing dengan foto lifestyle model memakai produk

#### Brand Story Section
- Narasi singkat tentang brand (visi, komunitas, nilai)
- Foto lifestyle: truk MB, sopir, jalan panjang
- CTA: "Tentang Kami"

#### Testimonial / Review Section
- Rating bintang 5
- Foto pembeli (opsional)
- Nama kota pembeli
- Kutipan singkat pengalaman

#### Footer
- Logo brand
- Link kategori produk
- Link informasi: Tentang Kami, FAQ, Kebijakan Pengembalian, Hubungi Kami
- Sosial media: Instagram, TikTok, Facebook, YouTube
- Metode pembayaran yang diterima (logo QRIS, BCA, Mandiri, GoPay, OVO, Dana)
- Info pengiriman (logo JNE, J&T, Sicepat)

---

### 3.2 Halaman Katalog / Koleksi

#### Filter & Sort
- Filter: Ukuran (S, M, L, XL, 2XL, 3XL), Harga, Warna, Kategori
- Sort: Terbaru, Terlaris, Harga: Rendah ke Tinggi, Harga: Tinggi ke Rendah
- Filter aktif ditampilkan sebagai tag yang bisa dihapus

#### Product Grid
- 3 kolom desktop, 2 kolom tablet, 1–2 kolom mobile
- Lazy loading gambar
- Skeleton loading saat fetch data
- Infinite scroll atau pagination

---

### 3.3 Halaman Detail Produk (PDP)

#### Galeri Produk
- Gambar utama besar
- Thumbnail gallery (depan, belakang, detail sablon, foto model)
- Zoom on hover (desktop) / pinch-to-zoom (mobile)
- Video produk (opsional)

#### Informasi Produk
- Nama produk
- Harga (dengan coret harga asli jika ada diskon)
- Badge stok: "Tersedia", "Stok Terbatas (3 pcs)", "Habis"
- Pilih ukuran dengan size guide popup
- Pilih warna (color swatch)
- Tombol "Tambah ke Keranjang"
- Tombol "Beli Langsung" → skip cart, langsung checkout
- Share ke sosial media

#### Informasi Tambahan
- Deskripsi produk (material, teknik sablon, cara perawatan)
- Size chart (tabel ukuran dalam CM)
- Estimasi pengiriman berdasarkan kota tujuan
- Tab: Deskripsi | Ulasan Pembeli | Info Pengiriman

#### Produk Terkait
- 4–8 produk dari koleksi yang sama

---

### 3.4 Keranjang Belanja (Cart)

- Slide-out cart drawer (desktop) atau halaman cart penuh (mobile)
- Daftar produk: gambar thumbnail, nama, ukuran, warna, qty, harga
- Ubah qty atau hapus item
- Subtotal realtime
- Input kode promo / voucher
- Estimasi ongkos kirim (masukkan kota)
- Tombol "Lanjut ke Checkout"
- Saran produk: "Mungkin kamu suka juga..."

---

### 3.5 Proses Checkout

#### Step 1 — Informasi Pengiriman
- Nama lengkap, nomor HP, email
- Alamat lengkap: provinsi, kota/kabupaten, kecamatan, kelurahan, kode pos
- Pilih kurir: JNE (REG/YES), J&T (Express), Sicepat (REG/BEST), Anteraja
- Tampilkan estimasi waktu & biaya pengiriman per kurir (via RajaOngkir API)
- Opsi "Simpan alamat ini" untuk user yang login

#### Step 2 — Metode Pembayaran
| Kategori | Pilihan |
|----------|---------|
| Virtual Account | BCA, Mandiri, BNI, BRI, BSI |
| E-Wallet | GoPay, OVO, Dana, ShopeePay, LinkAja |
| QRIS | Scan QR universal |
| Transfer Manual | BCA, Mandiri (konfirmasi manual) |
| Kartu Kredit/Debit | Visa, Mastercard (via Midtrans) |
| COD | Bayar di tempat (tersedia kota tertentu) |

#### Step 3 — Review & Konfirmasi
- Ringkasan pesanan
- Total: subtotal + ongkir + diskon = total bayar
- Tombol "Bayar Sekarang"

#### Step 4 — Konfirmasi Pesanan
- Halaman sukses dengan nomor order
- Email konfirmasi otomatis
- Instruksi pembayaran (jika VA atau transfer manual)
- Tombol "Lacak Pesanan" / "Lanjut Belanja"

---

### 3.6 Halaman Akun Pengguna

- **Register/Login:** Email & password, atau login via Google
- **Dashboard:** Ringkasan pesanan aktif, poin reward (jika ada)
- **Riwayat Pesanan:** Status pesanan, detail item, nomor resi
- **Lacak Pesanan:** Embed tracking kurir
- **Alamat Tersimpan:** Tambah, ubah, hapus alamat
- **Profil:** Ubah nama, email, password, foto profil
- **Wishlist:** Produk yang disimpan

---

## 4. Admin CMS (Content Management System)

### 4.1 Dashboard Admin

```
┌──────────────────────────────────────────────────────────┐
│  🏪 MB Truck Apparel Admin                    [Logout]   │
├──────────┬───────────────────────────────────────────────┤
│          │  📊 Dashboard                                  │
│ Sidebar  │  ─────────────────────────────────────────    │
│          │  Revenue Hari Ini    Pesanan Baru   Stok Habis │
│ Dashboard│  Rp 2.450.000        12 pesanan     3 produk   │
│ Produk   │                                                │
│ Pesanan  │  [Grafik penjualan 30 hari terakhir]           │
│ Pelanggan│  [Produk terlaris]  [Pesanan terbaru]          │
│ Konten   │                                                │
│ Diskon   └───────────────────────────────────────────────┘
│ Laporan  
│ Pengatur.
└──────────
```

### 4.2 Manajemen Produk

**Daftar Produk**
- Tabel: Foto, Nama, SKU, Harga, Stok, Status (Aktif/Draft/Arsip)
- Filter per kategori, status, stok
- Bulk action: aktifkan, nonaktifkan, hapus, ekspor CSV

**Tambah / Edit Produk**
- Nama produk
- Kategori (dengan sub-kategori)
- Deskripsi (rich text editor: bold, italic, list, gambar)
- Upload gambar (drag & drop, urutan bisa diubah, cropping)
- Harga normal & harga coret (sale price)
- Varian: kombinasi ukuran × warna dengan masing-masing stok & SKU
- Berat produk (untuk kalkulasi ongkir)
- Tag/label: "Terlaris", "Baru", "Limited"
- Status: Aktif / Draft
- SEO: meta title, meta description, URL slug

**Manajemen Stok**
- Update stok per varian (massal)
- Notifikasi stok hampir habis (threshold yang bisa diatur)
- Riwayat perubahan stok

**Kategori & Koleksi**
- CRUD kategori dan sub-kategori
- Buat koleksi manual (pilih produk) atau otomatis (berdasarkan tag/kondisi)
- Upload banner koleksi

---

### 4.3 Manajemen Pesanan

**Daftar Pesanan**
- Tabel: No. Order, Tanggal, Pelanggan, Total, Status, Pembayaran
- Filter: status, tanggal, metode bayar, kurir
- Cari berdasarkan nama pelanggan, no. order, email, HP
- Ekspor ke CSV/Excel

**Status Pesanan (Flow)**
```
Menunggu Pembayaran
       ↓
  Pembayaran Dikonfirmasi
       ↓
  Sedang Diproses (Picking & Packing)
       ↓
  Siap Kirim
       ↓
  Sedang Dikirim (+ no. resi)
       ↓
  Terkirim
       ↓
  Selesai (Dikonfirmasi Pembeli)
```

**Detail Pesanan**
- Info pembeli: nama, email, HP, alamat
- Daftar item: nama, ukuran, warna, qty, harga
- Ringkasan biaya: subtotal, ongkir, diskon, total
- Timeline status pesanan
- Input nomor resi pengiriman
- Ubah status pesanan
- Kirim email notifikasi manual ke pembeli
- Tambahkan catatan internal

**Konfirmasi Pembayaran Manual**
- Upload bukti bayar dari pembeli
- Admin verifikasi: Terima / Tolak + catatan

---

### 4.4 Manajemen Pelanggan

- Daftar pelanggan: nama, email, total pesanan, total belanja, terdaftar sejak
- Detail pelanggan: riwayat pesanan, alamat, data akun
- Blokir/aktifkan akun

---

### 4.5 Manajemen Konten

**Homepage Builder (Drag & Drop)**
- Atur urutan section: Hero, Koleksi, Banner Promo, Produk Pilihan, Testimoni
- Edit teks headline, subheadline, teks CTA
- Upload/ganti gambar atau video background
- Toggle tampilkan/sembunyikan section

**Banner & Promo**
- Upload banner promosi
- Atur tanggal tayang dan tanggal berakhir
- Target: homepage, halaman kategori tertentu

**Blog/Artikel** *(opsional)*
- Artikel seputar komunitas truk, perawatan, perjalanan
- Editor rich text
- SEO per artikel

**Halaman Statis**
- Edit halaman: Tentang Kami, FAQ, Kebijakan Pengembalian, Syarat & Ketentuan
- Editor rich text

---

### 4.6 Diskon & Promosi

**Kode Voucher**
- Buat kode promo: nama, kode, tipe (persentase / nominal tetap / free ongkir)
- Minimal pembelian
- Batas penggunaan (total / per user)
- Tanggal berlaku
- Berlaku untuk: semua produk / koleksi tertentu / produk tertentu

**Flash Sale**
- Set produk dengan harga khusus dan stok flash sale
- Countdown timer otomatis di halaman produk
- Tampil di homepage sebagai section khusus

**Free Ongkir**
- Atur threshold minimal belanja untuk free ongkir
- Berlaku per kurir atau semua kurir

---

### 4.7 Laporan & Analitik

| Laporan | Detail |
|---------|--------|
| Penjualan | Revenue per hari/minggu/bulan, rata-rata order value |
| Produk | Produk terlaris, slow-moving, stok habis |
| Pelanggan | Pelanggan baru vs returning, top spender |
| Diskon | Voucher yang digunakan, total diskon yang diberikan |
| Pengiriman | Distribusi kurir, rata-rata waktu kirim |

- Ekspor laporan ke CSV / PDF
- Grafik visualisasi data

---

### 4.8 Pengaturan Sistem

**Informasi Toko**
- Nama toko, alamat, email, nomor HP
- Logo, favicon
- Zona waktu, mata uang

**Pengiriman**
- Integrasi RajaOngkir API untuk kalkulasi ongkir realtime
- Atur kurir yang tersedia
- Tambahkan kota/zona untuk free ongkir atau surcharge
- Berat default dan dimensi default paket

**Pembayaran**
- Konfigurasi Midtrans / Xendit (API Key, Server Key)
- Aktifkan/nonaktifkan metode pembayaran
- Rekening transfer manual (nama bank, no. rekening, nama pemilik)

**Notifikasi Email**
- Template email: konfirmasi pesanan, pembayaran diterima, pesanan dikirim, pesanan selesai
- Email admin untuk notifikasi pesanan baru

**Manajemen Admin**
- Tambah/hapus akun admin
- Role: Super Admin, Admin, Gudang (hanya lihat & proses pesanan)

---

## 5. Desain Visual & UI/UX

### 5.1 Identitas Visual

| Elemen | Spesifikasi |
|--------|------------|
| **Palet Warna Utama** | Hitam `#111111` (dominan), Putih `#FFFFFF`, Silver `#C0C0C0` |
| **Aksen** | Biru Mercedes `#003899` atau Silver Chrome `#A8A9AD` |
| **Font Display** | Font bold industrial — misal: `Barlow Condensed Bold` / `Oswald` |
| **Font Body** | Sans-serif bersih — misal: `Inter` / `Plus Jakarta Sans` |
| **Tone Visual** | Maskulin, industrial, berani, komunitas, jalan raya |

### 5.2 Prinsip UX
- Mobile-first (mayoritas pengguna akses via HP)
- Checkout sesedikit mungkin langkah (maks 3 langkah)
- Loading time < 3 detik (optimasi gambar WebP, lazy load)
- Tombol CTA selalu visible di mobile (sticky bottom bar)

### 5.3 Elemen Signature
- **Hero foto:** Truk Mercedes-Benz Actros di jalan malam dengan lampu sorot — background gelap sinematik
- **Product hover:** Flip gambar dari depan ke belakang kaos
- **Size guide:** Popup interaktif dengan ilustrasi pengukuran tubuh

---

## 6. Integrasi Pihak Ketiga

| Layanan | Fungsi | Provider |
|---------|--------|----------|
| Payment Gateway | Proses pembayaran | Midtrans / Xendit |
| Kalkulasi Ongkir | Harga kirim realtime | RajaOngkir API |
| Email Transaksional | Email konfirmasi & notifikasi | Mailgun / Brevo |
| Penyimpanan Gambar | CDN foto produk | Cloudinary / Shopify CDN |
| Analitik | Tracking traffic & konversi | Google Analytics 4 |
| WhatsApp CS | Tombol chat CS | WhatsApp Business API |
| Sosial Login | Login via Google | Google OAuth 2.0 |

---

## 7. Alur Pengguna (User Flow) Utama

### 7.1 Alur Pembelian (Happy Path)
```
Buka Landing Page
      ↓
Browse / Cari Produk
      ↓
Buka Detail Produk
      ↓
Pilih Ukuran & Warna → Tambah ke Keranjang
      ↓
Buka Keranjang → Cek Item
      ↓
Masukkan Kode Promo (opsional)
      ↓
Checkout → Isi Alamat
      ↓
Pilih Kurir & Lihat Ongkir
      ↓
Pilih Metode Pembayaran
      ↓
Review & Bayar
      ↓
Halaman Sukses + Email Konfirmasi
      ↓
Notifikasi WhatsApp / Email saat Paket Dikirim
      ↓
Pesanan Diterima → Review Produk
```

### 7.2 Alur Admin Proses Pesanan
```
Pesanan Masuk (notifikasi email + dashboard)
      ↓
Verifikasi Pembayaran
      ↓
Ubah Status → "Sedang Diproses"
      ↓
Picking & Packing
      ↓
Input Nomor Resi
      ↓
Ubah Status → "Sedang Dikirim"
      ↓
Email Otomatis ke Pembeli (nomor resi + link tracking)
```

---

## 8. Kebutuhan Non-Fungsional

| Aspek | Persyaratan |
|-------|------------|
| **Performa** | Page load < 3 detik (LCP), mobile score Lighthouse > 80 |
| **Keamanan** | HTTPS, enkripsi data sensitif, proteksi CSRF & XSS |
| **Skalabilitas** | Mampu handle 1000 concurrent users saat flash sale |
| **Ketersediaan** | Uptime 99.5% (downtime maks ~43 jam/tahun) |
| **SEO** | Meta tags dinamis, sitemap.xml, schema.org Product markup |
| **Aksesibilitas** | Keyboard navigable, contrast ratio WCAG AA |
| **Mobile** | Responsif penuh, PWA (Progressive Web App) opsional |

---

## 9. Fase Pengembangan (Roadmap)

### Phase 1 — MVP (Bulan 1–2)
- [ ] Landing page + katalog produk (tanpa filter lanjutan)
- [ ] Halaman detail produk
- [ ] Cart & checkout dasar
- [ ] Integrasi Midtrans (VA + QRIS)
- [ ] Integrasi RajaOngkir (kalkulasi ongkir)
- [ ] Admin: manajemen produk & pesanan dasar
- [ ] Email konfirmasi otomatis

### Phase 2 — Peningkatan (Bulan 3–4)
- [ ] Filter & sort produk lanjutan
- [ ] Sistem akun pelanggan (register, login, riwayat pesanan)
- [ ] Kode voucher & diskon
- [ ] Manajemen konten homepage (drag & drop sederhana)
- [ ] Laporan penjualan dasar
- [ ] Review & rating produk

### Phase 3 — Growth (Bulan 5–6)
- [ ] Flash sale + countdown timer
- [ ] Program poin reward
- [ ] Blog komunitas
- [ ] WhatsApp Business notifikasi otomatis
- [ ] PWA (install ke home screen)
- [ ] Analitik lanjutan & ekspor laporan
- [ ] Multi-admin dengan role

---

## 10. Estimasi Biaya Pengembangan

### Opsi B — Shopify (Direkomendasikan untuk cepat launch)
| Item | Estimasi Biaya |
|------|---------------|
| Shopify Basic Plan | ~$29/bulan (~Rp 460.000) |
| Custom tema Shopify | Rp 5–15 juta (sekali bayar) |
| Plugin Midtrans | Gratis – Rp 500.000 |
| Plugin RajaOngkir | Gratis – Rp 300.000 |
| Domain (.com) | ~Rp 200.000/tahun |
| **Total setup** | **~Rp 6–16 juta** |
| **Biaya bulanan** | **~Rp 500.000–1 juta** |

### Opsi A — Full Custom (Kontrol penuh)
| Item | Estimasi Biaya |
|------|---------------|
| Desain UI/UX | Rp 3–8 juta |
| Frontend development | Rp 8–20 juta |
| Backend + CMS | Rp 10–25 juta |
| Integrasi payment + ongkir | Rp 3–5 juta |
| VPS + domain + SSL | Rp 1–3 juta/tahun |
| **Total setup** | **~Rp 25–60 juta** |

---

## 11. Pertanyaan Terbuka (Open Items)

- [ ] Nama brand final untuk toko ini?
- [ ] Apakah ada produk selain kaos? (topi, aksesori, sticker?)
- [ ] Apakah perlu fitur wholesale / order massal untuk perusahaan armada?
- [ ] Bahasa: Indonesia saja, atau ada versi Inggris?
- [ ] Apakah perlu integrasi marketplace (Tokopedia, Shopee) sebagai channel tambahan?
- [ ] COD diperlukan? Untuk area mana saja?
- [ ] Siapa yang akan handle konten & foto produk?

---

## 12. Glosarium

| Istilah | Definisi |
|---------|----------|
| PDP | Product Detail Page — halaman detail produk |
| SKU | Stock Keeping Unit — kode unik per varian produk |
| CMS | Content Management System — sistem kelola konten |
| VA | Virtual Account — metode pembayaran nomor rekening virtual |
| LCP | Largest Contentful Paint — metrik performa web |
| MVP | Minimum Viable Product — versi awal produk yang bisa diluncurkan |

---

*Dokumen ini adalah living document. Versi berikutnya akan diperbarui sesuai feedback stakeholder dan hasil riset pengguna.*

**Dibuat:** Juni 2026 | **Owner:** Product Team | **Status:** Draft v1.0
