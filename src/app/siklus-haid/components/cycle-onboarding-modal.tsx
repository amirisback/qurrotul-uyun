"use client";

import { useState } from "react";
import type { UserCycleProfile } from "@/types/cycle-tracker";
import { formatToISODate } from "@/lib/calendar-engine";

interface CycleOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserCycleProfile;
  onSaveProfile: (profile: Partial<UserCycleProfile>) => void;
}

interface OnboardingContentProps {
  onClose: () => void;
  currentProfile: UserCycleProfile;
  onSaveProfile: (profile: Partial<UserCycleProfile>) => void;
}

function OnboardingContent({
  onClose,
  currentProfile,
  onSaveProfile,
}: OnboardingContentProps) {
  const [startDate, setStartDate] = useState(
    currentProfile.lastPeriodStartDate || formatToISODate(new Date())
  );
  const [cycleLength, setCycleLength] = useState(
    currentProfile.averageCycleLength || 28
  );
  const [periodDuration, setPeriodDuration] = useState(
    currentProfile.averagePeriodDuration || 7
  );
  const [lutealPhase] = useState(
    currentProfile.lutealPhaseDays || 14
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      lastPeriodStartDate: startDate,
      averageCycleLength: Number(cycleLength),
      averagePeriodDuration: Number(periodDuration),
      lutealPhaseDays: Number(lutealPhase),
      isOnboardingCompleted: true,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 id="onboarding-modal-title" className="text-lg font-bold text-foreground">
              Konfigurasi Siklus Haid
            </h2>
            <p className="text-xs text-muted-foreground">
              Data digunakan untuk proyeksi siklus &amp; perhitungan Fiqih Syafi&apos;i
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Pengaturan"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tanggal Mulai Haid Terakhir */}
          <div className="space-y-1.5">
            <label
              htmlFor="start-date-input"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <span>🩸</span>
              <span>Hari Pertama Haid Terakhir:</span>
            </label>
            <input
              id="start-date-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Panjang Siklus Rata-rata */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="cycle-length-input" className="font-semibold text-foreground flex items-center gap-1.5">
                <span>🔄</span>
                <span>Panjang Siklus Rata-rata:</span>
              </label>
              <span className="font-bold text-primary">{cycleLength} Hari</span>
            </div>
            <input
              id="cycle-length-input"
              type="range"
              min={21}
              max={45}
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>21 hari (Pendek)</span>
              <span>28 hari (Standar)</span>
              <span>45 hari (Panjang)</span>
            </div>
          </div>

          {/* Durasi Haid Rata-rata */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="period-duration-input" className="font-semibold text-foreground flex items-center gap-1.5">
                <span>⏳</span>
                <span>Durasi Haid Kebiasaan (*Adat):</span>
              </label>
              <span className="font-bold text-primary">{periodDuration} Hari</span>
            </div>
            <input
              id="period-duration-input"
              type="range"
              min={1}
              max={15}
              value={periodDuration}
              onChange={(e) => setPeriodDuration(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Min Fiqih: 1 hari (24 jam)</span>
              <span>Ghalib: 6-7 hari</span>
              <span>Maks Fiqih: 15 hari</span>
            </div>
          </div>

          {/* Fiqih Mazhab Syafi'i Note */}
          <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Kaidah Mazhab Syafi&apos;i:</strong> Minimal masa haid adalah 24 jam akumulatif, batas maksimal adalah 15 hari 15 malam, dan minimal jeda suci antar-haid adalah 15 hari.
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs transition-all"
            >
              Simpan Profil Siklus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CycleOnboardingModal({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}: CycleOnboardingModalProps) {
  if (!isOpen) return null;

  return (
    <OnboardingContent
      onClose={onClose}
      currentProfile={currentProfile}
      onSaveProfile={onSaveProfile}
    />
  );
}
