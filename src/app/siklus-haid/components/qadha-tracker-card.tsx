"use client";

import { useState } from "react";
import type { QadhaPuasaEntry } from "@/types/cycle-tracker";
import { formatGregorianShort } from "@/lib/calendar-engine";
import { parseISODate } from "@/lib/cycle-engine";

interface QadhaTrackerCardProps {
  entries: QadhaPuasaEntry[];
  onTogglePaid: (id: string) => void;
  onPayNextOneDay: () => void;
  onAddManualEntry: (dateOwedIso: string) => void;
}

export function QadhaTrackerCard({
  entries,
  onTogglePaid,
  onPayNextOneDay,
  onAddManualEntry,
}: QadhaTrackerCardProps) {
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualDate, setManualDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0]!;
  });

  const totalOwed = entries.length;
  const totalPaid = entries.filter((e) => e.isPaid).length;
  const remaining = totalOwed - totalPaid;
  const progressPercent = totalOwed > 0 ? Math.round((totalPaid / totalOwed) * 100) : 100;

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDate) return;
    onAddManualEntry(manualDate);
    setIsAddingManual(false);
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 md:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌙</span>
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              Pelacak Qadha Puasa Ramadhan
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Hutang puasa yang terlewat akibat datang bulan dan wajib diqadha sebelum Ramadhan berikutnya.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {remaining > 0 ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs font-bold">
              Tersisa: {remaining} Hari
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
              ✓ Semua Lunas
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Total Hutang: <strong>{totalOwed} hari</strong> • Sudah Diqadha: <strong>{totalPaid} hari</strong>
          </span>
          <span className="font-semibold text-primary">{progressPercent}% Selesai</span>
        </div>
        <div className="w-full h-3 rounded-full bg-muted/60 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5">
        {remaining > 0 && (
          <button
            type="button"
            onClick={onPayNextOneDay}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Tandai 1 Hari Qadha Lunas</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsAddingManual((prev) => !prev)}
          className="min-h-[44px] px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold shadow-xs transition-all"
        >
          {isAddingManual ? "Batal Tambah" : "+ Tambah Hutang Puasa Manual"}
        </button>
      </div>

      {/* Manual Input Form */}
      {isAddingManual && (
        <form
          onSubmit={handleAddManual}
          className="p-4 rounded-2xl border border-border bg-muted/30 space-y-3 animate-in fade-in"
        >
          <label className="block text-xs font-semibold text-foreground">
            Tanggal Haid di Bulan Ramadhan:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
            <button
              type="submit"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Simpan ke Daftar
            </button>
          </div>
        </form>
      )}

      {/* Checklist List */}
      {entries.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border rounded-2xl text-xs text-muted-foreground space-y-1">
          <p className="text-base">🌸</p>
          <p className="font-semibold text-foreground">
            Belum ada catatan hutang puasa Ramadhan.
          </p>
          <p>
            Catatan akan bertambah otomatis saat Anda mencatat haid pada bulan Ramadhan, atau tambahkan secara manual di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {entries.map((entry, index) => {
            const dateObj = parseISODate(entry.dateOwed);
            const dateStr = formatGregorianShort(dateObj);

            return (
              <label
                key={entry.id}
                className={`min-h-[50px] p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  entry.isPaid
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200 line-through"
                    : "bg-card border-border hover:border-primary/40 text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={entry.isPaid}
                    onChange={() => onTogglePaid(entry.id)}
                    className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary"
                  />
                  <div className="text-xs">
                    <span className="font-bold">Hari ke-{index + 1}</span>
                    <span className="text-muted-foreground ml-1.5">({dateStr})</span>
                  </div>
                </div>
                {entry.isPaid && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    Lunas
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {/* Dalil Hadits Fiqih */}
      <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2 text-xs text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground flex items-center gap-1.5">
          <span>📜</span>
          <span>Landasan Syariat Qadha Puasa Bagi Wanita Haid:</span>
        </span>
        <blockquote className="italic border-l-2 border-primary/60 pl-3 py-0.5 text-foreground/90">
          &ldquo;Kami dahulu mengalami haid pada masa Rasulullah ﷺ, lalu kami diperintahkan untuk mengqadha puasa dan tidak diperintahkan untuk mengqadha shalat.&rdquo;
        </blockquote>
        <p className="text-[11px] text-muted-foreground">
          — Hadits Riwayat Muslim No. 335 dari Sayyidah Aisyah radhiyallahu &apos;anha.
        </p>
      </div>
    </div>
  );
}
