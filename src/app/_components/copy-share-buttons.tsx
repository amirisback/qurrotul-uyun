"use client";

import { useState } from "react";

interface CopyShareButtonsProps {
  title: string;
  textToCopy: string;
  shareUrl?: string;
  shareTitle?: string;
}

export function CopyShareButtons({
  title,
  textToCopy,
  shareUrl,
  shareTitle,
}: CopyShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle || title,
          text: textToCopy,
          url,
        });
      } catch {
        // Share cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleCopy}
        className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition-all ${
          copied
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border-border/80"
        }`}
        title="Salin Teks"
        aria-label="Salin Teks"
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span>Tersalin!</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Salin</span>
          </>
        )}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-border/80 bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        title="Bagikan"
        aria-label="Bagikan"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>Bagikan</span>
      </button>
    </div>
  );
}
