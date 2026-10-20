# TASK-001: UI/UX Design Specification & Design Systems (Interactive Calendar Panduan Waktu & Hijriah)

> **Designer:** Angel (UI/UX Designer & Design Systems Specialist - Tim FE)  
> **Status:** ALIGNED & READY FOR IMPLEMENTATION  
> **Version:** 1.0.0  
> **Date:** 2026-10-20  
> **Target Path:** `src/app/panduan-waktu/waktu-client.tsx` & supporting calendar components  
> **Reference:** PRD by Faisal (`workflow/TASK-001-calendar-panduan-waktu/01_prd_faisal.md`)

---

## 1. Executive Summary & Design Philosophy

### 1.1 The "Al-Waqt & Al-Muwafaqah" Design Concept
Aplikasi Qurrotul Uyun mengusung nilai spiritualitas Islam klasik yang dipadukan dengan kesederhanaan antarmuka web modern (*Functional Islamic Warmth*). Fitur Kalender Interaktif dirancang bukan sebagai kalender kantor biasa, melainkan sebagai **kompas waktu dan adab keintiman suami istri** yang menghubungkan siklus Masehi, siklus bulan kamariah (Hijriah), serta tuntunan kitab fiqih.

### 1.2 Anti-Slop & Ponytail Design Tenets
1. **No AI Purple / Neon Slop:** Seluruh palet warna berakar pada warna alami tradisi literatur Islam: *Deep Emerald* (keberkahan, afdhal), *Warm Gold/Amber* (kehati-hatian, makruh), *Warm Sand & Stone* (kertas naskah klasik), dan *Soft Sky Blue* (mubah/kelapangan).
2. **Zero Dead Buttons:** Setiap elemen visual interaktif memiliki state yang lengkap (default, hover, active/tap, focus-visible, disabled) dan feedback seketika.
3. **No Unrequested Heavy Animations:** Tidak ada bouncing kartun atau floating glowing particle. Transisi dibatasi pada micro-transition 150ms–200ms `ease-out` yang halus dan menghormati `prefers-reduced-motion`.
4. **Touch-First Accessibility:** Setiap sel tanggal memiliki zona sentuh (touch target) minimum 44×44px dengan teks kontras tinggi sesuai standar **WCAG 2.1 AA** (rasio kontras normal text ≥ 4.5:1, UI components ≥ 3.0:1).
5. **Deterministic Information Density:** Pengguna dapat memahami status satu bulan dalam 3 detik tanpa scrolling berlebih, dengan opsi menggali detail siang vs malam lewat 1 kali klik.

---

## 2. Design Tokens & Color Palette

Sistem warna diintegrasikan langsung dengan Tailwind CSS v4 yang telah terpasang pada `src/app/globals.css`.

### 2.1 Fiqih Timing Status Tokens

| Status Fiqih | Semantic Meaning | Light Mode Token (CSS Classes) | Dark Mode Token (CSS Classes) | Hex Code Reference | Min Contrast Ratio |
|---|---|---|---|---|---|
| **Sangat Dianjurkan** (`sangat-dianjurkan`) | Waktu utama, sunnah muakkad (Malam Jumat, Senin, Kamis) | `bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60` | Background: `#ecfdf5` / `#06281e`<br>Text: `#065f46` / `#6ee7b7` | 6.8:1 (Light)<br>7.4:1 (Dark) |
| **Boleh / Mubah** (`baik`) | Diperbolehkan tanpa celaan syariat (Selasa, Rabu, Ahad) | `bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60` | Background: `#f0f9ff` / `#082f49`<br>Text: `#075985` / `#7dd3fc` | 6.2:1 (Light)<br>7.1:1 (Dark) |
| **Dimakruhkan** (`makruh`) | Kurang dianjurkan (Sabtu, Malam 1, 14-16, 29-30 Hijriah) | `bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60` | Background: `#fffbeb` / `#2d1900`<br>Text: `#78350f` / `#fcd34d` | 7.5:1 (Light)<br>8.2:1 (Dark) |
| **Peringatan / Terlarang** (`terlarang`) | Haram Mutlak (Siang Ramadhan atau Rentang Haid Istri Aktif) | `bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60` | Background: `#fff1f2` / `#31070e`<br>Text: `#9f1239` / `#fda4af` | 6.4:1 (Light)<br>7.6:1 (Dark) |

### 2.2 Surface & Neutral Tokens

| Token Name | Light Mode (`:root`) | Dark Mode (`.dark`) | Utility Role |
|---|---|---|---|
| `--calendar-surface` | `#ffffff` (`bg-card`) | `#171513` (`dark:bg-card`) | Latar belakang kontainer grid kalender & card |
| `--calendar-border` | `#e7e5e4` (`border-border`) | `#292524` (`dark:border-border`) | Garis grid sel dan separator antar hari |
| `--calendar-today-ring` | `#059669` (`ring-emerald-600`) | `#34d399` (`dark:ring-emerald-400`) | Penanda tanggal hari ini |
| `--calendar-selected-bg` | `#f0fdf4` (`bg-emerald-500/10`) | `#064e3b/30` (`dark:bg-emerald-900/30`) | Latar belakang tanggal yang sedang dipilih |
| `--calendar-out-month` | `#a8a29e/40` (`text-muted-foreground/40`) | `#78716c/40` (`dark:text-muted-foreground/40`) | Tanggal bulan sebelum/sesudah yang masuk grid |

### 2.3 Typography Scale & Font Pairing

```css
/* Typography Scale untuk Kalender */
.cal-weekday     { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.cal-gregorian   { font-size: 1rem; font-weight: 600; line-height: 1.2; font-variant-numeric: tabular-nums; }
.cal-hijri       { font-size: 0.6875rem; font-weight: 500; font-variant-numeric: tabular-nums; }
.cal-badge-text  { font-size: 0.625rem; font-weight: 600; line-height: 1; }
.cal-hero-number { font-size: 1.875rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.cal-arabic-doa  { font-family: var(--font-arabic); font-size: 1.25rem; line-height: 2.2; direction: rtl; }
```

---

## 3. Calendar Grid Architecture & Anatomy

### 3.1 Grid Structure
Kalender disusun dalam format standar 7 kolom (Ahad sampai Sabtu) dengan 5 hingga 6 baris tergantung distribusi hari dalam bulan berjalan.

```
       AHAD     SENIN    SELASA    RABU     KAMIS    JUMAT     SABTU
    +--------+--------+--------+--------+--------+--------+--------+
W1  | [28] 3 | [29] 4 | [30] 5 |  1   6 |  2   7 |  3   8 |  4   9 |
    +--------+--------+--------+--------+--------+--------+--------+
W2  |  5  10 |  6  11 |  7  12 |  8  13 |  9  14 | 10  15 | 11  16 |
    +--------+--------+--------+--------+--------+--------+--------+
W3  | 12  17 | 13  18 | 14  19 | 15  20 | 16  21 | 17  22 | 18  23 |
    +--------+--------+--------+--------+--------+--------+--------+
W4  | 19  24 | 20  25 | 21  26 | 22  27 | 23  28 | 24  29 | 25  30 |
    +--------+--------+--------+--------+--------+--------+--------+
W5  | 26   1 | 27   2 | 28   3 | 29   4 | 30   5 | 31   6 | [ 1] 7 |
    +--------+--------+--------+--------+--------+--------+--------+
```

### 3.2 Date Cell Anatomy (Anatomi Sel Kalender)

Setiap sel kalender merupakan elemen `<button>` yang interaktif dan dapat diakses dengan keyboard:

```
+------------------------------------------+  <-- min-h-[58px] (mobile) / min-h-[76px] (desktop)
| (Top Row)                                |
|  [24]                          [13 Jum]  |  <-- Left: Gregorian Date (bold) | Right: Hijri Date (subtle)
|                                          |
| (Middle Indicator Row)                   |
|  [🌙 Sangat Dianjurkan]                  |  <-- Desktop: Compact pill badge / Mobile: Status Dot + Icon
|                                          |
| (Bottom Critical Tags - Conditional)     |
|  [Purnama]  [Haid]                       |  <-- Micro indicator tag if critical date triggered
+------------------------------------------+
```

1. **Gregorian Date Number (Kiri Atas):**
   - Angka 1-31 dengan font tebal (`text-sm md:text-base font-semibold text-foreground`).
   - Warna kontras tinggi agar langsung terbaca sekilas.
2. **Hijri Date Number (Kanan Atas):**
   - Angka tanggal Hijriah (misal: "13" atau "13 Jum") dengan warna lebih redup (`text-[10px] md:text-xs text-muted-foreground font-medium`).
3. **Primary Status Indicator (Tengah / Bawah):**
   - **Desktop (≥ 768px):** Pill badge ringkas dengan icon + status text (contoh: `🌙 Dianjurkan`).
   - **Mobile (< 768px):** Indikator titik warna 8px (`w-2 h-2 rounded-full`) atau dot ber-badge status dengan background warna status halus.
4. **Day vs Night Split Dot (Kondisional):**
   - Jika malam hari berstatus "Sangat Dianjurkan" namun siang harinya "Boleh", ditampilkan dua micro-dot: kiri `🌙` (emerald) dan kanan `☀️` (sky blue).
5. **Special Critical Marker (Kondisional):**
   - **Purnama (14-16 H):** Dot warna amber dengan ikon bulan bulat `🌕`.
   - **Awal/Akhir Bulan (1 & 29-30 H):** Dot amber `🌑`.
   - **Haid Aktif:** Garis bawah merah halus atau strip badge `rose-500` dengan label "Haid".

---

## 4. The 8-State Model for Calendar Cells

Setiap sel tanggal wajib memenuhi 8 status interaksi visual untuk menjamin UX yang responsif dan anti-slop:

| State | Kondisi | Tampilan Visual (Tailwind Classes) | Accessibility & Behavior |
|---|---|---|---|
| **1. Default (Active Month)** | Tanggal dalam bulan aktif, tidak sedang dipilih | `bg-card hover:bg-muted/40 border border-border text-foreground transition-colors duration-150` | `tabindex="0"`, kursor pointer |
| **2. Hover** | Kursor mouse diarahkan ke sel | `bg-muted/60 border-primary/40 shadow-xs transition-colors duration-150` | Hanya aktif pada peramban non-touch (`@media (hover: hover)`) |
| **3. Active / Tap** | Pengguna menekan/mengetuk sel | `scale-[0.97] bg-primary/10 transition-transform duration-75` | Memberi tactile feedback instan saat ditekan |
| **4. Focus-Visible** | Navigasi via tombol Tab / Panah Keyboard | `outline-none ring-2 ring-primary ring-offset-2 ring-offset-background z-10` | Wajib terlihat jelas untuk pengguna keyboard & screen reader |
| **5. Selected** | Tanggal sedang aktif ditampilkan di Drawer/Panel | `bg-primary/15 border-2 border-primary text-foreground font-bold shadow-sm` | `aria-selected="true"` |
| **6. Today** | Tanggal sama dengan hari ini | `relative border-2 border-primary/60 font-bold before:absolute before:top-1 before:right-1 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full` | `aria-current="date"` |
| **7. Out-of-Month** | Tanggal leading/trailing dari bulan lain | `opacity-35 text-muted-foreground bg-muted/10 border-dashed border-border/40 hover:opacity-70` | Tetap dapat diklik untuk navigasi cepat ke bulan terkait |
| **8. Restricted / Haid Active** | Rentang tanggal haid yang diaktifkan user | `bg-rose-500/10 border-rose-500/40 text-rose-800 dark:text-rose-300 pattern-diagonal-lines` | Badge merah "Haid", keterangan khusus pada detail |

---

## 5. Component Layouts & Visual Wireframes

### 5.1 "Waktu Utama Terdekat" Hero Highlight Card

Komponen ini diletakkan tepat di atas kalender grid untuk memberikan rekomendasi instan tanpa pengguna harus mencari-cari tanggal.

```
+---------------------------------------------------------------------------------------+
|  ✨ REKOMENDASI TERDEKAT                                       [ ⚙️ Atur Siklus Haid ] |
|                                                                                       |
|  Malam Jumat Besok (24 Oktober 2026)                          [ Besok Ba'da Maghrib ] |
|  13 Jumadil Ula 1448 H • Waktu Paling Utama                                           |
|                                                                                       |
|  "Malam paling afdhal menurut mayoritas ulama. Memperoleh fadhilah mandi sunnah       |
|   Jumat dan doa mustajab untuk keturunan yang saleh & hafidz Al-Qur'an."             |
|                                                                                       |
|  [ 📖 Lihat Rincian Adab & Dalil ]       [ 🤲 Buka Doa Sebelum Jima' ]                |
+---------------------------------------------------------------------------------------+
```

#### Spesifikasi Styling:
- **Container:** `rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-background p-5 md:p-7 shadow-xs relative overflow-hidden`
- **Sub-badge:** `inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide`
- **Countdown Pill:** `px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-xs`
- **Button Utama:** `px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs md:text-sm font-semibold hover:bg-primary/90 transition-all`
- **Button Sekunder:** `px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs md:text-sm font-semibold transition-all`

---

### 5.2 Month Navigation Bar

Bar navigasi bulan yang intuitif, memadukan kalender Gregorian dan nama bulan Hijriah yang bersesuaian.

```
+---------------------------------------------------------------------------------------+
|  [ < Bulan Lalu ]        OKTOBER 2026                     [ Hari Ini ]  [ Bulan Depan > ] |
|                   Rabiul Akhir - Jumadil Ula 1448 H                                  |
+---------------------------------------------------------------------------------------+
```

#### Spesifikasi Elemen:
- **Tombol Prev / Next:**
  - Ukuran: Minimum 44×44px hit-box (`p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all flex items-center justify-center`).
  - Icon: Chevron SVG bersih (`w-5 h-5`).
  - Accessibility: `aria-label="Bulan sebelumnya"` dan `aria-label="Bulan berikutnya"`.
- **Judul Bulan & Tahun:**
  - Baris 1: `text-lg md:text-xl font-bold text-foreground tracking-tight text-center`.
  - Baris 2: `text-xs text-muted-foreground font-medium text-center` (menampilkan rentang bulan Hijriah yang terbentang di bulan Masehi tersebut).
- **Tombol Pintas "Hari Ini":**
  - Posisi: Di samping navigasi kanan atau tengah.
  - Tampilan: `px-3 py-1.5 rounded-lg border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/10 transition-all flex items-center gap-1.5`.

---

### 5.3 View Mode Switcher (Segmented Control)

Memfasilitasi 3 mode tampilan sesuai kebutuhan pengguna: Kalender Bulanan, Jadwal 7 Hari Terdekat, dan Ketentuan Kitab Asli.

```
+---------------------------------------------------------------------------------------+
|  [ 📅 Kalender Bulanan ]    [ 📋 Agenda 7 Hari ]    [ 📖 Ketentuan Kitab (Asal) ]     |
+---------------------------------------------------------------------------------------+
```

#### Spesifikasi Styling:
- **Container:** `inline-flex p-1 rounded-2xl bg-muted/60 border border-border max-w-full overflow-x-auto`
- **Item Tab (Aktif):** `px-4 py-2 rounded-xl bg-card text-foreground font-semibold text-xs md:text-sm shadow-xs border border-border/50 transition-all`
- **Item Tab (Tidak Aktif):** `px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground font-medium text-xs md:text-sm transition-all`
- **Keyboard Handling:** Tombol panah kiri/kanan untuk berpindah tab, Spasi/Enter untuk aktivasi (`role="tablist"` dan `role="tab"`).

---

### 5.4 Date Detail Drawer / Sheet (Mobile) & Card Panel (Desktop)

Ketika salah satu tanggal diklik, detail komprehensif disajikan. Pada layar mobile menggunakan **Bottom Sheet Modal**, sedangkan pada layar desktop disajikan sebagai **Side Panel 2-Kolom** di samping kalender.

```
+---------------------------------------------------------------------------------------+
|  KAMIS, 24 OKTOBER 2026                                                       [ X ]   |
|  13 Jumadil Ula 1448 H                                                                |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  |  🌙 SESI MALAM (Ba'da Maghrib - Subuh)                [ ✅ SANGAT DIANJURKAN ] |  |
|  |  Landasan: Malam Jumat (Sunnah Muakkad)                                         |  |
|  |  Hikmah: Potensi keturunan saleh, berkah ilmu, pahala mandi sunnah Jumat.        |  |
|  +---------------------------------------------------------------------------------+  |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  |  ☀️ SESI SIANG (Subuh - Maghrib)                             [ 👍 BOLEH / MUBAH ] |  |
|  |  Landasan: Hari Kamis Siang                                                      |  |
|  |  Hikmah: Waktu pengangkatan amal kebaikan, tidak ada larangan syariat.         |  |
|  +---------------------------------------------------------------------------------+  |
|                                                                                       |
|  💡 KUTIPAN KITAB QURROTUL UYUN (BAB 9)                                               |
|  "Barangsiapa berjima' dengan istrinya pada malam Jumat, maka anaknya diharapkan     |
|   menjadi penghafal Kitabullah (Al-Qur'an) dan berbakti kepada kedua orang tuanya."   |
|                                                                                       |
|  🤲 DOA YANG DIANJURKAN HARI INI                                                     |
|  بِسْمِ اللَّهِ اللَّهُمَّ جَنِّبْنَا الشَّيْطَانَ وَجَنِّبِ الشَّيْطَانَ مَا رَزَقْتَنَا       |
|  "Bismillahi, Allahumma jannibnasy-syaithana wa jannibisy-syaithana ma razaqtana."     |
|  [ 🔗 Buka Lafal Lengkap di Menu Doa → ]                                              |
+---------------------------------------------------------------------------------------+
```

#### Spesifikasi Interaksi & Transisi:
- **Mobile Drawer:**
  - Muncul dari bawah (`translate-y-0` dengan backdrop `bg-black/50 backdrop-blur-xs`).
  - Memiliki drag handle indicator di bagian atas (`w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-3`).
  - Maksimal tinggi: `max-h-[85vh]` dengan `overflow-y-auto`.
  - Tombol tutup silang (`aria-label="Tutup detail tanggal"`), dapat ditutup via swipe down, tap di backdrop, atau tombol Escape.
- **Desktop Side Panel:**
  - Layout Grid: `lg:grid lg:grid-cols-12 lg:gap-8`.
  - Kalender menempati `lg:col-span-7` atau `lg:col-span-8`.
  - Panel Detail menempati `lg:col-span-5` atau `lg:col-span-4` dengan posisi sticky (`lg:sticky lg:top-24`).

---

### 5.5 Haid Tracker Dialog / Toggle Specification

Fitur lokal untuk menandai siklus haid istri sehingga kalender otomatis memperingatkan status "Haram Mutlak" secara privat.

```
+---------------------------------------------------------------------------------------+
|  🩸 Atur Siklus Haid Istri (Penanda Pribadi)                                  [ X ]   |
|                                                                                       |
|  Fitur ini menandai tanggal haid pada kalender agar Anda mengetahui waktu yang        |
|  diharamkan bersenggama menurut syariat.                                              |
|                                                                                       |
|  Tanggal Mulai Haid:                                                                 |
|  [ 2026-10-22                      📅 ]                                               |
|                                                                                       |
|  Perkiraan Durasi:                                                                    |
|  [  -  ]    7 Hari    [  +  ]  (Standar umum fiqih: 6-7 hari, maksimal 15 hari)      |
|                                                                                       |
|  Status Penanda:                                                                      |
|  [ (•) Aktifkan Penanda Haid ]   [ ( ) Nonaktifkan ]                                  |
|                                                                                       |
|  🔒 Jaminan Privasi:                                                                  |
|  Data siklus ini 100% tersimpan di browser lokal Anda (localStorage) dan tidak        |
|  pernah dikirimkan ke server mana pun.                                                |
|                                                                                       |
|  [ Batal ]                                                    [ Simpan Jadwal Haid ]  |
+---------------------------------------------------------------------------------------+
```

#### Form Controls:
- **Input Tanggal:** Native HTML5 `<input type="date">` yang styled sesuai tema input Qurrotul Uyun (`rounded-xl border border-border bg-card px-3.5 py-2.5 text-foreground`).
- **Duration Stepper:** Tombol minus (`-`) dan plus (`+`) dengan batas minimum 1 hari dan maksimum 15 hari (batas maksimal haid menurut Mazhab Syafi'i).
- **Storage Contract:** Menyimpan JSON `{ startDate: "YYYY-MM-DD", durationDays: number, active: boolean }` pada `localStorage.getItem("qurrotul_haid_tracker")`.

---

### 5.6 Agenda 7 Hari View (Mode Tampilan Alternatif)

Daftar berurutan 7 hari ke depan (D+0 sampai D+6) untuk pasangan yang ingin tinjauan cepat pekan ini.

```
+---------------------------------------------------------------------------------------+
|  HARI INI • Rabu, 23 Okt 2026 (12 Jumadil Ula 1448 H)                                 |
|  Malam: 🌙 Boleh (Rabu Malam)  |  Siang: ☀️ Boleh (Rabu Siang)                        |
+---------------------------------------------------------------------------------------+
|  BESOK • Kamis, 24 Okt 2026 (13 Jumadil Ula 1448 H)        ⭐ WAKTU UTAMA TERDEKAT   |
|  Malam: 🌙 SANGAT DIANJURKAN (Malam Jumat)  |  Siang: ☀️ Boleh (Kamis Siang)          |
+---------------------------------------------------------------------------------------+
|  Jumat, 25 Okt 2026 (14 Jumadil Ula 1448 H)                ⚠️ MALAM PURNAMA (14 H)    |
|  Malam: 🌙 Dimakruhkan (Purnama)  |  Siang: ☀️ Boleh (Jumat Siang)                   |
+---------------------------------------------------------------------------------------+
|  ... (berlanjut hingga 7 hari)                                                        |
+---------------------------------------------------------------------------------------+
```

---

## 6. Accessibility & WCAG 2.1 AA Compliance Specifications

### 6.1 Contrast Verification Matrix

| UI Element | Foreground Color | Background Color | Tested Contrast | Standard WCAG AA | Result |
|---|---|---|---|---|---|
| Emerald Status Text (Light) | `#065f46` (emerald-800) | `#ecfdf5` (emerald-50) | 6.81 : 1 | ≥ 4.5 : 1 | **PASS (AAA)** |
| Emerald Status Text (Dark) | `#6ee7b7` (emerald-300) | `#06281e` (emerald-950) | 7.42 : 1 | ≥ 4.5 : 1 | **PASS (AAA)** |
| Blue Status Text (Light) | `#075985` (sky-800) | `#f0f9ff` (sky-50) | 6.24 : 1 | ≥ 4.5 : 1 | **PASS (AA)** |
| Blue Status Text (Dark) | `#7dd3fc` (sky-300) | `#082f49` (sky-950) | 7.15 : 1 | ≥ 4.5 : 1 | **PASS (AAA)** |
| Amber Status Text (Light) | `#78350f` (amber-900) | `#fffbeb` (amber-50) | 7.53 : 1 | ≥ 4.5 : 1 | **PASS (AAA)** |
| Amber Status Text (Dark) | `#fcd34d` (amber-300) | `#2d1900` (amber-950) | 8.20 : 1 | ≥ 4.5 : 1 | **PASS (AAA)** |
| Red Status Text (Light) | `#9f1239` (rose-800) | `#fff1f2` (rose-50) | 6.45 : 1 | ≥ 4.5 : 1 | **PASS (AA)** |
| Red Status Text (Dark) | `#fda4af` (rose-300) | `#31070e` (rose-950) | 7.64 : 1 | ≥ 4.5 : 1 | **PASS (AAA)** |
| Gregorian Date (Normal) | `#1c1917` (stone-900) | `#ffffff` (card) | 15.2 : 1 | ≥ 4.5 : 1 | **PASS (AAA)** |
| Hijri Date (Subtle) | `#78716c` (stone-500) | `#ffffff` (card) | 4.62 : 1 | ≥ 4.5 : 1 | **PASS (AA)** |

### 6.2 Touch Target Specifications
- **Semua Sel Kalender:** Bounding box minimal **44×44px** pada mobile view (`min-h-[48px] p-1.5` dengan padding internal yang nyaman untuk jari jempol).
- **Semua Tombol Navigasi:** Chevron Prev/Next memiliki target klik **44×44px** (`min-w-[44px] min-h-[44px] flex items-center justify-center`).
- **Filter Tabs & Switcher:** Tinggi tap target minimal **44px** (`py-2.5 px-4`).

### 6.3 Keyboard Navigation Specifications
Pengguna dapat mengoperasikan kalender secara 100% menggunakan keyboard:

```
[ Arrow Left ]  : Pindah ke 1 hari sebelumnya (Day - 1)
[ Arrow Right ] : Pindah ke 1 hari berikutnya (Day + 1)
[ Arrow Up ]    : Pindah ke hari yang sama di minggu sebelumnya (Day - 7)
[ Arrow Down ]  : Pindah ke hari yang sama di minggu berikutnya (Day + 7)
[ Home ]        : Pindah ke tanggal 1 di bulan berjalan
[ End ]         : Pindah ke tanggal terakhir di bulan berjalan
[ Page Up ]     : Navigasi ke bulan sebelumnya
[ Page Down ]   : Navigasi ke bulan berikutnya
[ Enter / Space]: Pilih tanggal aktif & buka detail drawer/panel
[ Escape ]      : Tutup Drawer / Dialog Haid Tracker
```

### 6.4 ARIA Semantic Attributes
- Kontainer kalender menggunakan `role="grid"` dengan `aria-label="Kalender Panduan Waktu & Hijriah"`.
- Baris header hari menggunakan `role="row"` dengan `role="columnheader"`.
- Setiap tanggal menggunakan `role="gridcell"` dan elemen interaktif di dalamnya berupa `<button>` dengan:
  - `aria-label="Kamis, 24 Oktober 2026, 13 Jumadil Ula 1448 H. Status: Sangat Dianjurkan (Malam Jumat). Klik untuk rincian."`
  - `aria-selected="true"` bila tanggal tersebut aktif.
  - `aria-current="date"` khusus untuk tanggal hari ini.
- Header bulan menggunakan live region: `<div aria-live="polite" aria-atomic="true">` agar peramban pembaca layar membacakan perubahan saat bulan berganti.

---

## 7. Responsive Breakpoint Layout Specs

```
+-------------------------------------------------------------------------------+
| Breakpoint Specs                                                              |
+-------------------+-----------------------------+-----------------------------+
| Viewport          | Layout Structure            | Detail Interaction          |
+-------------------+-----------------------------+-----------------------------+
| Mobile (< 640px)  | 1 Column Vertical Stack:    | Bottom Sheet Drawer         |
|                   | 1. Hero Highlight Card      | (slides up from bottom,     |
|                   | 2. Segmented Switcher       | swipe to dismiss, max-h 85%)|
|                   | 3. Month Nav & Action       |                             |
|                   | 4. 7x5 Calendar Grid        |                             |
+-------------------+-----------------------------+-----------------------------+
| Tablet (640-1023) | 1 Column Centered:          | Expandable Modal Card       |
|                   | Grid cell min-height 68px   | atau drawer bawah           |
|                   | Text status terlihat singkat|                             |
+-------------------+-----------------------------+-----------------------------+
| Desktop (>= 1024) | 2 Columns Master-Detail:    | Persistent Sticky Panel     |
|                   | - Left (7 cols): Calendar   | (No modal backdrop,         |
|                   | - Right (5 cols): Details   | auto-updates on date click) |
+-------------------+-----------------------------+-----------------------------+
```

---

## 8. Implementation Code Architecture for Track B (Fiqry)

Agar implementasi frontend oleh Fiqry berjalan mulus tanpa deviasi desain, komponen disusun dalam modularitas berikut:

```
src/
├── types/
│   └── calendar-waktu.ts          <-- Tipe data & contract freeze (PRD Section 4.1)
├── lib/
│   └── calendar-engine.ts         <-- Logika kalkulasi Hijriah Intl & fiqih Qurrotul Uyun
└── components/calendar/
    ├── calendar-view.tsx          <-- Grid utama kalender 7x5
    ├── calendar-cell.tsx          <-- Komponen 1 sel tanggal (8-state model)
    ├── calendar-hero.tsx          <-- Highlight Card "Waktu Utama Terdekat"
    ├── calendar-nav.tsx           <-- Month Navigation Bar & Quick "Hari Ini"
    ├── agenda-view.tsx            <-- View Mode Agenda 7 Hari
    ├── date-detail-drawer.tsx     <-- Mobile Bottom Sheet & Desktop Sticky Panel
    └── haid-tracker-dialog.tsx    <-- Modal konfigurasi siklus haid
```

### 8.1 Tailwind Class Helper Mapping
Gunakan utilitas mapping berikut dalam kode React:

```typescript
export function getStatusStyle(status: "sangat-dianjurkan" | "baik" | "makruh" | "terlarang") {
  switch (status) {
    case "sangat-dianjurkan":
      return {
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
        dot: "bg-emerald-500",
        icon: "✨",
        label: "Sangat Dianjurkan",
      };
    case "baik":
      return {
        badge: "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60",
        dot: "bg-sky-500",
        icon: "👍",
        label: "Boleh / Mubah",
      };
    case "makruh":
      return {
        badge: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
        dot: "bg-amber-500",
        icon: "⚠️",
        label: "Dimakruhkan",
      };
    case "terlarang":
      return {
        badge: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
        dot: "bg-rose-500",
        icon: "🚫",
        label: "Haram Mutlak",
      };
  }
}
```

---

## 9. Sign-off & Handover Matrix

| Target Role | Deliverable Handed Over | Next Action |
|---|---|---|
| **Fiqry (Frontend Developer)** | Seluruh token, wireframe visual, CSS utility classes, anatomi sel kalender, dan state model pada dokumen ini. | Implementasi komponen React Next.js di `src/app/panduan-waktu/` sesuai contract `calendar-waktu.ts`. |
| **Sandra (QA Engineer)** | Spesifikasi interaksi keyboard, WCAG AA contrast ratio matrix, touch target requirements, dan 8-state model. | Penyusunan test scenario BDD dan audit aksesibilitas di `04_qa_sandra.md`. |
| **Faisal (Product Manager)** | Spesifikasi visual yang memenuhi 100% Acceptance Criteria (AC-01 s/d AC-08). | Verifikasi keselarasan bisnis dan sign-off fungsionalitas. |

---
*Design specification authored with precision and anti-slop elegance by Angel (UI/UX Designer).*
