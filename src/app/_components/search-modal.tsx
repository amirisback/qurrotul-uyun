"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { searchKitabAndDoa, type SearchResult } from "@/lib/kitab-data";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setQuery("");
    setResults([]);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) handleClose();
      } else if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 1) {
      const res = searchKitabAndDoa(val);
      setResults(res);
    } else {
      setResults([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-muted/40">
          <svg
            className="w-5 h-5 text-muted-foreground shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Cari bab, doa, adab malam pertama, jima'..."
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base focus:outline-none"
          />
          <button
            onClick={handleClose}
            className="px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-border rounded-md transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {query.trim().length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <p className="font-medium text-foreground">Ketik kata kunci untuk mencari</p>
              <p className="mt-1">Contoh: &ldquo;Malam Pertama&rdquo;, &ldquo;Waktu Jima&rdquo;, &ldquo;Doa Anak&rdquo;, &ldquo;Walimah&rdquo;</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <p className="font-medium text-foreground">Tidak ada hasil ditemukan</p>
              <p className="mt-1">Coba gunakan kata kunci lain seperti &ldquo;nikah&rdquo;, &ldquo;adab&rdquo;, atau &ldquo;hukum&rdquo;.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                Ditemukan ({results.length}) Hasil
              </p>
              {results.map((res) => (
                <Link
                  key={`${res.type}-${res.id}`}
                  href={res.url}
                  onClick={handleClose}
                  className="block p-3 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-muted/40 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base">
                      {res.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        res.type === "bab"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {res.type === "bab" ? "Kitab" : "Doa"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                    {res.snippet}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-muted/30 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Tekan ESC untuk menutup</span>
          <span>Qurrotul Uyun • 20 Bab & 13 Doa</span>
        </div>
      </div>
    </div>
  );
}
