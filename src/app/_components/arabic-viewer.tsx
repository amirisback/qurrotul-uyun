"use client";

import { CopyShareButtons } from "./copy-share-buttons";

interface ArabicViewerProps {
  arab: string;
  latin?: string;
  arti?: string;
  title: string;
  fontSize?: number;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
  sanadOrFaedah?: string;
}

export function ArabicViewer({
  arab,
  latin,
  arti,
  title,
  fontSize = 26,
  isFavorited,
  onToggleFavorite,
  sanadOrFaedah,
}: ArabicViewerProps) {
  const fullTextToCopy = `${title}\n\n${arab}\n\n${latin ? `Latin: ${latin}\n\n` : ""}Arti: ${arti || ""}${sanadOrFaedah ? `\n\nSumber: ${sanadOrFaedah}` : ""}`;

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-xs space-y-4 transition-all hover:border-primary/40">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-3">
        <h4 className="font-semibold text-foreground text-sm md:text-base leading-snug">
          {title}
        </h4>
        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`p-1.5 rounded-lg border transition-colors ${
                isFavorited
                  ? "bg-accent/15 text-accent border-accent/40"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground border-border/80"
              }`}
              title={isFavorited ? "Hapus dari Favorit" : "Simpan ke Favorit"}
              aria-label="Toggle Favorit"
            >
              <svg
                className="w-4 h-4"
                fill={isFavorited ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          )}
          <CopyShareButtons title={title} textToCopy={fullTextToCopy} />
        </div>
      </div>

      {/* Arabic Block */}
      <div className="py-2">
        <p
          className="font-arabic text-foreground font-normal tracking-wide text-right leading-loose select-all"
          style={{ fontSize: `${fontSize}px` }}
        >
          {arab}
        </p>
      </div>

      {/* Latin & Indonesian Meaning */}
      <div className="space-y-2 pt-2 border-t border-border/40 text-sm">
        {latin && (
          <p className="text-muted-foreground italic text-xs md:text-sm leading-relaxed">
            &ldquo;{latin}&rdquo;
          </p>
        )}
        {arti && (
          <p className="text-foreground/90 font-medium text-xs md:text-sm leading-relaxed">
            <span className="text-primary font-semibold">Artinya: </span>
            {arti}
          </p>
        )}
      </div>

      {/* Sanad / Faedah Note */}
      {sanadOrFaedah && (
        <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{sanadOrFaedah}</span>
        </div>
      )}
    </div>
  );
}
