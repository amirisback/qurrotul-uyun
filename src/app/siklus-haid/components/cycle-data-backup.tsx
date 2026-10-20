"use client";

import { useState, useRef } from "react";
import { formatToISODate } from "@/lib/calendar-engine";

interface CycleDataBackupProps {
  onExport: () => string;
  onImport: (jsonString: string) => boolean;
  onReset: () => void;
}

export function CycleDataBackup({
  onExport,
  onImport,
  onReset,
}: CycleDataBackupProps) {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadBackup = () => {
    try {
      const json = onExport();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const todayStr = formatToISODate(new Date());
      link.href = url;
      link.download = `qurrotul-siklus-backup-${todayStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setImportStatus("Pencadangan berhasil diunduh.");
    } catch {
      setImportStatus("Gagal membuat berkas cadangan.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImport(content);
        if (success) {
          setImportStatus("Data cadangan berhasil dipulihkan.");
        } else {
          setImportStatus("Format berkas tidak valid.");
        }
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmReset = () => {
    onReset();
    setIsResetConfirmOpen(false);
    setImportStatus("Seluruh data pribadi telah dihapus bersih.");
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 md:p-8 space-y-5 shadow-sm">
      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
        <span className="text-xl">🛡️</span>
        <div className="space-y-1 text-xs text-foreground/90 leading-relaxed">
          <h3 className="font-bold text-emerald-800 dark:text-emerald-200">
            Kedaulatan Privasi 100% (Zero Server Leakage)
          </h3>
          <p className="text-muted-foreground">
            Seluruh catatan siklus, aliran darah, dan status kesehatan reproduksi tersimpan secara lokal di peramban perangkat Anda. Tidak ada data yang dikirim ke server luar atau pihak ketiga.
          </p>
        </div>
      </div>

      {importStatus && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary flex items-center justify-between"
        >
          <span>{importStatus}</span>
          <button
            type="button"
            onClick={() => setImportStatus(null)}
            className="text-xs hover:underline"
          >
            ✕
          </button>
        </div>
      )}

      {/* Backup & Restore Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Export Button */}
        <button
          type="button"
          onClick={handleDownloadBackup}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
        >
          <span>📥</span>
          <span>Ekspor Cadangan (JSON)</span>
        </button>

        {/* Import Trigger */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold shadow-xs transition-all flex items-center gap-2"
        >
          <span>📤</span>
          <span>Impor Berkas Cadangan</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          className="hidden"
          aria-hidden="true"
        />

        {/* Delete All Data Trigger */}
        <button
          type="button"
          onClick={() => setIsResetConfirmOpen(true)}
          className="min-h-[44px] px-4 py-2 rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/10 text-xs font-semibold shadow-xs transition-all ml-auto flex items-center gap-2"
        >
          <span>🗑️</span>
          <span>Hapus Seluruh Data</span>
        </button>
      </div>

      {/* Double Confirmation Modal for Reset */}
      {isResetConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-destructive">
              Konfirmasi Hapus Seluruh Data
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tindakan ini akan menghapus seluruh catatan riwayat siklus, gejala harian, dan hutang puasa dari penyimpanan perangkat Anda. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold"
              >
                Ya, Hapus Bersih
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
