"use client";

interface FontSizeControlProps {
  fontSize: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onReset: () => void;
}

export function FontSizeControl({
  fontSize,
  onIncrease,
  onDecrease,
  onReset,
}: FontSizeControlProps) {
  return (
    <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-2.5 py-1 text-xs shadow-xs">
      <span className="text-muted-foreground font-medium mr-1 hidden sm:inline">
        Ukuran Arab:
      </span>
      <button
        onClick={onDecrease}
        disabled={fontSize <= 20}
        className="px-2 py-0.5 rounded-md hover:bg-muted font-bold disabled:opacity-40 transition-colors"
        title="Perkecil Font"
        aria-label="Perkecil Font"
      >
        A-
      </button>
      <button
        onClick={onReset}
        className="px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground hover:text-foreground"
        title="Reset Ukuran"
      >
        {fontSize}px
      </button>
      <button
        onClick={onIncrease}
        disabled={fontSize >= 38}
        className="px-2 py-0.5 rounded-md hover:bg-muted font-bold disabled:opacity-40 transition-colors"
        title="Perbesar Font"
        aria-label="Perbesar Font"
      >
        A+
      </button>
    </div>
  );
}
