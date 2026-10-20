import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CycleHeroCard } from "../components/cycle-hero-card";
import { CycleStripView } from "../components/cycle-strip-view";
import { DailyLogModal } from "../components/daily-log-modal";
import { FiqihGuideDrawer } from "../components/fiqih-guide-drawer";
import { QadhaTrackerCard } from "../components/qadha-tracker-card";
import { CycleDataBackup } from "../components/cycle-data-backup";
import { CycleOnboardingModal } from "../components/cycle-onboarding-modal";
import type { EvaluatedDayStatus, UserCycleProfile } from "@/types/cycle-tracker";
import { evaluateCycleDay } from "@/lib/cycle-engine";

describe("Siklus Haid Interactive Components - Verification Suite (TASK-002)", () => {
  const dummyFn = () => {};

  const mockProfile: UserCycleProfile = {
    lastPeriodStartDate: "2026-10-01",
    averageCycleLength: 28,
    averagePeriodDuration: 7,
    lutealPhaseDays: 14,
    isOnboardingCompleted: true,
  };

  const mockHaidStatus: EvaluatedDayStatus = {
    isoDate: "2026-10-03",
    cycleDayNumber: 3,
    syariStatus: "haid",
    isPeriodDay: true,
    isPredictedPeriod: true,
    isFertileWindow: false,
    isOvulationDay: false,
    canPray: false,
    canFast: false,
    canJima: false,
    ghuslRequired: false,
    statusBadge: {
      label: "Haid Aktif",
      description: "Haram shalat fardhu, puasa, dan hubungan intim.",
      variant: "rose",
      icon: "🩸",
    },
  };

  const mockSuciWajibStatus: EvaluatedDayStatus = {
    isoDate: "2026-10-08",
    cycleDayNumber: 8,
    syariStatus: "suci_wajib_mandi",
    isPeriodDay: false,
    isPredictedPeriod: false,
    isFertileWindow: false,
    isOvulationDay: false,
    canPray: false,
    canFast: true,
    canJima: false,
    ghuslRequired: true,
    statusBadge: {
      label: "Suci (Wajib Ghusl)",
      description: "Darah berhenti. Wajib mandi wajib sebelum dapat shalat dan jima'.",
      variant: "sky",
      icon: "💧",
    },
  };

  describe("CycleHeroCard (AC-01 & AC-02: Hero Radial Ring & Status Syar'i)", () => {
    it("renders cycle day number, formatted date, and status badge correctly", () => {
      const html = renderToStaticMarkup(
        <CycleHeroCard
          status={mockHaidStatus}
          profile={mockProfile}
          onOpenLogger={dummyFn}
          onOpenFiqihGuide={dummyFn}
          onOpenOnboarding={dummyFn}
        />
      );

      expect(html).toContain("Hari ke-3");
      expect(html).toContain("Haid Aktif");
      expect(html).toContain("Catat Hari Ini");
      expect(html).toContain("Panduan Fiqih");
      expect(html).toContain("Atur Siklus");
    });

    it("displays 'Konfirmasi Mandi Wajib' button when status is suci_wajib_mandi", () => {
      const html = renderToStaticMarkup(
        <CycleHeroCard
          status={mockSuciWajibStatus}
          profile={mockProfile}
          onOpenLogger={dummyFn}
          onConfirmGhusl={dummyFn}
          onOpenFiqihGuide={dummyFn}
          onOpenOnboarding={dummyFn}
        />
      );

      expect(html).toContain("Konfirmasi Mandi Wajib");
      expect(html).toContain("Suci (Wajib Ghusl)");
      expect(html).toContain("Hari ke-8");
    });
  });

  describe("CycleStripView (AC-03: 14-Day Strip & Expandable Grid)", () => {
    it("renders horizontal strip days and full calendar toggle button", () => {
      const html = renderToStaticMarkup(
        <CycleStripView
          selectedIsoDate="2026-10-03"
          onSelectDate={dummyFn}
          getEvaluatedDay={(date) => evaluateCycleDay(date, mockProfile, {})}
          logs={{}}
        />
      );

      expect(html).toContain("Strip 14 Hari Terdekat");
      expect(html).toContain("Lihat Kalender Penuh");
    });
  });

  describe("DailyLogModal (AC-03: Flo-Inspired Bottom Sheet Logger)", () => {
    it("renders logging categories, flow intensities, and fiqih cessation checks", () => {
      const html = renderToStaticMarkup(
        <DailyLogModal
          isOpen={true}
          onClose={dummyFn}
          isoDate="2026-10-03"
          onSaveLog={dummyFn}
        />
      );

      expect(html).toContain("Catatan Harian");
      expect(html).toContain("1. Intensitas Aliran Darah");
      expect(html).toContain("Bercak");
      expect(html).toContain("Sedang");
      expect(html).toContain("Deras");
      expect(html).toContain("Verifikasi Tuntas Haid &amp; Mandi Wajib");
      expect(html).toContain("Qashshah Baidha");
      expect(html).toContain("Simpan Catatan Harian");
    });
  });

  describe("FiqihGuideDrawer (AC-02 & AC-05: Fiqih Thaharah Drawer)", () => {
    it("renders Thaharah drawer, Arabic niat mandi wajib text, and tabs", () => {
      const html = renderToStaticMarkup(
        <FiqihGuideDrawer
          isOpen={true}
          onClose={dummyFn}
          onConfirmMandiWajib={dummyFn}
        />
      );

      expect(html).toContain("Panduan Fiqih Thaharah &amp; Bersuci");
      expect(html).toContain("نَوَيْتُ الْغُسْلَ لِرَفْعِ حَدَثِ الْحَيْضِ فَرْضًا لِلَّهِ تَعَالَى");
      expect(html).toContain("Nawaitul ghusla li raf&#x27;i hadatsil haidhi fardhan lillaahi ta&#x27;ala");
      expect(html).toContain("Tanda Tuntas Haid");
      expect(html).toContain("Istihadlah &amp; Wudhu");
    });
  });

  describe("QadhaTrackerCard (AC-06: Ramadan Fasting Debt)", () => {
    it("renders debt counter, checklist, and Hadith reference", () => {
      const mockEntries = [
        { id: "q1", hijriYear: 1448, dateOwed: "2026-02-20", isPaid: false },
        { id: "q2", hijriYear: 1448, dateOwed: "2026-02-21", isPaid: true, datePaid: "2026-05-10" },
      ];

      const html = renderToStaticMarkup(
        <QadhaTrackerCard
          entries={mockEntries}
          onTogglePaid={dummyFn}
          onPayNextOneDay={dummyFn}
          onAddManualEntry={dummyFn}
        />
      );

      expect(html).toContain("Pelacak Qadha Puasa Ramadhan");
      expect(html).toContain("Tersisa: 1 Hari");
      expect(html).toContain("Hari ke-1");
      expect(html).toContain("Hari ke-2");
      expect(html).toContain("Lunas");
      expect(html).toContain("Tandai 1 Hari Qadha Lunas");
      expect(html).toContain("Hadits Riwayat Muslim No. 335");
    });
  });

  describe("CycleDataBackup (AC-08: Data Privacy Sovereignty)", () => {
    it("renders privacy sovereignty banner and export/import actions", () => {
      const html = renderToStaticMarkup(
        <CycleDataBackup
          onExport={() => "{}"}
          onImport={() => true}
          onReset={dummyFn}
        />
      );

      expect(html).toContain("Kedaulatan Privasi 100%");
      expect(html).toContain("Ekspor Cadangan (JSON)");
      expect(html).toContain("Impor Berkas Cadangan");
      expect(html).toContain("Hapus Seluruh Data");
    });
  });

  describe("CycleOnboardingModal (AC-01: Profile Setup Modal)", () => {
    it("renders configuration form with range inputs and fiqih notes", () => {
      const html = renderToStaticMarkup(
        <CycleOnboardingModal
          isOpen={true}
          onClose={dummyFn}
          currentProfile={mockProfile}
          onSaveProfile={dummyFn}
        />
      );

      expect(html).toContain("Konfigurasi Siklus Haid");
      expect(html).toContain("Hari Pertama Haid Terakhir:");
      expect(html).toContain("Panjang Siklus Rata-rata:");
      expect(html).toContain("Durasi Haid Kebiasaan");
      expect(html).toContain("Kaidah Mazhab Syafi&#x27;i:");
      expect(html).toContain("Simpan Profil Siklus");
    });
  });

  describe("Anti-Slop Copywriting Audit (TASK-002)", () => {
    it("does not contain banned AI cliches in rendered component markup", () => {
      const heroHtml = renderToStaticMarkup(
        <CycleHeroCard
          status={mockHaidStatus}
          profile={mockProfile}
          onOpenLogger={dummyFn}
          onOpenFiqihGuide={dummyFn}
          onOpenOnboarding={dummyFn}
        />
      );

      const fiqihHtml = renderToStaticMarkup(
        <FiqihGuideDrawer
          isOpen={true}
          onClose={dummyFn}
        />
      );

      const qadhaHtml = renderToStaticMarkup(
        <QadhaTrackerCard
          entries={[]}
          onTogglePaid={dummyFn}
          onPayNextOneDay={dummyFn}
          onAddManualEntry={dummyFn}
        />
      );

      const allHtml = heroHtml + fiqihHtml + qadhaHtml;

      expect(allHtml).not.toContain("delve");
      expect(allHtml).not.toContain("game changer");
      expect(allHtml).not.toContain("revolutionize");
      expect(allHtml).not.toContain("tapestry");
      expect(allHtml).not.toContain("seamlessly");
    });
  });
});
