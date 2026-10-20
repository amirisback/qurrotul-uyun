# TASK-001: Interactive Calendar Panduan Waktu & Hijriah - Product Requirement Document (PRD)

> **Author:** Faisal (Product Manager & Business Analyst)  
> **Status:** ALIGNED & FROZEN  
> **Date:** 2026-10-20  
> **Target Path:** `src/app/panduan-waktu/`  

---

## 1. Business Objective & Context

### Problem Statement
Halaman panduan waktu saat ini (`/panduan-waktu`) hanya menampilkan daftar statis ketentuan hari tanpa koneksi langsung ke kalender riil. Pengguna kesulitan memetakan anjuran kitab (seperti Malam Jumat, Hari Senin, purnama tanggal 14-16 Hijriah, atau tanggal awal/akhir bulan) ke kalender masehi hari ini dan hari-hari mendatang. Akibatnya, pengguna harus membuka kalender Hijriah terpisah secara manual untuk mencocokkan waktu.

### User Persona
1. **Pasangan Suami Istri Muslim:** Ingin merencanakan ikhtiar hubungan intim sesuai sunnah dan adab Kitab Qurrotul Uyun tanpa repot menghitung manual hari Hijriah dan waktu utama.
2. **Pengantin Baru:** Membutuhkan panduan praktis harian yang langsung menunjukkan status waktu hari ini ("Apakah malam ini dianjurkan? Kapan waktu utama terdekat?").

### Impact Metric
- **Zero Calculation Friction:** Pengguna langsung mengetahui status waktu hari ini dan 30 hari ke depan dalam 1 layar.
- **Zero External Dependencies:** 100% menggunakan native browser API (`Intl.DateTimeFormat`) tanpa library kalender eksternal (memenuhi standar Ponytail & Next.js performance).
- **Core Web Vitals:** LCP < 1.2s, INP < 100ms, bundle size overhead < 15KB.

---

## 2. Scope & Boundaries

### In Scope
1. **Kalender Grid Interaktif Bulanan:** Sinkronisasi otomatis dengan tanggal hari ini (default view) dan navigasi ke bulan-bulan berikutnya (maju/mundur).
2. **Kalkulasi Hijriah Otomatis (Native JS Intl):** Konversi tanggal Masehi ke kalender Islam (Umm al-Qura) menggunakan `Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura')`.
3. **Klasifikasi Status Waktu Qurrotul Uyun:**
   - **Sangat Dianjurkan (Emerald):** Malam Jumat (Kamis malam), Hari Senin & Malam Senin (Minggu malam), Hari Kamis & Malam Kamis (Rabu malam).
   - **Boleh / Mubah (Blue):** Hari Selasa, Rabu, Ahad siang.
   - **Dimakruhkan (Amber):** Hari Sabtu & Malam Sabtu (Jumat malam), Malam 1 Hijriah, Malam 14-16 Hijriah (Purnama), Malam 29-30 Hijriah (Akhir bulan).
   - **Peringatan Khusus / Terlarang (Red):** Siang hari bulan Ramadhan (puasa wajib) dan penanda periode Haid/Nifas aktif.
4. **Pembedaan Sesi Siang vs Malam:** Menampilkan rincian bahwa dalam fiqih Islam waktu malam dimulai sejak Maghrib (masuk hari Hijriah baru).
5. **Highlight Card "Waktu Utama Terdekat":** Menampilkan rekomendasi waktu paling afdhal terdekat dari tanggal hari ini.
6. **Date Detail Drawer / Modal:** Menampilkan rincian tanggal terpilih (Masehi, Hijriah, status siang/malam, dalil kitab, dan doa yang dianjurkan).
7. **View Mode Toggle:** Pilihan tampilan: Kalender Bulanan, Agenda 7 Hari Terdekat, dan Ketentuan Kitab (daftar bab asal).
8. **Penanda Periode Haid Personal (Client-side):** Toggle sederhana untuk menandai rentang tanggal haid istri yang disimpan di `localStorage` tanpa akun/server.

### Out of Scope (YAGNI / Ponytail)
1. Integrasi Google Calendar / sinkronisasi sync iCal eksternal (YAGNI: Pengguna hanya membutuhkan acuan fiqih di web/PWA).
2. Backend database atau user authentication (semua kalkulasi murni client-side deterministic).
3. Notifikasi push background alarm jam tertentu (cukup rekomendasi tanggal dan slot waktu siang/malam).
4. Penyesuaian hisab/rukyat custom per ormas (menggunakan standar resmi Umm al-Qura via browser Intl engine).

---

## 3. Acceptance Criteria (AC Matrix)

### AC-01: Dynamic Real-Time Date Synchronization & Navigation
```gherkin
Scenario: Pengguna membuka halaman panduan waktu
  Given pengguna mengakses rute "/panduan-waktu"
  When halaman selesai dimuat di peramban
  Then sistem otomatis menetapkan tanggal hari ini (Today) sebagai tanggal aktif terpilih
  And kalender menampilkan bulan dan tahun Gregorian berjalan
  And pengguna dapat menavigasi ke bulan sebelumnya atau bulan-bulan berikutnya dengan tombol navigasi
  And terdapat tombol pintas "Hari Ini" untuk kembali ke bulan dan tanggal saat ini
```

### AC-02: Visual Grid Markers Sesuai Kitab Qurrotul Uyun
```gherkin
Scenario: Tampilan kalender menampilkan penanda visual status hari
  Given kalender berada pada bulan yang aktif
  When tanggal-tanggal dalam bulan tersebut dirender
  Then setiap tanggal memiliki indikator warna status yang jelas:
    | Status | Warna Token Tailwind | Kriteria Hari / Tanggal |
    | Sangat Dianjurkan | Emerald (bg-emerald-500/15 text-emerald-700) | Kamis malam, Senin, Kamis, Minggu malam |
    | Boleh / Mubah | Blue (bg-blue-500/15 text-blue-700) | Selasa, Rabu, Ahad siang |
    | Dimakruhkan | Amber (bg-amber-500/15 text-amber-700) | Sabtu, Jumat malam, Tgl 1, 14-16, 29-30 Hijriah |
    | Terlarang / Peringatan | Red (bg-red-500/15 text-red-700) | Siang Ramadhan atau Rentang Haid aktif |
  And setiap sel tanggal menampilkan angka tanggal Masehi dan tanggal Hijriah kecil di bawahnya
```

### AC-03: Pembedaan Sesi Siang dan Malam (Pergantian Hari Maghrib)
```gherkin
Scenario: Pengguna memeriksa detail pembagian waktu siang dan malam
  Given pengguna memilih tanggal tertentu pada kalender
  When panel detail tanggal terbuka
  Then sistem menyajikan 2 slot waktu terpisah:
    1. Sesi Malam (dimulai ba'da Maghrib hingga terbit fajar)
    2. Sesi Siang (dimulai terbit fajar hingga Maghrib)
  And status hukum dan hikmah masing-masing sesi dijelaskan secara spesifik sesuai kaidah Bab 3 & 9 Qurrotul Uyun
```

### AC-04: Kalkulasi Hijriah Otomatis via Native Intl & Deteksi Tanggal Kritis
```gherkin
Scenario: Deteksi otomatis tanggal kamariah kritis kitab
  Given tanggal Masehi dihitung konversi Hijriahnya melalui "Intl.DateTimeFormat"
  When tanggal Hijriah jatuh pada tanggal 1, 14, 15, 16, 29, atau 30
  Then sistem memberi tag khusus "Malam Awal Bulan", "Malam Purnama (14-16)", atau "Malam Akhir Bulan (29-30)"
  And status malam tersebut disesuaikan menjadi "Dimakruhkan" disertai kutipan alasan medis/fiqih kitab
```

### AC-05: Highlight Card "Waktu Utama Terdekat"
```gherkin
Scenario: Menampilkan rekomendasi waktu afdhal berikutnya
  Given sistem mengetahui tanggal dan jam saat ini
  When komponen kalender dirender
  Then sistem menampilkan card ringkasan "Waktu Utama Terdekat" di bagian atas kalender
  And card memuat nama hari, estimasi malam/siang (misal: "Malam Jumat besok"), hitungan mundur hari ("Besok", "2 hari lagi"), serta fadhilah utamanya
```

### AC-06: Interactive Date Inspection Sheet / Drawer
```gherkin
Scenario: Pengguna mengklik salah satu tanggal di kalender
  Given kalender sedang aktif
  When pengguna mengklik salah satu sel tanggal
  Then panel rincian tanggal terbuka (drawer pada mobile, card detail pada desktop)
  And menampilkan:
    - Format lengkap tanggal Masehi (contoh: "Kamis, 24 Oktober 2026")
    - Format lengkap tanggal Hijriah (contoh: "13 Jumadil Awal 1448 H")
    - Status utama (Badge warna dan ikon status)
    - Penjelasan landasan kitab dan hikmah kesehatan/keturunan
    - Doa yang dianjurkan beserta tombol cepat untuk melihat doa di menu Doa
```

### AC-07: Multi-View Switcher (Kalender Bulanan vs Agenda 7 Hari vs Ketentuan Kitab)
```gherkin
Scenario: Pengguna mengganti mode tampilan
  Given pengguna berada di halaman panduan waktu
  When pengguna memilih tab navigasi view:
    | Tab | Output |
    | "Kalender Bulanan" | Grid kalender 7x5 dengan navigasi bulan |
    | "Jadwal 7 Hari" | Daftar runut hari ini sampai 6 hari ke depan dengan status siang/malam |
    | "Ketentuan Kitab" | Tampilan referensi teks asli daftar hari dari JSON `panduanWaktu` |
  Then tampilan langsung beralih secara instan tanpa reload halaman
```

### AC-08: Penanda Periode Haid Personal & Ramadhan
```gherkin
Scenario: Pengguna mengaktifkan penanda haid atau berada di bulan Ramadhan
  Given pengguna membuka modal pengaturan periode haid
  When pengguna menginput tanggal mulai dan perkiraan durasi hari haid
  Then data disimpan di browser `localStorage` dengan key "qurrotul_haid_tracker"
  And tanggal-tanggal dalam rentang tersebut otomatis berstatus "Haram Mutlak (Sedang Haid)" dengan warna merah
  And pada bulan Ramadhan (Bulan ke-9 Hijriah), sesi siang otomatis berstatus "Haram Mutlak (Siang Ramadhan)"
```

---

## 4. Contract Freeze Specifications (Phase 2 Alignment)

### 4.1 Data Models & Type Definitions (`src/types/calendar-waktu.ts`)

```typescript
export type TimingStatus = "sangat-dianjurkan" | "baik" | "makruh" | "terlarang";

export interface DaySlotDetail {
  status: TimingStatus;
  label: string;
  alasan: string;
  hikmah: string;
  doaIdRecommended?: string;
}

export interface CalendarDayInfo {
  date: Date;
  isoDate: string; // "YYYY-MM-DD"
  dayOfWeek: number; // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  dayName: string; // "Senin", "Selasa", dll.
  gregorianDay: number;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  hijriYear: number;
  hijriFormatted: string; // e.g. "9 Jumadilawal 1448 H"
  isToday: boolean;
  isCurrentMonth: boolean;
  isRamadhan: boolean;
  isHaid: boolean;
  malamSlot: DaySlotDetail;
  siangSlot: DaySlotDetail;
  primaryStatus: TimingStatus;
  primaryBadge: {
    label: string;
    variant: "emerald" | "blue" | "amber" | "red";
    icon: string;
  };
}

export interface HaidPeriodConfig {
  startDate: string; // "YYYY-MM-DD"
  durationDays: number; // default: 7
}

export type ViewMode = "calendar" | "agenda7" | "kitab";
```

### 4.2 Utility Engine Contract (`src/lib/calendar-engine.ts`)

```typescript
/**
 * Native Intl Hijri parser - strictly zero external dependencies.
 */
export function getHijriDateDetails(date: Date): {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string;
};

/**
 * Resolves Islamic fiqh timing status for a given Gregorian date based on Kitab Qurrotul Uyun.
 */
export function evaluateDateTiming(
  date: Date,
  haidConfig?: HaidPeriodConfig | null
): CalendarDayInfo;

/**
 * Generates monthly grid days including leading/trailing offset days.
 */
export function getMonthCalendarDays(
  year: number,
  monthIndex: number, // 0 - 11
  haidConfig?: HaidPeriodConfig | null
): CalendarDayInfo[];

/**
 * Finds the upcoming best recommended time starting from a reference date.
 */
export function getNextRecommendedTiming(
  fromTomorrowDate?: Date
): {
  targetDate: Date;
  slot: "malam" | "siang";
  title: string;
  countdownText: string;
  fadhilah: string;
};
```

---

## 5. Cross-Role Alignment Log

| Role | Inquiry / Constraint | Resolution / Binding Decision |
|---|---|---|
| **Sandra (QA)** | Edge cases: pergantian bulan Hijriah 29/30 hari, penanganan leap year, dan risiko hydration mismatch saat server rendering tanggal. | Kalender di-render sebagai Client Component dengan initial mount guard (`useEffect` / state default) untuk mencegah perbedaan timezone server vs client. Semua fungsi tanggal diuji dengan unit test komprehensif. |
| **Angel (UI/UX)** | Ukuran touch target tanggal pada smartphone dan kontras warna status. | Ukuran sel tanggal minimal 44x44px. Angka Masehi dibuat kontras, angka Hijriah dengan warna sekunder yang tetap terbaca. Warna badge status wajib memenuhi standar rasio kontras WCAG AA (emerald-700/emerald-400, amber-700/amber-400, red-700/red-400). |
| **Fiqry (Frontend)** | Kebutuhan library kalender pihak ketiga (misal: date-fns, moment, fullcalendar). | DILARANG menambahkan library kalender pihak ketiga. Sesuai prinsip Ponytail dan YAGNI, gunakan native JS `Date` dan `Intl.DateTimeFormat` (terbukti didukung penuh oleh Node/Bun dan modern browsers). |
| **Bryan (Backend)** | Kebutuhan endpoint API atau penyimpanan database. | Tidak memerlukan backend API. Data ketentuan waktu sudah tersedia di `src/data/qurrotul-uyun.json`. Konfigurasi haid disimpan secara privat di `localStorage` peramban pengguna. |

---

## 6. Execution Tracks (Fork-Join Concurrency)

1. **Track A (UI/UX Design - Angel):**
   - Menyiapkan spesifikasi visual, wireframe, micro-interactions, layout grid sel kalender, dan drawer detail tanggal di `02_design_angel.md`.
2. **Track B (Frontend Implementation - Fiqry):**
   - Mengimplementasikan `calendar-engine.ts`, tipe TypeScript, dan komponen `CalendarView`, `Agenda7View`, `DateDetailModal`, dan `HaidTrackerDialog` di `03_build_fiqry.md`.
3. **Track C (QA & Security Verification - Sandra):**
   - Menyiapkan test matrix verifikasi BDD (AC-01 s/d AC-08), pengujian timezone boundary, validasi tanggal Hijriah, dan audit aksesibilitas di `04_qa_sandra.md`.
