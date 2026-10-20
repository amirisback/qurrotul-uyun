"use client";

import type { EvaluatedDayStatus, UserCycleProfile } from "@/types/cycle-tracker";
import { formatGregorianFull } from "@/lib/calendar-engine";

interface CycleHeroCardProps {
  status: EvaluatedDayStatus;
  profile: UserCycleProfile;
  onOpenLogger: () => void;
  onConfirmGhusl?: () => void;
  onOpenFiqihGuide: () => void;
  onOpenOnboarding: () => void;
}

export function CycleHeroCard({
  status,
  profile,
  onOpenLogger,
  onConfirmGhusl,
  onOpenFiqihGuide,
  onOpenOnboarding,
}: CycleHeroCardProps) {
  const targetDate = new Date(status.isoDate);
  const formattedDate = formatGregorianFull(targetDate);
  const cycleLen = profile.averageCycleLength || 28;
  const progressRatio = Math.min(Math.max(status.cycleDayNumber / cycleLen, 0), 1);

  // SVG Radial Circle calculations
  const size = 220;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Badge styling mapped to semantic syari colors
  const badgeColors: Record<
    EvaluatedDayStatus["statusBadge"]["variant"],
    { bg: string; text: string; border: string; ringColor: string }
  > = {
    rose: {
      bg: "bg-rose-500/15 dark:bg-rose-950/40",
      text: "text-rose-800 dark:text-rose-200",
      border: "border-rose-300 dark:border-rose-800",
      ringColor: "#e11d48",
    },
    sky: {
      bg: "bg-sky-500/15 dark:bg-sky-950/40",
      text: "text-sky-800 dark:text-sky-200",
      border: "border-sky-300 dark:border-sky-800",
      ringColor: "#0284c7",
    },
    emerald: {
      bg: "bg-emerald-500/15 dark:bg-emerald-950/40",
      text: "text-emerald-800 dark:text-emerald-200",
      border: "border-emerald-300 dark:border-emerald-800",
      ringColor: "#059669",
    },
    amber: {
      bg: "bg-amber-500/15 dark:bg-amber-950/40",
      text: "text-amber-800 dark:text-amber-200",
      border: "border-amber-300 dark:border-amber-800",
      ringColor: "#d97706",
    },
  };

  const currentBadgeColor = badgeColors[status.statusBadge.variant];

  // Phase subtitle helper
  let phaseSubtitle = "Fase Siklus Berjalan";
  if (status.syariStatus === "haid") {
    phaseSubtitle = "Masa Haid Aktif (Larangan Ibadah & Jima')";
  } else if (status.syariStatus === "suci_wajib_mandi") {
    phaseSubtitle = "Darah Berhenti • Menunggu Mandi Wajib";
  } else if (status.isOvulationDay) {
    phaseSubtitle = "Puncak Ovulasi (Kesuburan Maksimal)";
  } else if (status.isFertileWindow) {
    phaseSubtitle = "Jendela Masa Subur (Ikhtiar Konsepsi)";
  } else if (status.syariStatus === "istihadlah") {
    phaseSubtitle = "Darah Istihadlah (Wajib Shalat & Puasa)";
  } else {
    phaseSubtitle = "Masa Suci (Thaharah Sempurna)";
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-sm transition-all hover:border-primary/40">
      {/* Background Soft Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: currentBadgeColor.ringColor }}
      />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-lg mx-auto">
        {/* Date & Settings Trigger */}
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {formattedDate}
          </span>
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="inline-flex min-h-[44px] items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
            aria-label="Atur Profil Siklus"
          >
            <span>⚙️</span>
            <span>Atur Siklus</span>
          </button>
        </div>

        {/* Radial Ring Hero */}
        <div
          role="region"
          aria-label="Cincin visualisasi siklus haid"
          className="relative flex items-center justify-center select-none"
          style={{ width: size, height: size }}
        >
          <svg
            className="transform -rotate-90"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background Track Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted/50 dark:text-muted/30"
              fill="transparent"
            />
            {/* Animated Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={currentBadgeColor.ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Inner Content inside Ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <span className="text-xs font-medium text-muted-foreground">
              Siklus {cycleLen} Hari
            </span>
            <div className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight my-0.5">
              Hari ke-{status.cycleDayNumber}
            </div>
            <span className="text-[11px] font-medium text-foreground/80 max-w-[140px] leading-tight">
              {phaseSubtitle}
            </span>
          </div>
        </div>

        {/* Syar'i Status Badge */}
        <div
          role="status"
          aria-live="polite"
          className={`w-full p-4 rounded-2xl border ${currentBadgeColor.bg} ${currentBadgeColor.border} ${currentBadgeColor.text} space-y-1`}
        >
          <div className="flex items-center justify-center gap-2 font-bold text-sm md:text-base">
            <span className="text-base">{status.statusBadge.icon}</span>
            <span>{status.statusBadge.label}</span>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed max-w-md mx-auto">
            {status.statusBadge.description}
          </p>
        </div>

        {/* Quick Action CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full pt-1">
          <button
            type="button"
            onClick={onOpenLogger}
            className="flex-1 min-w-[200px] min-h-[44px] px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm shadow-sm transition-all duration-150 transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>🩸</span>
            <span>Catat Hari Ini</span>
          </button>

          {status.syariStatus === "suci_wajib_mandi" && onConfirmGhusl && (
            <button
              type="button"
              onClick={onConfirmGhusl}
              className="flex-1 min-w-[180px] min-h-[44px] px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-150 transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>💧</span>
              <span>Konfirmasi Mandi Wajib</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenFiqihGuide}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>📖</span>
            <span>Panduan Fiqih</span>
          </button>
        </div>
      </div>
    </div>
  );
}
