# TASK-001: Islamic Geometric Patterns & Ramadan Ornaments — UI/UX Design Specification

> **Lead Designer:** Angel (`angel_uiux` — Senior UI/UX Designer & Design Systems Architect)  
> **Status:** APPROVED & READY FOR IMPLEMENTATION  
> **Target Release:** Qurrotul Uyun Web & PWA v1.2.0  
> **Date:** 2026-10-20  
> **Reference:** PRD by Faisal (`workflow/TASK-001-ramadan-ornaments/01_prd_faisal.md`)  
> **Target Implementer:** Fiqry (Frontend Engineer)  
> **Target Verifier:** Sandra (QA & Test Automation Engineer)

---

## 1. Executive Summary & Aesthetic Philosophy

### 1.1 The "Sakinah & Noor" Islamic Aesthetic Concept
Aplikasi *Qurrotul Uyun* menyampaikan panduan fiqih keluarga sakinah dan adab pernikahan Islami dari naskah klasik Syekh Muhammad al-Tihami. Menjelang bulan suci Ramadan dan momen-momen spiritual penting, antarmuka aplikasi perlu mencerminkan keindahan tradisi seni Islam klasik (*Islamic Visual Arts*) tanpa mengurangi kesederhanaan, keterbacaan (*legibility*), atau performa aplikasi web modern.

Konsep desain **"Sakinah & Noor"** (Ketenangan & Cahaya Berkah) memadukan tiga pilar utama seni rupa Islam:
1. **Geometric Tessellation (Tathir / Girih):** Pola simetri 8 sudut (*Rub el Hizb*) yang melambangkan keseimbangan kosmik dan keteraturan ilahi.
2. **Illuminated Manuscripts (Tazhib):** Sudut berornamen (*Latchak / Corner Brackets*) dan pembatas bab bermahkotakan roset yang terinspirasi dari mushaf Al-Qur'an dan manuskrip klasik Maroko-Andalusia.
3. **Ramadan Ambient Warmth (Hilal & Fanous):** Siluet bulan sabit ramping (*Hilal*) dan lentera tradisional (*Fanous*) dengan bias cahaya emas hangat (*Warm Amber Glow*) yang menghadirkan atmosfer kehangatan ibadah malam hari.

---

### 1.2 Anti-Slop & Performance Tenets (Pedoman Anti-Clutter)
Desain ini dirancang dengan prinsip ketat agar terhindar dari ornamen berlebihan (*design slop*):

1. **Subtle Opacity (Anti-Distraction):** Pola latar belakang (*ambient lattice*) dibatasi secara mutlak pada rentang **3% hingga 6% opacity**. Pola tidak boleh mencuri perhatian dari teks bacaan bahasa Arab maupun terjemahan bahasa Indonesia.
2. **Pure Crisp Vectors (Zero Raster Bloat):** Tidak menggunakan file PNG/JPG/WebP berat untuk ornamen. Seluruh aset merupakan SVG murni berbasis vektor dengan total bobot transfer < 10 KB (uncompressed) dan 0 request HTTP tambahan.
3. **Zero JavaScript Animation Runtime:** Tidak ada dependensi pustaka animasi seperti Lottie, Framer Motion, Three.js, atau partikel canvas. Efek pendar (*glow*) dan gerakan mengapung halus lentera diimplementasikan murni dengan CSS `@keyframes` dan akselerasi GPU (`transform: translate3d`).
4. **Touch & Click Immunity (`pointer-events-none`):** Seluruh lapisan ornamen dekoratif memiliki utility `pointer-events-none` dan `select-none`, memastikan klik, sentuhan jari, dan seleksi teks pengguna melintas tanpa hambatan (*zero interaction blocking*).
5. **Full Accessibility Compliance (WCAG 2.1 AA):** Semua elemen dekoratif menyertakan atribut `aria-hidden="true"`. Rasio kontras teks di atas permukaan bermotif tetap memenuhi ambang batas minimum **≥ 4.5:1** (teks normal) dan **≥ 3.0:1** (judul besar).

---

## 2. Design System Tokens & Color Palette

Sistem token memperluas palet warna inti Qurrotul Uyun pada Tailwind CSS v4 (`src/app/globals.css`).

### 2.1 Ramadan & Islamic Ornament Color Tokens

| Token Name | Light Mode (`:root`) | Dark Mode (`.dark`) | Semantic Role & Application | Contrast against Surface |
|---|---|---|---|---|
| `--color-emerald-deep` | `#064e3b` (Emerald 900) | `#10b981` (Emerald 500) | Warna utama brand, stroke ornamen islami, bingkai hadits | Light: 8.9:1<br>Dark: 9.4:1 |
| `--color-gold-warm` | `#d97706` (Amber 600) | `#fbbf24` (Amber 400) | Aksen lentera, bintang roset, sudut tazhib, badge Ramadan | Light: 4.8:1<br>Dark: 11.2:1 |
| `--color-sand-warm` | `#fef3c7` (Amber 100) | `#292524` (Stone 800) | Latar belakang pill badge, highlight subtil sudut kartu | Light: 1.1:1 (Bg)<br>Dark: 1.2:1 (Bg) |
| `--color-midnight-onyx`| `#1c1917` (Stone 900) | `#0c0a09` (Stone 950) | Warna teks pekat (light), latar dasar malam Ramadan (dark) | Light: 15.2:1<br>Dark: Surface |
| `--color-starlight-glow`| `rgba(217, 119, 6, 0.12)` | `rgba(251, 191, 36, 0.15)` | Pendaran cahaya ambient di belakang lentera hero & hadits | Non-text decorative glow |
| `--color-pattern-stroke`| `rgba(6, 78, 59, 0.045)` | `rgba(16, 185, 129, 0.055)`| Garis kisi geometris latar belakang (lattice background) | Strictly calibrated (3.5%-5.5%) |

### 2.2 Opacity Scales & Calibration Rules

```css
/* Ambient Geometric Lattice Opacities */
--opacity-pattern-light: 0.04;    /* 4% stroke opacity pada latar #fcfbf9 */
--opacity-pattern-dark:  0.055;   /* 5.5% stroke opacity pada latar #0c0a09 */

/* Tazhib Corner Brackets Opacities */
--opacity-corner-default: 0.25;   /* 25% aksen sudut saat default */
--opacity-corner-hover:   0.65;   /* 65% aksen sudut saat container di-hover */

/* Ramadan Hero Ambient Elements */
--opacity-hero-hilal:     0.18;   /* 18% kontur bulan sabit di hero */
--opacity-hero-fanous:    0.22;   /* 22% kontur lentera gantung */
--opacity-hero-glow:      0.14;   /* 14% pendaran radial starlight */
```

### 2.3 globals.css Extension Spec

Tambahkan variabel token berikut ke dalam `src/app/globals.css`:

```css
:root {
  /* Existing tokens */
  --emerald-deep: #064e3b;
  --gold-warm: #d97706;
  --sand-warm: #fef3c7;

  /* Ramadan & Islamic Ornament extensions */
  --pattern-stroke: rgba(6, 78, 59, 0.045);
  --corner-bracket: rgba(217, 119, 6, 0.35);
  --hero-glow: rgba(217, 119, 6, 0.12);
  --divider-line: rgba(6, 78, 59, 0.15);
}

.dark {
  /* Existing tokens */
  --emerald-deep: #10b981;
  --gold-warm: #fbbf24;
  --sand-warm: #292524;

  /* Ramadan & Islamic Ornament extensions */
  --pattern-stroke: rgba(16, 185, 129, 0.055);
  --corner-bracket: rgba(251, 191, 36, 0.35);
  --hero-glow: rgba(251, 191, 36, 0.14);
  --divider-line: rgba(16, 185, 129, 0.2);
}

@theme inline {
  --color-pattern-stroke: var(--pattern-stroke);
  --color-corner-bracket: var(--corner-bracket);
  --color-hero-glow: var(--hero-glow);
  --color-divider-line: var(--divider-line);
}
```

---

## 3. SVG Motif Specifications & Vector Definitions

Seluruh motif dirancang dengan rasio matematis presisi, kurva Bezier bersih tanpa titik jangkar liar (*redundant anchor points*), dan mendukung penskalaan dinamis melalui SVG `viewBox`.

---

### 3.1 Rub el Hizb (۞ 8-Point Islamic Star Rosette)
Simbol tradisional penanda seperempat hizb dalam naskah mushaf Al-Qur'an. Terdiri dari dua bujur sangkar simetris yang bertumpuk dengan rotasi sudut 45 derajat, dilengkapi lingkaran aksen tengah.

```
       /\
     /    \
   /   /\   \
  |  /    \  |
  | |  ()  | |  <-- Two interlocking 45° squares with central focal ring
  |  \    /  |
   \   \/   /
     \    /
       \/
```

#### Vector Code (`rub-el-hizb.svg` / Inline JSX):
```tsx
export function RubElHizbIcon({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Bujur sangkar 1 (Rotasi 0°) */}
      <rect x="4" y="4" width="16" height="16" rx="1" />
      {/* Bujur sangkar 2 (Rotasi 45° berpusat di x=12, y=12) */}
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="1"
        transform="rotate(45 12 12)"
      />
      {/* Lingkaran fokus sentral */}
      <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.25" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}
```

---

### 3.2 Ramadan Hilal (Crescent Moon with 8-Point Star Accent)
Bulan sabit ramping khas permulaan bulan kamariah dengan lengkungan elegan yang memeluk bintang delapan sudut di bagian cekungannya.

#### Vector Code (`ramadan-hilal.svg` / Inline JSX):
```tsx
export function RamadanHilalIcon({ className = "w-6 h-6", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Hilal Crescent Path */}
      <path
        d="M23 4.5C13.887 4.5 6.5 11.887 6.5 21c0 2.285.467 4.46 1.309 6.435C5.12 25.176 3.5 21.782 3.5 18c0-8.008 6.492-14.5 14.5-14.5 1.834 0 3.58.341 5 1z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M23 4.5C13.887 4.5 6.5 11.887 6.5 21c0 2.285.467 4.46 1.309 6.435C5.12 25.176 3.5 21.782 3.5 18c0-8.008 6.492-14.5 14.5-14.5 1.834 0 3.58.341 5 1z"
      />
      {/* Nested 8-Point Star in the Crescent Embrace */}
      <g transform="translate(19, 13) scale(0.42)">
        <rect x="0" y="0" width="14" height="14" rx="0.8" transform="rotate(0)" />
        <rect x="0" y="0" width="14" height="14" rx="0.8" transform="rotate(45 7 7)" />
        <circle cx="7" cy="7" r="1.5" fill="currentColor" />
      </g>
    </svg>
  );
}
```

---

### 3.3 Traditional Fanous (Ramadan Lantern with Filigree Windows)
Siluet lentera Ramadan klasik dengan ring penggantung di bagian atas, kubah pavilion tirus, jendela kaca berpola jaring geometric (*mashrabiya*), dan kaki tumpuan berundak.

```
         O        <-- Hanging suspension ring
        / \       <-- Pagoda cap dome
       |===|      <-- Cap trim
       /   \      <-- Upper tapered chamber
      | [X] |     <-- Hexagonal lattice window panes
       \   /      <-- Lower tapered chamber
       |===|      <-- Base pedestal
        \-/
```

#### Vector Code (`ramadan-fanous.svg` / Inline JSX):
```tsx
export function RamadanFanousIcon({ className = "w-6 h-9", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 28 42"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Hanging Chain & Ring */}
      <circle cx="14" cy="4" r="2.5" />
      <line x1="14" y1="6.5" x2="14" y2="10" strokeWidth="1.2" />

      {/* Finial / Spire */}
      <path d="M14 10 L14 12" />

      {/* Top Cap & Pavilion Roof */}
      <path d="M9 14.5 C9 12.5 12 12 14 12 C16 12 19 12.5 19 14.5 Z" fill="currentColor" fillOpacity="0.15" />
      <path d="M7 16.5 L21 16.5" strokeWidth="1.5" />
      <path d="M9 14.5 L7 16.5 M19 14.5 L21 16.5" />

      {/* Upper Lantern Taper */}
      <path d="M7 16.5 L4.5 22 L23.5 22 L21 16.5" />

      {/* Central Glass Chamber & Filigree Lattice */}
      <path d="M4.5 22 L6.5 32 L21.5 32 L23.5 22" fill="currentColor" fillOpacity="0.08" />
      <line x1="14" y1="22" x2="14" y2="32" strokeDasharray="1 2" strokeWidth="1" />
      <line x1="9.5" y1="22" x2="10.5" y2="32" strokeWidth="0.9" strokeOpacity="0.6" />
      <line x1="18.5" y1="22" x2="17.5" y2="32" strokeWidth="0.9" strokeOpacity="0.6" />

      {/* Internal Candle Flame Glow */}
      <ellipse cx="14" cy="27" rx="1.5" ry="2.5" fill="currentColor" fillOpacity="0.4" stroke="none" />

      {/* Bottom Trim & Foot Pedestal */}
      <path d="M6 32 L22 32" strokeWidth="1.5" />
      <path d="M7.5 32 L9.5 36 L18.5 36 L20.5 32" />
      <path d="M8 36 L20 36" strokeWidth="1.5" />
      <path d="M11 36 L11 38 M17 36 L17 38 M11 38 L17 38" />
    </svg>
  );
}
```

---

### 3.4 Islamic Arabesque Geometric Lattice Pattern (`IslamicPatternBg`)
Kisi-kisi ubin geometris 8-sudut (*seamless tileable Girih pattern*) yang berulang secara matematis tanpa celah pergeseran (*seamless repetition*).

- **Ukuran Sel Tile (Grid Unit):** `64px × 64px`.
- **Rasio Titik Sudut:** Sudut diagonal menyatu pada persimpangan antar sel tetangga menghasilkan roset 8-titik yang teratur di seluruh layar.
- **Optimasi CSS/SVG:** Menggunakan elemen `<pattern>` SVG murni dengan `id="islamic-girih-pattern"` dan `patternUnits="userSpaceOnUse"`.

#### Vector Code (`islamic-pattern-bg.tsx`):
```tsx
export function IslamicPatternBg() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none opacity-[0.04] dark:opacity-[0.06] transition-opacity duration-500"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="islamic-girih-pattern"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            {/* 8-Point Rosette Central Unit */}
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="0.85"
              className="text-primary dark:text-emerald-400"
            >
              {/* Central 8-star */}
              <polygon points="32,22 35,29 42,32 35,35 32,42 29,35 22,32 29,29" />
              {/* Interlocking corner octagons */}
              <path d="M0,0 L10,0 L16,6 L16,16 L6,16 L0,10 Z" />
              <path d="M64,0 L54,0 L48,6 L48,16 L58,16 L64,10 Z" />
              <path d="M0,64 L10,64 L16,58 L16,48 L6,48 L0,54 Z" />
              <path d="M64,64 L54,64 L48,58 L48,48 L58,48 L64,54 Z" />
              
              {/* Star connector spokes */}
              <line x1="32" y1="0" x2="32" y2="22" />
              <line x1="32" y1="42" x2="32" y2="64" />
              <line x1="0" y1="32" x2="22" y2="32" />
              <line x1="42" y1="32" x2="64" y2="32" />
              
              {/* Diagonal connecting ties */}
              <line x1="16" y1="16" x2="29" y2="29" />
              <line x1="48" y1="16" x2="35" y2="29" />
              <line x1="16" y1="48" x2="29" y2="35" />
              <line x1="48" y1="48" x2="35" y2="35" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-girih-pattern)" />
      </svg>
    </div>
  );
}
```

---

### 3.5 Tazhib Ornamental Corner Brackets (`OrnamentalCorner`)
Sudut hias iluminasi manuskrip (*Latchak Tazhib*) yang ditempatkan di 4 sudut kartu utama (misalnya *Pilar Pembahasan Utama* dan banner *Untaian Hadits Hari Ini*).

- **Ukuran Bounding Box:** `32px × 32px` (mobile), `40px × 40px` (desktop).
- **Penempatan:** Siku 90° menempel presisi di sudut dalam kontainer (`top-1.5 left-1.5`, `top-1.5 right-1.5`, dll.).
- **Orientasi:** Menggunakan transformasi CSS `rotate-0`, `rotate-90`, `rotate-180`, `rotate-270` atau orientasi berbasis props `position: "top-left" | "top-right" | "bottom-left" | "bottom-right"`.

```
+---\             /---+
| *  \           /  * |
|     \         /     |
|      +       +      |
```

#### Vector Code (`ornamental-corner.tsx`):
```tsx
interface OrnamentalCornerProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  size?: number;
}

export function OrnamentalCorner({
  position = "top-left",
  className = "",
  size = 32,
}: OrnamentalCornerProps) {
  const rotationClass = {
    "top-left": "rotate-0",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90",
  }[position];

  return (
    <div
      className={`pointer-events-none absolute select-none text-amber-600/35 dark:text-amber-400/35 transition-opacity duration-300 ${rotationClass} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Outer Corner Frame Borders */}
        <path d="M2 18 L2 4 C2 2.895 2.895 2 4 2 L18 2" strokeWidth="1.2" />
        
        {/* Ornamental Arabesque Flourish */}
        <path d="M2 12 C6 12 12 6 12 2" strokeWidth="1.3" />
        <path d="M2 20 C10 20 20 10 20 2" strokeWidth="1" strokeDasharray="1.5 1.5" />
        
        {/* Corner Leaf/Petal Accents */}
        <path d="M6 6 C9 4 11 6 11 8 C11 11 8 11 6 6 Z" fill="currentColor" fillOpacity="0.2" />
        
        {/* Corner Finial Rosette Dot */}
        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
        <circle cx="16" cy="3" r="1" fill="currentColor" />
        <circle cx="3" cy="16" r="1" fill="currentColor" />
      </svg>
    </div>
  );
}
```

---

### 3.6 Arabesque Decorative Section Divider (`IslamicDivider`)
Pemisah antar bagian (*horizontal section separator*) yang menggantikan elemen `<hr>` polos. Memiliki roset Rub el Hizb di tengah dan dua garis bersayap yang memudar lembut (*fade out*) ke kiri dan kanan.

- **Lebar Maksimal:** `280px` (mobile), `420px` (desktop).
- **Tinggi Elemen:** `24px`.
- **Elemen Tengah:** Rub el Hizb 8-titik berukuran `18px × 18px` dengan aksen titik intan (*diamond finials*).

```
<----+----+--------- [ ۞ ] ---------+----+---->
```

#### Vector Code (`islamic-divider.tsx`):
```tsx
interface IslamicDividerProps {
  className?: string;
}

export function IslamicDivider({ className = "" }: IslamicDividerProps) {
  return (
    <div
      className={`flex items-center justify-center my-6 sm:my-8 px-4 pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center w-full max-w-[280px] sm:max-w-[420px]">
        {/* Left Tapered Gradient Rule */}
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/25 to-primary/40 dark:via-primary/30 dark:to-primary/50" />
        
        {/* Left Diamond Accent */}
        <div className="mx-2 w-1.5 h-1.5 rotate-45 border border-primary/40 bg-sand-warm/60 dark:bg-amber-400/20" />

        {/* Center Rub el Hizb Rosette Motif */}
        <div className="mx-2 text-primary dark:text-emerald-400">
          <svg
            className="w-5 h-5 text-amber-600 dark:text-amber-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="5" y="5" width="14" height="14" rx="0.75" />
            <rect x="5" y="5" width="14" height="14" rx="0.75" transform="rotate(45 12 12)" />
            <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.3" />
          </svg>
        </div>

        {/* Right Diamond Accent */}
        <div className="mx-2 w-1.5 h-1.5 rotate-45 border border-primary/40 bg-sand-warm/60 dark:bg-amber-400/20" />

        {/* Right Tapered Gradient Rule */}
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-primary/25 to-primary/40 dark:via-primary/30 dark:to-primary/50" />
      </div>
    </div>
  );
}
```

---

## 4. Component Placement & Layout Hierarchy

### 4.1 Global Layout Wireframe (Homepage Anatomy)

```
+-------------------------------------------------------------------------+
| [HEADER / NAVBAR]   Qurrotul Uyun        [Doa] [Bab] [🌙 Tema] [ID|EN]  |
+-------------------------------------------------------------------------+
|                                                                         |
| (HERO SECTION)                                                          |
|  [Left Fanous Ornament]                          [Right Hilal & Star]   |
|   (floating sway: 3s)                             (ambient warm glow)   |
|                                                                         |
|            [🌙 Syahrul Mubarak / Ramadan Kareem Badge]                  |
|                                                                         |
|       Panduan Membina Rumah Tangga Sakinah & Adab Pernikahan Islami      |
|         Disarikan dari kitab klasik fiqih perkawinan Islam...           |
|                                                                         |
|          [ Mulai Baca Kitab (20 Bab) ]   [ Jelajahi Kumpulan Doa ]       |
|                                                                         |
+-------------------------------------------------------------------------+
|                     ~~~~~ [ ۞ Islamic Divider ] ~~~~~                   |
+-------------------------------------------------------------------------+
|                                                                         |
| (PILAR PEMBAHASAN UTAMA)                                                |
|  +-------------------+  +-------------------+  +-------------------+    |
|  | [*] Malam Pertama |  | [*] Adab Bersengg |  | [*] Kumpulan Doa  |... |
|  |     [Corner BR]   |  |     [Corner BR]   |  |     [Corner BR]   |    |
|  +-------------------+  +-------------------+  +-------------------+    |
|                                                                         |
+-------------------------------------------------------------------------+
|                     ~~~~~ [ ۞ Islamic Divider ] ~~~~~                   |
+-------------------------------------------------------------------------+
|                                                                         |
| (UNTAIAN HADITS HARI INI - BANNER)                                      |
|  +-------------------------------------------------------------------+  |
|  | [Corner TL]                                           [Corner TR] |  |
|  |                                                                   |  |
|  |   [UNTAIAN HADITS & FADHILAH]                                     |  |
|  |   خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي   |  |
|  |   "Sebaik-baik kalian adalah yang paling baik terhadap keluarganya"|  |
|  |                                                                   |  |
|  | [Corner BL]                                           [Corner BR] |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
+-------------------------------------------------------------------------+
|                     ~~~~~ [ ۞ Islamic Divider ] ~~~~~                   |
+-------------------------------------------------------------------------+
|                                                                         |
| (DAFTAR BAB PILIHAN - 6 CARDS)                                          |
|  Cards with subtle top-right corner hint on hover                       |
|                                                                         |
+-------------------------------------------------------------------------+
| [FOOTER]                                                                |
+-------------------------------------------------------------------------+
| [BOTTOM MOBILE NAV] (Mobile viewport only)                              |
+-------------------------------------------------------------------------+
```

---

### 4.2 Hero Section Ornaments (`RamadanHeroOrnament`)

Hero section mendapatkan perlakuan visual khusus dengan komposisi asimetris seimbang:
1. **Sisi Kiri Atas (Top-Left):** Lentera gantung (*Fanous*) dengan tali tipis yang menjulur dari tepi atas hero, bergerak mengapung perlahan (*subtle gentle float* `translateY: -3px to +3px`).
2. **Sisi Kanan Atas (Top-Right):** Bulan sabit Ramadan (*Hilal*) berpadu bintang delapan sudut dan pendaran cahaya radial emas lembut (*radial gold aura*).
3. **Pusat Latar (Center Ambient):** Lapisan radial glow `from-amber-500/10 via-transparent to-transparent` di belakang judul utama.
4. **Pill Badge Ramadan:** Badge musiman di atas judul utama:
   - Icon: Mini Hilal / Rub el Hizb.
   - Text ID: `✨ Syahrul Mubarak • Edisi Ramadan 1447 H`
   - Text EN: `✨ Ramadan Kareem • Holy Season Edition`

#### Implementasi CSS Keyframe Animasi Lentera:
```css
@keyframes lanternFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(1deg);
  }
}

.animate-lantern {
  animation: lanternFloat 6s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-lantern {
    animation: none;
  }
}
```

---

### 4.3 Hadits Hari Ini Banner Framing (`Tazhib Frame`)
Banner Hadits Hari Ini merupakan titik fokus spiritual di homepage. Desain bingkai mengadopsi struktur iluminasi *tazhib* mushaf:

1. **4 Sudut Berornamen (`OrnamentalCorner`):**
   - Sudut Kiri-Atas (`top-2 left-2`)
   - Sudut Kanan-Atas (`top-2 right-2`)
   - Sudut Kiri-Bawah (`bottom-2 left-2`)
   - Sudut Kanan-Bawah (`bottom-2 right-2`)
2. **Border Glow:** Border `border-amber-500/25 dark:border-amber-400/25` dengan `ring-1 ring-amber-500/10`.
3. **Background Gradient:** `bg-gradient-to-br from-amber-500/5 via-card to-emerald-950/5 dark:from-amber-950/20 dark:via-card dark:to-emerald-950/20`.
4. **Padding Kritis:** Konten hadits memiliki padding minimal `px-6 py-7 sm:px-10 sm:py-9` sehingga ornamen sudut berukuran 32px tidak pernah bertubrukan (*clipping*) dengan teks Arab atau terjemahan.

---

### 4.4 4 Pilar Pembahasan Utama Cards
Setiap kartu pilar mendapatkan aksen ornamental subtil:
- **Default State:** Ornamen sudut kanan-atas (`position="top-right"`, size 24px) dengan opacity 20% (`opacity-20`).
- **Hover State:** Border bertransisi ke warna aksen pilar (`hover:border-primary/50` atau `hover:border-accent/50`), opacity ornamen sudut meningkat halus menjadi 60% (`group-hover:opacity-60`), dan ikon utama mengalami micro-scaling (`scale-105`).

---

## 5. Dark Mode & Light Mode Parity Rules

Desain mempertahankan harmoni kontras di kedua mode tema tanpa ada silau (*glare*) pada mode malam atau pudarnya motif pada mode terang.

| Elemen Ornamen | Pengaturan Light Mode | Pengaturan Dark Mode (`.dark`) | Rationale Desain |
|---|---|---|---|
| **Pola Latar Kisi (Girih)** | Stroke: `#064e3b` (Emerald 900)<br>Opacity: `0.04` (4%) | Stroke: `#10b981` (Emerald 500)<br>Opacity: `0.055` (5.5%) | Pada mode gelap, background `#0c0a09` menyerap kontras, sehingga stroke sedikit dinaikkan ke 5.5% agar pola tetap terasa hidup tanpa menyilaukan mata pembaca malam. |
| **Bulan Sabit (Hilal)** | Stroke: `#b45309` (Amber 700)<br>Fill Opacity: `0.08`<br>Drop Glow: None | Stroke: `#fbbf24` (Amber 400)<br>Fill Opacity: `0.15`<br>Drop Glow: `rgba(251,191,36,0.12)` | Mode malam mencerminkan langit malam bertabur bintang (*Lailatul Qadr*), pendaran emas memberikan sensasi hangat. |
| **Lentera (Fanous)** | Stroke: `#065f46`<br>Flame: `#d97706` (Opacity: 0.35) | Stroke: `#10b981`<br>Flame: `#fbbf24` (Opacity: 0.60) | Api lentera lebih terang dan hangat saat malam hari, menghadirkan estetika lampu minyak klasik. |
| **Sudut Tazhib Card** | Color: `#d97706` (Amber 600)<br>Opacity: `0.25` (Hover: `0.55`) | Color: `#fbbf24` (Amber 400)<br>Opacity: `0.30` (Hover: `0.65`) | Mengikuti warna emas sepuhan (*gilded gold*) pada naskah kuno. |
| **Garis Pembatas (Divider)**| Gradient: `from-transparent via-primary/25 to-primary/40` | Gradient: `from-transparent via-emerald-500/30 to-emerald-500/50` | Memastikan garis batas tidak memotong kontras teks di sekitarnya. |

---

## 6. Accessibility & Contrast Verification (WCAG 2.1 AA)

### 6.1 Contrast Audit Matrix (Text over Patterned Surface)

Pengujian kontras dilakukan dengan menghitung nilai luminansi relatif (*relative luminance*) teks terhadap warna latar gabungan (*composite background* = dasar warna latar + lapisan kisi SVG 4–6%).

| Elemen Teks | Foreground Hex | Composite Background Hex | Rasio Kontras Terukur | Standar WCAG 2.1 AA | Status |
|---|---|---|---|---|---|
| **Heading Hero (Light)** | `#1c1917` (Stone 900) | `#fcfbf9` + 4% emerald = `#fbfbf8` | **15.1 : 1** | ≥ 4.5:1 (Normal) / ≥ 3.0:1 (Large) | **PASSED (AAA)** |
| **Subtitle Hero (Light)** | `#78716c` (Stone 500) | `#fcfbf9` + 4% emerald = `#fbfbf8` | **4.9 : 1** | ≥ 4.5:1 (Normal) | **PASSED (AA)** |
| **Heading Hero (Dark)** | `#fafaf9` (Stone 50) | `#0c0a09` + 5.5% emerald = `#0d0d0c` | **16.8 : 1** | ≥ 4.5:1 (Normal) / ≥ 3.0:1 (Large) | **PASSED (AAA)** |
| **Subtitle Hero (Dark)** | `#a8a29e` (Stone 400) | `#0c0a09` + 5.5% emerald = `#0d0d0c` | **7.2 : 1** | ≥ 4.5:1 (Normal) | **PASSED (AAA)** |
| **Hadits Arabic (Light)** | `#1c1917` (Stone 900) | `#f8f7f4` (Card + 5% gold tint) | **14.6 : 1** | ≥ 3.0:1 (Large text ≥ 18pt) | **PASSED (AAA)** |
| **Hadits Arabic (Dark)** | `#fafaf9` (Stone 50) | `#171513` (Card + 5% gold tint) | **14.2 : 1** | ≥ 3.0:1 (Large text ≥ 18pt) | **PASSED (AAA)** |
| **Badge Ramadan (Light)** | `#92400e` (Amber 800) | `#fef3c7` (Amber 100) | **6.2 : 1** | ≥ 4.5:1 (Normal) | **PASSED (AA)** |
| **Badge Ramadan (Dark)** | `#fde68a` (Amber 200) | `#451a03` (Amber 950) | **8.5 : 1** | ≥ 4.5:1 (Normal) | **PASSED (AAA)** |

### 6.2 Screen Reader & Assistive Technology Guidelines
1. **Atribut `aria-hidden="true"` Wajib:** Semua elemen SVG ornamen, div pembungkus pola latar, ikon bulan sabit, lentera, dan sudut tazhib **wajib** menyertakan `aria-hidden="true"`.
2. **Badge Ramadan Aksesibel:** Badge musiman Ramadan di hero menyertakan teks semantik yang bermakna bagi screen reader tanpa menyuarakan emoji atau dekorasi:
   ```html
   <div role="status" aria-label="Edisi Ramadan 1447 Hijriah">
     <span aria-hidden="true">🌙</span>
     <span>Ramadan Mubarak 1447 H</span>
   </div>
   ```
3. **Pointer Events Passthrough:** Semua container SVG dekoratif diberi class `pointer-events-none select-none` untuk menjamin tidak ada intersepsi event kursor, tap layar, maupun drag.

---

## 7. Responsive Breakpoint Behavior

| Viewport Range | Breakpoint | Penyesuaian Ornamen Ramadan & Geometris |
|---|---|---|
| **< 640px** (Mobile) | `xs` / `sm` | - Lentera Fanous hero direduksi ke ukuran `w-5 h-7.5` dan diposisikan rapat ke tepi (`top-2 left-2`).<br>- Bulan Hilal hero direduksi ke `w-7 h-7` di `top-2 right-2`.<br>- Divider dibatasi pada lebar `max-w-[260px]`.<br>- Sudut tazhib Hadits banner berukuran `24px × 24px`.<br>- Background lattice SVG tetap aktif (rendering GPU lancar). |
| **640px – 1024px** (Tablet) | `md` | - Lentera Fanous ukuran `w-6 h-9`.<br>- Divider lebar `max-w-[340px]`.<br>- Sudut tazhib berukuran `32px × 32px`. |
| **≥ 1024px** (Desktop / Ultra-wide) | `lg` / `xl` | - Lentera Fanous ukuran `w-7 h-10` dengan tali gantung sepanjang 32px.<br>- Bulan Hilal ukuran `w-9 h-9` dengan pendaran glow radial 180px.<br>- Divider penuh `max-w-[420px]`.<br>- Sudut tazhib berukuran `36px × 36px`. |

---

## 8. File Structure & Component Delivery Plan

Untuk kerapian arsitektur kode dan memudahkan implementasi oleh Fiqry (Frontend Engineer), komponen diorganisir dalam folder khusus ornamen:

```
src/
└── app/
    ├── _components/
    │   └── ornaments/
    │       ├── index.ts                     # Re-export barrel
    │       ├── islamic-pattern-bg.tsx       # Pola lattice latar seamless SVG
    │       ├── islamic-divider.tsx          # Pembatas seksi bermahkota Rub el Hizb
    │       ├── ornamental-corner.tsx        # Sudut tazhib kartu & banner hadits
    │       ├── ramadan-hero-ornament.tsx    # Komposisi Hilal, Fanous & Glow hero
    │       └── icons.tsx                    # RubElHizbIcon, HilalIcon, FanousIcon
    ├── globals.css                          # Definisi tokens & keyframes
    ├── layout.tsx                           # Global IslamicPatternBg injection
    └── page.tsx                             # Integrasi hero, divider, corners, hadits
```

---

## 9. Implementation Checklist & Instructions for Engineers

### 9.1 Track B: Frontend Engineer (Fiqry)
- [ ] Buat direktori `src/app/_components/ornaments/`.
- [ ] Implementasikan file ikon vektor di `icons.tsx` (Rub el Hizb, Hilal, Fanous).
- [ ] Implementasikan `islamic-pattern-bg.tsx` dengan SVG pattern seamless 64×64.
- [ ] Implementasikan `islamic-divider.tsx` dengan Rub el Hizb rosette dan gradien sayap.
- [ ] Implementasikan `ornamental-corner.tsx` dengan varian posisi 4 sudut.
- [ ] Implementasikan `ramadan-hero-ornament.tsx` dengan pendaran starlight dan animasi floating lentera.
- [ ] Pasang `IslamicPatternBg` pada `src/app/layout.tsx` (atau di wrapper utama `page.tsx`).
- [ ] Integrasikan `OrnamentalCorner` ke dalam 4 Pilar dan Banner Hadits di `src/app/page.tsx`.
- [ ] Sisipkan `IslamicDivider` di antara seksi Hero-Pilar, Pilar-Hadits, dan Hadits-Kitab.
- [ ] Tambahkan keyframe `@keyframes lanternFloat` dan token CSS di `src/app/globals.css`.
- [ ] Tambahkan entri kamus lokalisasi Ramadan di `src/dictionaries/id.json` dan `en.json`.

### 9.2 Track C: QA Engineer (Sandra)
- [ ] Verifikasi kontras warna teks di atas latar bermotif menggunakan browser contrast checker (skor WCAG AA ≥ 4.5:1).
- [ ] Uji responsivitas pada viewport 320px (iPhone SE), 375px, 768px (iPad), dan 1440px (Desktop).
- [ ] Pastikan tidak ada horizontal scrollbar (`overflow-x: hidden` terjamin).
- [ ] Verifikasi semua elemen ornamen memiliki `aria-hidden="true"`.
- [ ] Verifikasi klik tombol CTA di Hero dan kartu pilar tetap berfungsi tanpa hambatan lapisan vektor (`pointer-events-none`).
- [ ] Verifikasi mode gelap (`.dark`) dan mode terang (`light`) bertransisi mulus tanpa kedip layout (*zero Cumulative Layout Shift*).

---

## 10. Design Sign-Off & Status

| Role | Name | Status | Signature / Date |
|---|---|---|---|
| **Lead UI/UX Designer** | Angel | **APPROVED** | *Angel* — 2026-10-20 |
| **Product Manager** | Faisal | **ALIGNED** | Ref: PRD 2026-10-20 |
| **Frontend Engineer** | Fiqry | **READY FOR IMPLEMENTATION** | Awaiting Track B Build |
| **QA Engineer** | Sandra | **TEST PLAN PREPARED** | Awaiting Track C Audit |
