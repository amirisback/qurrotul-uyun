"use client";

import type { CalendarDayInfo, TimingStatus } from "@/types/calendar-waktu";
import { formatGregorianFull } from "@/lib/calendar-engine";

interface AgendaViewProps {
  days7: CalendarDayInfo[];
  onSelectDate: (dayInfo: CalendarDayInfo) => void;
}

export function AgendaView({ days7, onSelectDate }: AgendaViewProps) {
  const getBadgeStyle = (status: TimingStatus) => {
    switch (status) {
      case "sangat-dianjurkan":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60";
      case "baik":
        return "bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60";
      case "makruh":
        return "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60";
      case "terlarang":
        return "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60";
    }
  };

  return (
    <div className="space-y-3" role="feed" aria-label="Jadwal Waktu 7 Hari Terdekat">
      <div className="rounded-xl border border-border/80 bg-muted/30 p-3 text-xs text-muted-foreground">
        Menampilkan tinjauan status fiqih 7 hari ke depan mulai hari ini. Ketuk salah satu kartu untuk melihat rincian adab, dalil, dan doa.
      </div>

      <div className="space-y-3">
        {days7.map((dayInfo, idx) => {
          const isToday = idx === 0;
          const isTomorrow = idx === 1;
          const formattedGregorian = formatGregorianFull(dayInfo.date);
          const isPrimaryRecommended =
            dayInfo.malamSlot.status === "sangat-dianjurkan" ||
            dayInfo.siangSlot.status === "sangat-dianjurkan";

          return (
            <button
              key={dayInfo.isoDate}
              type="button"
              onClick={() => onSelectDate(dayInfo)}
              className={`w-full text-left rounded-2xl border p-4 sm:p-5 transition-all shadow-2xs hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isToday
                  ? "border-primary/60 bg-card ring-1 ring-primary/20"
                  : isPrimaryRecommended
                    ? "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
                    : "border-border/80 bg-card hover:bg-muted/30"
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase ${
                      isToday
                        ? "bg-primary text-primary-foreground"
                        : isTomorrow
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {isToday ? "Hari Ini" : isTomorrow ? "Besok" : `H+${idx}`}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-foreground">
                    {formattedGregorian}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {dayInfo.isPurnama && (
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                      🌕 Purnama
                    </span>
                  )}
                  {dayInfo.isHaid && (
                    <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 dark:text-rose-300">
                      🚫 Haid
                    </span>
                  )}
                  {isPrimaryRecommended && !dayInfo.isHaid && (
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                      ⭐ Waktu Utama
                    </span>
                  )}
                </div>
              </div>

              {/* Hijri Date Subtitle */}
              <div className="pt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {dayInfo.hijriFormatted}
              </div>

              {/* Slots Breakdown: Malam vs Siang */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Malam Slot */}
                <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground flex items-center gap-1">
                      <span>🌙</span>
                      <span>Sesi Malam</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                      {dayInfo.malamSlot.alasan}
                    </div>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold border ${getBadgeStyle(
                      dayInfo.malamSlot.status
                    )}`}
                  >
                    {dayInfo.malamSlot.status === "sangat-dianjurkan"
                      ? "Dianjurkan"
                      : dayInfo.malamSlot.status === "baik"
                        ? "Mubah"
                        : dayInfo.malamSlot.status === "makruh"
                          ? "Makruh"
                          : "Haram"}
                  </span>
                </div>

                {/* Siang Slot */}
                <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-foreground flex items-center gap-1">
                      <span>☀️</span>
                      <span>Sesi Siang</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                      {dayInfo.siangSlot.alasan}
                    </div>
                  </div>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold border ${getBadgeStyle(
                      dayInfo.siangSlot.status
                    )}`}
                  >
                    {dayInfo.siangSlot.status === "sangat-dianjurkan"
                      ? "Dianjurkan"
                      : dayInfo.siangSlot.status === "baik"
                        ? "Mubah"
                        : dayInfo.siangSlot.status === "makruh"
                          ? "Makruh"
                          : "Haram"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
