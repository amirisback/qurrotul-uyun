"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export interface ThemeSwitcherLabels {
  light: string;
  dark: string;
  system: string;
}

export interface ThemeSwitcherProps {
  labels?: ThemeSwitcherLabels;
  variant?: "compact" | "drawer" | "full";
  className?: string;
}

const emptySubscribe = () => () => {};

function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function SunIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MonitorIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

export function ThemeSwitcher({
  labels,
  variant = "compact",
  className = "",
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  const lightLabel = labels?.light || "Terang";
  const darkLabel = labels?.dark || "Gelap";
  const systemLabel = labels?.system || "Sistem";

  const isDrawer = variant === "drawer" || variant === "full";

  if (!isMounted) {
    if (isDrawer) {
      return (
        <div
          role="status"
          aria-label="Memuat preferensi tema..."
          className={`grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-muted/50 border border-border/80 h-[52px] w-full animate-pulse ${className}`}
        >
          <div className="rounded-xl bg-muted/80 h-full" />
          <div className="rounded-xl bg-muted/80 h-full" />
          <div className="rounded-xl bg-muted/80 h-full" />
        </div>
      );
    }

    return (
      <div
        role="status"
        aria-label="Memuat preferensi tema..."
        className={`inline-flex items-center gap-0.5 p-1 bg-muted/70 dark:bg-muted/40 rounded-full border border-border/80 shadow-xs h-[34px] w-[138px] sm:w-[190px] animate-pulse ${className}`}
      />
    );
  }

  const currentTheme = theme || "system";

  const options = [
    {
      value: "light" as const,
      label: lightLabel,
      Icon: SunIcon,
      activeIconColor: "text-amber-500 dark:text-amber-400",
    },
    {
      value: "dark" as const,
      label: darkLabel,
      Icon: MoonIcon,
      activeIconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      value: "system" as const,
      label: systemLabel,
      Icon: MonitorIcon,
      activeIconColor: "text-primary",
    },
  ];

  if (isDrawer) {
    return (
      <div
        role="radiogroup"
        aria-label="Pilih tema tampilan"
        className={`grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-muted/50 border border-border/80 ${className}`}
      >
        {options.map((opt) => {
          const isActive = currentTheme === opt.value;
          const Icon = opt.Icon;

          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              aria-label={opt.label}
              title={opt.label}
              onClick={() => setTheme(opt.value)}
              className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs transition-all duration-200 min-h-[48px] cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-95 ${
                isActive
                  ? "bg-card text-foreground shadow-xs font-semibold ring-1 ring-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? opt.activeIconColor : "text-muted-foreground"
                }`}
              />
              <span className="font-medium text-[11px] leading-tight">{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Pilih tema tampilan"
      className={`inline-flex items-center gap-0.5 p-1 bg-muted/70 dark:bg-muted/40 rounded-full border border-border/80 shadow-xs ${className}`}
    >
      {options.map((opt) => {
        const isActive = currentTheme === opt.value;
        const Icon = opt.Icon;

        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setTheme(opt.value)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden ${
              isActive
                ? "bg-card text-foreground shadow-xs font-semibold scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                isActive ? opt.activeIconColor : "text-muted-foreground"
              }`}
            />
            <span className="hidden sm:inline font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
