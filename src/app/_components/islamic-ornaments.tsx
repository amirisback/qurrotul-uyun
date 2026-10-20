import React from "react";

// ============================================================================
// 1. ISLAMIC BACKGROUND PATTERN (Ambient 8-point geometric lattice)
// ============================================================================
export interface IslamicBackgroundPatternProps {
  className?: string;
  opacityClassName?: string;
}

export function IslamicBackgroundPattern({
  className = "",
  opacityClassName = "opacity-[0.035] dark:opacity-[0.055]",
}: IslamicBackgroundPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
    >
      <svg
        className={`w-full h-full text-foreground ${opacityClassName}`}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="islamic-ambient-lattice"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Seamless 45-degree diagonal strapping */}
            <path
              d="
                M0 20 L20 0
                M0 60 L60 0
                M20 80 L80 20
                M60 80 L80 60
                M0 60 L20 80
                M0 20 L60 80
                M20 0 L80 60
                M60 0 L80 20
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />

            {/* Central 8-point Khatam star (at 40,40) */}
            <rect
              x="26"
              y="26"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <polygon
              points="40,20.2 59.8,40 40,59.8 20.2,40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <circle
              cx="40"
              cy="40"
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeDasharray="1.5 1.5"
            />
            <circle cx="40" cy="40" r="2" fill="currentColor" />

            {/* Corner star sections (wrapping [0,80] boundary) */}
            {/* Top-Left */}
            <rect x="0" y="0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <polygon points="0,0 19.8,0 0,19.8" fill="none" stroke="currentColor" strokeWidth="0.8" />
            {/* Top-Right */}
            <rect x="66" y="0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <polygon points="80,0 60.2,0 80,19.8" fill="none" stroke="currentColor" strokeWidth="0.8" />
            {/* Bottom-Left */}
            <rect x="0" y="66" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <polygon points="0,80 19.8,80 0,60.2" fill="none" stroke="currentColor" strokeWidth="0.8" />
            {/* Bottom-Right */}
            <rect x="66" y="66" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <polygon points="80,80 60.2,80 80,60.2" fill="none" stroke="currentColor" strokeWidth="0.8" />

            {/* Interlocking rosettes and node beads */}
            <circle cx="0" cy="0" r="2.5" fill="currentColor" />
            <circle cx="80" cy="0" r="2.5" fill="currentColor" />
            <circle cx="0" cy="80" r="2.5" fill="currentColor" />
            <circle cx="80" cy="80" r="2.5" fill="currentColor" />
            <circle cx="40" cy="0" r="1.5" fill="currentColor" />
            <circle cx="0" cy="40" r="1.5" fill="currentColor" />
            <circle cx="80" cy="40" r="1.5" fill="currentColor" />
            <circle cx="40" cy="80" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-ambient-lattice)" />
      </svg>
    </div>
  );
}

// ============================================================================
// 2. RUB EL HIZB (8-point Islamic star motif)
// ============================================================================
export interface RubElHizbProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | number;
  strokeWidth?: number;
}

const rubElHizbSizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export function RubElHizb({
  className = "",
  size = "md",
  strokeWidth = 1.5,
}: RubElHizbProps) {
  const isNamedSize = typeof size === "string";
  const hasExplicitWidth = className.includes("w-");
  const sizeClasses = isNamedSize && !hasExplicitWidth ? rubElHizbSizes[size] : "";
  const customDimensions = typeof size === "number" ? { width: size, height: size } : undefined;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={`inline-block shrink-0 align-middle ${sizeClasses} ${className}`}
      style={customDimensions}
    >
      {/* Upright square */}
      <rect x="4.5" y="4.5" width="15" height="15" rx="0.5" />
      {/* 45-degree rotated square (completing 8-pointed star) */}
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="15"
        rx="0.5"
        transform="rotate(45 12 12)"
      />
      {/* Concentric inner medallion ring */}
      <circle cx="12" cy="12" r="4.2" strokeWidth={strokeWidth * 0.8} />
      {/* Central focal node */}
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ============================================================================
// 3. RAMADAN HILAL (Crescent moon with 8-point star and ambient glow)
// ============================================================================
export interface RamadanHilalProps {
  className?: string;
  size?: number | string;
  glow?: boolean;
}

export function RamadanHilal({
  className = "",
  size,
  glow = true,
}: RamadanHilalProps) {
  const customStyle =
    size !== undefined
      ? typeof size === "number"
        ? { width: size, height: size }
        : { width: size, height: size }
      : undefined;

  return (
    <div
      aria-hidden="true"
      className={`relative inline-block pointer-events-none select-none ${className}`}
      style={customStyle}
    >
      {/* Ambient background glow */}
      {glow && (
        <div
          className="absolute -inset-4 rounded-full bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-transparent blur-2xl -z-10 dark:from-amber-400/15 dark:via-emerald-500/10"
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="hilal-crescent-grad" x1="15%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="var(--color-gold-warm, #d97706)" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="var(--color-emerald-deep, #065f46)" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="hilal-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Crescent Moon Path */}
        <path
          d="M62 12 C35 18 20 42 24 68 C27 82 40 92 56 94 C64 95 72 92 78 88 C52 86 38 65 42 42 C45 27 54 17 62 12 Z"
          fill="url(#hilal-crescent-grad)"
          stroke="var(--color-gold-warm, #d97706)"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />

        {/* Delicate inner crescent highlight rim */}
        <path
          d="M58 17 C38 23 28 44 31 65 C34 77 44 86 58 88 C40 82 32 66 35 46 C37 32 46 22 58 17 Z"
          fill="rgba(255, 255, 255, 0.25)"
          className="dark:fill-amber-200/20"
        />

        {/* 8-Point Rub el Hizb Star cradled inside crescent */}
        <g transform="translate(62, 42)">
          {/* Outer star tips */}
          <polygon
            points="0,-12 3.2,-3.5 12,0 3.2,3.5 0,12 -3.2,3.5 -12,0 -3.2,-3.5"
            fill="url(#hilal-star-grad)"
          />
          {/* Rotated 45-deg diamond tips */}
          <polygon
            points="0,-8.5 2.5,-2.5 8.5,0 2.5,2.5 0,8.5 -2.5,2.5 -8.5,0 -2.5,-2.5"
            transform="rotate(45)"
            fill="url(#hilal-star-grad)"
            opacity="0.9"
          />
          {/* Star center jewel */}
          <circle cx="0" cy="0" r="2.2" fill="#fff" opacity="0.9" />
          <circle cx="0" cy="0" r="1" fill="#d97706" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 4. RAMADAN FANOUS (Traditional lantern with cord, tiered dome, and tassel)
// ============================================================================
export interface RamadanFanousProps {
  className?: string;
  size?: number | string;
  cordLength?: number;
  glow?: boolean;
}

export function RamadanFanous({
  className = "",
  size,
  cordLength = 16,
  glow = true,
}: RamadanFanousProps) {
  const customStyle =
    size !== undefined
      ? typeof size === "number"
        ? { width: size * 0.67, height: size }
        : { width: size, height: size }
      : undefined;

  const totalHeight = cordLength + 106;
  const viewBox = `0 0 80 ${totalHeight}`;
  const yOffset = cordLength;

  return (
    <div
      aria-hidden="true"
      className={`relative inline-block pointer-events-none select-none ${className}`}
      style={customStyle}
    >
      {/* Ambient warm lantern glow */}
      {glow && (
        <div
          className="absolute inset-x-2 rounded-full bg-amber-500/20 blur-xl -z-10 dark:bg-amber-400/15"
          style={{ top: `${(yOffset / totalHeight) * 100}%`, height: "65%" }}
          aria-hidden="true"
        />
      )}
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-gold-warm"
      >
        <defs>
          <linearGradient id="fanous-glow-grad" x1="50%" y1="30%" x2="50%" y2="85%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 1. Hanging cord & suspension ring */}
        <line
          x1="40"
          y1="0"
          x2="40"
          y2={yOffset}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <circle
          cx="40"
          cy={yOffset + 4}
          r="4"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />

        {/* 2. Top finial & tiered dome */}
        <path
          d={`M40 ${yOffset + 8} L38 ${yOffset + 11} H42 Z`}
          fill="currentColor"
        />
        {/* Upper dome cupola */}
        <path
          d={`M33 ${yOffset + 14} C33 ${yOffset + 11} 47 ${yOffset + 11} 47 ${yOffset + 14} L50 ${yOffset + 20} H30 Z`}
          fill="currentColor"
          fillOpacity="0.25"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        {/* Dome eaves collar */}
        <path
          d={`M25 ${yOffset + 20} H55 L57 ${yOffset + 24} H23 Z`}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* 3. Glass body chamber with warm glow */}
        <polygon
          points={`26,${yOffset + 24} 54,${yOffset + 24} 60,${yOffset + 48} 52,${yOffset + 72} 28,${yOffset + 72} 20,${yOffset + 48}`}
          fill="url(#fanous-glow-grad)"
        />
        <polygon
          points={`26,${yOffset + 24} 54,${yOffset + 24} 60,${yOffset + 48} 52,${yOffset + 72} 28,${yOffset + 72} 20,${yOffset + 48}`}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Fretwork / arabesque geometric window grill */}
        <line
          x1="40"
          y1={yOffset + 24}
          x2="40"
          y2={yOffset + 72}
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.7"
        />
        <line
          x1="26"
          y1={yOffset + 24}
          x2="52"
          y2={yOffset + 72}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />
        <line
          x1="54"
          y1={yOffset + 24}
          x2="28"
          y2={yOffset + 72}
          stroke="currentColor"
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />

        {/* Center Diamond Jewel Lattice */}
        <polygon
          points={`40,${yOffset + 36} 48,${yOffset + 48} 40,${yOffset + 60} 32,${yOffset + 48}`}
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeOpacity="0.8"
        />
        {/* Inner candle flame */}
        <path
          d={`M40 ${yOffset + 46} C38.5 ${yOffset + 49} 37.5 ${yOffset + 52} 38.5 ${yOffset + 54} C39.2 ${yOffset + 55.5} 40.8 ${yOffset + 55.5} 41.5 ${yOffset + 54} C42.5 ${yOffset + 52} 41.5 ${yOffset + 49} 40 ${yOffset + 46} Z`}
          fill="#fff"
        />
        <circle cx="40" cy={yOffset + 52} r="1" fill="#d97706" />

        {/* 4. Tiered base / pedestal */}
        <rect
          x="26"
          y={yOffset + 72}
          width="28"
          height="4"
          fill="currentColor"
          fillOpacity="0.3"
          stroke="currentColor"
          strokeWidth="1"
        />
        <polygon
          points={`24,${yOffset + 76} 56,${yOffset + 76} 59,${yOffset + 84} 21,${yOffset + 84}`}
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        {/* Scalloped ornamental feet */}
        <path
          d={`M21 ${yOffset + 84} Q26 ${yOffset + 88} 31 ${yOffset + 84} Q40 ${yOffset + 88} 49 ${yOffset + 84} Q54 ${yOffset + 88} 59 ${yOffset + 84}`}
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />

        {/* 5. Hanging Tassel */}
        <circle cx="40" cy={yOffset + 89} r="1.8" fill="currentColor" />
        <path
          d={`M38 ${yOffset + 91} L36 ${yOffset + 102} H44 L42 ${yOffset + 91} Z`}
          fill="currentColor"
          fillOpacity="0.4"
          stroke="currentColor"
          strokeWidth="1"
        />
        {/* Fringe tips */}
        <line x1="37" y1={yOffset + 102} x2="36" y2={yOffset + 106} stroke="currentColor" strokeWidth="1" />
        <line x1="40" y1={yOffset + 102} x2="40" y2={yOffset + 106} stroke="currentColor" strokeWidth="1" />
        <line x1="43" y1={yOffset + 102} x2="44" y2={yOffset + 106} stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ============================================================================
// 5. ISLAMIC DIVIDER (Section divider with Rub el Hizb and tapered flourish)
// ============================================================================
export interface IslamicDividerProps {
  className?: string;
  variant?: "default" | "gold" | "emerald";
}

export function IslamicDivider({
  className = "",
  variant = "default",
}: IslamicDividerProps) {
  const colorClass = {
    default: "text-border",
    gold: "text-amber-500/60 dark:text-amber-400/50",
    emerald: "text-primary/60 dark:text-primary/50",
  }[variant];

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center w-full max-w-xs sm:max-w-md mx-auto my-6 sm:my-8 pointer-events-none select-none ${className}`}
    >
      <svg
        viewBox="0 0 400 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-8 ${colorClass}`}
      >
        <defs>
          <linearGradient id="div-fade-left" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="div-fade-right" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="60%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left tapering line */}
        <line
          x1="182"
          y1="16"
          x2="10"
          y2="16"
          stroke="url(#div-fade-left)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Right tapering line */}
        <line
          x1="218"
          y1="16"
          x2="390"
          y2="16"
          stroke="url(#div-fade-right)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Flanking ornamental arabesque scroll curls */}
        <path
          d="M186 16 C176 11 160 11 146 16"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeOpacity="0.7"
          fill="none"
        />
        <path
          d="M214 16 C224 11 240 11 254 16"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeOpacity="0.7"
          fill="none"
        />

        {/* Symmetrical diamond beads */}
        {/* Inner diamonds */}
        <polygon points="174,16 177,13 180,16 177,19" fill="currentColor" />
        <polygon points="220,16 223,13 226,16 223,19" fill="currentColor" />

        {/* Mid diamonds */}
        <polygon points="144,16 146.5,13.5 149,16 146.5,18.5" fill="currentColor" opacity="0.7" />
        <polygon points="251,16 253.5,13.5 256,16 253.5,18.5" fill="currentColor" opacity="0.7" />

        {/* Outer tiny dot beads */}
        <circle cx="120" cy="16" r="1.5" fill="currentColor" opacity="0.5" />
        <circle cx="280" cy="16" r="1.5" fill="currentColor" opacity="0.5" />

        {/* Centerpiece: Rub el Hizb 8-point Rosette */}
        <g transform="translate(200, 16)">
          {/* Outer upright square */}
          <rect
            x="-6.5"
            y="-6.5"
            width="13"
            height="13"
            rx="0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          {/* 45-degree diamond */}
          <rect
            x="-6.5"
            y="-6.5"
            width="13"
            height="13"
            rx="0.5"
            transform="rotate(45)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          {/* Inner ring */}
          <circle cx="0" cy="0" r="3.2" fill="none" stroke="currentColor" strokeWidth="0.8" />
          {/* Core dot */}
          <circle cx="0" cy="0" r="1.2" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 6. TAZHIB CORNER (Classical manuscript illumination corner bracket)
// ============================================================================
export interface TazhibCornerProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number | string;
  className?: string;
}

const positionClasses = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0 scale-x-[-1]",
  "bottom-left": "bottom-0 left-0 scale-y-[-1]",
  "bottom-right": "bottom-0 right-0 scale-[-1]",
};

export function TazhibCorner({
  position = "top-left",
  size = 48,
  className = "",
}: TazhibCornerProps) {
  const dimensionProps =
    typeof size === "number"
      ? { width: size, height: size }
      : { width: size, height: size };

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none z-10 ${positionClasses[position]} ${className}`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-current"
        {...dimensionProps}
      >
        {/* Outer L-bracket borders */}
        <path
          d="M4 44 V6 C4 4.9 4.9 4 6 4 H44"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Inner parallel guide line */}
        <path
          d="M8 36 V10 C8 8.9 8.9 8 10 8 H36"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />

        {/* Spearhead / Palmette Finials at bracket tips */}
        <polygon points="44,4 40,2 41,4 40,6" fill="currentColor" />
        <polygon points="4,44 2,40 4,41 6,40" fill="currentColor" />

        {/* Interlacing arabesque leaf curve in the corner nook */}
        <path
          d="M8 20 C14 20 20 14 20 8"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.8"
          fill="none"
        />
        <path
          d="M14 26 C22 26 26 22 26 14"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeDasharray="1.5 1.5"
          fill="none"
        />

        {/* Corner rosette jewel at (10, 10) */}
        <rect
          x="8.5"
          y="8.5"
          width="3.5"
          height="3.5"
          transform="rotate(45 10.25 10.25)"
          fill="currentColor"
        />
        {/* Accent dot beads on curves */}
        <circle cx="20" cy="8" r="1" fill="currentColor" />
        <circle cx="8" cy="20" r="1" fill="currentColor" />
        <circle cx="16" cy="16" r="1.2" fill="currentColor" />
      </svg>
    </div>
  );
}

// ============================================================================
// 7. RAMADAN PILL BADGE (Festive Ramadan badge with crescent icon)
// ============================================================================
export interface RamadanPillBadgeProps {
  className?: string;
  text?: string;
  subtext?: string;
  children?: React.ReactNode;
}

export function RamadanPillBadge({
  className = "",
  text = "Bulan Suci Ramadan",
  subtext = "Syahrul Mubarak",
  children,
}: RamadanPillBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-emerald-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold tracking-wide shadow-xs backdrop-blur-xs transition-all hover:border-amber-500/50 ${className}`}
    >
      {/* Miniature gold crescent & star */}
      <svg
        aria-hidden="true"
        className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.32 0 4.46-.8 6.16-2.14-5.32-.44-9.5-4.9-9.5-10.36 0-3.64 1.87-6.85 4.69-8.72C12.87 2.27 12.44 2 12 2z" />
        <circle cx="18" cy="8" r="1.5" />
      </svg>

      {children ? (
        children
      ) : (
        <>
          <span>{text}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-amber-700/90 dark:text-amber-300/90 font-medium">
            {subtext}
          </span>
        </>
      )}
    </div>
  );
}
