import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/kitab",
  useSearchParams: () => new URLSearchParams(),
}));

import HomePage from "@/app/page";
import KitabPage from "@/app/kitab/page";
import DoaPage from "@/app/doa/page";
import PanduanWaktuPage from "@/app/panduan-waktu/page";
import SiklusHaidPage from "@/app/siklus-haid/page";
import FavoritPage from "@/app/favorit/page";
import TentangPage from "@/app/tentang/page";
import manifest from "@/app/manifest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getAllBab, getAllDoa, searchKitabAndDoa } from "@/lib/kitab-data";
import type { DailyCycleLog } from "@/types/cycle-tracker";
import {
  evaluateCycleDay,
  calculatePredictions,
  recalculateRamadhanQadha,
  parseISODate,
  formatToISODate,
} from "@/lib/cycle-engine";
import {
  getMonthCalendarDays,
  getNextRecommendedTiming,
  evaluateDateTiming,
} from "@/lib/calendar-engine";
import { proxy } from "@/proxy";
import { NextRequest } from "next/server";
import { resetRateLimitStore } from "@/lib/rate-limiter";
import { encrypt, decrypt } from "@/lib/crypto";
import { obfuscateId, deobfuscateId } from "@/lib/obfuscator";

describe("End-to-End (E2E) Application Flow Suite", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  describe("1. Full Page Rendering & Route Verification", () => {
    it("renders Home Page with Ramadan seasonal badges, 4 pillars, and Siklus Haid banner", async () => {
      const html = renderToStaticMarkup(await HomePage({ searchParams: Promise.resolve({ ramadan: "true" }) }));

      expect(html).toContain("Qurrotul Uyun");
      expect(html).toContain("Syarah Nadzam Ibni Yamun");
      expect(html).toContain("20 Bab Lengkap");
      expect(html).toContain("Malam Pertama");
      expect(html).toContain("Adab Bersenggama");
      expect(html).toContain("Kumpulan Doa");
      expect(html).toContain("Waktu Utama Jima&#x27;");
      expect(html).toContain("Pelacak Siklus Haid &amp; Masa Subur Islami Terpadu");
      expect(html).toContain("/siklus-haid");
      expect(html).toContain("/kitab");
      expect(html).toContain("/doa");
      expect(html).toContain("/panduan-waktu");
    });

    it("renders Kitab Index Page listing all 20 chapters with direct reader links", async () => {
      const html = renderToStaticMarkup(await KitabPage({ searchParams: Promise.resolve({}) }));

      expect(html).toContain("Daftar 20 Bab Kitab Qurrotul Uyun");
      expect(html).toContain("Kitab Syarah Nadzam Ibni Yamun");

      // Verify all 20 chapter links exist
      for (let i = 1; i <= 20; i++) {
        expect(html).toContain(`/kitab?bab=${i}`);
      }
    });

    it("renders Kitab Chapter Reader for Bab 5 with ArabicViewer and controls", async () => {
      const html = renderToStaticMarkup(await KitabPage({ searchParams: Promise.resolve({ bab: "5" }) }));

      expect(html).toContain("Bab 5");
      expect(html).toContain("Adab Memasuki Kamar Pengantin &amp; Malam Pertama");
      expect(html).toContain("Daftar 20 Bab");
      expect(html).toContain("Bab Sebelumnya");
      expect(html).toContain("Bab Selanjutnya");
      expect(html).toContain("font-arabic");
    });

    it("renders Kitab Chapter Reader boundaries (Bab 1 has no previous, Bab 20 has no next)", async () => {
      const htmlBab1 = renderToStaticMarkup(await KitabPage({ searchParams: Promise.resolve({ bab: "1" }) }));
      expect(htmlBab1).toContain("Bab Selanjutnya");
      expect(htmlBab1).not.toContain("← Bab Sebelumnya");

      const htmlBab20 = renderToStaticMarkup(await KitabPage({ searchParams: Promise.resolve({ bab: "20" }) }));
      expect(htmlBab20).toContain("← Bab Sebelumnya");
      expect(htmlBab20).not.toContain("Bab Selanjutnya →");
    });

    it("renders Doa Page with all prayers, categories, and transliterations", () => {
      const html = renderToStaticMarkup(<DoaPage />);

      expect(html).toContain("Kumpulan Doa Mustajab");
      expect(html).toContain("Doa Pernikahan &amp; Rumah Tangga");
      expect(html).toContain("Semua Doa");
      expect(html).toContain("Jodoh");
      expect(html).toContain("Akad Nikah");
      expect(html).toContain("Malam Pertama");
      expect(html).toContain("Jima&#x27; / Intim");
      expect(html).toContain("Kehamilan &amp; Keturunan");
      expect(html).toContain("Keluarga Sakinah");
    });

    it("renders Panduan Waktu Page with hero recommendation, calendar, and tabs", () => {
      const html = renderToStaticMarkup(<PanduanWaktuPage />);

      expect(html).toContain("Panduan Waktu &amp; Adab Hubungan Suami Istri");
      expect(html).toContain("Kalender Bulanan");
      expect(html).toContain("Agenda 7 Hari");
      expect(html).toContain("Ketentuan Kitab (Asal)");
      expect(html).toContain("Ringkasan 5 Adab Sebelum &amp; Saat Berhubungan Intim");
    });

    it("renders Siklus Haid Page with privacy guarantees and Fiqh Syafi'i integrations", () => {
      const html = renderToStaticMarkup(<SiklusHaidPage />);

      expect(html).toContain("Siklus Haid, Masa Subur &amp; Fiqih Thaharah");
      expect(html).toContain("100% Data Lokal (Privasi Penuh)");
      expect(html).toContain("Pelacak Qadha Puasa Ramadhan");
      expect(html).toContain("Tata Cara Mandi Wajib (Ghusl)");
      expect(html).toContain("Kaidah Darah Istihadlah");
      expect(html).toContain("Kedaulatan Privasi 100%");
    });

    it("renders Favorit Page bookmark center", () => {
      const html = renderToStaticMarkup(<FavoritPage />);

      expect(html).toContain("Favorit &amp; Bookmark Anda");
      expect(html).toContain("Tersimpan di Perangkat Anda");
    });

    it("renders Tentang Page with historical synopsis, author nasab, and disclaimer", () => {
      const html = renderToStaticMarkup(<TentangPage />);

      expect(html).toContain("Tentang Kitab Qurrotul ‘Uyun");
      expect(html).toContain("Syekh Muhammad al-Tihami ibn al-Madani Kanun");
      expect(html).toContain("Syekh Qasim bin Ahmad bin Musa Ibni Yamun");
      expect(html).toContain("Surat Al-Furqan ayat 74");
      expect(html).toContain("Disclaimer Pembaca Dewasa");
    });

    it("generates correct PWA manifest, robots.txt, and sitemap entries", () => {
      const pwaManifest = manifest();
      expect(pwaManifest.name).toBe("Qurrotul Uyun — Panduan Rumah Tangga Islami");
      expect(pwaManifest.display).toBe("standalone");
      expect(pwaManifest.icons?.length).toBeGreaterThan(0);

      const robotsResult = robots();
      expect(robotsResult.rules).toBeDefined();
      expect(robotsResult.sitemap).toContain("/sitemap.xml");

      const sitemapResult = sitemap();
      expect(sitemapResult.length).toBe(7);
      const paths = sitemapResult.map((s) => s.url);
      expect(paths.some((p) => p.endsWith("/kitab"))).toBe(true);
      expect(paths.some((p) => p.endsWith("/doa"))).toBe(true);
      expect(paths.some((p) => p.endsWith("/panduan-waktu"))).toBe(true);
      expect(paths.some((p) => p.endsWith("/siklus-haid"))).toBe(true);
    });
  });

  describe("2. Comprehensive Search & Kitab Data Integrity", () => {
    it("ensures all 20 chapters are complete and sequentially ordered", () => {
      const chapters = getAllBab();
      expect(chapters.length).toBe(20);

      for (let i = 0; i < chapters.length; i++) {
        const bab = chapters[i];
        expect(bab.id).toBe(i + 1);
        expect(bab.nomor).toBe(`Bab ${i + 1}`);
        expect(bab.judul.length).toBeGreaterThan(0);
        expect(bab.deskripsiRingkas.length).toBeGreaterThan(0);
        expect(bab.konten.length).toBeGreaterThan(0);
      }
    });

    it("ensures all 13 prayers have Arabic, Latin, and Indonesian translations", () => {
      const doas = getAllDoa();
      expect(doas.length).toBe(13);

      for (const doa of doas) {
        expect(doa.id).toBeDefined();
        expect(doa.judul.length).toBeGreaterThan(0);
        expect(doa.arab.length).toBeGreaterThan(0);
        expect(doa.latin.length).toBeGreaterThan(0);
        expect(doa.arti.length).toBeGreaterThan(0);
        expect(doa.faedah.length).toBeGreaterThan(0);
      }
    });

    it("accurately finds results for multiple domain queries across Bab and Doa", () => {
      const jimaResults = searchKitabAndDoa("jima");
      expect(jimaResults.length).toBeGreaterThan(0);
      expect(jimaResults.some((r) => r.type === "bab")).toBe(true);
      expect(jimaResults.some((r) => r.type === "doa")).toBe(true);

      const malamPertamaResults = searchKitabAndDoa("malam pertama");
      expect(malamPertamaResults.length).toBeGreaterThan(0);

      const emptyResults = searchKitabAndDoa("xyznonexistentterm12345");
      expect(emptyResults.length).toBe(0);
    });
  });

  describe("3. Fiqih Syafi'i Cycle & Calendar Engine Calculations", () => {
    const profile = {
      lastPeriodStartDate: "2026-10-01",
      averageCycleLength: 28,
      averagePeriodDuration: 7,
      lutealPhaseDays: 14,
      isOnboardingCompleted: true,
    };

    it("calculates biological ovulation and fertile window predictions accurately", () => {
      const predictions = calculatePredictions(profile);
      expect(formatToISODate(predictions.nextPeriodStart)).toBe("2026-10-29");
      expect(formatToISODate(predictions.ovulationDate)).toBe("2026-10-14");
      expect(formatToISODate(predictions.fertileWindowStart)).toBe("2026-10-09");
      expect(formatToISODate(predictions.fertileWindowEnd)).toBe("2026-10-15");
    });

    it("enforces Mazhab Syafi'i 15-day maximum bleeding limit (Days 1-15: Haid, Day 16+: Istihadlah)", () => {
      const logs: Record<string, DailyCycleLog> = {};

      for (let day = 1; day <= 17; day++) {
        const iso = `2026-10-${String(day).padStart(2, "0")}`;
        logs[iso] = {
          isoDate: iso,
          flow: "medium",
          isGhuslDone: false,
          symptoms: [],
          moods: [],
          updatedAt: new Date().toISOString(),
        };
      }

      // Day 15 should be Haid (last allowed day of haid)
      const statusDay15 = evaluateCycleDay(parseISODate("2026-10-15"), profile, logs);
      expect(statusDay15.syariStatus).toBe("haid");
      expect(statusDay15.canPray).toBe(false);
      expect(statusDay15.canJima).toBe(false);

      // Day 16 exceeds 15 days maximum -> becomes Istihadlah
      const statusDay16 = evaluateCycleDay(parseISODate("2026-10-16"), profile, logs);
      expect(statusDay16.syariStatus).toBe("istihadlah");
      expect(statusDay16.canPray).toBe(true);
      expect(statusDay16.canFast).toBe(true);
      expect(statusDay16.canJima).toBe(true);
    });

    it("enforces Mazhab Syafi'i 15-day minimum purity gap between cycles", () => {
      // First cycle: 1-5 Oct
      const logs: Record<string, DailyCycleLog> = {
        "2026-10-01": { isoDate: "2026-10-01", flow: "medium", isGhuslDone: false, symptoms: [], moods: [], updatedAt: "" },
        "2026-10-02": { isoDate: "2026-10-02", flow: "medium", isGhuslDone: false, symptoms: [], moods: [], updatedAt: "" },
        "2026-10-03": { isoDate: "2026-10-03", flow: "medium", isGhuslDone: false, symptoms: [], moods: [], updatedAt: "" },
        "2026-10-04": { isoDate: "2026-10-04", flow: "medium", isGhuslDone: false, symptoms: [], moods: [], updatedAt: "" },
        "2026-10-05": { isoDate: "2026-10-05", flow: "medium", isGhuslDone: false, symptoms: [], moods: [], updatedAt: "" },
        // Blood re-emerges on 12 Oct (only 6 days gap < 15 days required)
        "2026-10-12": { isoDate: "2026-10-12", flow: "medium", isGhuslDone: false, symptoms: [], moods: [], updatedAt: "" },
      };

      const status = evaluateCycleDay(parseISODate("2026-10-12"), profile, logs);
      expect(status.syariStatus).toBe("istihadlah");
      expect(status.canPray).toBe(true);
    });

    it("automatically calculates Ramadan fasting debt when bleeding occurs in Ramadan", () => {
      // Ramadan 1448 H corresponds to approx February-March 2027 (Hijri month 9)
      // Find a date in month 9
      const ramadanDate = new Date(2027, 1, 15); // February 15 2027 is in Ramadan 1448 H
      const ramadanIso = formatToISODate(ramadanDate);

      const logs: Record<string, DailyCycleLog> = {
        [ramadanIso]: {
          isoDate: ramadanIso,
          flow: "heavy" as const,
          isGhuslDone: false,
          symptoms: [],
          moods: [],
          updatedAt: new Date().toISOString(),
        },
      };

      const qadhaEntries = recalculateRamadhanQadha(logs, []);
      expect(qadhaEntries.length).toBe(1);
      expect(qadhaEntries[0].dateOwed).toBe(ramadanIso);
      expect(qadhaEntries[0].isPaid).toBe(false);
    });

    it("evaluates calendar dates, Friday night recommendations, and lunar warnings", () => {
      // Thursday evening / Friday: dayOfWeek 4 is Thursday (Malam Jumat)
      const thursDate = new Date(2026, 9, 22); // Thursday
      const dayInfo = evaluateDateTiming(thursDate);

      expect(dayInfo.malamSlot.status).toBe("sangat-dianjurkan");
      expect(dayInfo.malamSlot.label).toContain("Malam Jumat");

      const monthDays = getMonthCalendarDays(2026, 9);
      expect(monthDays.length).toBeGreaterThanOrEqual(35);

      const nextRec = getNextRecommendedTiming(new Date(2026, 9, 20));
      expect(nextRec.slot).toBeDefined();
      expect(nextRec.title.length).toBeGreaterThan(0);
    });
  });

  describe("4. Security Proxy & Rate Limiting Enforcement", () => {
    it("blocks probe scanners for sensitive files (.env, .git, wp-admin)", () => {
      const maliciousPaths = ["/.env", "/.git/config", "/wp-admin/index.php", "/phpmyadmin", "/..%2fconfig"];

      for (const path of maliciousPaths) {
        const req = new NextRequest(`http://localhost:3000${path}`, {
          headers: { "user-agent": "Mozilla/5.0" },
        });
        const res = proxy(req);
        expect(res.status).toBe(403);
      }
    });

    it("blocks malicious bot user-agents (sqlmap, nikto, masscan)", () => {
      const req = new NextRequest("http://localhost:3000/kitab", {
        headers: { "user-agent": "sqlmap/1.5.2" },
      });
      const res = proxy(req);
      expect(res.status).toBe(403);
    });

    it("allows standard requests and attaches informational rate-limit headers", () => {
      const req = new NextRequest("http://localhost:3000/kitab", {
        headers: { "user-agent": "Mozilla/5.0 Chrome/120.0.0.0" },
      });
      const res = proxy(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("X-RateLimit-Limit")).toBe("120");
      expect(Number(res.headers.get("X-RateLimit-Remaining"))).toBeLessThanOrEqual(120);
    });

    it("enforces rate limit tier thresholds (blocks 429 when quota exceeded)", () => {
      const ip = "203.0.113.88";
      // Auth tier has limit of 10 req / min
      for (let i = 0; i < 10; i++) {
        const req = new NextRequest("http://localhost:3000/auth/login", {
          headers: { "cf-connecting-ip": ip },
        });
        const res = proxy(req);
        expect(res.status).toBe(200);
      }

      // 11th request must be rejected with 429
      const overflowReq = new NextRequest("http://localhost:3000/auth/login", {
        headers: { "cf-connecting-ip": ip },
      });
      const overflowRes = proxy(overflowReq);
      expect(overflowRes.status).toBe(429);
      expect(overflowRes.headers.get("Retry-After")).toBeDefined();
    });
  });

  describe("5. Cryptographic Security & Obfuscator Round-Trip", () => {
    it("encrypts and decrypts payloads correctly with AES-256-GCM", () => {
      const sensitiveText = "User-Personal-Siklus-Note-12345";
      const encrypted = encrypt(sensitiveText);
      expect(encrypted).not.toBe(sensitiveText);

      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(sensitiveText);
    });

    it("safely rejects tampered encrypted payloads", () => {
      const encrypted = encrypt("Secret");
      const tampered = encrypted.slice(0, -4) + "AAAA";
      const result = decrypt(tampered);
      expect(result).toBeNull();
    });

    it("obfuscates and deobfuscates positive integer IDs with Sqids", () => {
      const id = 1204;
      const hash = obfuscateId(id);
      expect(hash.length).toBeGreaterThanOrEqual(6);

      const decoded = deobfuscateId(hash);
      expect(decoded).toBe(id);
    });
  });
});
