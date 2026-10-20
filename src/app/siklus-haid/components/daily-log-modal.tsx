"use client";

import { useState } from "react";
import type {
  DailyCycleLog,
  FlowIntensity,
  FiqihBloodColor,
  PhysicalSymptom,
  MoodType,
  DischargeType,
  CessationSign,
} from "@/types/cycle-tracker";
import {
  FIQIH_BLOOD_COLORS,
  PHYSICAL_SYMPTOM_OPTIONS,
  MOOD_OPTIONS,
  DISCHARGE_OPTIONS,
} from "@/types/cycle-tracker";
import { formatGregorianFull } from "@/lib/calendar-engine";
import { parseISODate } from "@/lib/cycle-engine";

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  isoDate: string;
  initialLog?: DailyCycleLog;
  onSaveLog: (isoDate: string, log: Partial<DailyCycleLog>) => void;
  onDeleteLog?: (isoDate: string) => void;
}

const FLOW_OPTIONS: { id: FlowIntensity; label: string; desc: string; icon: string }[] = [
  { id: "spotting", label: "Bercak", desc: "Tetesan kecil", icon: "💧" },
  { id: "light", label: "Ringan", desc: "1 pembalut", icon: "🩸" },
  { id: "medium", label: "Sedang", desc: "2-3 pembalut", icon: "🩸" },
  { id: "heavy", label: "Deras", desc: ">3 pembalut", icon: "🩸" },
  { id: "none", label: "Tidak Ada", desc: "Kering / Jufuf", icon: "⚪" },
];

function DailyLogContent({
  onClose,
  isoDate,
  initialLog,
  onSaveLog,
  onDeleteLog,
}: Omit<DailyLogModalProps, "isOpen">) {
  const [flow, setFlow] = useState<FlowIntensity>(initialLog?.flow ?? "none");
  const [fiqihColor, setFiqihColor] = useState<FiqihBloodColor | undefined>(
    initialLog?.fiqihColor
  );
  const [cessationSign, setCessationSign] = useState<CessationSign | null>(
    initialLog?.cessationSign ?? null
  );
  const [isGhuslDone, setIsGhuslDone] = useState<boolean>(
    initialLog?.isGhuslDone ?? false
  );
  const [symptoms, setSymptoms] = useState<PhysicalSymptom[]>(
    initialLog?.symptoms ?? []
  );
  const [moods, setMoods] = useState<MoodType[]>(initialLog?.moods ?? []);
  const [discharge, setDischarge] = useState<DischargeType | undefined>(
    initialLog?.discharge
  );
  const [intimatePerformed, setIntimatePerformed] = useState<boolean>(
    initialLog?.intimateActivity?.performed ?? false
  );
  const [intimateRecitedDoa, setIntimateRecitedDoa] = useState<boolean>(
    initialLog?.intimateActivity?.recitedDoa ?? false
  );
  const [notes, setNotes] = useState<string>(initialLog?.notes ?? "");

  const dateObj = parseISODate(isoDate);
  const fullDateLabel = formatGregorianFull(dateObj);

  const toggleSymptom = (sym: PhysicalSymptom) => {
    setSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const toggleMood = (m: MoodType) => {
    setMoods((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const handleSave = () => {
    onSaveLog(isoDate, {
      flow,
      fiqihColor,
      cessationSign,
      isGhuslDone,
      symptoms,
      moods,
      discharge,
      intimateActivity: {
        performed: intimatePerformed,
        recitedDoa: intimateRecitedDoa,
      },
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-log-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl transition-transform animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 id="daily-log-title" className="text-lg font-bold text-foreground">
              Catatan Harian
            </h2>
            <p className="text-xs text-muted-foreground">{fullDateLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Catatan"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-foreground">
          {/* 1. Aliran Darah */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              1. Intensitas Aliran Darah
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {FLOW_OPTIONS.map((item) => {
                const isSelected = flow === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFlow(item.id)}
                    aria-pressed={isSelected}
                    className={`min-h-[56px] p-2 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                      isSelected
                        ? "bg-rose-500/15 border-rose-600 text-rose-800 dark:text-rose-200 font-semibold ring-2 ring-rose-500/30"
                        : "bg-card border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-bold leading-tight mt-0.5">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 2. Warna Darah Fiqih */}
          {flow !== "none" && (
            <fieldset className="space-y-2.5">
              <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                2. Tingkatan &amp; Sifat Warna Darah Fiqih
              </legend>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FIQIH_BLOOD_COLORS.map((color) => {
                  const isSelected = fiqihColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setFiqihColor(color.id)}
                      aria-pressed={isSelected}
                      className={`min-h-[50px] p-2.5 rounded-2xl border flex items-center gap-3 transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary ring-2 ring-primary/30 font-semibold"
                          : "bg-card border-border hover:border-primary/40"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border shrink-0"
                        style={{
                          backgroundColor: color.hexLight,
                          borderColor: color.borderColor,
                        }}
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold">{color.name}</div>
                        <div className="text-[10px] text-muted-foreground leading-tight">
                          {color.arabic}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* 3. Tanda Suci / Berhentinya Darah (Fiqih Cessation) */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              3. Verifikasi Tuntas Haid &amp; Mandi Wajib
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setCessationSign(
                    cessationSign === "qashshah_baidha" ? null : "qashshah_baidha"
                  )
                }
                aria-pressed={cessationSign === "qashshah_baidha"}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  cessationSign === "qashshah_baidha"
                    ? "bg-sky-500/15 border-sky-600 text-sky-800 dark:text-sky-200 font-semibold ring-2 ring-sky-500/30"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                <span>⚪</span>
                <div className="text-xs">
                  <div className="font-bold">Qashshah Baidha&apos;</div>
                  <div className="text-[10px] text-muted-foreground">Cairan putih bening penutup darah</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setCessationSign(cessationSign === "jufuf" ? null : "jufuf")
                }
                aria-pressed={cessationSign === "jufuf"}
                className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  cessationSign === "jufuf"
                    ? "bg-sky-500/15 border-sky-600 text-sky-800 dark:text-sky-200 font-semibold ring-2 ring-sky-500/30"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                <span>✨</span>
                <div className="text-xs">
                  <div className="font-bold">Jufuf (Kering)</div>
                  <div className="text-[10px] text-muted-foreground">Kapas bersih tanpa noda darah</div>
                </div>
              </button>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-muted/30 cursor-pointer">
              <input
                type="checkbox"
                checked={isGhuslDone}
                onChange={(e) => setIsGhuslDone(e.target.checked)}
                className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary"
              />
              <span className="text-xs font-semibold text-foreground">
                Saya sudah menuntaskan Mandi Wajib (Ghusl) untuk tanggal ini
              </span>
            </label>
          </fieldset>

          {/* 4. Gejala Fisik */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              4. Gejala Fisik (Pill Multi-Pilih)
            </legend>
            <div className="flex flex-wrap gap-2">
              {PHYSICAL_SYMPTOM_OPTIONS.map((item) => {
                const isSelected = symptoms.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSymptom(item.id)}
                    aria-pressed={isSelected}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-card border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 5. Suasana Hati / Mood */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              5. Suasana Hati / Mood
            </legend>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((item) => {
                const isSelected = moods.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleMood(item.id)}
                    aria-pressed={isSelected}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-accent text-accent-foreground border-accent shadow-xs"
                        : "bg-card border-border hover:border-primary/40 text-foreground"
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 6. Cairan Vagina / Keputihan */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              6. Cairan Vagina / Keputihan (Cervical Mucus)
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DISCHARGE_OPTIONS.map((item) => {
                const isSelected = discharge === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDischarge(isSelected ? undefined : item.id)}
                    aria-pressed={isSelected}
                    className={`min-h-[48px] p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? "bg-teal-500/15 border-teal-600 text-teal-800 dark:text-teal-200 font-semibold ring-2 ring-teal-500/30"
                        : "bg-card border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 7. Hubungan Keintiman & Doa */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              7. Aktivitas Keintiman Pasutri (Jima&apos;)
            </legend>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-muted/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={intimatePerformed}
                  onChange={(e) => setIntimatePerformed(e.target.checked)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary accent-primary"
                />
                <span className="text-xs font-semibold text-foreground">
                  Berhubungan Suami-Istri pada tanggal ini
                </span>
              </label>

              {intimatePerformed && (
                <label className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 cursor-pointer animate-in fade-in">
                  <input
                    type="checkbox"
                    checked={intimateRecitedDoa}
                    onChange={(e) => setIntimateRecitedDoa(e.target.checked)}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span className="text-xs font-semibold text-foreground">
                    Membaca Doa Perlindungan Syaitan (&ldquo;Bismillah, Allahumma jannibna...&rdquo;)
                  </span>
                </label>
              )}
            </div>
          </fieldset>

          {/* 8. Catatan Pribadi */}
          <div className="space-y-2">
            <label htmlFor="daily-note" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              8. Catatan Pribadi
            </label>
            <textarea
              id="daily-note"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan kondisi fisik, obat yang dikonsumsi, dll..."
              className="w-full p-3 rounded-2xl border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-border flex flex-wrap items-center justify-between gap-3 bg-muted/20">
          {initialLog && onDeleteLog && (
            <button
              type="button"
              onClick={() => {
                onDeleteLog(isoDate);
                onClose();
              }}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-destructive hover:bg-destructive/10 text-xs font-semibold transition-colors"
            >
              Hapus Catatan
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none min-h-[44px] px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              Simpan Catatan Harian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DailyLogModal(props: DailyLogModalProps) {
  if (!props.isOpen) return null;

  return (
    <DailyLogContent
      key={props.isoDate + (props.initialLog?.updatedAt ?? "new")}
      onClose={props.onClose}
      isoDate={props.isoDate}
      initialLog={props.initialLog}
      onSaveLog={props.onSaveLog}
      onDeleteLog={props.onDeleteLog}
    />
  );
}
