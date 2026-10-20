export type TimingStatus = "sangat-dianjurkan" | "baik" | "makruh" | "terlarang";

export interface DaySlotDetail {
  status: TimingStatus;
  label: string;
  alasan: string;
  hikmah: string;
  doaIdRecommended?: string;
}

export interface CalendarDayInfo {
  date: Date;
  isoDate: string; // "YYYY-MM-DD"
  dayOfWeek: number; // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
  dayName: string; // "Minggu", "Senin", dll.
  gregorianDay: number;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  hijriYear: number;
  hijriFormatted: string; // e.g. "13 Jumadil Ula 1448 H"
  isToday: boolean;
  isCurrentMonth: boolean;
  isRamadhan: boolean;
  isHaid: boolean;
  isPurnama: boolean;
  isAwalBulan: boolean;
  isAkhirBulan: boolean;
  malamSlot: DaySlotDetail;
  siangSlot: DaySlotDetail;
  primaryStatus: TimingStatus;
  primaryBadge: {
    label: string;
    variant: "emerald" | "blue" | "amber" | "red";
    icon: string;
  };
}

export interface HaidPeriodConfig {
  startDate: string; // "YYYY-MM-DD"
  durationDays: number; // default: 7
  active?: boolean;
}

export type ViewMode = "calendar" | "agenda7" | "kitab";

export interface NextRecommendedTiming {
  targetDate: Date;
  slot: "malam" | "siang";
  title: string;
  countdownText: string;
  fadhilah: string;
  hijriFormatted: string;
}
