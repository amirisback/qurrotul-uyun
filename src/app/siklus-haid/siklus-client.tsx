"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCycleTracker } from "@/lib/use-cycle-tracker";
import { formatToISODate } from "@/lib/calendar-engine";
import { formatGregorianFull } from "@/lib/calendar-engine";
import { parseISODate } from "@/lib/cycle-engine";
import { CycleHeroCard } from "./components/cycle-hero-card";
import { CycleStripView } from "./components/cycle-strip-view";
import { DailyLogModal } from "./components/daily-log-modal";
import { FiqihGuideDrawer } from "./components/fiqih-guide-drawer";
import { QadhaTrackerCard } from "./components/qadha-tracker-card";
import { CycleOnboardingModal } from "./components/cycle-onboarding-modal";
import { CycleDataBackup } from "./components/cycle-data-backup";

export function SiklusClient() {
  const {
    profile,
    logs,
    qadhaEntries,
    getEvaluatedDay,
    saveProfile,
    saveDailyLog,
    deleteDailyLog,
    confirmGhuslForDate,
    toggleQadhaPayment,
    addQadhaDebtManually,
    payNextQadhaOneDay,
    exportData,
    importData,
    resetAllData,
  } = useCycleTracker();

  const [selectedIsoDate, setSelectedIsoDate] = useState(() =>
    formatToISODate(new Date())
  );
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isFiqihGuideOpen, setIsFiqihGuideOpen] = useState(false);

  const selectedDateObj = useMemo(
    () => parseISODate(selectedIsoDate),
    [selectedIsoDate]
  );
  const selectedDayStatus = useMemo(
    () => getEvaluatedDay(selectedDateObj),
    [getEvaluatedDay, selectedDateObj]
  );

  const selectedLog = logs[selectedIsoDate];

  const handleConfirmGhusl = () => {
    confirmGhuslForDate(selectedIsoDate);
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              Kesehatan Reproduksi &amp; Fiqih Wanita
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <span>🛡️</span>
              <span>100% Data Lokal (Privasi Penuh)</span>
            </span>
          </div>

          <Link
            href="/panduan-waktu"
            className="inline-flex min-h-[44px] items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-xs"
          >
            <span>⏳</span>
            <span>Sinkronisasi Kalender Waktu Jima&apos; &rarr;</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Siklus Haid, Masa Subur &amp; Fiqih Thaharah
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Pencatatan siklus harian terinspirasi dari antarmuka modern yang diselaraskan dengan batas Fiqih Mazhab Syafi&apos;i (minimal haid 24 jam, maksimal 15 hari, minimal suci 15 hari) dan adab keintiman Kitab Qurrotul Uyun.
        </p>
      </div>

      {/* 2. Hero Card: Radial Ring Progress & Syar'i Status */}
      <CycleHeroCard
        status={selectedDayStatus}
        profile={profile}
        onOpenLogger={() => setIsLoggerOpen(true)}
        onConfirmGhusl={handleConfirmGhusl}
        onOpenFiqihGuide={() => setIsFiqihGuideOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* 3. 14-Day Horizontal Phase Strip & Expandable Month View */}
      <CycleStripView
        selectedIsoDate={selectedIsoDate}
        onSelectDate={(iso) => setSelectedIsoDate(iso)}
        getEvaluatedDay={getEvaluatedDay}
        logs={logs}
      />

      {/* 4. Selected Day Details Summary Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 md:p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Rincian Tanggal Terpilih:
            </span>
            <h3 className="text-base font-bold text-foreground">
              {formatGregorianFull(selectedDateObj)}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsLoggerOpen(true)}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
          >
            {selectedLog ? "Ubah Catatan Hari Ini" : "+ Tambah Catatan Tanggal Ini"}
          </button>
        </div>

        {selectedLog ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-muted/40 space-y-1">
              <span className="text-muted-foreground font-semibold">Aliran Darah:</span>
              <p className="font-bold text-foreground capitalize">
                {selectedLog.flow === "none" ? "Tidak Ada (Kering/Jufuf)" : selectedLog.flow}
              </p>
            </div>

            {selectedLog.fiqihColor && (
              <div className="p-3 rounded-2xl bg-muted/40 space-y-1">
                <span className="text-muted-foreground font-semibold">Warna Darah Fiqih:</span>
                <p className="font-bold text-foreground capitalize">
                  {selectedLog.fiqihColor}
                </p>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-muted/40 space-y-1">
              <span className="text-muted-foreground font-semibold">Status Mandi Wajib:</span>
              <p className="font-bold text-foreground">
                {selectedLog.isGhuslDone ? "✓ Selesai Mandi Wajib" : "Belum Mandi"}
              </p>
            </div>

            {selectedLog.symptoms && selectedLog.symptoms.length > 0 && (
              <div className="p-3 rounded-2xl bg-muted/40 space-y-1 sm:col-span-2 md:col-span-3">
                <span className="text-muted-foreground font-semibold">Gejala Fisik:</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedLog.symptoms.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-lg bg-card border border-border text-[11px] font-medium"
                    >
                      {s.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedLog.moods && selectedLog.moods.length > 0 && (
              <div className="p-3 rounded-2xl bg-muted/40 space-y-1 sm:col-span-2 md:col-span-3">
                <span className="text-muted-foreground font-semibold">Suasana Hati:</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedLog.moods.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-lg bg-accent/15 border border-accent/30 text-accent font-semibold text-[11px]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedLog.notes && (
              <div className="p-3 rounded-2xl bg-muted/40 space-y-1 sm:col-span-2 md:col-span-3">
                <span className="text-muted-foreground font-semibold">Catatan Tambahan:</span>
                <p className="text-foreground italic">{selectedLog.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic py-2">
            Belum ada catatan aliran darah atau gejala fisik untuk tanggal ini. Klik tombol di atas untuk mencatat.
          </p>
        )}
      </div>

      {/* 5. Ramadan Fasting Debt (Qadha Puasa) Tracker */}
      <QadhaTrackerCard
        entries={qadhaEntries}
        onTogglePaid={toggleQadhaPayment}
        onPayNextOneDay={payNextQadhaOneDay}
        onAddManualEntry={addQadhaDebtManually}
      />

      {/* 6. Fiqih Guides Accordion & Kitab Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl border border-border/80 bg-card space-y-3 hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xl">💧</span>
            <h3 className="font-bold text-foreground text-sm sm:text-base">
              Tata Cara Mandi Wajib (Ghusl)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pelajari niat mandi wajib haid beraksara Arab, rukun meratakan air ke seluruh tubuh, dan sunnah mengusapkan wewangian misk/kasturi.
          </p>
          <button
            type="button"
            onClick={() => setIsFiqihGuideOpen(true)}
            className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>Buka Panduan Mandi Lengkap &rarr;</span>
          </button>
        </div>

        <div className="p-6 rounded-3xl border border-border/80 bg-card space-y-3 hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xl">🩺</span>
            <h3 className="font-bold text-foreground text-sm sm:text-base">
              Kaidah Darah Istihadlah
            </h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Panduan hukum saat darah keluar lebih dari 15 hari, kewajiban shalat fardhu, dan tata cara wudhu da&apos;imul hadats (1 wudhu = 1 shalat fardhu).
          </p>
          <button
            type="button"
            onClick={() => setIsFiqihGuideOpen(true)}
            className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <span>Buka Panduan Istihadlah &rarr;</span>
          </button>
        </div>
      </div>

      {/* 7. Data Privacy Sovereignty, Export & Import */}
      <CycleDataBackup
        onExport={exportData}
        onImport={importData}
        onReset={resetAllData}
      />

      {/* Modals & Drawers */}
      <DailyLogModal
        isOpen={isLoggerOpen}
        onClose={() => setIsLoggerOpen(false)}
        isoDate={selectedIsoDate}
        initialLog={selectedLog}
        onSaveLog={saveDailyLog}
        onDeleteLog={deleteDailyLog}
      />

      <CycleOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentProfile={profile}
        onSaveProfile={saveProfile}
      />

      <FiqihGuideDrawer
        isOpen={isFiqihGuideOpen}
        onClose={() => setIsFiqihGuideOpen(false)}
        onConfirmMandiWajib={handleConfirmGhusl}
      />
    </div>
  );
}
