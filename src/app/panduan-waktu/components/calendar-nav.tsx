"use client";

import {
  getMonthYearDisplay,
  getHijriMonthRangeForGregorian,
} from "@/lib/calendar-engine";

interface CalendarNavProps {
  currentYear: number;
  currentMonthIndex: number; // 0 - 11
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onResetToToday: () => void;
  isCurrentRealMonth: boolean;
}

export function CalendarNav({
  currentYear,
  currentMonthIndex,
  onPrevMonth,
  onNextMonth,
  onResetToToday,
  isCurrentRealMonth,
}: CalendarNavProps) {
  const gregorianTitle = getMonthYearDisplay(currentYear, currentMonthIndex);
  const hijriSubtitle = getHijriMonthRangeForGregorian(
    currentYear,
    currentMonthIndex
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Prev Navigation Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Bulan sebelumnya"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {!isCurrentRealMonth && (
          <button
            type="button"
            onClick={onResetToToday}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span>📅</span>
            <span>Hari Ini</span>
          </button>
        )}
      </div>

      {/* Month & Year Title Header (with aria-live for a11y) */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="text-center"
      >
        <h3 className="text-base font-extrabold uppercase tracking-tight text-foreground sm:text-lg md:text-xl">
          {gregorianTitle}
        </h3>
        <p className="text-xs font-medium text-muted-foreground">
          {hijriSubtitle}
        </p>
      </div>

      {/* Next Navigation & Today Action */}
      <div className="flex items-center justify-end gap-2">
        {isCurrentRealMonth && (
          <span className="hidden rounded-lg bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground sm:inline-block">
            Bulan Berjalan
          </span>
        )}

        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Bulan berikutnya"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
