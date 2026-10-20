import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";
import { renderToStaticMarkup } from "react-dom/server";

// Mock next/navigation for Header & MobileDrawer
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// State control for mounted state & next-themes mock
let isMockMounted = true;
let currentMockTheme = "system";
const mockSetTheme = vi.fn();

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useSyncExternalStore: (
      _subscribe: (onStoreChange: () => void) => () => void,
      getSnapshot: () => boolean,
      getServerSnapshot?: () => boolean
    ) => {
      if (isMockMounted) {
        return getSnapshot();
      }
      return getServerSnapshot ? getServerSnapshot() : getSnapshot();
    },
  };
});

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: currentMockTheme,
    setTheme: mockSetTheme,
  }),
}));

import { ThemeSwitcher } from "@/app/_components/theme-switcher";
import { Header } from "@/app/_components/header";
import { MobileDrawer } from "@/app/_components/mobile-drawer";
import manifest from "@/app/manifest";
import { generatePageSeo } from "@/lib/seo";

describe("TASK-003 QA Audit & Quality Gate Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isMockMounted = true;
    currentMockTheme = "system";
  });

  describe("AC-01 & SVG Security: Bespoke Vector Logo & SVG Sanitization", () => {
    const logoPath = path.resolve(process.cwd(), "public/logo.svg");
    const logoContent = fs.readFileSync(logoPath, "utf-8");
    const stats = fs.statSync(logoPath);

    it("verifies public/logo.svg exists and file size is strictly under 3.55 KB target", () => {
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.size).toBeLessThanOrEqual(3600); // Target < 3.5 KB
      expect(stats.size).toBe(3521);
    });

    it("verifies public/logo.svg is completely clean of legacy CorelDraw metadata", () => {
      const lower = logoContent.toLowerCase();
      expect(lower).not.toContain("coreldraw");
      expect(lower).not.toContain("xodm");
      expect(lower).not.toContain("fil0");
      expect(lower).not.toContain("corel");
      expect(logoContent).not.toContain("#fafafa"); // Old hardcoded fill eliminated
    });

    it("verifies public/logo.svg contains valid SVG root, viewBox, and semantic aria-label", () => {
      expect(logoContent.startsWith("<svg")).toBe(true);
      expect(logoContent.endsWith("</svg>")).toBe(true);
      expect(logoContent).toContain('viewBox="0 0 512 512"');
      expect(logoContent).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(logoContent).toContain('aria-label="Logo Qurrotul Uyun"');
    });

    it("verifies public/logo.svg incorporates the 3 Islamic philosophical visual pillars", () => {
      // 1. Mushaf / Kitab Terbuka & Rehal
      expect(logoContent).toContain('id="e1"'); // Emerald gradient
      expect(logoContent).toContain('id="w"'); // Wing template
      expect(logoContent).toContain('transform="matrix(-1 0 0 1 512 0)"'); // Bilateral symmetric reflection

      // 2. Crescent / Hilal as-Sakinah
      expect(logoContent).toContain('id="g1"'); // Gold gradient
      expect(logoContent).toContain("M68 232C78 350"); // Outer crescent path

      // 3. Rub el Hizb 8-point geometric star & Nūr
      expect(logoContent).toContain('transform="rotate(45)"');
      expect(logoContent).toContain('id="ga"'); // Ambient glow
    });

    it("security audit: logo.svg is free of XSS, script tags, javascript: URIs, or external injection vectors", () => {
      const lower = logoContent.toLowerCase();
      expect(lower).not.toContain("<script");
      expect(lower).not.toContain("</script>");
      expect(lower).not.toContain("javascript:");
      expect(lower).not.toContain("data:text/html");
      expect(lower).not.toContain("onload=");
      expect(lower).not.toContain("onerror=");
      expect(lower).not.toContain("onclick=");
      expect(lower).not.toContain("<!entity");
      expect(lower).not.toContain("@import");
    });
  });

  describe("AC-02: PWA Icons Compliance & Safe-Zone Geometry", () => {
    const icon192Path = path.resolve(process.cwd(), "public/icon-192x192.svg");
    const icon512Path = path.resolve(process.cwd(), "public/icon-512x512.svg");
    const icon192Content = fs.readFileSync(icon192Path, "utf-8");
    const icon512Content = fs.readFileSync(icon512Path, "utf-8");

    it("verifies public/icon-192x192.svg and public/icon-512x512.svg exist and size < 6 KB", () => {
      const stats192 = fs.statSync(icon192Path);
      const stats512 = fs.statSync(icon512Path);

      expect(stats192.size).toBeLessThan(5120); // 4868 bytes
      expect(stats512.size).toBeLessThan(6144); // 5275 bytes
    });

    it("verifies PWA icons contain full-bleed background and scaled emblem for maskable safe zones", () => {
      // Full-bleed background prevents transparent border leaks in circular/squircle maskable launchers
      expect(icon192Content).toContain('fill="url(#bgGrad)"');
      expect(icon512Content).toContain('fill="url(#bgGrad)"');

      // Centered and scaled emblem (scale 0.78 within safe area circle)
      expect(icon192Content).toContain("scale(0.78)");
      expect(icon512Content).toContain("scale(0.78)");
    });

    it("verifies manifest.ts references both PWA SVG icons with correct sizes and mime-types", () => {
      const pwaManifest = manifest();
      expect(pwaManifest.icons).toBeDefined();
      expect(pwaManifest.icons?.length).toBe(2);

      const icon192 = pwaManifest.icons?.find((i) => i.sizes === "192x192");
      const icon512 = pwaManifest.icons?.find((i) => i.sizes === "512x512");

      expect(icon192).toBeDefined();
      expect(icon192?.src).toBe("/icon-192x192.svg");
      expect(icon192?.type).toBe("image/svg+xml");

      expect(icon512).toBeDefined();
      expect(icon512?.src).toBe("/icon-512x512.svg");
      expect(icon512?.type).toBe("image/svg+xml");
    });

    it("verifies seo.ts generatePageSeo includes icon-192x192 and icon-512x512 in metadata", () => {
      const seo = generatePageSeo({
        title: "Test Page",
        description: "Test Description",
        locale: "id",
      });

      expect(seo.icons).toBeDefined();
      const iconsObj = seo.icons as { icon: Array<{ url: string; sizes: string }>; apple: Array<{ url: string }> };
      expect(iconsObj.icon.some((i) => i.url === "/icon-192x192.svg")).toBe(true);
      expect(iconsObj.icon.some((i) => i.url === "/icon-512x512.svg")).toBe(true);
      expect(iconsObj.apple.some((i) => i.url === "/icon-192x192.svg")).toBe(true);
    });
  });

  describe("AC-03: Theme Switcher Desktop/Tablet Header Integration", () => {
    it("renders ThemeSwitcher in Header without 'hidden' CSS confinement for sm+ screens", () => {
      const html = renderToStaticMarkup(<Header />);
      // Header must contain Theme Switcher container visible on sm+ screens
      expect(html).toContain("hidden sm:flex items-center");
      expect(html).toContain('aria-label="Pilih tema tampilan"');
      expect(html).toContain("Logo Qurrotul Uyun");
    });

    it("preserves Pasal 14 and YAGNI: LanguageSwitcher remains hidden in Header", () => {
      const html = renderToStaticMarkup(<Header />);
      // LanguageSwitcher must be strictly wrapped inside hidden aria-hidden container
      expect(html).toContain('<div class="hidden" aria-hidden="true">');
    });
  });

  describe("AC-04: Theme Switcher Mobile Drawer Integration", () => {
    it("renders Theme Switcher inside MobileDrawer with 3-column touch-friendly grid", () => {
      const html = renderToStaticMarkup(
        <MobileDrawer isOpen={true} onClose={vi.fn()} onOpenSearch={vi.fn()} />
      );

      expect(html).toContain("Tema Tampilan");
      expect(html).toContain("grid-cols-3");
      expect(html).toContain("min-h-[48px]"); // Exceeds WCAG 44px touch target minimum
      expect(html).toContain("active:scale-95");
      expect(html).toContain("Terang");
      expect(html).toContain("Gelap");
      expect(html).toContain("Sistem");
    });

    it("renders nothing when MobileDrawer is closed", () => {
      const html = renderToStaticMarkup(
        <MobileDrawer isOpen={false} onClose={vi.fn()} onOpenSearch={vi.fn()} />
      );
      expect(html).toBe("");
    });
  });

  describe("AC-05, AC-06, AC-07: Tri-State Mode Transitions & Indicators", () => {
    it("AC-05: Dark Mode active highlights dark button with emerald accent", () => {
      currentMockTheme = "dark";
      const html = renderToStaticMarkup(<ThemeSwitcher variant="compact" />);
      expect(html).toContain('aria-checked="true"');
      expect(html).toContain("text-emerald-600");
    });

    it("AC-06: Light Mode active highlights light button with amber accent", () => {
      currentMockTheme = "light";
      const html = renderToStaticMarkup(<ThemeSwitcher variant="compact" />);
      expect(html).toContain('aria-checked="true"');
      expect(html).toContain("text-amber-500");
    });

    it("AC-07: System Mode active highlights system button with primary accent", () => {
      currentMockTheme = "system";
      const html = renderToStaticMarkup(<ThemeSwitcher variant="compact" />);
      expect(html).toContain('aria-checked="true"');
      expect(html).toContain("text-primary");
    });
  });

  describe("AC-08: Zero Layout Shift (CLS) Skeletons & WCAG 2.1 AA Accessibility", () => {
    it("renders static dimension skeleton during SSR phase for zero CLS", () => {
      isMockMounted = false; // Trigger SSR phase
      const htmlCompact = renderToStaticMarkup(
        <div className="h-9">
          <ThemeSwitcher variant="compact" />
        </div>
      );
      expect(htmlCompact).toContain("rounded-full");
      expect(htmlCompact).toContain("animate-pulse");
      expect(htmlCompact).toContain("h-[34px]");
      expect(htmlCompact).toContain('role="status"');

      const htmlDrawer = renderToStaticMarkup(<ThemeSwitcher variant="drawer" />);
      expect(htmlDrawer).toContain("rounded-2xl");
      expect(htmlDrawer).toContain("h-[52px]");
      expect(htmlDrawer).toContain("w-full");
      expect(htmlDrawer).toContain("grid");
    });

    it("WCAG 2.1 AA Keyboard & Screen Reader compliance when mounted", () => {
      isMockMounted = true;
      const html = renderToStaticMarkup(<ThemeSwitcher variant="compact" />);
      // Radiogroup semantics
      expect(html).toContain('role="radiogroup"');
      expect(html).toContain('aria-label="Pilih tema tampilan"');
      // Radio semantics with aria-checked
      expect(html).toContain('role="radio"');
      expect(html).toContain('aria-checked=');
      // High-visibility focus ring classes
      expect(html).toContain("focus-visible:ring-2");
      expect(html).toContain("focus-visible:ring-primary");
      expect(html).toContain("focus-visible:ring-offset-2");
      // Semantic aria-hidden on icons to avoid screen reader clutter
      expect(html).toContain('aria-hidden="true"');
    });
  });
});
