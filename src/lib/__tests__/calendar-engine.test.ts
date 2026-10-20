import { describe, it, expect } from "vitest";
import {
  evaluateDateTiming,
  formatGregorianFull,
  formatGregorianShort,
  formatToISODate,
  getHijriDateDetails,
  getHijriMonthRangeForGregorian,
  getMonthCalendarDays,
  getMonthYearDisplay,
  getNextRecommendedTiming,
  isDateInHaidRange,
  isRamadanSeason,
} from "../calendar-engine";
import type { HaidPeriodConfig } from "@/types/calendar-waktu";

describe("Calendar Engine - Islamic Timing & Hijri Calculation Test Suite", () => {
  describe("AC-01: Calendar Grid & Navigation Engine", () => {
    it("generates exactly 35 or 42 grid cells for any month", () => {
      // Test across multiple months in 2026 and 2027
      const months = [
        { year: 2026, month: 0 }, // Jan 2026
        { year: 2026, month: 1 }, // Feb 2026 (non leap)
        { year: 2026, month: 9 }, // Oct 2026
        { year: 2028, month: 1 }, // Feb 2028 (leap year)
      ];

      for (const { year, month } of months) {
        const grid = getMonthCalendarDays(year, month);
        expect([35, 42]).toContain(grid.length);

        // Every cell has valid ISO date and Gregorian day
        for (const cell of grid) {
          expect(cell.isoDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          expect(cell.gregorianDay).toBeGreaterThanOrEqual(1);
          expect(cell.gregorianDay).toBeLessThanOrEqual(31);
        }

        // Verify current month flagging
        const currentMonthCells = grid.filter((c) => c.isCurrentMonth);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        expect(currentMonthCells.length).toBe(daysInMonth);
      }
    });

    it("correctly handles leap year February (29 days in 2028)", () => {
      const feb2028Grid = getMonthCalendarDays(2028, 1);
      const febDays = feb2028Grid.filter((c) => c.isCurrentMonth);
      expect(febDays.length).toBe(29);
      expect(febDays[28].gregorianDay).toBe(29);
      expect(febDays[28].isoDate).toBe("2028-02-29");
    });

    it("formats ISO date deterministically without timezone shift", () => {
      const date = new Date(2026, 9, 24, 15, 30);
      expect(formatToISODate(date)).toBe("2026-10-24");
    });

    it("provides localized Indonesian month-year headers", () => {
      expect(getMonthYearDisplay(2026, 9)).toBe("Oktober 2026");
      expect(getMonthYearDisplay(2027, 0)).toBe("Januari 2027");
      expect(formatGregorianShort(new Date(2026, 9, 24))).toBe("24 Okt 2026");
      expect(formatGregorianFull(new Date(2026, 9, 24))).toBe(
        "Sabtu, 24 Oktober 2026"
      );
    });
  });

  describe("AC-02 & AC-03: Fiqih Timing Status & Day/Night Split", () => {
    it("classifies Kamis Malam (Ba'da Maghrib) as Malam Jumat (Sangat Dianjurkan / Sunnah Muakkad)", () => {
      // 2026-10-22 is Thursday (Kamis, dayOfWeek = 4)
      const kamisDate = new Date(2026, 9, 22);
      expect(kamisDate.getDay()).toBe(4);

      const info = evaluateDateTiming(kamisDate);

      // Night slot must be Malam Jumat (Sangat Dianjurkan)
      expect(info.malamSlot.status).toBe("sangat-dianjurkan");
      expect(info.malamSlot.label).toContain("Malam Jumat");
      expect(info.malamSlot.alasan).toContain("Sunnah Muakkad");
      expect(info.malamSlot.doaIdRecommended).toBe("doa-5");

      // Overall primary status must be Sangat Dianjurkan with emerald badge
      expect(info.primaryStatus).toBe("sangat-dianjurkan");
      expect(info.primaryBadge.variant).toBe("emerald");
      expect(info.primaryBadge.label).toBe("Malam Jumat");
    });

    it("classifies Ahad Malam as Malam Senin (Sangat Dianjurkan)", () => {
      // 2026-10-18 is Sunday (Ahad, dayOfWeek = 0)
      const ahadDate = new Date(2026, 9, 18);
      expect(ahadDate.getDay()).toBe(0);

      const info = evaluateDateTiming(ahadDate);

      // Night slot is Malam Senin (kelahiran Nabi SAW)
      expect(info.malamSlot.status).toBe("sangat-dianjurkan");
      expect(info.malamSlot.label).toContain("Malam Senin");
      expect(info.malamSlot.alasan).toContain("Rasulullah SAW");

      // Daytime slot on Sunday is Boleh / Mubah
      expect(info.siangSlot.status).toBe("baik");
      expect(info.siangSlot.label).toContain("Minggu Siang");
    });

    it("classifies Rabu Malam as Malam Kamis (Sangat Dianjurkan)", () => {
      // 2026-10-21 is Wednesday (Rabu, dayOfWeek = 3)
      const rabuDate = new Date(2026, 9, 21);
      expect(rabuDate.getDay()).toBe(3);

      const info = evaluateDateTiming(rabuDate);

      expect(info.malamSlot.status).toBe("sangat-dianjurkan");
      expect(info.malamSlot.label).toContain("Malam Kamis");
    });

    it("classifies Senin Siang as Sangat Dianjurkan (Kelahiran & Kenabian Rasulullah SAW)", () => {
      // 2026-10-19 is Monday (Senin, dayOfWeek = 1)
      const seninDate = new Date(2026, 9, 19);
      expect(seninDate.getDay()).toBe(1);

      const info = evaluateDateTiming(seninDate);

      expect(info.siangSlot.status).toBe("sangat-dianjurkan");
      expect(info.siangSlot.label).toContain("Senin Siang");
    });

    it("classifies Jumat Malam as Malam Sabtu (Dimakruhkan)", () => {
      // 2026-10-23 is Friday (Jumat, dayOfWeek = 5)
      const jumatDate = new Date(2026, 9, 23);
      expect(jumatDate.getDay()).toBe(5);

      const info = evaluateDateTiming(jumatDate);

      expect(info.malamSlot.status).toBe("makruh");
      expect(info.malamSlot.label).toContain("Malam Sabtu");
      expect(info.primaryStatus).toBe("makruh");
      expect(info.primaryBadge.variant).toBe("amber");
    });

    it("classifies Sabtu Siang as Dimakruhkan", () => {
      // 2026-10-24 is Saturday (Sabtu, dayOfWeek = 6)
      const sabtuDate = new Date(2026, 9, 24);
      expect(sabtuDate.getDay()).toBe(6);

      const info = evaluateDateTiming(sabtuDate);

      expect(info.siangSlot.status).toBe("makruh");
      expect(info.siangSlot.label).toContain("Sabtu Siang");
    });

    it("classifies Selasa & Rabu daytime as Boleh / Mubah (Blue Badge)", () => {
      // 2026-10-20 is Tuesday (Selasa, dayOfWeek = 2)
      const selasaDate = new Date(2026, 9, 20);
      const info = evaluateDateTiming(selasaDate);

      expect(info.siangSlot.status).toBe("baik");
      expect(info.malamSlot.status).toBe("baik");
      expect(info.primaryStatus).toBe("baik");
      expect(info.primaryBadge.variant).toBe("blue");
    });
  });

  describe("AC-04: Hijri Calculation & Lunar Critical Phase Detection", () => {
    it("accurately converts Gregorian date to Umm al-Qura Hijri representation", () => {
      const date = new Date(2026, 9, 24);
      const hijri = getHijriDateDetails(date);

      expect(hijri.year).toBeGreaterThanOrEqual(1447);
      expect(hijri.month).toBeGreaterThanOrEqual(1);
      expect(hijri.month).toBeLessThanOrEqual(12);
      expect(hijri.day).toBeGreaterThanOrEqual(1);
      expect(hijri.day).toBeLessThanOrEqual(30);
      expect(hijri.formatted).toContain("H");
    });

    it("detects Malam Purnama (14-16 Hijriah) and marks night slot as Dimakruhkan", () => {
      // Search for a date in 2026 where hijriDay is 14, 15, or 16
      let purnamaDate: Date | null = null;
      for (let day = 1; day <= 30; day++) {
        const d = new Date(2026, 9, day);
        const h = getHijriDateDetails(d);
        if (h.day >= 14 && h.day <= 16) {
          purnamaDate = d;
          break;
        }
      }

      expect(purnamaDate).not.toBeNull();
      if (purnamaDate) {
        const info = evaluateDateTiming(purnamaDate);
        expect(info.isPurnama).toBe(true);
        expect(info.malamSlot.status).toBe("makruh");
        expect(info.malamSlot.label).toContain("Purnama");
        expect(info.primaryBadge.variant).toBe("amber");
        expect(info.primaryBadge.label).toBe("Purnama");
        expect(info.primaryBadge.icon).toBe("🌕");
      }
    });

    it("detects Malam Awal Bulan (1 Hijriah) and marks night slot as Dimakruhkan", () => {
      let awalBulanDate: Date | null = null;
      // Scan up to 60 days to find Hijri day 1
      for (let offset = 0; offset < 60; offset++) {
        const d = new Date(2026, 9, 1 + offset);
        const h = getHijriDateDetails(d);
        if (h.day === 1) {
          awalBulanDate = d;
          break;
        }
      }

      expect(awalBulanDate).not.toBeNull();
      if (awalBulanDate) {
        const info = evaluateDateTiming(awalBulanDate);
        expect(info.isAwalBulan).toBe(true);
        expect(info.malamSlot.status).toBe("makruh");
        expect(info.malamSlot.label).toContain("Awal Bulan");
        expect(info.primaryBadge.variant).toBe("amber");
        expect(info.primaryBadge.label).toBe("Awal Bln");
        expect(info.primaryBadge.icon).toBe("🌑");
      }
    });

    it("detects Malam Akhir Bulan (29-30 Hijriah) and marks night slot as Dimakruhkan", () => {
      let akhirBulanDate: Date | null = null;
      for (let offset = 0; offset < 60; offset++) {
        const d = new Date(2026, 9, 1 + offset);
        const h = getHijriDateDetails(d);
        if (h.day >= 29) {
          akhirBulanDate = d;
          break;
        }
      }

      expect(akhirBulanDate).not.toBeNull();
      if (akhirBulanDate) {
        const info = evaluateDateTiming(akhirBulanDate);
        expect(info.isAkhirBulan).toBe(true);
        expect(info.malamSlot.status).toBe("makruh");
        expect(info.malamSlot.label).toContain("Akhir Bulan");
        expect(info.primaryBadge.variant).toBe("amber");
        expect(info.primaryBadge.label).toBe("Akhir Bln");
      }
    });

    it("summarizes Hijri month range across a Gregorian month", () => {
      const summary = getHijriMonthRangeForGregorian(2026, 9);
      expect(summary).toMatch(/\d{4}\s*H/);
    });
  });

  describe("AC-05: Highlight Card 'Waktu Utama Terdekat'", () => {
    it("returns next upcoming recommended slot from a reference date", () => {
      // Reference date: Wednesday 2026-10-21
      // Tomorrow (Thursday 2026-10-22) evening is Malam Jumat
      const refDate = new Date(2026, 9, 21);
      const nextRec = getNextRecommendedTiming(refDate);

      expect(nextRec).toBeDefined();
      expect(nextRec.slot).toBe("malam");
      expect(nextRec.title).toContain("Malam");
      expect(nextRec.countdownText).toBeDefined();
      expect(nextRec.fadhilah).toBeDefined();
      expect(nextRec.hijriFormatted).toContain("H");
    });

    it("gives human countdown text for offset = 0, 1, 2", () => {
      // Test Thursday (offset 0: Malam Jumat is tonight)
      const thursday = new Date(2026, 9, 22);
      const recThursday = getNextRecommendedTiming(thursday);
      expect(recThursday.countdownText).toBe("Malam ini ba'da Maghrib");

      // Test Tuesday (offset 1: Wednesday night / Malam Kamis is tomorrow)
      const tuesday = new Date(2026, 9, 20);
      const recTuesday = getNextRecommendedTiming(tuesday);
      expect(recTuesday.countdownText).toBe("Besok ba'da Maghrib");
    });
  });

  describe("AC-07: Agenda 7-Day Computation", () => {
    it("generates 7 sequential days starting from reference date", () => {
      const start = new Date(2026, 9, 20);
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(evaluateDateTiming(d));
      }

      expect(days.length).toBe(7);
      expect(days[0].gregorianDay).toBe(20);
      expect(days[6].gregorianDay).toBe(26);
    });
  });

  describe("AC-08: Haid Range Overlay & Ramadhan Fasting Fiqih", () => {
    it("correctly identifies dates within active haid duration", () => {
      const config: HaidPeriodConfig = {
        startDate: "2026-10-20",
        durationDays: 7,
        active: true,
      };

      // In range: 2026-10-20 through 2026-10-26 (7 days)
      expect(isDateInHaidRange(new Date(2026, 9, 20), config)).toBe(true);
      expect(isDateInHaidRange(new Date(2026, 9, 23), config)).toBe(true);
      expect(isDateInHaidRange(new Date(2026, 9, 26), config)).toBe(true);

      // Outside range
      expect(isDateInHaidRange(new Date(2026, 9, 19), config)).toBe(false);
      expect(isDateInHaidRange(new Date(2026, 9, 27), config)).toBe(false);
    });

    it("ignores haid range if active is false", () => {
      const config: HaidPeriodConfig = {
        startDate: "2026-10-20",
        durationDays: 7,
        active: false,
      };

      expect(isDateInHaidRange(new Date(2026, 9, 20), config)).toBe(false);
    });

    it("clamps duration between 1 and 15 days (Syafi'i fiqih limit)", () => {
      const excessiveConfig: HaidPeriodConfig = {
        startDate: "2026-10-01",
        durationDays: 30, // exceeds max 15
        active: true,
      };

      // Day 15 (Oct 15) must be within range
      expect(isDateInHaidRange(new Date(2026, 9, 15), excessiveConfig)).toBe(
        true
      );
      // Day 16 (Oct 16) must be excluded due to 15-day clamp
      expect(isDateInHaidRange(new Date(2026, 9, 16), excessiveConfig)).toBe(
        false
      );
    });

    it("overrides all timing to 'terlarang' (Haram Mutlak) when haid is active", () => {
      // 2026-10-22 is Thursday (ordinarily Malam Jumat / Sangat Dianjurkan)
      const kamisDate = new Date(2026, 9, 22);
      const haidConfig: HaidPeriodConfig = {
        startDate: "2026-10-21",
        durationDays: 5,
        active: true,
      };

      const info = evaluateDateTiming(kamisDate, haidConfig);

      expect(info.isHaid).toBe(true);
      expect(info.primaryStatus).toBe("terlarang");
      expect(info.primaryBadge.variant).toBe("red");
      expect(info.primaryBadge.label).toBe("Haid");
      expect(info.primaryBadge.icon).toBe("🚫");

      // Both slots must reflect prohibition
      expect(info.malamSlot.status).toBe("terlarang");
      expect(info.malamSlot.label).toContain("Haram Mutlak");
      expect(info.siangSlot.status).toBe("terlarang");
      expect(info.siangSlot.label).toContain("Haram Mutlak");
      expect(info.malamSlot.alasan).toContain("Al-Baqarah: 222");
    });

    it("evaluates Ramadhan daytime as Haram Mutlak (Siang Ramadhan)", () => {
      // Find a Ramadhan date
      let ramadhanDate: Date | null = null;
      for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= 28; day++) {
          const d = new Date(2026, month, day);
          const h = getHijriDateDetails(d);
          if (h.month === 9) {
            ramadhanDate = d;
            break;
          }
        }
        if (ramadhanDate) break;
      }

      expect(ramadhanDate).not.toBeNull();
      if (ramadhanDate) {
        const info = evaluateDateTiming(ramadhanDate);
        expect(info.isRamadhan).toBe(true);
        expect(info.siangSlot.status).toBe("terlarang");
        expect(info.siangSlot.label).toContain("Siang Ramadhan");
        expect(info.siangSlot.alasan).toContain("Puasa Wajib");
      }
    });

    it("isRamadanSeason accurately detects when a date is in Ramadan or not", () => {
      // In October 2026 (Jumadil Ula 1448 H), isRamadanSeason must be false
      const octoberDate = new Date(2026, 9, 20);
      expect(isRamadanSeason(octoberDate)).toBe(false);

      // In Ramadan 1448 H (approx. mid Feb 2027), isRamadanSeason must be true
      const ramadan1448 = new Date(2027, 1, 15);
      expect(isRamadanSeason(ramadan1448)).toBe(true);

      // In Syawal 1448 H (approx. late March 2027), isRamadanSeason must be false
      const syawal1448 = new Date(2027, 2, 25);
      expect(isRamadanSeason(syawal1448)).toBe(false);
    });
  });
});
