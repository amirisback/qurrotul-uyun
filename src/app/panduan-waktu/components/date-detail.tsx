"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { CalendarDayInfo, TimingStatus } from "@/types/calendar-waktu";
import { formatGregorianFull } from "@/lib/calendar-engine";

interface DateDetailProps {
  dayInfo: CalendarDayInfo | null;
  isOpen: boolean;
  onClose: () => void;
  isDesktopInline?: boolean;
}

export function DateDetail({
  dayInfo,
  isOpen,
  onClose,
  isDesktopInline = false,
}: DateDetailProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen || isDesktopInline) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isDesktopInline]);

  if (!dayInfo || (!isOpen && !isDesktopInline)) {
    return null;
  }

  const getStatusBadge = (status: TimingStatus) => {
    switch (status) {
      case "sangat-dianjurkan":
        return {
          label: "Sangat Dianjurkan",
          classes:
            "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
          icon: "✨",
        };
      case "baik":
        return {
          label: "Boleh / Mubah",
          classes:
            "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60",
          icon: "👍",
        };
      case "makruh":
        return {
          label: "Dimakruhkan",
          classes:
            "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
          icon: "⚠️",
        };
      case "terlarang":
        return {
          label: "Haram Mutlak",
          classes:
            "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
          icon: "🚫",
        };
    }
  };

  const malamBadge = getStatusBadge(dayInfo.malamSlot.status);
  const siangBadge = getStatusBadge(dayInfo.siangSlot.status);
  const formattedGregorian = formatGregorianFull(dayInfo.date);

  const content = (
    <div className="space-y-5 text-foreground">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              {formattedGregorian}
            </h3>
            {dayInfo.isToday && (
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                Hari Ini
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400">
            {dayInfo.hijriFormatted}
          </p>
        </div>

        {!isDesktopInline && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail tanggal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Sesi Malam Box */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
            <span>🌙</span>
            <span>SESI MALAM (Ba&apos;da Maghrib &ndash; Subuh)</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${malamBadge.classes}`}
          >
            <span>{malamBadge.icon}</span>
            <span>{malamBadge.label}</span>
          </span>
        </div>

        <div className="text-xs font-semibold text-primary">
          Landasan: {dayInfo.malamSlot.alasan}
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {dayInfo.malamSlot.hikmah}
        </p>
      </div>

      {/* Sesi Siang Box */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
            <span>☀️</span>
            <span>SESI SIANG (Subuh &ndash; Maghrib)</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${siangBadge.classes}`}
          >
            <span>{siangBadge.icon}</span>
            <span>{siangBadge.label}</span>
          </span>
        </div>

        <div className="text-xs font-semibold text-primary">
          Landasan: {dayInfo.siangSlot.alasan}
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {dayInfo.siangSlot.hikmah}
        </p>
      </div>

      {/* Kutipan Kitab Qurrotul Uyun */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
          <span>📖</span>
          <span>Kutipan Nadzam Qurrotul Uyun (Bab 3 &amp; 9)</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-foreground/80 italic">
          {dayInfo.dayOfWeek === 4
            ? "“Malam yang paling utama menurut mayoritas ulama adalah Malam Jumat. Mendapatkan fadhilah mandi sunnah Jumat dan doa mustajab untuk keturunan yang hafidz Al-Qur'an serta berbakti kepada orang tua.”"
            : dayInfo.dayOfWeek === 1
              ? "“Anak yang terlahir dari hubungan di hari Senin cenderung ridha terhadap pembagian rezeki dari Allah, berhati lembut, dan mencintai ilmu syar'i.”"
              : dayInfo.dayOfWeek === 3
                ? "“Berikhtiar di malam Kamis membawa keberkahan waktu pengangkatan amal kebaikan, diharapkan anak menjadi insan arif dan bijaksana.”"
                : dayInfo.dayOfWeek === 6
                  ? "“Hari Sabtu adalah hari tipu muslihat, para ulama memakruhkan berjima' jika dikhawatirkan mempengaruhi watak keturunan.”"
                  : dayInfo.isPurnama
                    ? "“Malam purnama memiliki tarikan cairan tubuh yang kuat. Dimakruhkan berjima' untuk menjaga kestabilan saraf dan emosi.”"
                    : "“Hendaklah suami istri menjaga niat semata-mata mencari ridha Allah dan memelihara kehormatan diri dari godaan syahwat yang diharamkan.”"}
        </p>
      </div>

      {/* Recommended Doa */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <span>🤲</span>
            <span>Doa Dianjurkan Sebelum Jima</span>
          </div>
          <Link
            href="/doa#doa-5"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Lihat di Menu Doa &rarr;
          </Link>
        </div>

        <p className="font-arabic text-base sm:text-lg text-foreground text-right leading-loose">
          بِسْمِ اللَّهِ، اللَّهُمَّ جَنِّبْنَا الشَّيْطَانَ، وَجَنِّبِ الشَّيْطَانَ مَا رَزَقْتَنَا
        </p>

        <p className="text-[11px] sm:text-xs text-muted-foreground italic">
          &ldquo;Bismillahi, Allahumma jannibnasy-syaithana wa jannibisy-syaithana ma razaqtana.&rdquo;
        </p>

        <p className="text-[11px] sm:text-xs text-foreground/80 leading-relaxed">
          Artinya: Dengan nama Allah, ya Allah jauhkanlah kami dari setan, dan jauhkanlah setan dari rezeki (anak) yang Engkau anugerahkan kepada kami. (HR. Bukhari &amp; Muslim)
        </p>
      </div>
    </div>
  );

  // If used in desktop inline layout (Side Panel)
  if (isDesktopInline) {
    return (
      <div
        aria-label="Panel Rincian Tanggal Terpilih"
        className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs sticky top-24"
      >
        {content}
      </div>
    );
  }

  // Mobile Bottom Sheet Modal
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Rincian tanggal ${formattedGregorian}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border bg-background p-5 sm:p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted-foreground/30 sm:hidden" />
        {content}
      </div>
    </div>
  );
}
