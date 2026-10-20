# TASK-002: Fitur Pencatatan Siklus Haid & Masa Subur Islami Terpadu — Frontend Implementation Report

> **Implementer:** Fiqry (`fiqry_frontend` — Senior Frontend Web Developer, Tim FE)  
> **Feature:** Fitur Pencatatan Siklus Haid & Masa Subur Islami Terpadu (Flo-Inspired with Islamic Fiqh Integration)  
> **Status:** COMPLETED & VERIFIED (Zero Errors, Zero Warnings, 102 Tests Passing)  
> **Release Target:** Qurrotul Uyun Web & PWA v1.3.0  
> **Date:** 2026-10-20  
> **Reference Specs:**  
> - PRD: `workflow/TASK-002-pencatatan-siklus-haid/01_prd_faisal.md` (Faisal)  
> - UI/UX: `workflow/TASK-002-pencatatan-siklus-haid/02_design_angel.md` (Angel)  

---

## 1. Executive Summary

Fitur pencatatan siklus menstruasi dan masa subur islami terpadu (`/siklus-haid`) telah selesai diimplementasikan secara menyeluruh. Fitur ini memadukan kemudahan ergonomis pelacak modern bergaya Flo dengan ketepatan hukum Fiqih Wanita standar Mazhab Syafi'i dan tuntunan Kitab Qurrotul Uyun.

Semua data tersimpan secara mandiri 100% pada penyimpanan lokal peramban (`localStorage`) dengan skema `qurrotul_cycle_storage_v1`, tanpa server backend, tanpa analitik pihak ketiga, dan tanpa kebocoran data (*zero telemetry / zero server leakage*). Modul ini juga tersinkronisasi dua arah secara reaktif dengan Kalender Panduan Waktu (`/panduan-waktu`).

---

## 2. Deliverables & File Architecture

```
src/
├── types/
│   └── cycle-tracker.ts              # Data contracts, SyariState, DailyCycleLog, UserCycleProfile, QadhaPuasaEntry
├── lib/
│   ├── cycle-engine.ts               # Mazhab Syafi'i Deterministic Logic & Biological Prediction Engine
│   ├── use-cycle-tracker.ts          # Reactive client hook via useSyncExternalStore (storage key: qurrotul_cycle_storage_v1)
│   └── __tests__/
│       └── cycle-engine.test.ts      # 13 pure logic unit tests (AC-01 through AC-08)
├── app/
│   ├── globals.css                   # Syar'i State color tokens (--haid-*, --suci-*, --fertile-*, --istihadlah-*)
│   ├── sitemap.ts                    # Priority 0.8 sitemap entry for /siklus-haid
│   ├── page.tsx                      # Homepage shortcut & banner for /siklus-haid
│   ├── _components/
│   │   ├── header.tsx                # Desktop navigation link to /siklus-haid
│   │   └── mobile-drawer.tsx         # Mobile drawer navigation link to /siklus-haid
│   ├── panduan-waktu/
│   │   └── components/
│   │       └── calendar-hero.tsx     # Direct CTA link to /siklus-haid & synchronization
│   └── siklus-haid/
│       ├── page.tsx                  # Server Component with complete SEO metadata & OpenGraph
│       ├── siklus-client.tsx         # Client State Coordinator widget provider
│       ├── components/
│       │   ├── cycle-hero-card.tsx       # SVG Radial Ring Progress & Large Syar'i Status Badge
│       │   ├── cycle-strip-view.tsx      # 14-day horizontal strip view & expandable 35-day grid
│       │   ├── daily-log-modal.tsx       # Flo-inspired bottom sheet for flow, fiqih colors, symptoms, moods
│       │   ├── fiqih-guide-drawer.tsx    # Fiqih Thaharah, Arabic Mandi Wajib niat, & Istihadlah drawer
│       │   ├── qadha-tracker-card.tsx    # Ramadan Fasting Debt tally, checklist, & Hadith HR. Muslim 335
│       │   ├── cycle-onboarding-modal.tsx# Profile setup for period duration & cycle length
│       │   └── cycle-data-backup.tsx     # JSON backup export, import, & data reset
│       └── __tests__/
│           └── siklus-haid.test.tsx      # 9 component and accessibility verification tests
```

---

## 3. Fiqih Engine Logic (Mazhab Syafi'i Compliance)

Mesin kalkulasi murni (`src/lib/cycle-engine.ts`) menerapkan kaidah baku Mazhab Syafi'i:
1. **Batas Durasi Haid:**
   - Minimal: 24 jam akumulatif (1 hari 1 malam).
   - Maksimal: 15 hari 15 malam (360 jam).
   - Kebiasaan umum (*Adat/Ghalib*): 6 atau 7 hari.
2. **Batas Jeda Suci:**
   - Minimal masa suci pemisah antar-dua haid: 15 hari 15 malam.
3. **Deteksi Otomatis Istihadlah:**
   - Jika pendarahan berlanjut melampaui 15 hari berturut-turut, sistem otomatis mengklasifikasikan hari ke-16 ke atas sebagai **Istihadlah** (darah penyakit). Shalat dan puasa tetap wajib dikerjakan dengan wudhu khusus setiap masuk waktu shalat (*da'imul hadats*).
   - Jika darah keluar kembali sebelum genap 15 hari masa suci setelah haid sebelumnya berakhir, sistem menghukumi darah tersebut sebagai Istihadlah (belum genap masa suci minimal).
4. **Verifikasi Tuntas Haid (Ath-Thuhru) & Mandi Wajib:**
   - Didukung pemilihan tanda *Qashshah Baidha'* (cairan putih bening) atau *Jufuf* (kapas kering bersih).
   - Jika darah terhenti tetapi belum mandi wajib, status syar'i adalah `suci_wajib_mandi`: haram shalat dan jima' sebelum mandi wajib diselesaikan.
   - Seketika mandi wajib dikonfirmasi, status bertransisi ke `suci_sempurna` (halal shalat, puasa, dan jima').
5. **Prediksi Biologis Ovulasi & Masa Subur:**
   - Tanggal ovulasi dihitung: `startDate + (averageCycleLength - lutealPhaseDays - 1)`.
   - Jendela subur (*fertile window*): 5 hari sebelum ovulasi puncak hingga 1 hari setelah ovulasi (total 7 hari).
6. **Pelacak Qadha Puasa Ramadhan:**
   - Fungsi `recalculateRamadhanQadha` mendeteksi tanggal haid aktif yang bertepatan dengan bulan ke-9 Hijriah (Ramadhan), mengumpulkan daftar hutang puasa, dan memfasilitasi pelunasan bertahap.

---

## 4. UI/UX & Design System Implementation

Sesuai spesifikasi Angel (`02_design_angel.md`):
1. **Design Tokens (`src/app/globals.css`):**
   - Haid: `--color-haid-bg`, `--color-haid-border`, `--color-haid-text`, `--color-haid-ring` (Rose theme).
   - Suci Wajib Mandi: `--color-suci-wajib-*` (Sky theme).
   - Suci Sempurna: `--color-suci-*` (Emerald theme).
   - Masa Subur: `--color-fertile-*` (Teal theme).
   - Istihadlah: `--color-istihadlah-*` (Warm Amber theme).
2. **Visualisasi Cincin Siklus Radial (`CycleHeroCard.tsx`):**
   - Dibuat murni menggunakan SVG semantik `<circle>` dan `stroke-dashoffset` animatif, **tanpa library charting eksternal (0 KB dependensi tambahan)**.
3. **Ergonomi Sentuh Ramah Jempol (Thumb-Zone First):**
   - Modal pencatatan harian bertindak sebagai *bottom sheet* di mobile dengan *drag handle* dan zona sentuh minimum `min-h-[44px]` (lulus WCAG 2.1 AA).
4. **Anti-Slop Copywriting & UI Hygiene:**
   - Bebas dari gradien ungu sintetis, bebas dari maskot kartun berlebihan, dan bebas dari copywriting klise.
   - Disertai teks Arab bertulisan khat Amiri untuk Niat Mandi Wajib dan kutipan hadits riwayat Imam Muslim No. 335.

---

## 5. Verification & Test Evidence

### 5.1 Unit & Component Tests (`bun test`)
```
102 pass
0 fail
805 expect() calls
Ran 102 tests across 10 files. [343.00ms]
```

Daftar test suite yang mencakup TASK-002:
- `src/lib/__tests__/cycle-engine.test.ts` (13 test cases):
  - Prediksi siklus 28 hari & hari haid berikutnya 29 Okt (AC-01)
  - Hari ovulasi puncak ke-14 & jendela subur 9-15 Okt (AC-04)
  - Evaluasi status Haid aktif hari 1-7 (AC-02)
  - Evaluasi Suci Wajib Mandi hari ke-8 (AC-02)
  - Evaluasi Suci Sempurna setelah mandi wajib (AC-02)
  - Deteksi Istihadlah saat jeda suci < 15 hari (AC-02)
  - Transisi otomatis Istihadlah pada hari ke-16 pendarahan (AC-05)
  - Kalkulator Qadha Puasa Ramadhan (AC-06)
- `src/app/siklus-haid/__tests__/siklus-haid.test.tsx` (9 test cases):
  - Rendering CycleHeroCard radial progress & status syar'i
  - Konfirmasi mandi wajib conditional trigger
  - Navigasi 14-day strip & full calendar toggle
  - Logging flow intensity, fiqih colors, & symptoms
  - Tab navigasi Thaharah Drawer & teks Arab niat
  - Checklist Qadha Puasa & pelunasan instan
  - Banner kedaulatan privasi lokal
  - Form onboarding siklus
  - Audit anti-slop copywriting

### 5.2 Linter (`bun run lint`)
```
$ eslint
Done with code 0 (0 errors, 0 warnings).
```

### 5.3 Production Build (`bun run build`)
```
$ next build --webpack
▲ Next.js 16.3.6 (webpack)
✓ Compiled successfully in 4.6s
✓ Finished TypeScript in 5.5s
✓ (serwist) Bundling the service worker script with the URL '/sw.js'...
✓ Generating static pages using 14 workers (13/13) in 2.4s

Route (app)
┌ ƒ /
├ ƒ /_not-found
├ ƒ /doa
├ ƒ /favorit
├ ƒ /kitab
├ ○ /manifest.webmanifest
├ ƒ /panduan-waktu
├ ○ /robots.txt
├ ƒ /siklus-haid
├ ○ /sitemap.xml
└ ƒ /tentang

Exit code: 0
```

---

## 6. Handover for Sandra (QA Gate)

Fitur telah siap secara penuh untuk diaudit oleh Sandra (`sandra_qa`). Skenario uji BDD (AC-01 hingga AC-08) telah didukung oleh implementasi kode murni yang deterministik dan siap diverifikasi pada lingkungan desktop maupun mobile peramban.
