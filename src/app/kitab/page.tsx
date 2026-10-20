import type { Metadata } from "next";
import Link from "next/link";
import { getAllBab, getBabById } from "@/lib/kitab-data";
import { ReaderClient } from "./reader-client";

interface KitabPageProps {
  searchParams: Promise<{
    bab?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: KitabPageProps): Promise<Metadata> {
  const { bab } = await searchParams;
  if (bab) {
    const babData = getBabById(Number(bab));
    if (babData) {
      return {
        title: `${babData.nomor}: ${babData.judul} — Qurrotul Uyun`,
        description: babData.deskripsiRingkas,
      };
    }
  }

  return {
    title: "Daftar 20 Bab Kitab Qurrotul Uyun — Panduan Lengkap",
    description: "Daftar lengkap 20 bab syarah Kitab Qurrotul Uyun seputar fiqih pernikahan, adab jima', hak dan kewajiban suami istri.",
  };
}

export default async function KitabPage({ searchParams }: KitabPageProps) {
  const { bab } = await searchParams;
  const allBab = getAllBab();

  // If specific chapter is requested, render the full reader
  if (bab) {
    const babId = Number(bab);
    const currentBab = getBabById(babId);

    if (currentBab) {
      const prevBab = getBabById(babId - 1);
      const nextBab = getBabById(babId + 1);

      return (
        <ReaderClient
          currentBab={currentBab}
          prevBab={prevBab}
          nextBab={nextBab}
          allBab={allBab}
        />
      );
    }
  }

  // Otherwise, render Table of Contents (Daftar 20 Bab)
  return (
    <div className="container mx-auto px-4 max-w-5xl py-8 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8 space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <span>Kitab Syarah Nadzam Ibni Yamun</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Daftar 20 Bab Kitab Qurrotul Uyun
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Pilihlah bab yang ingin Anda pelajari. Dilengkapi dengan teks Nadzam/hadits berbahasa Arab, transliterasi Latin, terjemahan Indonesia, serta ulasan fiqih praktis.
        </p>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allBab.map((b) => (
          <Link
            key={b.id}
            href={`/kitab?bab=${b.id}`}
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span className="font-mono font-bold text-primary px-2.5 py-0.5 rounded-md bg-primary/10">
                  {b.nomor}
                </span>
                <span className="capitalize text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted">
                  {b.kategori}
                </span>
              </div>
              <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {b.judul}
              </h2>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                {b.deskripsiRingkas}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-medium text-primary">
              <span className="text-muted-foreground text-[11px]">
                {b.konten.length} Pasal Pembahasan
              </span>
              <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Buka Bab</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
