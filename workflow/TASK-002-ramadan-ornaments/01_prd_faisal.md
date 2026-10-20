# TASK-002: Ramadan Islamic Geometric Patterns & Ornaments - Product Requirement Document (PRD)

> **Feature:** Ramadan Islamic Geometric Patterns & Ornaments  
> **Author:** Faisal (Product Manager & Business Analyst)  
> **Date:** 2026-10-20  
> **Status:** IN_PROGRESS  
> **Target Release:** Qurrotul Uyun Web & PWA v1.2.0  

---

## 1. Executive Summary & Objective

### 1.1 Problem Statement
The current Qurrotul Uyun website delivers comprehensive Islamic marriage guidance and prayers with clean functional typography, but lacks ambient Islamic aesthetic identity. Users visiting during Ramadan and holy months seek an immersive, culturally reverent visual atmosphere that reflects classical Islamic arts (geometric arabesque, Rub el Hizb motifs, subtle crescents and lanterns) without sacrificing modern UI legibility or loading speed.

### 1.2 Objective
Implement authentic, elegant, and lightweight Islamic geometric patterns and Ramadan ornamental motifs across the Qurrotul Uyun web application. The design must elevate visual prestige, celebrate the holy season, maintain strict WCAG AA contrast standards, introduce zero third-party runtime dependencies, and preserve seamless light and dark mode transitions.

### 1.3 Target Audience & User Persona
- **Primary Persona:** Muslim couples, newlyweds, and Islamic studies readers seeking marital guidance and daily prayers on mobile and desktop devices.
- **User Need:** A calm, sacred, and respectful reading environment with authentic Islamic visual ornaments that do not distract from long-form Arabic and Indonesian text.

### 1.4 Success Metrics
- **Performance:** Zero increase in JavaScript bundle size; SVG assets under 15 KB total; Cumulative Layout Shift (CLS) = 0.
- **Accessibility:** 100% WCAG 2.1 AA text contrast compliance (minimum 4.5:1 for normal text, 3:1 for large headings) across light and dark modes.
- **Visual Engagement:** Zero user-reported readability regressions during prolonged night reading sessions.

---

## 2. User Stories

1. **US-01 (Reader Experience):** As a user reading marriage chapters, I want a subtle Islamic geometric background lattice so that the application feels spiritually dignified and visually rich.
2. **US-02 (Seasonal Atmosphere):** As a visitor accessing the homepage during holy times, I want festive Ramadan header emblems and crescent-star motifs so that I feel the special blessings of the month.
3. **US-03 (Focus & Content Framing):** As a student reading hadith quotes and prayer cards, I want ornamental corner brackets and dividers so that key passages feel distinguished like classical illuminated manuscripts (*tazhib*).
4. **US-04 (Comfort & Dark Mode):** As a night reader in dark mode, I want patterns to remain soft and non-glaring (3% to 6% opacity) so that eye strain is prevented.

---

## 3. Scope & Boundaries

### 3.1 In Scope
- **Ambient Islamic Geometric Background:** Seamless CSS or inline SVG geometric tiling (8-point Rub el Hizb lattice) rendered at 3% to 6% opacity on page containers.
- **Ramadan Hero & Header Accents:** Decorative crescent (Hilal), 8-point Islamic star rosettes, and subtle lantern (Fanous) vectors positioned in the homepage hero and navigation backdrop.
- **Ornamental Card & Banner Frames:** Decorative corner accents and subtle border flourishes for the 4 Pillar cards, Hadits Hari Ini banner, and featured chapter cards.
- **Islamic Section Dividers:** Elegant arabesque rosettes with tapered horizontal lines separating homepage sections (replacing plain generic `<hr>` borders).
- **Ramadan Seasonal Emblem/Badge:** Subtle seasonal badge (e.g., "Ramadan Kareem / Syahrul Mubarak") harmonized with the existing Nadzam Ibni Yamun pill badge.
- **Dark & Light Mode Integration:** Adaptive styling using CSS variables and Tailwind v4 theme tokens (`--color-emerald-deep`, `--color-gold-warm`, `--color-border`).

### 3.2 Out of Scope (Ponytail / YAGNI Scoping)
- No heavy canvas or WebGL particle generators (e.g., falling stars or 3D spinning lanterns).
- No audio cues (e.g., bedug sound effects or automated adhan playback).
- No complex theme toggles or user-customizable pattern pickers.
- No external font icon libraries (e.g., FontAwesome, Boxicons); all ornaments must use native lightweight SVG code.
- No invasive full-screen modal overlays or blocking Ramadan greeting popups.

---

## 4. Functional Scope & Component Specifications

### 4.1 Ambient Background Pattern (`IslamicPatternBg`)
- Renders an infinite repeating SVG pattern based on Islamic 8-pointed geometric tessellation.
- Applied as fixed/absolute non-interactive background layer (`pointer-events-none`).
- Opacity strictly bounded:
  - Light mode: 3% to 5% stroke opacity using emerald/slate tones (`#065f46` / `#78716c`).
  - Dark mode: 4% to 6% stroke opacity using muted emerald/gold tones (`#10b981` / `#fbbf24`).

### 4.2 Ramadan Hero Ornaments (`RamadanHeroOrnament`)
- Crescent moon (*Hilal*) vector combined with a delicate hanging lantern silhouette (*Fanous*).
- Located in the hero background periphery (top-right and top-left corners of hero wrapper), non-obtrusive to hero typography and CTA buttons.
- Subtle CSS floating or ambient glow animation using hardware-accelerated transforms (`transform: translateY`).

### 4.3 Ornamental Card Brackets (`OrnamentalCorner`)
- Classical illuminated manuscript corner brackets applied to the Hadits banner and 4 Pillar cards.
- Scalable SVG path component taking `position: "top-left" | "top-right" | "bottom-left" | "bottom-right"`.
- Gold-warm accent color (`var(--color-gold-warm)`) with subtle opacity (20% to 35%).

### 4.4 Decorative Islamic Section Divider (`IslamicDivider`)
- Centerpiece featuring a Rub el Hizb 8-point star or floral arabesque node flanked by symmetrical gradient horizontal rules.
- Optional small Bismillah calligraphic SVG or ornamental palmette symbol.
- Responsive width: max 320px on mobile, max 480px on desktop.

### 4.5 Ramadan Seasonal Badge
- Refined pill badge within the Hero component or adjacent to the header branding.
- Displays seasonal greeting with icon indicator, respecting localized strings from `src/dictionaries/id.json` and `en.json`.

---

## 5. Acceptance Criteria (BDD / Gherkin Matrix)

### AC-01: Ambient Islamic Lattice Background Rendering
```gherkin
Scenario: Ambient geometric pattern displays seamlessly across viewpoints
  Given the user opens any page of the Qurrotul Uyun web app
  When the page finishes rendering
  Then a subtle Islamic geometric lattice pattern is visible in the background
  And the pattern has pointer-events set to none
  And the pattern opacity remains between 3% and 6%
  And the pattern does not produce horizontal scrollbars on viewports from 320px to 2560px
```

### AC-02: Ramadan Hero Ornaments & Visual Hierarchy
```gherkin
Scenario: Hero section displays Ramadan crescent and lantern motifs
  Given the user visits the homepage on desktop or mobile
  When the hero section is in view
  Then decorative Ramadan crescent and lantern SVG elements render in the background frame
  And the hero headline and CTA buttons remain fully readable without overlap
  And all interactive elements maintain their click and tap targets
```

### AC-03: Ornamental Corner Accents on Feature Cards & Hadits Banner
```gherkin
Scenario: Feature cards and Hadits banner display illuminated corner brackets
  Given the user scrolls to the "Pilar Pembahasan Utama" or "Untaian Hadits Hari Ini" section
  When cards are rendered
  Then subtle ornamental corner accents appear on the card borders
  And the corner accents adapt their stroke color according to light and dark theme tokens
  And text within the card maintains standard padding and does not clip with the ornaments
```

### AC-04: Decorative Islamic Section Separator
```gherkin
Scenario: Section dividers display Islamic star rosettes between content blocks
  Given the homepage content flows between major sections
  When the user scrolls past the 4 Pillars or Hadits banner
  Then an ornamental Islamic divider with an 8-pointed star node renders horizontally centered
  And the divider transitions smoothly from central motif to transparent rules on both flanks
  And the divider does not shift page layout during initial load
```

### AC-05: Ramadan Festive Header Emblem & i18n Compatibility
```gherkin
Scenario: Seasonal Ramadan indicator renders with internationalization support
  Given the user views the header or hero top area
  When the locale is set to "id" (Indonesian) or "en" (English)
  Then the festive Ramadan badge renders the appropriate localized label from the dictionary
  And the badge contains a subtle crescent/star icon
  And the badge does not obscure navigation links or drawer triggers
```

### AC-06: Dark Mode Compatibility & WCAG AA Contrast Compliance
```gherkin
Scenario: User toggles between Light and Dark mode
  Given the user switches theme from Light to Dark or vice versa
  When the theme changes
  Then all pattern strokes and ornamental fills transition smoothly
  And text contrast on all headings, body text, and links meets WCAG 2.1 AA (>= 4.5:1 for body, >= 3:1 for large text)
  And ornamental vectors do not cause contrast degradation or background glare
```

---

## 6. Non-Functional Requirements

1. **Performance & Lightweight Assets:**
   - All ornamental assets must be pure vector SVGs or inline CSS data URIs.
   - Total payload of all added SVG assets must not exceed 15 KB uncompressed.
   - Zero external icon libraries or JavaScript animation packages allowed.
2. **Accessibility (WCAG 2.1 AA):**
   - Decorative ornaments must carry `aria-hidden="true"` so screen readers bypass them.
   - Contrast ratio of text against patterned background must remain >= 4.5:1 across all color modes.
3. **Responsive Design (Mobile-First):**
   - Seamless presentation from small mobile screens (320px) up to ultra-wide displays (2560px).
   - Touch targets for interactive elements inside cards must remain >= 44x44px.
4. **Architectural Consistency:**
   - Adhere to Next.js 16 App Router, React 19 Server Component standards where applicable.
   - Adhere to Tailwind CSS v4 design tokens defined in `src/app/globals.css`.
   - Reusable ornamental components placed in `src/app/_components/ornaments/`.

---

## 7. Cross-Role Alignment Log

| Role | Domain / Concern | Resolution & Binding Decision |
|---|---|---|
| **Angel (UI/UX)** | Visual weight, motif authenticity, token alignment | Rub el Hizb 8-point star and fanous lantern vectors; gold-warm and emerald tokens; opacity capped at 6% to prevent visual fatigue. |
| **Fiqry (Web Frontend)** | Component co-location, SVG optimization, Tailwind v4 integration | Create reusable components under `src/app/_components/ornaments/`; use Tailwind utility classes with CSS variables; zero client-side animation runtime. |
| **Bryan (Backend / DevOps)** | Asset caching, build size, static delivery | Pure SVG components rendered inline or via Next.js static bundling; zero API or backend footprint. |
| **Sandra (QA & Security)** | Contrast ratios, cross-browser SVG rendering, accessibility tags | All decorative SVGs require `aria-hidden="true"`; visual regression test on Chromium, Firefox, and WebKit across 375px, 768px, 1440px viewports. |

---

## 8. Execution Tracks (Fork-Join Concurrency)

- **Track A (UI/UX - Angel):** Design detailed ornamental tokens, SVG path definitions, and corner layout mockups in `workflow/TASK-002-ramadan-ornaments/02_design_angel.md`.
- **Track B (Frontend Build - Fiqry):** Implement ornament components (`islamic-pattern-bg.tsx`, `islamic-divider.tsx`, `ornamental-corner.tsx`, `ramadan-ornament.tsx`) and integrate into `src/app/page.tsx` and layout in `workflow/TASK-002-ramadan-ornaments/03_build_fiqry.md`.
- **Track C (QA & Verification - Sandra):** Audit WCAG AA contrast, responsive breakpoints, SVG rendering, and Serwist PWA build verification in `workflow/TASK-002-ramadan-ornaments/04_qa_sandra.md`.
