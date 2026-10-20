"use client";

import { useState } from "react";
import type { DoaItem } from "@/types/qurrotul-uyun";
import { ArabicViewer } from "../_components/arabic-viewer";
import { useFavorites } from "@/lib/use-favorites";

interface DoaClientProps {
  initialDoas: DoaItem[];
}

export function DoaClient({ initialDoas }: DoaClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const { isDoaFavorited, toggleFavoriteDoa } = useFavorites();

  const categories = [
    { id: "all", label: "Semua Doa" },
    { id: "jodoh", label: "Jodoh" },
    { id: "akad", label: "Akad Nikah" },
    { id: "malam-pertama", label: "Malam Pertama" },
    { id: "jima", label: "Jima' / Intim" },
    { id: "kehamilan", label: "Kehamilan & Keturunan" },
    { id: "keluarga", label: "Keluarga Sakinah" },
  ];

  const filteredDoas = initialDoas.filter((doa) => {
    const matchCategory =
      selectedCategory === "all" || doa.kategori === selectedCategory;
    const matchSearch =
      searchFilter.trim() === "" ||
      doa.judul.toLowerCase().includes(searchFilter.toLowerCase()) ||
      doa.arti.toLowerCase().includes(searchFilter.toLowerCase()) ||
      doa.faedah.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8 space-y-3">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          Kumpulan Doa Mustajab
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Doa Pernikahan & Rumah Tangga
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Untaian doa pilihan dari Al-Qur&apos;an, Sunnah Rasulullah SAW, dan amalan para ulama salaf untuk mendatangkan keberkahan ikatan perkawinan.
        </p>

        {/* Quick Search in Prayers */}
        <div className="pt-2">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari doa (misal: 'anak', 'malam pertama', 'jima')..."
            className="w-full sm:max-w-md px-4 py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs"
          />
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Prayers List */}
      <div className="space-y-5">
        {filteredDoas.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground rounded-2xl border border-dashed border-border p-8">
            <p className="text-base font-semibold text-foreground">
              Tidak ada doa yang cocok
            </p>
            <p className="text-xs mt-1">
              Coba ganti kata kunci pencarian atau pilih kategori lain.
            </p>
          </div>
        ) : (
          filteredDoas.map((doa) => (
            <article key={doa.id} id={doa.id} className="scroll-mt-20">
              <ArabicViewer
                arab={doa.arab}
                latin={doa.latin}
                arti={doa.arti}
                title={doa.judul}
                isFavorited={isDoaFavorited(doa.id)}
                onToggleFavorite={() => toggleFavoriteDoa(doa.id)}
                sanadOrFaedah={`${doa.riwayat} • ${doa.faedah}`}
              />
            </article>
          ))
        )}
      </div>
    </div>
  );
}
