"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BabItem } from "@/types/qurrotul-uyun";
import { ArabicViewer } from "../_components/arabic-viewer";
import { FontSizeControl } from "../_components/font-size-control";
import { useFavorites } from "@/lib/use-favorites";

interface ReaderClientProps {
  currentBab: BabItem;
  prevBab?: BabItem;
  nextBab?: BabItem;
  allBab: BabItem[];
}

export function ReaderClient({
  currentBab,
  prevBab,
  nextBab,
  allBab,
}: ReaderClientProps) {
  const router = useRouter();
  const [fontSize, setFontSize] = useState(26);
  const { isBabFavorited, toggleFavoriteBab } = useFavorites();
  const isFav = isBabFavorited(currentBab.id);

  return (
    <div className="container mx-auto px-4 max-w-4xl py-6 space-y-6">
      {/* Top Navigation & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <Link
          href="/kitab"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Daftar 20 Bab</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Font Size Adjuster */}
          <FontSizeControl
            fontSize={fontSize}
            onIncrease={() => setFontSize((p) => Math.min(38, p + 2))}
            onDecrease={() => setFontSize((p) => Math.max(20, p - 2))}
            onReset={() => setFontSize(26)}
          />

          {/* Bookmark Button */}
          <button
            onClick={() => toggleFavoriteBab(currentBab.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isFav
                ? "bg-accent/15 text-accent border-accent/40"
                : "bg-card text-muted-foreground hover:text-foreground border-border"
            }`}
            title={isFav ? "Hapus dari Favorit" : "Simpan ke Favorit"}
          >
            <svg
              className="w-4 h-4"
              fill={isFav ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="hidden sm:inline">{isFav ? "Tersimpan" : "Favorit"}</span>
          </button>
        </div>
      </div>

      {/* Chapter Title Card */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary">
          <span className="px-2.5 py-0.5 rounded-md bg-primary/10">
            {currentBab.nomor}
          </span>
          <span className="text-muted-foreground uppercase tracking-widest text-[11px]">
            {currentBab.kategori}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {currentBab.judul}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
          {currentBab.deskripsiRingkas}
        </p>
      </div>

      {/* Sub-Bab / Articles List */}
      <div className="space-y-6">
        {currentBab.konten.map((sub, idx) => (
          <article
            key={sub.id}
            id={sub.id}
            className="rounded-2xl border border-border/80 bg-card p-5 md:p-7 space-y-4 shadow-xs"
          >
            {/* Sub-heading */}
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {sub.subJudul}
              </h2>
            </div>

            {/* Arabic Block if available */}
            {sub.arab && (
              <div className="py-2 px-4 rounded-xl bg-muted/30 border border-border/40">
                <ArabicViewer
                  arab={sub.arab}
                  latin={sub.latin}
                  arti={sub.arti}
                  title={sub.subJudul}
                  fontSize={fontSize}
                />
              </div>
            )}

            {/* Fiqih / Penjelasan Text */}
            <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed space-y-2 pt-1">
              <p>{sub.penjelasan}</p>
            </div>

            {/* Hadits Terkait */}
            {sub.haditsTerkait && sub.haditsTerkait.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-1">
                <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block">
                  Riwayat & Rujukan:
                </span>
                {sub.haditsTerkait.map((h, i) => (
                  <p key={i} className="italic">• {h}</p>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Chapter Bottom Navigation (Prev / Next) */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
        {prevBab ? (
          <Link
            href={`/kitab?bab=${prevBab.id}`}
            className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-left group"
          >
            <span className="text-[11px] text-muted-foreground font-medium block">
              ← Bab Sebelumnya
            </span>
            <span className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 mt-0.5">
              {prevBab.nomor}: {prevBab.judul}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextBab ? (
          <Link
            href={`/kitab?bab=${nextBab.id}`}
            className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-muted/30 transition-all text-right group"
          >
            <span className="text-[11px] text-muted-foreground font-medium block">
              Bab Selanjutnya →
            </span>
            <span className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1 mt-0.5">
              {nextBab.nomor}: {nextBab.judul}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Quick Jump Dropdown */}
      <div className="pt-4 text-center">
        <label htmlFor="bab-select" className="text-xs text-muted-foreground font-medium block mb-2">
          Pindah Cepat ke Bab Lain:
        </label>
        <select
          id="bab-select"
          defaultValue={currentBab.id}
          onChange={(e) => {
            router.push(`/kitab?bab=${e.target.value}`);
          }}
          className="px-4 py-2 rounded-xl bg-card border border-border text-xs sm:text-sm text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs max-w-xs"
        >
          {allBab.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nomor}: {b.judul}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
