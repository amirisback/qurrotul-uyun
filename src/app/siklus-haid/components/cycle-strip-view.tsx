"use client";

import { useState, useMemo } from "react";
import type { EvaluatedDayStatus, DailyCycleLog } from "@/types/cycle-tracker";
import { formatToISODate, addDays, parseISODate } from "@/lib/cycle-engine";

interface CycleStripViewProps {
  selectedIsoDate: string;
  onSelectDate: (isoDate: string) => void;
  getEvaluatedDay: (date: Date) => EvaluatedDayStatus;
  logs: Record<string, DailyCycleLog>;
}

const SHORT_DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function CycleStripView({
  selectedIsoDate,
  onSelectDate,
  getEvaluatedDay,
  logs,
}: CycleStripViewProps) {
  const [showFullMonth, setShowFullMonth] = useState(false);

  // 14-day window: 7 days before today to 6 days after today
  const stripDays = useMemo(() => {
    const today = new Date();
    const result: EvaluatedDayStatus[] = [];

    for (let offset = -6; offset <= 7; offset++) {
      const d = addDays(today, offset);
      result.push(getEvaluatedDay(d));
    }
    return result;
  }, [getEvaluatedDay]);

  // Full 35 or 42-day month window if toggled
  const fullMonthDays = useMemo(() => {
    if (!showFullMonth) return [];
    const base = parseISODate(selectedIsoDate);
    const year = base.getFullYear();
    const month = base.getMonth();

    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: EvaluatedDayStatus[] = [];

    // Leading days
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i);
      days.push(getEvaluatedDay(d));
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      days.push(getEvaluatedDay(d));
    }

    // Trailing days to reach full 35 or 42 grid cells
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      days.push(getEvaluatedDay(d));
    }

    return days;
  }, [showFullMonth, selectedIsoDate, getEvaluatedDay]);

  const getDayIndicator = (dayStatus: EvaluatedDayStatus) => {
    const log = logs[dayStatus.isoDate];

    if (dayStatus.syariStatus === "haid" || (log && log.flow && log.flow !== "none")) {
      return {
        bg: "bg-rose-500",
        label: "Haid",
        icon: "🩸",
      };
    }
    if (dayStatus.syariStatus === "istihadlah") {
      return {
        bg: "bg-amber-500",
        label: "Istihadlah",
        icon: "⚠️",
      };
    }
    if (dayStatus.syariStatus === "suci_wajib_mandi") {
      return {
        bg: "bg-sky-500",
        label: "Wajib Mandi",
        icon: "💧",
      };
    }
    if (dayStatus.isOvulationDay) {
      return {
        bg: "bg-teal-500",
        label: "Puncak Ovulasi",
        icon: "⭐",
      };
    }
    if (dayStatus.isFertileWindow) {
      return {
        bg: "bg-teal-400",
        label: "Masa Subur",
        icon: "🌱",
      };
    }
    return {
      bg: "bg-emerald-500/40",
      label: "Suci",
      icon: "•",
    };
  };

  const todayIso = formatToISODate(new Date());

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 md:p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
          <span>📅</span>
          <span>Riwayat &amp; Proyeksi 14 Hari</span>
        </h2>
        <button
          type="button"
          onClick={() => setShowFullMonth((prev) => !prev)}
          className="min-h-[44px] px-3.5 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-all"
        >
          {showFullMonth ? "Tutup Kalender Bulanan" : "Lihat Kalender Penuh"}
        </button>
      </div>

      {/* Horizontal Strip */}
      <div
        role="region"
        aria-label="Strip 14 Hari Terdekat"
        className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x"
      >
        {stripDays.map((dayStatus) => {
          const dateObj = parseISODate(dayStatus.isoDate);
          const dayNum = dateObj.getDate();
          const dayName = SHORT_DAYS[dateObj.getDay()];
          const isSelected = dayStatus.isoDate === selectedIsoDate;
          const isToday = dayStatus.isoDate === todayIso;
          const indicator = getDayIndicator(dayStatus);

          return (
            <button
              key={dayStatus.isoDate}
              type="button"
              onClick={() => onSelectDate(dayStatus.isoDate)}
              aria-pressed={isSelected}
              className={`min-w-[56px] min-h-[74px] p-2 rounded-2xl border flex flex-col items-center justify-between transition-all shrink-0 snap-center ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : isToday
                    ? "bg-primary/10 text-foreground border-primary/40 font-bold"
                    : "bg-card border-border hover:border-primary/40 text-foreground"
              }`}
            >
              <span className={`text-[11px] ${isSelected ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
                {dayName}
              </span>
              <span className="text-base font-extrabold tracking-tight">
                {dayNum}
              </span>
              <span
                className="text-xs leading-none"
                title={indicator.label}
              >
                {indicator.icon}
              </span>
            </button>
          );
        })}
      </div>

      {/* Full 35-Day Month Grid (Toggled) */}
      {showFullMonth && (
        <div className="pt-4 border-t border-border space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-muted-foreground">
            {SHORT_DAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {fullMonthDays.map((dayStatus) => {
              const dateObj = parseISODate(dayStatus.isoDate);
              const dayNum = dateObj.getDate();
              const isSelected = dayStatus.isoDate === selectedIsoDate;
              const isToday = dayStatus.isoDate === todayIso;
              const indicator = getDayIndicator(dayStatus);

              return (
                <button
                  key={dayStatus.isoDate}
                  type="button"
                  onClick={() => onSelectDate(dayStatus.isoDate)}
                  className={`min-h-[52px] p-1.5 rounded-xl border flex flex-col items-center justify-between transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2 ring-offset-background font-bold"
                      : isToday
                        ? "bg-primary/15 border-primary/50 text-foreground font-bold"
                        : "bg-card border-border hover:border-primary/40 text-foreground"
                  }`}
                >
                  <span className="text-xs font-semibold">{dayNum}</span>
                  <span className="text-[11px] leading-none">{indicator.icon}</span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-muted-foreground border-t border-border/60">
            <span className="flex items-center gap-1">
              <span>🩸</span>
              <span>Haid</span>
            </span>
            <span className="flex items-center gap-1">
              <span>💧</span>
              <span>Wajib Mandi</span>
            </span>
            <span className="flex items-center gap-1">
              <span>⭐</span>
              <span>Puncak Ovulasi</span>
            </span>
            <span className="flex items-center gap-1">
              <span>🌱</span>
              <span>Masa Subur</span>
            </span>
            <span className="flex items-center gap-1">
              <span>⚠️</span>
              <span>Istihadlah</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
