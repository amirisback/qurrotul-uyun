"use client";

import type { CalendarDayInfo } from "@/types/calendar-waktu";
import { CalendarCell } from "./calendar-cell";

interface CalendarGridProps {
  days: CalendarDayInfo[];
  selectedDate: CalendarDayInfo | null;
  onSelectDate: (dayInfo: CalendarDayInfo) => void;
}

const WEEKDAY_HEADERS = [
  { short: "Ahad", label: "Ahad (Minggu)" },
  { short: "Senin", label: "Senin" },
  { short: "Selasa", label: "Selasa" },
  { short: "Rabu", label: "Rabu" },
  { short: "Kamis", label: "Kamis" },
  { short: "Jumat", label: "Jumat" },
  { short: "Sabtu", label: "Sabtu" },
];

export function CalendarGrid({
  days,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const handleKeyDown = (
    e: React.KeyboardEvent,
    currentIndex: number
  ) => {
    let nextIndex = currentIndex;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        nextIndex = Math.max(0, currentIndex - 1);
        break;
      case "ArrowRight":
        e.preventDefault();
        nextIndex = Math.min(days.length - 1, currentIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        nextIndex = Math.max(0, currentIndex - 7);
        break;
      case "ArrowDown":
        e.preventDefault();
        nextIndex = Math.min(days.length - 1, currentIndex + 7);
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = days.length - 1;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onSelectDate(days[currentIndex]);
        return;
      default:
        return;
    }

    if (nextIndex !== currentIndex && days[nextIndex]) {
      onSelectDate(days[nextIndex]);
    }
  };

  return (
    <div className="space-y-3">
      {/* 7-Column Calendar Grid Container */}
      <div
        role="grid"
        aria-label="Kalender Panduan Waktu & Hijriah"
        className="overflow-hidden rounded-2xl border border-border/80 bg-card p-2 sm:p-3 shadow-xs"
      >
        {/* Day of Week Column Headers */}
        <div
          role="row"
          className="grid grid-cols-7 pb-2 text-center border-b border-border/50 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground"
        >
          {WEEKDAY_HEADERS.map((header, idx) => (
            <div
              key={idx}
              role="columnheader"
              aria-label={header.label}
              className={`py-1.5 ${
                idx === 4 // Kamis
                  ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                  : idx === 1 // Senin
                    ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                    : idx === 6 // Sabtu
                      ? "text-amber-700 dark:text-amber-400 font-semibold"
                      : "text-muted-foreground"
              }`}
            >
              <span className="sm:hidden">{header.short.slice(0, 3)}</span>
              <span className="hidden sm:inline">{header.short}</span>
            </div>
          ))}
        </div>

        {/* Calendar Cells Grid (7 columns x 5-6 rows) */}
        <div className="grid grid-cols-7 pt-1">
          {days.map((dayInfo, idx) => {
            const isSelected =
              selectedDate?.isoDate === dayInfo.isoDate;

            return (
              <div
                key={dayInfo.isoDate + idx}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              >
                <CalendarCell
                  dayInfo={dayInfo}
                  isSelected={isSelected}
                  onSelect={onSelectDate}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Color Status Legend */}
      <div
        aria-label="Keterangan Warna Status Fiqih"
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-[11px] sm:text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="font-medium text-foreground">Sangat Dianjurkan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-500" aria-hidden="true" />
          <span className="font-medium text-foreground">Boleh / Mubah</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden="true" />
          <span className="font-medium text-foreground">Dimakruhkan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" aria-hidden="true" />
          <span className="font-medium text-foreground">Haram Mutlak</span>
        </div>
      </div>
    </div>
  );
}
