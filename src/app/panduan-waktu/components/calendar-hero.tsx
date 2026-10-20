"use client";

import Link from "next/link";
import type { NextRecommendedTiming } from "@/types/calendar-waktu";

interface CalendarHeroProps {
  timing: NextRecommendedTiming;
  onSelectRecommendedDate: (date: Date) => void;
  onOpenHaidTracker: () => void;
}

export function CalendarHero({
  timing,
  onSelectRecommendedDate,
  onOpenHaidTracker,
}: CalendarHeroProps) {
  return (
    <section
      aria-label="Rekomendasi Waktu Utama Terdekat"
      className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-background p-5 md:p-7 shadow-xs"
    >
      {/* Top Bar: Label & Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold tracking-wide text-emerald-800 dark:text-emerald-300">
          <span>✨</span>
          <span>REKOMENDASI TERDEKAT</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/siklus-haid"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 text-xs font-semibold text-rose-800 dark:text-rose-200 transition-all hover:bg-rose-100 dark:hover:bg-rose-900/50 active:scale-95"
          >
            <span>🩸</span>
            <span>Pelacak Siklus Lengkap</span>
          </Link>

          <button
            type="button"
            onClick={onOpenHaidTracker}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>⚙️</span>
            <span>Atur Siklus Haid</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            {timing.title}
          </h2>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-xs">
            {timing.countdownText}
          </span>
        </div>

        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 md:text-sm">
          {timing.hijriFormatted} • Waktu Paling Utama
        </p>

        <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
          &ldquo;{timing.fadhilah}&rdquo;
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => onSelectRecommendedDate(timing.targetDate)}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-sm"
        >
          <span>📖 Lihat Rincian & Jadwal</span>
        </button>

        <Link
          href="/doa#doa-5"
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-sm"
        >
          <span>🤲 Buka Doa Sebelum Jima</span>
        </Link>
      </div>
    </section>
  );
}
