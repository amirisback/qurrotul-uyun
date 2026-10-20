"use client";

import { useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/lib/use-favorites";
import { getAllBab, getAllDoa } from "@/lib/kitab-data";

export function FavoritClient() {
  const {
    favoriteBabs,
    favoriteDoas,
    toggleFavoriteBab,
    toggleFavoriteDoa,
    isLoaded,
  } = useFavorites();

  const [activeTab, setActiveTab] = useState<"all" | "bab" | "doa">("all");

  const allBab = getAllBab();
  const allDoa = getAllDoa();

  const savedBabs = allBab.filter((b) => favoriteBabs.includes(b.id));
  const savedDoas = allDoa.filter((d) => favoriteDoas.includes(d.id));

  const totalCount = savedBabs.length + savedDoas.length;

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 max-w-4xl py-16 text-center text-muted-foreground text-sm">
        Memuat daftar favorit tersimpan...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8 space-y-3">
        <span className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
          ⭐ Tersimpan di Perangkat Anda
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Favorit & Bookmark Anda
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Kumpulan bab kitab dan doa pernikahan yang telah Anda tandai untuk dibaca kembali secara cepat tanpa perlu mencari ulang.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Semua ({totalCount})
        </button>
        <button
          onClick={() => setActiveTab("bab")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "bab"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Bab Kitab ({savedBabs.length})
        </button>
        <button
          onClick={() => setActiveTab("doa")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "doa"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Doa ({savedDoas.length})
        </button>
      </div>

      {/* Content */}
      {totalCount === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-2xl">
            ⭐
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-foreground text-base">
              Belum Ada Item yang Ditandai
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              Saat membaca bab atau doa, tekan ikon bintang/bookmark untuk menyimpannya ke halaman ini.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/kitab"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Jelajahi 20 Bab
            </Link>
            <Link
              href="/doa"
              className="px-4 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-semibold hover:bg-muted transition-colors"
            >
              Lihat Kumpulan Doa
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bab Section */}
          {(activeTab === "all" || activeTab === "bab") && savedBabs.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">
                Bab Kitab Tersimpan ({savedBabs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedBabs.map((bab) => (
                  <div
                    key={bab.id}
                    className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span className="font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                          {bab.nomor}
                        </span>
                        <button
                          onClick={() => toggleFavoriteBab(bab.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                          title="Hapus dari Favorit"
                        >
                          Hapus
                        </button>
                      </div>
                      <h3 className="font-bold text-foreground text-base line-clamp-1">
                        {bab.judul}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {bab.deskripsiRingkas}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/40">
                      <Link
                        href={`/kitab?bab=${bab.id}`}
                        className="text-xs font-semibold text-primary hover:underline flex items-center justify-between"
                      >
                        <span>Baca Bab Ini</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doa Section */}
          {(activeTab === "all" || activeTab === "doa") && savedDoas.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">
                Doa Pernikahan Tersimpan ({savedDoas.length})
              </h2>
              <div className="space-y-4">
                {savedDoas.map((doa) => (
                  <div
                    key={doa.id}
                    className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground text-base">
                        {doa.judul}
                      </h3>
                      <button
                        onClick={() => toggleFavoriteDoa(doa.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                        title="Hapus dari Favorit"
                      >
                        Hapus
                      </button>
                    </div>
                    <p className="font-arabic text-xl text-foreground text-right leading-loose">
                      {doa.arab}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      &ldquo;{doa.latin}&rdquo;
                    </p>
                    <p className="text-xs sm:text-sm text-foreground/90">
                      <span className="font-semibold text-primary">Arti: </span>
                      {doa.arti}
                    </p>
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-muted-foreground">
                        {doa.riwayat}
                      </span>
                      <Link
                        href={`/doa#${doa.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        Buka di Kumpulan Doa →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
