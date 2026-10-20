/**
 * TypeScript Data Contracts for Islamic Cycle Tracker (TASK-002)
 * Mazhab Syafi'i Fiqh Standard & Flo-Inspired Reproduction Logging
 */

export type FlowIntensity = "none" | "spotting" | "light" | "medium" | "heavy";

export type FiqihBloodColor =
  | "aswad"   // Hitam pekat (Al-Qawiy)
  | "ahmar"   // Merah segar (Al-Mutawassith)
  | "ashqar"  // Merah kekuningan
  | "kudrah"  // Keruh kecoklatan
  | "shufrah" // Kekuningan
  | "naqa";   // Putih bersih / Jufuf

export type SyariState =
  | "haid"              // Darah aktif dalam batas 15 hari -> Haram shalat, puasa, jima'
  | "suci_wajib_mandi"  // Darah tuntas (jufuf/qashshah baidha') tp belum mandi junub
  | "suci_sempurna"     // Suci & sdh mandi wajib -> Wajib shalat/puasa, halal jima'
  | "istihadlah";       // Darah abnormal (<24 jam atau >15 hari) -> Wajib shalat/puasa

export type PhysicalSymptom =
  | "kram_perut"
  | "nyeri_payudara"
  | "kembung"
  | "sakit_kepala"
  | "kelelahan"
  | "jerawat"
  | "nyeri_punggung";

export type MoodType =
  | "bahagia"
  | "tenang"
  | "cemas"
  | "sensitif"
  | "sedih"
  | "marah";

export type DischargeType =
  | "kering"
  | "lengket"
  | "creamy"
  | "egg_white" // Subur puncak
  | "keruh";

export type CessationSign = "qashshah_baidha" | "jufuf";

export interface IntimateActivityLog {
  performed: boolean;
  usedProtection?: boolean;
  recitedDoa?: boolean;
}

export interface DailyCycleLog {
  isoDate: string; // "YYYY-MM-DD"
  flow: FlowIntensity;
  fiqihColor?: FiqihBloodColor;
  isGhuslDone: boolean;
  cessationSign?: CessationSign | null;
  symptoms: PhysicalSymptom[];
  moods: MoodType[];
  discharge?: DischargeType;
  intimateActivity?: IntimateActivityLog;
  notes?: string;
  updatedAt: string;
}

export interface UserCycleProfile {
  lastPeriodStartDate: string; // "YYYY-MM-DD"
  averageCycleLength: number;  // Default 28, batas wajar 21-45
  averagePeriodDuration: number; // Default 7, batas fiqih 1-15
  lutealPhaseDays: number;     // Default 14
  isOnboardingCompleted: boolean;
}

export interface QadhaPuasaEntry {
  id: string;
  hijriYear: number;
  dateOwed: string; // "YYYY-MM-DD"
  isPaid: boolean;
  datePaid?: string | null;
}

export interface CycleStorageSchema {
  version: number; // schema version = 1
  profile: UserCycleProfile;
  logs: Record<string, DailyCycleLog>; // Key: "YYYY-MM-DD"
  qadhaEntries: QadhaPuasaEntry[];
}

export interface EvaluatedDayStatus {
  isoDate: string;
  cycleDayNumber: number; // Hari ke-X siklus
  syariStatus: SyariState;
  isPeriodDay: boolean;
  isPredictedPeriod: boolean;
  isFertileWindow: boolean;
  isOvulationDay: boolean;
  canPray: boolean;
  canFast: boolean;
  canJima: boolean;
  ghuslRequired: boolean;
  statusBadge: {
    label: string;
    description: string;
    variant: "rose" | "amber" | "sky" | "emerald";
    icon: string;
  };
}

export interface CyclePrediction {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  ovulationDate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
}

export interface BloodColorItem {
  id: FiqihBloodColor;
  name: string;
  arabic: string;
  description: string;
  hexLight: string;
  hexDark: string;
  borderColor: string;
}

export const FIQIH_BLOOD_COLORS: BloodColorItem[] = [
  {
    id: "aswad",
    name: "Aswad (Hitam)",
    arabic: "أَسْوَد",
    description: "Hitam pekat, kental, bau khas kuat (Al-Qawiy / Darah Terkuat)",
    hexLight: "#450a0a",
    hexDark: "#2d0606",
    borderColor: "#7f1d1d",
  },
  {
    id: "ahmar",
    name: "Ahmar (Merah)",
    arabic: "أَحْمَر",
    description: "Merah segar mengalir (Al-Mutawassith / Darah Sedang)",
    hexLight: "#b91c1c",
    hexDark: "#ef4444",
    borderColor: "#dc2626",
  },
  {
    id: "ashqar",
    name: "Ashqar (Pirang)",
    arabic: "أَشْقَر",
    description: "Merah kekuningan atau tembaga",
    hexLight: "#c2410c",
    hexDark: "#fb923c",
    borderColor: "#ea580c",
  },
  {
    id: "kudrah",
    name: "Kudrah (Keruh)",
    arabic: "كُدْرَة",
    description: "Keruh kecoklatan serupa air cucian daging",
    hexLight: "#78350f",
    hexDark: "#b45309",
    borderColor: "#92400e",
  },
  {
    id: "shufrah",
    name: "Shufrah (Kuning)",
    arabic: "صُفْرَة",
    description: "Cairan kekuningan seperti nanah encer",
    hexLight: "#a16207",
    hexDark: "#eab308",
    borderColor: "#ca8a04",
  },
  {
    id: "naqa",
    name: "Naqa' / Jufuf",
    arabic: "نَقَاء",
    description: "Putih bersih / kapas kering (Tanda Suci)",
    hexLight: "#f8fafc",
    hexDark: "#1e293b",
    borderColor: "#cbd5e1",
  },
];

export const PHYSICAL_SYMPTOM_OPTIONS: { id: PhysicalSymptom; label: string; icon: string }[] = [
  { id: "kram_perut", label: "Kram Perut", icon: "⚡" },
  { id: "nyeri_payudara", label: "Nyeri Payudara", icon: "🌸" },
  { id: "kembung", label: "Kembung", icon: "🫧" },
  { id: "sakit_kepala", label: "Sakit Kepala", icon: "🤕" },
  { id: "kelelahan", label: "Kelelahan", icon: "🥱" },
  { id: "jerawat", label: "Jerawat", icon: "✨" },
  { id: "nyeri_punggung", label: "Nyeri Punggung", icon: "🦴" },
];

export const MOOD_OPTIONS: { id: MoodType; label: string; emoji: string }[] = [
  { id: "bahagia", label: "Bahagia", emoji: "😊" },
  { id: "tenang", label: "Tenang", emoji: "😌" },
  { id: "sensitif", label: "Sensitif", emoji: "🥺" },
  { id: "cemas", label: "Cemas", emoji: "😰" },
  { id: "sedih", label: "Sedih", emoji: "😢" },
  { id: "marah", label: "Mudah Marah", emoji: "😡" },
];

export const DISCHARGE_OPTIONS: { id: DischargeType; label: string; desc: string; icon: string }[] = [
  { id: "kering", label: "Kering", desc: "Tidak ada cairan terasa", icon: "⚪" },
  { id: "lengket", label: "Lengket", desc: "Tebal dan elastis rendah", icon: "🧴" },
  { id: "creamy", label: "Creamy", desc: "Halus seperti losion", icon: "🥛" },
  { id: "egg_white", label: "Putih Telur (Subur)", desc: "Bening, licin, melar (Masa Subur)", icon: "🥚" },
  { id: "keruh", label: "Keruh", desc: "Keputihan pekat", icon: "🌫️" },
];
