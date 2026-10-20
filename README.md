# 📖 Qurrotul Uyun - Panduan Rumah Tangga & Adab Pernikahan Islami

Aplikasi web modern dan Progressive Web App (PWA) edukasi fiqih munakahat (pernikahan Islam) berbasis Kitab klasik **Qurrotul 'Uyun bi Syarhi Nadzam Ibni Yamun** (*قرة العيون بشرح نظم ابن يامون*) karya Syekh Muhammad al-Tihami ibn al-Madani Kanun al-Idrisi al-Hasani.

Aplikasi ini dirancang untuk pasangan suami istri dan calon pengantin dewasa dalam mempelajari adab pernikahan, malam pertama, etika hubungan suami istri (jima'), hak dan kewajiban keluarga sakinah, kumpulan doa mustajab, kalender waktu syar'i, serta pelacak siklus haid dan masa subur islami yang menjaga privasi penuh pengguna.

---

## 🌟 Fitur Utama

### 1. Kitab Digital 20 Bab Lengkap
* **Syarah dan Nadzam Asli**: Memuat 20 bab lengkap yang mencakup seluruh aspek pernikahan dari hukum nikah, kriteria jodoh, walimah, malam pertama, etika cumbu rayu, posisi jima' yang dihalalkan, mandi wajib, hingga hak kewajiban suami istri dan pendidikan anak.
* **Teks Multi-Format**: Dilengkapi naskah Arab berharakat jelas menggunakan font kaligrafi Amiri, transliterasi Latin, terjemahan Bahasa Indonesia, syarah penjelasan mendalam, serta dalil Al-Qur'an dan Hadits shahih.
* **Pengaturan Baca**: Kontrol ukuran font dinamis (A- / A+), navigasi pasal yang rapi, tombol salin teks, fitur bagikan (*share*), dan penanda bab favorit.

### 2. Kumpulan 13 Doa Mustajab Pernikahan
* Koleksi doa pilihan dari kitab suci dan sunnah Nabi: doa mendekatkan jodoh, doa usai akad nikah, doa memegang kening/ubun-ubun istri pada malam pertama, doa sebelum dan sesudah jima', niat mandi junub, hingga doa memohon anak saleh dan doa penyejuk hati keluarga (*Qurrata A'yun*).
* Filter kategori doa: **Jodoh & Akad**, **Malam Pertama**, **Jima' & Bersuci**, **Kehamilan & Anak**, serta **Keluarga Sakinah**.
* Teks doa lengkap dengan harakat, transliterasi Latin, terjemahan, dan keterangan fadhilah/faedah amalan.

### 3. Panduan Waktu Syar'i (Kalender Hubungan Intim)
* Klasifikasi waktu syar'i berdasarkan anjuran sunnah dan fiqih:
  * **Sangat Dianjurkan (Mustahab)**: Malam Jumat, hari Senin, hari Kamis.
  * **Boleh (Ja'iz)**: Hari Selasa dan Rabu.
  * **Dimakruhkan (Makruh)**: Malam awal/tengah/akhir bulan kamariah, hari Sabtu.
  * **Terlarang (Mamnu')**: Saat istri sedang haid/nifas dan siang hari puasa Ramadhan.
* Mode tampilan: Kalender Bulanan interaktif, Agenda Mingguan, serta Detail Hari dengan fadhilah dan atsar ulama.
* Konversi kalender Hijriyah dan deteksi otomatis bulan suci Ramadhan (*Syahrul Mubarak*) dengan tampilan ornamen tematik.

### 4. Pelacak Siklus Haid & Masa Subur Islami Terpadu
* **Engine Fiqih Wanita Mazhab Syafi'i**: Perhitungan otomatis status darah berdasarkan kaidah fiqih: batas minimal haid (24 jam), batas maksimal (15 hari 15 malam), dan masa suci minimal (15 hari 15 malam).
* **Indikator Status Ibadah Real-Time**: Kejelasan status hukum harian apakah wajib shalat atau haram shalat dan jima'.
* **Perkiraan Masa Subur & Ovulasi**: Estimasi jendela masa subur (*fertile window*) dan hari ovulasi puncak untuk membantu ikhtiar program kehamilan secara alami.
* **Panduan Fiqih Ghusl & Istihadlah**: Tata cara mandi wajib bersuci sesuai rukun dan sunnahnya serta panduan hukum darah penyakit (istihadlah).
* **Pelacak Qadha Puasa Ramadhan**: Fitur pencatatan dan pelacakan pembayaran hutang puasa dengan progress bar interaktif.
* **Pencatatan Harian (Daily Log)**: Catatan warna darah, volume aliran, dan gejala fisik.
* **100% Privacy-First**: Semua data siklus biologis disimpan secara lokal di perangkat pengguna (*Local Storage*), tanpa transmisi data sensitif ke server. Mendukung ekspor dan impor cadangan data JSON.

### 5. Pencarian Cepat Global (Search Modal)
* Pencarian instan untuk menemukan bab kitab, pasal pembahasan, dan doa berdasarkan kata kunci bahasa Indonesia maupun istilah Arab.

### 6. Progressive Web App (PWA) & Offline-First
* Ditenagai oleh **Serwist Service Worker v9.5**.
* Dapat dipasang (*installable*) sebagai aplikasi native di Android, iOS, Windows, dan macOS.
* Mendukung akses offline untuk membaca isi kitab dan doa kapan saja tanpa koneksi internet.

### 7. Desain Islami Modern & Aksesibilitas
* Sentuhan ornamen geometris Islam elegan: *Tazhib corner illumination*, ornamen *Rub el Hizb*, dan pembatas bermotif islami.
* Dukungan penuh **Dark Mode** dan **Light Mode** tanpa efek kedip (*FOUC*) menggunakan `next-themes`.
* Tipografi terkurasi: Amiri untuk kaligrafi Arab dan Geist Sans/Mono untuk antarmuka teks modern.
* Tata letak responsif (*mobile-first*) dengan *bottom navigation bar* yang nyaman diakses via ponsel pintar.

### 8. Sistem Internasionalisasi (i18n)
* Arsitektur lokalisasi native berbasis cookie `NEXT_LOCALE` tanpa prefix URL `[lang]`.
* Mendukung Bahasa Indonesia (default: `id`) dan Bahasa Inggris (`en`).

---

## 📚 Daftar 20 Bab Kitab Qurrotul Uyun

| Bab | Judul Pembahasan | Kategori |
| --- | ---------------- | -------- |
| **Bab 1** | Hukum dan Rukun Pernikahan | Nikah |
| **Bab 2** | Kriteria Memilih Calon Istri & Pasangan Hidup | Nikah |
| **Bab 3** | Waktu yang Tepat untuk Menikah & Berhubungan Intim | Adab |
| **Bab 4** | Tata Cara Pesta Pernikahan (Walimah) & Jamuan Islam | Adab |
| **Bab 5** | Adab Memasuki Kamar Pengantin & Malam Pertama | Adab |
| **Bab 6** | Tata Cara & Etika Bersenggama (Jima') | Hubungan |
| **Bab 7** | Posisi & Variasi dalam Bersenggama | Hubungan |
| **Bab 8** | Doa-Doa Seputar Hubungan Suami Istri | Doa |
| **Bab 9** | Waktu yang Dimakruhkan untuk Berhubungan | Adab |
| **Bab 10** | Adab Mandi Junub (Mandi Wajib) & Bersuci | Kesehatan |
| **Bab 11** | Kewajiban Suami Memberi Nafkah & Mendidik Istri | Hak & Kewajiban |
| **Bab 12** | Adab & Ketaatan Istri Terhadap Suami | Hak & Kewajiban |
| **Bab 13** | Kewajiban Mendidik Anak & Membina Generasi | Keluarga |
| **Bab 14** | Larangan Menyebarkan Rahasia Ranjang | Adab |
| **Bab 15** | Makanan & Pola Hidup Penguat Vitalitas | Kesehatan |
| **Bab 16** | Larangan Hubungan Saat Haid & Kifaratnya | Hubungan |
| **Bab 17** | Hukum Onani / Masturbasi Menurut Syariat | Fiqih |
| **Bab 18** | Mengatasi Perselisihan (Nusyuz) dalam Rumah Tangga | Hak & Kewajiban |
| **Bab 19** | Hukum dan Ketentuan Talak (Perceraian) | Fiqih |
| **Bab 20** | Doa-Doa Rumah Tangga Sakinah Mawaddah Warahmah | Doa |

---

## 🤲 Daftar 13 Kumpulan Doa Mustajab

| ID Doa | Judul Doa | Kategori |
| ------ | --------- | -------- |
| `doa-1` | Doa Mendekatkan Jodoh yang Saleh/Salihah | Jodoh |
| `doa-2` | Doa Usai Ijab Qabul / Akad Nikah | Akad |
| `doa-3` | Doa Memegang Ubun-Ubun / Kening Istri | Malam Pertama |
| `doa-4` | Doa untuk Pengantin Baru (*Barakallahu Laka*) | Akad |
| `doa-5` | Doa Sebelum Bersenggama (Jima') | Jima' |
| `doa-6` | Doa Saat Mengeluarkan Air Mani | Jima' |
| `doa-7` | Doa Setelah Selesai Hubungan Suami Istri | Jima' |
| `doa-8` | Niat Mandi Junub (Mandi Wajib) | Jima' & Bersuci |
| `doa-9` | Doa Memohon Keturunan Anak yang Saleh | Kehamilan |
| `doa-10` | Doa Memohon Anak Laki-Laki yang Saleh | Kehamilan |
| `doa-11` | Doa Keselamatan & Perlindungan Anak Cucu | Keluarga |
| `doa-12` | Doa Penyejuk Hati Keluarga (*Qurrata A'yun*) | Keluarga |
| `doa-13` | Doa Terhindar dari Rumah Tangga Toxic & Fitnah | Keluarga |

---

## 💻 Teknologi yang Digunakan

* **Framework**: Next.js 16.3.6 (App Router, Server Components by default)
* **Frontend Library**: React 19.3.0
* **Bahasa**: TypeScript 6.0.3 (Strict Mode)
* **Styling**: Tailwind CSS v4.3.3 (CSS variables via `@theme inline`)
* **PWA Engine**: Serwist v9.5.13 (`@serwist/next`)
* **Tema**: `next-themes` v0.4.6 (Dark, Light, System)
* **Tipografi**: Google Fonts (`Amiri` untuk teks Arab dan `Geist` untuk antarmuka teks)
* **Keamanan & Utilitas**: Sqids v0.3.0 (ID obfuscation), AES-256-GCM (server cryptography)
* **Testing Framework**: Vitest v5.0.5 (114 automated unit & integration tests)
* **Pengelola Paket**: Bun v1.4.2
* **Linter**: ESLint v9.39.5 (`eslint-config-next` 16.3.6)

---

## 📁 Struktur Direktori Proyek

```
qurrotul-uyun/
├── src/
│   ├── app/                               # Next.js App Router
│   │   ├── _components/                   # Komponen antarmuka global
│   │   │   ├── arabic-viewer.tsx          # Komponen penampil teks Arab berharakat
│   │   │   ├── bottom-nav.tsx             # Navigasi bawah untuk perangkat mobile
│   │   │   ├── copy-share-buttons.tsx     # Tombol interaktif salin & bagikan
│   │   │   ├── font-size-control.tsx      # Kontrol ukuran teks Arab/Latin
│   │   │   ├── footer.tsx                 # Footer aplikasi & disclaimer
│   │   │   ├── header.tsx                 # Header & bilah navigasi utama
│   │   │   ├── islamic-ornaments.tsx      # Komponen Tazhib, Fanous, Hilal, Rosette
│   │   │   ├── language-switcher.tsx      # Pilihan bahasa
│   │   │   ├── mobile-drawer.tsx          # Laci menu mobile
│   │   │   ├── search-modal.tsx           # Modal pencarian cepat bab & doa
│   │   │   └── theme-switcher.tsx         # Pengalih tema gelap/terang
│   │   ├── doa/                           # Halaman & komponen kumpulan doa
│   │   ├── favorit/                       # Halaman penanda (bookmark) konten
│   │   ├── kitab/                         # Halaman pembaca 20 bab kitab
│   │   ├── panduan-waktu/                 # Halaman & kalender waktu syar'i jima'
│   │   ├── siklus-haid/                   # Halaman pelacak haid, masa subur & qadha
│   │   ├── tentang/                       # Halaman profil kitab & pengarang
│   │   ├── globals.css                    # Pengaturan CSS variabel Tailwind v4
│   │   ├── layout.tsx                     # Root Layout, font, & structured data SEO
│   │   ├── manifest.ts                    # Manifest PWA
│   │   ├── page.tsx                       # Halaman beranda utama
│   │   ├── providers.tsx                  # Provider wrapper (ThemeProvider)
│   │   ├── robots.ts                      # Generator robots.txt
│   │   ├── sitemap.ts                     # Generator sitemap.xml
│   │   └── sw.ts                          # Service worker Serwist
│   ├── data/
│   │   └── qurrotul-uyun.json             # Basis data naskah 20 bab & 13 doa
│   ├── dictionaries/
│   │   ├── id.json                        # Terjemahan Bahasa Indonesia
│   │   └── en.json                        # Terjemahan Bahasa Inggris
│   ├── i18n/
│   │   └── config.ts                      # Konfigurasi locale
│   ├── lib/
│   │   ├── calendar-engine.ts             # Kalkulasi kalender Hijriyah & waktu jima'
│   │   ├── cycle-engine.ts                # Engine kalkulasi haid Mazhab Syafi'i & ovulasi
│   │   ├── kitab-data.ts                  # Helper data kitab, doa, & pencarian
│   │   ├── crypto.ts                      # Enkripsi & dekripsi AES-256-GCM (server-only)
│   │   ├── obfuscator.ts                  # Obfuscation ID integer dengan Sqids
│   │   ├── rate-limiter.ts                # Pengendali laju permintaan request
│   │   ├── security-guards.ts             # Pemeriksaan keamanan header & payload
│   │   ├── seo.ts                         # Helper metadata & JSON-LD
│   │   ├── use-cycle-tracker.ts           # React hook state pelacak haid
│   │   └── use-favorites.ts               # React hook bookmark favorit
│   ├── proxy.ts                           # Middleware proxy keamanan
│   └── types/                             # Definisi tipe TypeScript
├── public/                                # Aset statis (logo, ikon PWA)
├── .env.example                           # Template variabel lingkungan
├── GUIDELINE.md                           # Panduan arsitektur & standar pengkodean
├── package.json                           # Skrip & dependensi proyek
├── tsconfig.json                          # Konfigurasi TypeScript Strict
└── vitest.config.mts                      # Konfigurasi pengujian Vitest
```

---

## 🚀 Panduan Instalasi & Pengembangan Lokal

### Prasyarat
Pastikan sistem Anda telah terpasang:
* **Bun** (versi ≥ 1.3 direkomendasikan) atau Node.js (versi ≥ 18)
* Peramban modern dengan dukungan JavaScript aktif

### 1. Kloning Repositori & Masuk ke Direktori
```bash
git clone <URL_REPOSITORI>
cd qurrotul-uyun
```

### 2. Pemasangan Dependensi
Pasang semua paket dependensi menggunakan Bun:
```bash
bun install
```

### 3. Konfigurasi Variabel Lingkungan
Salin berkas contoh `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Variabel yang tersedia:
* `NEXT_PUBLIC_APP_URL`: Alamat URL aplikasi (contoh: `http://localhost:3000` untuk lokal).
* `ENCRYPTION_KEY`: Kunci rahasia 32 karakter (256-bit) untuk utilitas modul AES-GCM.
* `SQIDS_ALPHABET`: Deretan karakter acak unik untuk hash URL Sqids.

### 4. Menjalankan Server Pengembangan
```bash
bun run dev
```
Akses aplikasi melalui peramban di [http://localhost:3000](http://localhost:3000).

### 5. Menjalankan Pengujian Otomatis
Jalankan rangkaian tes unit dan integrasi dengan Vitest:
```bash
bunx vitest run
```
Seluruh 114 skenario pengujian mencakup engine kalender syar'i, engine siklus haid fiqih, komponen ornamen islami, serta modul keamanan proxy.

### 6. Pemeriksaan Kualitas Kode (Linting)
```bash
bun run lint
```

### 7. Membangun untuk Produksi
```bash
bun run build
bun start
```

---

## 📖 Profil Kitab & Pengarang

* **Nama Lengkap Kitab**: *Qurrotul 'Uyun bi Syarhi Nadzam Ibni Yamun* (*قرة العيون بشرح نظم ابن يامون*)
* **Pensyarah (Penulis Syarah)**: **Syekh Muhammad al-Tihami ibn al-Madani Kanun al-Idrisi al-Hasani** (wafat 1331 H / 1913 M), ulama besar, muhaddits, dan faqih dari kota Fes, Maroko, bernasab mulia kepada Rasulullah SAW melalui jalur Sayyidina Hasan bin Ali RA.
* **Pengarang Nadzam (Bait Asli)**: **Syekh Qasim bin Ahmad bin Musa Ibni Yamun al-Tilimsani** (wafat 1010 H).
* **Makna Nama Kitab**: *Qurrotul 'Uyun* bermakna "Penyejuk Pandangan Mata" atau "Penenang Jiwa", dipetik dari firman Allah SWT dalam Al-Qur'an Surat Al-Furqan ayat 74.

---

## ⚠️ Adab & Disclaimer Pembaca Dewasa

Materi di dalam aplikasi ini memuat edukasi fiqih munakahat (hukum perkawinan Islam) yang ditujukan bagi **pasangan suami istri** dan **calon pengantin usia dewasa**.

Pembaca diharapkan mempelajari materi ini dengan niat menuntut ilmu syar'i, menghidupkan sunnah Rasulullah SAW, memelihara keharmonisan rumah tangga, serta menjauhi hal-hal yang diharamkan oleh Allah SWT. Seluruh pembahasan disajikan dengan bahasa santun, beradab, dan berlandaskan dalil-dalil agama Islam.
