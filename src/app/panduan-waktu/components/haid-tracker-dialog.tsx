"use client";

import { useState, useEffect } from "react";
import type { HaidPeriodConfig } from "@/types/calendar-waktu";
import { formatToISODate } from "@/lib/calendar-engine";

interface HaidTrackerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: HaidPeriodConfig | null;
  onSaveConfig: (config: HaidPeriodConfig | null) => void;
}

function HaidTrackerModalContent({
  onClose,
  currentConfig,
  onSaveConfig,
}: Omit<HaidTrackerDialogProps, "isOpen">) {
  const [startDate, setStartDate] = useState<string>(
    currentConfig?.startDate || formatToISODate(new Date())
  );
  const [durationDays, setDurationDays] = useState<number>(
    currentConfig?.durationDays || 7
  );
  const [isActive, setIsActive] = useState<boolean>(
    currentConfig?.active ?? true
  );

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDecreaseDuration = () => {
    setDurationDays((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseDuration = () => {
    setDurationDays((prev) => Math.min(15, prev + 1));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isActive) {
      onSaveConfig(null);
    } else {
      onSaveConfig({
        startDate,
        durationDays,
        active: true,
      });
    }
    onClose();
  };

  const handleReset = () => {
    onSaveConfig(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="haid-tracker-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">
              🩸
            </span>
            <h3
              id="haid-tracker-title"
              className="text-base sm:text-lg font-bold text-foreground tracking-tight"
            >
              Atur Siklus Haid Istri
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengaturan haid"
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
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Fitur ini menandai tanggal siklus haid pada kalender agar Anda mengetahui waktu yang diharamkan bersenggama menurut syariat fiqih Islam.
          </p>

          {/* Toggle Active */}
          <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card p-3">
            <div>
              <div className="text-xs font-bold text-foreground">
                Status Penanda Haid
              </div>
              <div className="text-[11px] text-muted-foreground">
                {isActive ? "Aktif (ditandai di kalender)" : "Nonaktif"}
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive((prev) => !prev)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive ? "bg-rose-600" : "bg-muted"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {isActive && (
            <>
              {/* Start Date Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="haid-start-date"
                  className="text-xs font-semibold text-foreground"
                >
                  Tanggal Mulai Haid:
                </label>
                <input
                  id="haid-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              {/* Duration Stepper */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="haid-duration-stepper"
                    className="text-xs font-semibold text-foreground"
                  >
                    Perkiraan Durasi Hari:
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    (Maks. 15 hari dalam Mazhab Syafi&apos;i)
                  </span>
                </div>

                <div
                  id="haid-duration-stepper"
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-1.5"
                >
                  <button
                    type="button"
                    onClick={handleDecreaseDuration}
                    disabled={durationDays <= 1}
                    aria-label="Kurangi 1 hari durasi"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-base font-bold text-foreground hover:bg-muted disabled:opacity-40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    &minus;
                  </button>

                  <span className="text-sm font-extrabold text-foreground tabular-nums">
                    {durationDays} Hari
                  </span>

                  <button
                    type="button"
                    onClick={handleIncreaseDuration}
                    disabled={durationDays >= 15}
                    aria-label="Tambah 1 hari durasi"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-base font-bold text-foreground hover:bg-muted disabled:opacity-40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    &#43;
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Privacy Note */}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
            <span className="text-base" aria-hidden="true">
              🔒
            </span>
            <div>
              <strong className="text-foreground">Jaminan Privasi Pribadi:</strong>
              <p className="mt-0.5">
                Data siklus ini tersimpan 100% di browser lokal Anda (localStorage) dan tidak pernah dikirimkan ke server mana pun.
              </p>
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
            {currentConfig ? (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Hapus
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Batal
              </button>
            )}

            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Simpan Jadwal Haid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function HaidTrackerDialog(props: HaidTrackerDialogProps) {
  if (!props.isOpen) return null;
  return <HaidTrackerModalContent {...props} />;
}
