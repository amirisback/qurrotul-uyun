import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CalendarNav } from "../components/calendar-nav";
import { CalendarCell } from "../components/calendar-cell";
import { CalendarGrid } from "../components/calendar-grid";
import { CalendarHero } from "../components/calendar-hero";
import { DateDetail } from "../components/date-detail";
import { AgendaView } from "../components/agenda-view";
import { HaidTrackerDialog } from "../components/haid-tracker-dialog";
import {
  evaluateDateTiming,
  getMonthCalendarDays,
  getNextRecommendedTiming,
} from "@/lib/calendar-engine";

describe("Panduan Waktu Interactive Calendar - Component & Accessibility Test Suite", () => {
  const dummyFn = () => {};

  describe("CalendarNav (AC-01 & A11y)", () => {
    it("renders month title with live region polite announcements", () => {
      const html = renderToStaticMarkup(
        <CalendarNav
          currentYear={2026}
          currentMonthIndex={9}
          onPrevMonth={dummyFn}
          onNextMonth={dummyFn}
          onResetToToday={dummyFn}
          isCurrentRealMonth={true}
        />
      );

      expect(html).toContain('aria-live="polite"');
      expect(html).toContain('aria-atomic="true"');
      expect(html).toContain("Oktober 2026");
    });

    it("has 44px minimum touch targets and accessible navigation buttons", () => {
      const html = renderToStaticMarkup(
        <CalendarNav
          currentYear={2026}
          currentMonthIndex={8}
          onPrevMonth={dummyFn}
          onNextMonth={dummyFn}
          onResetToToday={dummyFn}
          isCurrentRealMonth={false}
        />
      );

      expect(html).toContain('aria-label="Bulan sebelumnya"');
      expect(html).toContain('aria-label="Bulan berikutnya"');
      expect(html).toContain("h-11 w-11"); // 44px hit-box
      expect(html).toContain("Hari Ini");
      expect(html).toContain("min-h-[44px]");
    });
  });

  describe("CalendarGrid (AC-01, AC-02, ARIA Semantics)", () => {
    it("renders with role='grid' and column headers for 7 weekdays", () => {
      const days = getMonthCalendarDays(2026, 9);
      const selected = days[15];

      const html = renderToStaticMarkup(
        <CalendarGrid
          days={days}
          selectedDate={selected}
          onSelectDate={dummyFn}
        />
      );

      expect(html).toContain('role="grid"');
      expect(html).toContain('aria-label="Kalender Panduan Waktu &amp; Hijriah"');
      expect(html).toContain('role="columnheader"');
      expect(html).toContain("Kamis");
      expect(html).toContain("Jumat");
      expect(html).toContain("Sabtu");
    });

    it("renders comprehensive color status legend with all 4 fiqih categories", () => {
      const days = getMonthCalendarDays(2026, 9);
      const html = renderToStaticMarkup(
        <CalendarGrid
          days={days}
          selectedDate={days[0]}
          onSelectDate={dummyFn}
        />
      );

      expect(html).toContain("Sangat Dianjurkan");
      expect(html).toContain("Boleh / Mubah");
      expect(html).toContain("Dimakruhkan");
      expect(html).toContain("Haram Mutlak");
      expect(html).toContain("bg-emerald-500");
      expect(html).toContain("bg-sky-500");
      expect(html).toContain("bg-amber-500");
      expect(html).toContain("bg-rose-500");
    });
  });

  describe("CalendarCell (AC-02 & WCAG AA Contrast)", () => {
    it("renders with role='gridcell' and minimum touch target size min-h-[58px]", () => {
      const dayInfo = evaluateDateTiming(new Date(2026, 9, 22)); // Kamis malam
      const html = renderToStaticMarkup(
        <CalendarCell
          dayInfo={dayInfo}
          isSelected={false}
          onSelect={dummyFn}
        />
      );

      expect(html).toContain('role="gridcell"');
      expect(html).toContain("min-h-[58px]"); // Satisfies >= 44px
      expect(html).toContain("aria-label=");
    });

    it("applies verified WCAG AA token classes for emerald (sangat-dianjurkan)", () => {
      const dayInfo = evaluateDateTiming(new Date(2026, 9, 22)); // Kamis malam (Malam Jumat)
      const html = renderToStaticMarkup(
        <CalendarCell
          dayInfo={dayInfo}
          isSelected={false}
          onSelect={dummyFn}
        />
      );

      expect(html).toContain("bg-emerald-50");
      expect(html).toContain("text-emerald-800");
      expect(html).toContain("dark:text-emerald-300");
    });

    it("applies verified WCAG AA token classes for amber (makruh/purnama)", () => {
      const dayInfo = evaluateDateTiming(new Date(2026, 9, 24)); // Sabtu
      const html = renderToStaticMarkup(
        <CalendarCell
          dayInfo={dayInfo}
          isSelected={false}
          onSelect={dummyFn}
        />
      );

      expect(html).toContain("bg-amber-50");
      expect(html).toContain("text-amber-900");
      expect(html).toContain("dark:text-amber-300");
    });

    it("marks Today cell with aria-current='date' and selected cell with aria-pressed='true'", () => {
      const dayInfo = evaluateDateTiming(new Date(2026, 9, 22));
      dayInfo.isToday = true;

      const html = renderToStaticMarkup(
        <CalendarCell
          dayInfo={dayInfo}
          isSelected={true}
          onSelect={dummyFn}
        />
      );

      expect(html).toContain('aria-current="date"');
      expect(html).toContain('aria-pressed="true"');
      expect(html).toContain('aria-selected="true"');
    });
  });

  describe("CalendarHero (AC-05: Highlight Card)", () => {
    it("renders recommendation hero with action buttons satisfying min 44px touch targets", () => {
      const timing = getNextRecommendedTiming(new Date(2026, 9, 20));
      const html = renderToStaticMarkup(
        <CalendarHero
          timing={timing}
          onSelectRecommendedDate={dummyFn}
          onOpenHaidTracker={dummyFn}
        />
      );

      expect(html).toContain("REKOMENDASI TERDEKAT");
      expect(html).toContain("Atur Siklus Haid");
      expect(html).toContain("min-h-[44px]");
      expect(html).toContain("/doa#doa-5");
    });
  });

  describe("DateDetail (AC-03 & AC-06: Day/Night Sesi & Doa Modal)", () => {
    it("renders distinct Sesi Malam and Sesi Siang boxes with fiqih rationale", () => {
      const dayInfo = evaluateDateTiming(new Date(2026, 9, 22));
      const html = renderToStaticMarkup(
        <DateDetail
          dayInfo={dayInfo}
          isOpen={true}
          onClose={dummyFn}
          isDesktopInline={true}
        />
      );

      expect(html).toContain("SESI MALAM");
      expect(html).toContain("SESI SIANG");
      expect(html).toContain("Landasan:");
      expect(html).toContain("Kutipan Nadzam Qurrotul Uyun");
      expect(html).toContain("Doa Dianjurkan Sebelum Jima");
      expect(html).toContain("اللَّهُمَّ جَنِّبْنَا الشَّيْطَانَ");
    });

    it("renders modal with role='dialog' and aria-modal='true' when in mobile view", () => {
      const dayInfo = evaluateDateTiming(new Date(2026, 9, 22));
      const html = renderToStaticMarkup(
        <DateDetail
          dayInfo={dayInfo}
          isOpen={true}
          onClose={dummyFn}
          isDesktopInline={false}
        />
      );

      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('aria-label="Tutup detail tanggal"');
    });
  });

  describe("AgendaView (AC-07: 7-Day Overview)", () => {
    it("renders feed of 7 upcoming day cards with day and night statuses", () => {
      const start = new Date(2026, 9, 20);
      const days7 = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days7.push(evaluateDateTiming(d));
      }

      const html = renderToStaticMarkup(
        <AgendaView days7={days7} onSelectDate={dummyFn} />
      );

      expect(html).toContain('role="feed"');
      expect(html).toContain("Hari Ini");
      expect(html).toContain("Besok");
      expect(html).toContain("H+2");
      expect(html).toContain("Sesi Malam");
      expect(html).toContain("Sesi Siang");
    });
  });

  describe("HaidTrackerDialog (AC-08: Haid Settings Modal)", () => {
    it("renders accessible modal dialog with date input, stepper, and privacy note", () => {
      const html = renderToStaticMarkup(
        <HaidTrackerDialog
          isOpen={true}
          onClose={dummyFn}
          currentConfig={{
            startDate: "2026-10-20",
            durationDays: 7,
            active: true,
          }}
          onSaveConfig={dummyFn}
        />
      );

      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('id="haid-tracker-title"');
      expect(html).toContain('id="haid-start-date"');
      expect(html).toContain('role="switch"');
      expect(html).toContain('aria-label="Kurangi 1 hari durasi"');
      expect(html).toContain('aria-label="Tambah 1 hari durasi"');
      expect(html).toContain("Jaminan Privasi Pribadi");
      expect(html).toContain("Simpan Jadwal Haid");
      expect(html).toContain("min-h-[44px]");
    });
  });

  describe("Anti-Slop Copywriting Audit", () => {
    it("strictly contains zero em dashes (\u2014) in rendered UI components", () => {
      const dayInfo = evaluateDateTiming(new Date(2026, 9, 22));
      const navHtml = renderToStaticMarkup(
        <CalendarNav
          currentYear={2026}
          currentMonthIndex={9}
          onPrevMonth={dummyFn}
          onNextMonth={dummyFn}
          onResetToToday={dummyFn}
          isCurrentRealMonth={true}
        />
      );
      const cellHtml = renderToStaticMarkup(
        <CalendarCell dayInfo={dayInfo} isSelected={false} onSelect={dummyFn} />
      );
      const heroHtml = renderToStaticMarkup(
        <CalendarHero
          timing={getNextRecommendedTiming(new Date(2026, 9, 20))}
          onSelectRecommendedDate={dummyFn}
          onOpenHaidTracker={dummyFn}
        />
      );
      const detailHtml = renderToStaticMarkup(
        <DateDetail
          dayInfo={dayInfo}
          isOpen={true}
          onClose={dummyFn}
          isDesktopInline={true}
        />
      );
      const haidHtml = renderToStaticMarkup(
        <HaidTrackerDialog
          isOpen={true}
          onClose={dummyFn}
          currentConfig={null}
          onSaveConfig={dummyFn}
        />
      );

      const allRendered = [navHtml, cellHtml, heroHtml, detailHtml, haidHtml].join(
        "\n"
      );
      expect(allRendered).not.toContain("\u2014");
    });
  });
});
