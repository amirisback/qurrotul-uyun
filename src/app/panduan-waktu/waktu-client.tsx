"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import type { PanduanWaktuItem } from "@/types/qurrotul-uyun";
import type {
  CalendarDayInfo,
  HaidPeriodConfig,
  ViewMode,
} from "@/types/calendar-waktu";
import {
  evaluateDateTiming,
  getMonthCalendarDays,
  getNextRecommendedTiming,
} from "@/lib/calendar-engine";
import { CalendarHero } from "./components/calendar-hero";
import { CalendarNav } from "./components/calendar-nav";
import { CalendarGrid } from "./components/calendar-grid";
import { DateDetail } from "./components/date-detail";
import { AgendaView } from "./components/agenda-view";
import { HaidTrackerDialog } from "./components/haid-tracker-dialog";

interface WaktuClientProps {
  waktuItems: PanduanWaktuItem[];
}

const HAID_STORAGE_KEY = "qurrotul_haid_tracker";
const emptySubscribe = () => () => {};

/**
 * Custom Hook: Reactive client-side HaidConfig store with zero cascading render warnings
 */
function useHaidConfigStore(): [
  HaidPeriodConfig | null,
  (config: HaidPeriodConfig | null) => void,
] {
  const rawSnapshot = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      try {
        return localStorage.getItem(HAID_STORAGE_KEY);
      } catch {
        return null;
      }
    },
    () => null
  );

  const [localOverride, setLocalOverride] = useState<string | null | undefined>(
    undefined
  );

  const effectiveRaw =
    localOverride !== undefined ? localOverride : rawSnapshot;

  const haidConfig = useMemo(() => {
    if (!effectiveRaw) return null;
    try {
      const parsed = JSON.parse(effectiveRaw) as HaidPeriodConfig;
      if (parsed && parsed.startDate) return parsed;
    } catch {
      return null;
    }
    return null;
  }, [effectiveRaw]);

  const saveConfig = (config: HaidPeriodConfig | null) => {
    try {
      if (config) {
        const val = JSON.stringify(config);
        localStorage.setItem(HAID_STORAGE_KEY, val);
        setLocalOverride(val);
      } else {
        localStorage.removeItem(HAID_STORAGE_KEY);
        setLocalOverride(null);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch {
      // Ignore storage errors
    }
  };

  return [haidConfig, saveConfig];
}

export function WaktuClient({ waktuItems }: WaktuClientProps) {
  // Safe client mount indicator without cascading render
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // View Mode: 'calendar' | 'agenda7' | 'kitab'
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

  // Haid Tracker State & Modal
  const [haidConfig, handleSaveHaidConfig] = useHaidConfigStore();
  const [isHaidDialogOpen, setIsHaidDialogOpen] = useState<boolean>(false);

  // Reference Date & Active Month Navigation
  const [todayDate] = useState<Date>(() => new Date());
  const [currentYear, setCurrentYear] = useState<number>(() =>
    new Date().getFullYear()
  );
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(() =>
    new Date().getMonth()
  );

  // Selected Date state (Derived during render - zero effect synchronization needed)
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const selectedDay = useMemo(() => {
    return evaluateDateTiming(selectedDate, haidConfig);
  }, [selectedDate, haidConfig]);

  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState<boolean>(false);

  // Filter for Tab 3 (Ketentuan Kitab Asal)
  const [kitabFilter, setKitabFilter] = useState<string>("all");

  // Compute calendar grid days for current viewing month
  const monthDays = useMemo(() => {
    return getMonthCalendarDays(currentYear, currentMonthIndex, haidConfig);
  }, [currentYear, currentMonthIndex, haidConfig]);

  // Compute 7-day upcoming agenda
  const agendaDays7 = useMemo(() => {
    const days: CalendarDayInfo[] = [];
    const start = new Date(todayDate);
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(evaluateDateTiming(d, haidConfig));
    }

    return days;
  }, [todayDate, haidConfig]);

  // Compute next recommended timing
  const nextRecommended = useMemo(() => {
    return getNextRecommendedTiming(todayDate, haidConfig);
  }, [todayDate, haidConfig]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  const handleResetToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonthIndex(now.getMonth());
    setSelectedDate(now);
  };

  const handleSelectDate = (dayInfo: CalendarDayInfo) => {
    setSelectedDate(dayInfo.date);
    setIsMobileDetailOpen(true);

    // If day belongs to another month, sync viewing month
    const clickedMonth = dayInfo.date.getMonth();
    const clickedYear = dayInfo.date.getFullYear();
    if (clickedMonth !== currentMonthIndex || clickedYear !== currentYear) {
      setCurrentMonthIndex(clickedMonth);
      setCurrentYear(clickedYear);
    }
  };

  const handleSelectRecommendedDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentYear(date.getFullYear());
    setCurrentMonthIndex(date.getMonth());
    setIsMobileDetailOpen(true);
    setViewMode("calendar");
  };

  // Filtered items for Ketentuan Kitab view
  const filteredKitabItems = waktuItems.filter((item) => {
    if (kitabFilter === "all") return true;
    return item.status === kitabFilter;
  });

  const getKitabBadge = (status: PanduanWaktuItem["status"]) => {
    switch (status) {
      case "sangat-dianjurkan":
        return {
          label: "Sangat Dianjurkan",
          bg: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30",
          icon: "✅",
        };
      case "baik":
        return {
          label: "Boleh / Mubah",
          bg: "bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30",
          icon: "👍",
        };
      case "makruh":
        return {
          label: "Dimakruhkan",
          bg: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30",
          icon: "⚠️",
        };
      case "terlarang":
        return {
          label: "Haram Mutlak",
          bg: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30",
          icon: "🚫",
        };
    }
  };

  const isCurrentRealMonth =
    currentYear === todayDate.getFullYear() &&
    currentMonthIndex === todayDate.getMonth();

  return (
    <div className="container mx-auto px-4 max-w-6xl py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            Kalender &amp; Fiqih Waktu
          </span>
          {haidConfig?.active && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/15 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-500/30">
              <span>🩸</span>
              <span>Penanda Haid Aktif</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Panduan Waktu &amp; Adab Hubungan Suami Istri
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Ulasan komprehensif dari Bab 3, 9, dan 16 Kitab Qurrotul Uyun mengenai hikmah pemilihan hari, waktu, dan adab jasmani-rohani saat berikhtiar menjalin hubungan intim.
        </p>
      </div>

      {/* 2. Highlight Card: Waktu Utama Terdekat */}
      {isMounted && (
        <CalendarHero
          timing={nextRecommended}
          onSelectRecommendedDate={handleSelectRecommendedDate}
          onOpenHaidTracker={() => setIsHaidDialogOpen(true)}
        />
      )}

      {/* 3. Segmented View Switcher */}
      <div
        role="tablist"
        aria-label="Mode Tampilan Panduan Waktu"
        className="inline-flex max-w-full overflow-x-auto rounded-2xl border border-border/80 bg-muted/60 p-1 scrollbar-none"
      >
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === "calendar"}
          onClick={() => setViewMode("calendar")}
          className={`flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
            viewMode === "calendar"
              ? "bg-card text-foreground shadow-xs border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>📅</span>
          <span>Kalender Bulanan</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={viewMode === "agenda7"}
          onClick={() => setViewMode("agenda7")}
          className={`flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
            viewMode === "agenda7"
              ? "bg-card text-foreground shadow-xs border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>📋</span>
          <span>Agenda 7 Hari</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={viewMode === "kitab"}
          onClick={() => setViewMode("kitab")}
          className={`flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
            viewMode === "kitab"
              ? "bg-card text-foreground shadow-xs border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>📖</span>
          <span>Ketentuan Kitab (Asal)</span>
        </button>
      </div>

      {/* 4. Main View Content */}
      {viewMode === "calendar" && (
        <div className="space-y-4">
          <CalendarNav
            currentYear={currentYear}
            currentMonthIndex={currentMonthIndex}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onResetToToday={handleResetToToday}
            isCurrentRealMonth={isCurrentRealMonth}
          />

          {/* Desktop Master-Detail 2-Column Layout */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start">
            {/* Left Column: Calendar Grid */}
            <div className="lg:col-span-7 xl:col-span-8">
              <CalendarGrid
                days={monthDays}
                selectedDate={selectedDay}
                onSelectDate={handleSelectDate}
              />
            </div>

            {/* Right Column (Desktop): Persistent Sticky Date Detail Panel */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
              <DateDetail
                dayInfo={selectedDay}
                isOpen={true}
                onClose={() => {}}
                isDesktopInline={true}
              />
            </div>
          </div>

          {/* Mobile Bottom Sheet Drawer for Date Detail */}
          <div className="lg:hidden">
            <DateDetail
              dayInfo={selectedDay}
              isOpen={isMobileDetailOpen}
              onClose={() => setIsMobileDetailOpen(false)}
              isDesktopInline={false}
            />
          </div>
        </div>
      )}

      {viewMode === "agenda7" && (
        <div className="space-y-4">
          <AgendaView
            days7={agendaDays7}
            onSelectDate={handleSelectDate}
          />

          {/* Mobile/Tablet Detail Drawer when clicked from Agenda */}
          <DateDetail
            dayInfo={selectedDay}
            isOpen={isMobileDetailOpen}
            onClose={() => setIsMobileDetailOpen(false)}
            isDesktopInline={false}
          />
        </div>
      )}

      {viewMode === "kitab" && (
        <div className="space-y-6">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setKitabFilter("all")}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                kitabFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua Ketentuan
            </button>
            <button
              type="button"
              onClick={() => setKitabFilter("sangat-dianjurkan")}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                kitabFilter === "sangat-dianjurkan"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Sangat Dianjurkan
            </button>
            <button
              type="button"
              onClick={() => setKitabFilter("makruh")}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                kitabFilter === "makruh"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Dimakruhkan
            </button>
            <button
              type="button"
              onClick={() => setKitabFilter("terlarang")}
              className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                kitabFilter === "terlarang"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Haram Mutlak
            </button>
          </div>

          {/* Timing Cards List */}
          <div className="space-y-4">
            {filteredKitabItems.map((item, idx) => {
              const badge = getKitabBadge(item.status);
              return (
                <div
                  key={idx}
                  className="p-5 md:p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all space-y-3 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      {item.hari}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
                    >
                      <span>{badge.icon}</span>
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-primary">
                    Alasan / Landasan: {item.alasan}
                  </div>

                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pt-1">
                    {item.keteranganKitab}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Checklist Adab Suami Istri (Preserved for complete content integrity) */}
      <section
        aria-label="Ringkasan 5 Adab Sebelum &amp; Saat Berhubungan Intim"
        className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-5"
      >
        <h3 className="text-lg font-bold text-foreground tracking-tight">
          Ringkasan 5 Adab Sebelum &amp; Saat Berhubungan Intim
        </h3>

        <ol className="space-y-3 text-xs sm:text-sm text-foreground/90 leading-relaxed list-decimal list-inside">
          <li className="pl-1">
            <strong>Bersuci &amp; Wewangian:</strong> Menyikat gigi (siwak), membersihkan tubuh, dan memakai wewangian segar yang disukai pasangan.
          </li>
          <li className="pl-1">
            <strong>Shalat Sunnah / Doa Perlindungan:</strong> Membaca doa <em>&ldquo;Bismillahi, Allahumma jannibnasy-syaithana...&rdquo;</em> agar keturunan terlindungi dari setan.
          </li>
          <li className="pl-1">
            <strong>Pemanasan Lemah Lembut (Foreplay):</strong> Berbincang mesra, bercumbu rayu, dan tidak tergesa-gesa agar istri merasakan kenyamanan penuh.
          </li>
          <li className="pl-1">
            <strong>Menjaga Rasa Malu:</strong> Menggunakan selimut atau kain penutup tubuh, tidak telanjang bulat tanpa penutup.
          </li>
          <li className="pl-1">
            <strong>Berwudhu Setelahnya:</strong> Disunnahkan mencuci kemaluan dan berwudhu jika ingin istirahat atau mengulang sebelum mandi junub.
          </li>
        </ol>

        <div className="pt-2">
          <Link
            href="/kitab?bab=6"
            className="inline-flex min-h-[44px] items-center gap-2 text-xs font-semibold text-primary hover:underline"
          >
            <span>Pelajari Bab 6: Tata Cara &amp; Etika Bersenggama Lengkap &rarr;</span>
          </Link>
        </div>
      </section>

      {/* 6. Haid Tracker Dialog Modal */}
      <HaidTrackerDialog
        isOpen={isHaidDialogOpen}
        onClose={() => setIsHaidDialogOpen(false)}
        currentConfig={haidConfig}
        onSaveConfig={handleSaveHaidConfig}
      />
    </div>
  );
}
