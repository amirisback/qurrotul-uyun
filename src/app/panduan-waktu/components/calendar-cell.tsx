"use client";

import type { CalendarDayInfo } from "@/types/calendar-waktu";

interface CalendarCellProps {
  dayInfo: CalendarDayInfo;
  isSelected: boolean;
  onSelect: (dayInfo: CalendarDayInfo) => void;
}

export function CalendarCell({
  dayInfo,
  isSelected,
  onSelect,
}: CalendarCellProps) {
  const {
    gregorianDay,
    hijriDay,
    isToday,
    isCurrentMonth,
    isHaid,
    isPurnama,
    isAwalBulan,
    isAkhirBulan,
    primaryStatus,
    primaryBadge,
    dayName,
    hijriFormatted,
    malamSlot,
    siangSlot,
  } = dayInfo;

  // Determine badge styling based on primary status
  let badgeClasses =
    "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60";
  let dotClass = "bg-sky-500";

  if (primaryStatus === "sangat-dianjurkan") {
    badgeClasses =
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60";
    dotClass = "bg-emerald-500";
  } else if (primaryStatus === "makruh") {
    badgeClasses =
      "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60";
    dotClass = "bg-amber-500";
  } else if (primaryStatus === "terlarang") {
    badgeClasses =
      "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60";
    dotClass = "bg-rose-500";
  }

  // Accessibility label
  const ariaLabel = `${dayName}, ${gregorianDay}. ${hijriFormatted}. Status: ${primaryBadge.label}. Malam: ${malamSlot.label}. Siang: ${siangSlot.label}.`;

  return (
    <div role="gridcell" aria-selected={isSelected} className="relative p-0.5 sm:p-1">
      <button
        type="button"
        onClick={() => onSelect(dayInfo)}
        aria-pressed={isSelected}
        aria-current={isToday ? "date" : undefined}
        aria-label={ariaLabel}
        className={`group relative flex w-full flex-col justify-between rounded-xl p-1.5 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 z-0 min-h-[58px] sm:min-h-[72px] md:min-h-[82px] ${
          isSelected
            ? "border-2 border-primary bg-primary/15 shadow-sm font-semibold"
            : isToday
              ? "border-2 border-primary/70 bg-card hover:bg-muted/50"
              : isCurrentMonth
                ? "border border-border/70 bg-card hover:border-primary/40 hover:bg-muted/40"
                : "border border-dashed border-border/30 bg-muted/10 opacity-40 hover:opacity-80"
        } ${
          isHaid
            ? "bg-rose-500/10 border-rose-500/40"
            : ""
        } active:scale-[0.97]`}
      >
        {/* Today Dot Indicator */}
        {isToday && (
          <span
            className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary"
            title="Hari ini"
            aria-hidden="true"
          />
        )}

        {/* Top Header: Gregorian Day (left) & Hijri Day (right) */}
        <div className="flex w-full items-baseline justify-between gap-1">
          <span
            className={`text-xs sm:text-sm md:text-base font-bold tabular-nums ${
              isSelected
                ? "text-primary"
                : isCurrentMonth
                  ? "text-foreground"
                  : "text-muted-foreground"
            }`}
          >
            {gregorianDay}
          </span>

          <span className="text-[10px] sm:text-xs font-medium tabular-nums text-muted-foreground">
            {hijriDay}
          </span>
        </div>

        {/* Middle/Bottom: Status Display */}
        <div className="mt-1 flex w-full flex-col gap-0.5">
          {/* Mobile Dot Indicator */}
          <div className="flex items-center gap-1 sm:hidden">
            <span
              className={`h-2 w-2 rounded-full ${dotClass}`}
              aria-hidden="true"
            />
            {isPurnama && (
              <span className="text-[10px]" title="Purnama">
                🌕
              </span>
            )}
            {isHaid && (
              <span className="text-[10px] text-rose-600 font-bold">
                Haid
              </span>
            )}
          </div>

          {/* Desktop Badge Indicator */}
          <div className="hidden sm:flex sm:items-center sm:gap-1">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${badgeClasses} truncate max-w-full`}
            >
              <span aria-hidden="true">{primaryBadge.icon}</span>
              <span className="truncate">{primaryBadge.label}</span>
            </span>
          </div>

          {/* Critical Phase Badges (Small tags on Desktop) */}
          <div className="hidden md:flex flex-wrap gap-1">
            {isPurnama && (
              <span className="rounded bg-amber-500/15 px-1 py-0.2 text-[9px] font-bold text-amber-800 dark:text-amber-300">
                Purnama
              </span>
            )}
            {isAwalBulan && (
              <span className="rounded bg-amber-500/15 px-1 py-0.2 text-[9px] font-bold text-amber-800 dark:text-amber-300">
                Awal Bln
              </span>
            )}
            {isAkhirBulan && (
              <span className="rounded bg-amber-500/15 px-1 py-0.2 text-[9px] font-bold text-amber-800 dark:text-amber-300">
                Akhir Bln
              </span>
            )}
            {isHaid && (
              <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[9px] font-bold text-rose-700 dark:text-rose-300">
                Haid
              </span>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
