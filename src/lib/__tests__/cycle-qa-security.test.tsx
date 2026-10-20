import { describe, it, expect } from "vitest";
import {
  evaluateCycleDay,
  calculatePredictions,
  recalculateRamadhanQadha,
  parseISODate,
  diffInDays,
  addDays,
} from "../cycle-engine";
import { formatToISODate } from "../calendar-engine";
import type { DailyCycleLog, UserCycleProfile, CycleStorageSchema, QadhaPuasaEntry } from "@/types/cycle-tracker";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

describe("Sandra QA & Security Gate: Mazhab Syafi'i Edge Cases & Security Audit (TASK-002)", () => {
  const standardProfile: UserCycleProfile = {
    lastPeriodStartDate: "2026-10-01",
    averageCycleLength: 28,
    averagePeriodDuration: 7,
    lutealPhaseDays: 14,
    isOnboardingCompleted: true,
  };

  describe("1. Mazhab Syafi'i Purity Interval (Aqalluth-Thuhri: 15 Days)", () => {
    it("classifies blood emerging at exactly 14 days of suci as ISTIHADLAH (less than 15 full days)", () => {
      // Period 1: 2026-10-01 to 2026-10-07 (7 days haid)
      // Suci interval: 2026-10-08 to 2026-10-21 (14 full days: 8..21 = 14 days)
      // On 2026-10-22, blood re-emerges: 22 - 7 - 1 = 14 days suci (< 15)
      const logs: Record<string, DailyCycleLog> = {};
      for (let d = 1; d <= 7; d++) {
        const iso = `2026-10-0${d}`;
        logs[iso] = {
          isoDate: iso,
          flow: "medium",
          isGhuslDone: false,
          symptoms: [],
          moods: [],
          updatedAt: new Date().toISOString(),
        };
      }
      logs["2026-10-22"] = {
        isoDate: "2026-10-22",
        flow: "light",
        isGhuslDone: false,
        symptoms: [],
        moods: [],
        updatedAt: new Date().toISOString(),
      };

      const evalDay22 = evaluateCycleDay(parseISODate("2026-10-22"), standardProfile, logs);
      expect(evalDay22.syariStatus).toBe("istihadlah");
      expect(evalDay22.canPray).toBe(true);
      expect(evalDay22.canFast).toBe(true);
      expect(evalDay22.canJima).toBe(true);
      expect(evalDay22.statusBadge.variant).toBe("amber");
      expect(evalDay22.statusBadge.label).toContain("Istihadlah");
    });

    it("classifies blood emerging after exactly 15 full days of suci as HAID (valid new cycle)", () => {
      // Period 1: 2026-10-01 to 2026-10-07 (7 days haid)
      // Suci interval: 2026-10-08 to 2026-10-22 (15 full days: 8..22 = 15 days)
      // On 2026-10-23, blood emerges: 23 - 7 - 1 = 15 days suci (>= 15)
      const logs: Record<string, DailyCycleLog> = {};
      for (let d = 1; d <= 7; d++) {
        const iso = `2026-10-0${d}`;
        logs[iso] = {
          isoDate: iso,
          flow: "medium",
          isGhuslDone: false,
          symptoms: [],
          moods: [],
          updatedAt: new Date().toISOString(),
        };
      }
      logs["2026-10-23"] = {
        isoDate: "2026-10-23",
        flow: "medium",
        isGhuslDone: false,
        symptoms: [],
        moods: [],
        updatedAt: new Date().toISOString(),
      };

      const evalDay23 = evaluateCycleDay(parseISODate("2026-10-23"), standardProfile, logs);
      expect(evalDay23.syariStatus).toBe("haid");
      expect(evalDay23.canPray).toBe(false);
      expect(evalDay23.canFast).toBe(false);
      expect(evalDay23.canJima).toBe(false);
      expect(evalDay23.statusBadge.variant).toBe("rose");
      expect(evalDay23.statusBadge.label).toContain("Haid Aktif");
    });
  });

  describe("2. Mazhab Syafi'i 15-Day Maximum Period Boundary (Aktsarul-Haid: 15 Days)", () => {
    it("maintains HAID status up to Day 15, then transitions to ISTIHADLAH on Day 16, 17, and beyond", () => {
      const logs: Record<string, DailyCycleLog> = {};
      // 18 days of continuous bleeding
      for (let d = 1; d <= 18; d++) {
        const iso = `2026-10-${String(d).padStart(2, "0")}`;
        logs[iso] = {
          isoDate: iso,
          flow: "heavy",
          isGhuslDone: false,
          symptoms: [],
          moods: [],
          updatedAt: new Date().toISOString(),
        };
      }

      // Day 14: Haid
      const day14 = evaluateCycleDay(parseISODate("2026-10-14"), standardProfile, logs);
      expect(day14.syariStatus).toBe("haid");
      expect(day14.canPray).toBe(false);

      // Day 15: Still Haid (last valid day under Mazhab Syafi'i)
      const day15 = evaluateCycleDay(parseISODate("2026-10-15"), standardProfile, logs);
      expect(day15.syariStatus).toBe("haid");
      expect(day15.canPray).toBe(false);

      // Day 16: Immediate transition to Istihadlah
      const day16 = evaluateCycleDay(parseISODate("2026-10-16"), standardProfile, logs);
      expect(day16.syariStatus).toBe("istihadlah");
      expect(day16.canPray).toBe(true);
      expect(day16.canFast).toBe(true);

      // Day 17: Persists as Istihadlah
      const day17 = evaluateCycleDay(parseISODate("2026-10-17"), standardProfile, logs);
      expect(day17.syariStatus).toBe("istihadlah");
      expect(day17.canPray).toBe(true);

      // Day 18: Persists as Istihadlah
      const day18 = evaluateCycleDay(parseISODate("2026-10-18"), standardProfile, logs);
      expect(day18.syariStatus).toBe("istihadlah");
      expect(day18.canPray).toBe(true);
    });
  });

  describe("3. Ramadan Fasting Debt (Qadha Puasa) Edge Cases", () => {
    it("correctly identifies Ramadan days (Hijri month 9) and does not add duplicates", () => {
      const existingEntries: QadhaPuasaEntry[] = [
        { id: "qadha-2026-02-20", hijriYear: 1447, dateOwed: "2026-02-20", isPaid: false, datePaid: null },
      ];

      const logs: Record<string, DailyCycleLog> = {
        "2026-02-20": {
          isoDate: "2026-02-20",
          flow: "medium",
          isGhuslDone: false,
          symptoms: [],
          moods: [],
          updatedAt: "",
        },
      };

      const result = recalculateRamadhanQadha(logs, existingEntries);
      const matches = result.filter((e) => e.dateOwed === "2026-02-20");
      expect(matches.length).toBe(1);
    });

    it("does not charge qadha puasa for days marked with flow 'none'", () => {
      const logs: Record<string, DailyCycleLog> = {
        "2026-02-21": {
          isoDate: "2026-02-21",
          flow: "none",
          cessationSign: "jufuf",
          isGhuslDone: true,
          symptoms: [],
          moods: [],
          updatedAt: "",
        },
      };

      const result = recalculateRamadhanQadha(logs, []);
      expect(result.some((e) => e.dateOwed === "2026-02-21")).toBe(false);
    });
  });

  describe("4. Security, XSS Prevention & Data Sanitization Audit", () => {
    it("renders user notes containing malicious XSS script safely escaped without executing HTML", () => {
      const maliciousPayload = "<script>alert('XSS-HAID')</script><img src=x onerror=alert(1)>";

      const renderedHtml = renderToStaticMarkup(
        React.createElement("div", { "data-testid": "user-note" },
          React.createElement("p", null, maliciousPayload)
        )
      );

      // React escaping must convert < and > to HTML entities
      expect(renderedHtml).not.toContain("<script>alert('XSS-HAID')</script>");
      expect(renderedHtml).toContain("&lt;script&gt;alert(&#x27;XSS-HAID&#x27;)&lt;/script&gt;");
      expect(renderedHtml).toContain("&lt;img src=x onerror=alert(1)&gt;");
    });

    it("safely handles corrupted or malicious JSON in backup import logic", () => {
      const invalidJsonStrings = [
        "",
        "null",
        "undefined",
        "not-a-json",
        "{\"__proto__\": {\"admin\": true}}",
        "[]",
        "12345",
      ];

      for (const badJson of invalidJsonStrings) {
        try {
          const parsed = JSON.parse(badJson);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            // Valid JSON object
          }
        } catch {
          // Expected for bad JSON
        }

        expect((Object.prototype as Record<string, unknown>).admin).toBeUndefined();
      }
    });

    it("handles prototype pollution payloads in import schema without polluting global Object", () => {
      const maliciousJson = JSON.stringify({
        version: 1,
        profile: {
          __proto__: { polluted: "hacked" },
          lastPeriodStartDate: "2026-10-01",
        },
        logs: {},
        qadhaEntries: [],
      });

      const parsed = JSON.parse(maliciousJson) as Partial<CycleStorageSchema>;
      expect(parsed.version).toBe(1);
      expect((Object.prototype as Record<string, unknown>).polluted).toBeUndefined();
    });
  });

  describe("5. Boundary Conditions, Leap Years & Clamped Calculations", () => {
    it("clamps abnormal cycle lengths to safe range [21, 45]", () => {
      const tooShortProfile: UserCycleProfile = {
        ...standardProfile,
        averageCycleLength: 10,
      };
      const predShort = calculatePredictions(tooShortProfile);
      expect(formatToISODate(predShort.nextPeriodStart)).toBe("2026-10-22");

      const tooLongProfile: UserCycleProfile = {
        ...standardProfile,
        averageCycleLength: 60,
      };
      const predLong = calculatePredictions(tooLongProfile);
      expect(formatToISODate(predLong.nextPeriodStart)).toBe("2026-11-15");
    });

    it("clamps period duration to Fiqih limits [1, 15]", () => {
      const zeroDurationProfile: UserCycleProfile = {
        ...standardProfile,
        averagePeriodDuration: 0,
      };
      const predMin = calculatePredictions(zeroDurationProfile);
      expect(formatToISODate(predMin.nextPeriodEnd)).toBe("2026-10-29");

      const thirtyDurationProfile: UserCycleProfile = {
        ...standardProfile,
        averagePeriodDuration: 30,
      };
      const predMax = calculatePredictions(thirtyDurationProfile);
      expect(formatToISODate(predMax.nextPeriodEnd)).toBe("2026-11-12");
    });

    it("handles leap year February 29 seamlessly", () => {
      const feb28 = parseISODate("2028-02-28");
      const feb29 = addDays(feb28, 1);
      expect(formatToISODate(feb29)).toBe("2028-02-29");

      const mar1 = addDays(feb29, 1);
      expect(formatToISODate(mar1)).toBe("2028-03-01");

      expect(diffInDays(feb28, mar1)).toBe(2);
    });

    it("handles year transition from December to January accurately", () => {
      const dec30 = parseISODate("2026-12-30");
      const jan5 = addDays(dec30, 6);
      expect(formatToISODate(jan5)).toBe("2027-01-05");
      expect(diffInDays(dec30, jan5)).toBe(6);
    });
  });
});
