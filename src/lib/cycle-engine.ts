import type {
  DailyCycleLog,
  UserCycleProfile,
  EvaluatedDayStatus,
  CyclePrediction,
  QadhaPuasaEntry,
  SyariState,
} from "@/types/cycle-tracker";
import { formatToISODate, getHijriDateDetails } from "./calendar-engine";
export { formatToISODate, getHijriDateDetails };

/**
 * Parses YYYY-MM-DD string into a local Date object set at 00:00:00 local time
 */
export function parseISODate(isoStr: string): Date {
  const [y, m, d] = isoStr.split("-").map((v) => parseInt(v, 10));
  return new Date(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0, 0);
}

/**
 * Calculates date difference in full days (dateB - dateA)
 */
export function diffInDays(dateA: Date, dateB: Date): number {
  const a = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
  const b = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());
  const diffMs = b.getTime() - a.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Adds integer days to a date
 */
export function addDays(date: Date, days: number): Date {
  const res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}

/**
 * Calculates cycle predictions (next period, ovulation, and fertile window)
 * based on Mazhab Syafi'i parameters & biological luteal phase.
 */
export function calculatePredictions(
  profile: UserCycleProfile
): CyclePrediction {
  const startDate = parseISODate(profile.lastPeriodStartDate || formatToISODate(new Date()));
  const cycleLen = Math.max(21, Math.min(profile.averageCycleLength ?? 28, 45));
  const periodDuration = Math.max(1, Math.min(profile.averagePeriodDuration ?? 7, 15));
  const luteal = Math.max(10, Math.min(profile.lutealPhaseDays ?? 14, 16));

  // Next period begins cycleLen days from start
  const nextPeriodStart = addDays(startDate, cycleLen);
  const nextPeriodEnd = addDays(nextPeriodStart, periodDuration - 1);

  // Ovulation day: Day (cycleLen - luteal) from start (e.g. 1 Okt + 13 days = 14 Okt, Day 14 of 28-day cycle)
  const ovulationOffset = cycleLen - luteal - 1;
  const ovulationDate = addDays(startDate, ovulationOffset);

  // Fertile window: 5 days prior to ovulation up to 1 day after ovulation (7-day window)
  const fertileWindowStart = addDays(ovulationDate, -5);
  const fertileWindowEnd = addDays(ovulationDate, 1);

  return {
    nextPeriodStart,
    nextPeriodEnd,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
  };
}

/**
 * Finds all bleeding streaks in recorded logs sorted chronologically
 */
interface BleedingStreak {
  startDate: string;
  endDate: string;
  dates: string[];
}

export function detectBleedingStreaks(
  logs: Record<string, DailyCycleLog>
): BleedingStreak[] {
  const dates = Object.keys(logs)
    .filter((d) => {
      const log = logs[d];
      return log && log.flow && log.flow !== "none";
    })
    .sort();

  if (dates.length === 0) return [];

  const streaks: BleedingStreak[] = [];
  let currentStreak: string[] = [dates[0]!];

  for (let i = 1; i < dates.length; i++) {
    const prevDate = parseISODate(dates[i - 1]!);
    const currDate = parseISODate(dates[i]!);
    const diff = diffInDays(prevDate, currDate);

    if (diff === 1) {
      currentStreak.push(dates[i]!);
    } else {
      streaks.push({
        startDate: currentStreak[0]!,
        endDate: currentStreak[currentStreak.length - 1]!,
        dates: [...currentStreak],
      });
      currentStreak = [dates[i]!];
    }
  }

  if (currentStreak.length > 0) {
    streaks.push({
      startDate: currentStreak[0]!,
      endDate: currentStreak[currentStreak.length - 1]!,
      dates: [...currentStreak],
    });
  }

  return streaks;
}

/**
 * Core Fiqh Syafi'i Evaluation for a specific day
 */
export function evaluateCycleDay(
  targetDate: Date,
  profile: UserCycleProfile,
  logs: Record<string, DailyCycleLog>
): EvaluatedDayStatus {
  const targetIso = formatToISODate(targetDate);
  const targetMidnight = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  const startIso = profile.lastPeriodStartDate || targetIso;
  const startDate = parseISODate(startIso);
  const cycleLen = Math.max(21, Math.min(profile.averageCycleLength ?? 28, 45));
  const periodDuration = Math.max(1, Math.min(profile.averagePeriodDuration ?? 7, 15));

  // Determine cycle day number (1-based, wrapped by cycleLen)
  const diffFromStart = diffInDays(startDate, targetMidnight);
  let cycleDayNumber: number;
  if (diffFromStart >= 0) {
    cycleDayNumber = (diffFromStart % cycleLen) + 1;
  } else {
    // Dates prior to lastPeriodStartDate
    cycleDayNumber = ((diffFromStart % cycleLen) + cycleLen) % cycleLen + 1;
  }

  // 1. Biological predictions
  const predictions = calculatePredictions(profile);
  const isOvulationDay =
    formatToISODate(predictions.ovulationDate) === targetIso;
  const isFertileWindow =
    targetMidnight >= predictions.fertileWindowStart &&
    targetMidnight <= predictions.fertileWindowEnd;

  // Predicted period day (fallback if no log)
  const isPredictedPeriod =
    cycleDayNumber <= periodDuration &&
    targetMidnight >= startDate;

  // 2. Fiqih Bleeding & Purity Evaluation
  const targetLog = logs[targetIso];
  const hasLoggedFlow = Boolean(targetLog && targetLog.flow && targetLog.flow !== "none");

  let syariStatus: SyariState = "suci_sempurna";
  let isPeriodDay = false;

  // Analyze streaks
  const streaks = detectBleedingStreaks(logs);
  const currentStreak = streaks.find((s) => s.dates.includes(targetIso));

  if (hasLoggedFlow && currentStreak) {
    // Position of this day within the streak (1-based)
    const dayIndexInStreak =
      currentStreak.dates.indexOf(targetIso) + 1;

    // Check Mazhab Syafi'i 15-day maximum rule
    if (dayIndexInStreak > 15) {
      // Exceeded 15 days consecutive bleeding -> Istihadlah
      syariStatus = "istihadlah";
      isPeriodDay = false;
    } else {
      // Check interval since previous streak ended (Minimum Suci 15 Days Rule)
      const prevStreak = streaks
        .filter((s) => s.endDate < currentStreak.startDate)
        .pop();

      if (prevStreak) {
        const prevEnd = parseISODate(prevStreak.endDate);
        const currStart = parseISODate(currentStreak.startDate);
        const suciDays = diffInDays(prevEnd, currStart) - 1;

        if (suciDays < 15) {
          // Blood re-emerged before 15 days of suci -> Istihadlah (Belum genap 15 hari suci)
          syariStatus = "istihadlah";
          isPeriodDay = false;
        } else {
          syariStatus = "haid";
          isPeriodDay = true;
        }
      } else {
        // Normal within 15 days limit
        syariStatus = "haid";
        isPeriodDay = true;
      }
    }
  } else if (targetLog && (targetLog.flow === "none" || targetLog.cessationSign)) {
    // User explicitly marked blood cessation / dry
    if (!targetLog.isGhuslDone) {
      syariStatus = "suci_wajib_mandi";
    } else {
      syariStatus = "suci_sempurna";
    }
  } else {
    // No explicit log for targetDate.
    // Check if yesterday had haid that ended today without confirmation of ghusl:
    const yesterdayIso = formatToISODate(addDays(targetMidnight, -1));
    const yesterdayLog = logs[yesterdayIso];
    const yesterdayStreak = streaks.find((s) => s.dates.includes(yesterdayIso));

    if (
      yesterdayLog &&
      yesterdayLog.flow &&
      yesterdayLog.flow !== "none" &&
      yesterdayStreak &&
      yesterdayStreak.dates.indexOf(yesterdayIso) + 1 <= 15
    ) {
      // Yesterday was bleeding, today no blood recorded yet -> prompt to verify suci & mandi
      syariStatus = "suci_wajib_mandi";
    } else if (isPredictedPeriod && Object.keys(logs).length === 0) {
      // Onboarding default without logs: assume predicted haid
      syariStatus = "haid";
      isPeriodDay = true;
    } else {
      syariStatus = "suci_sempurna";
    }
  }

  // 3. Derive Halal/Haram Ibadah & Jima' Actions
  let canPray = true;
  let canFast = true;
  let canJima = true;
  let ghuslRequired = false;

  switch (syariStatus) {
    case "haid":
      canPray = false;
      canFast = false;
      canJima = false;
      ghuslRequired = false;
      break;
    case "suci_wajib_mandi":
      canPray = false;
      canFast = true; // Sah puasa jika darah tuntas sebelum fajar walau mandi sesudahnya
      canJima = false; // Diharamkan jima' sebelum mandi wajib selesai
      ghuslRequired = true;
      break;
    case "suci_sempurna":
      canPray = true;
      canFast = true;
      canJima = true;
      ghuslRequired = false;
      break;
    case "istihadlah":
      canPray = true; // Wajib shalat fardhu (wudhu tiap masuk waktu)
      canFast = true; // Sah berpuasa
      canJima = true; // Mubah bila ada hajat suami-istri
      ghuslRequired = false;
      break;
  }

  // 4. Construct Descriptive Status Badge
  let statusBadge: EvaluatedDayStatus["statusBadge"];
  switch (syariStatus) {
    case "haid":
      statusBadge = {
        label: "Haid Aktif",
        description: "Haram shalat fardhu, puasa, dan hubungan intim. Tidak wajib qadha shalat.",
        variant: "rose",
        icon: "🩸",
      };
      break;
    case "suci_wajib_mandi":
      statusBadge = {
        label: "Suci (Wajib Ghusl)",
        description: "Darah berhenti. Wajib mandi wajib sebelum dapat menunaikan shalat dan jima'.",
        variant: "sky",
        icon: "💧",
      };
      break;
    case "suci_sempurna":
      statusBadge = {
        label: "Suci Sempurna",
        description: "Wajib shalat fardhu, sah berpuasa, dan halal berjima' sesuai adab syariat.",
        variant: "emerald",
        icon: "🟢",
      };
      break;
    case "istihadlah":
      statusBadge = {
        label: "Istihadlah (Darah Penyakit)",
        description: "Pendarahan di luar batas haid. Wajib shalat & puasa; berwudhu setiap masuk waktu shalat.",
        variant: "amber",
        icon: "⚠️",
      };
      break;
  }

  return {
    isoDate: targetIso,
    cycleDayNumber,
    syariStatus,
    isPeriodDay,
    isPredictedPeriod,
    isFertileWindow,
    isOvulationDay,
    canPray,
    canFast,
    canJima,
    ghuslRequired,
    statusBadge,
  };
}

/**
 * Re-evaluates Ramadan fasting debt from logs
 */
export function recalculateRamadhanQadha(
  logs: Record<string, DailyCycleLog>,
  existingEntries: QadhaPuasaEntry[]
): QadhaPuasaEntry[] {
  const result: QadhaPuasaEntry[] = [...existingEntries];

  // Look for any date in logs where flow > none and falls in Ramadan (month 9)
  const loggedDates = Object.keys(logs).sort();

  for (const isoDate of loggedDates) {
    const log = logs[isoDate];
    if (!log || log.flow === "none") continue;

    const date = parseISODate(isoDate);
    const hijri = getHijriDateDetails(date);

    if (hijri.month === 9) {
      // Haid in Ramadan
      const exists = result.find((e) => e.dateOwed === isoDate);
      if (!exists) {
        result.push({
          id: `qadha-${isoDate}`,
          hijriYear: hijri.year,
          dateOwed: isoDate,
          isPaid: false,
          datePaid: null,
        });
      }
    }
  }

  return result;
}

/**
 * Sync helper with Panduan Waktu Kalender
 */
export function syncWithPanduanWaktu(
  _isoDate: string,
  evaluatedStatus: EvaluatedDayStatus
): {
  isHaidActive: boolean;
  overrideTimingStatus?: "terlarang";
  overrideReason?: string;
} {
  if (evaluatedStatus.syariStatus === "haid") {
    return {
      isHaidActive: true,
      overrideTimingStatus: "terlarang",
      overrideReason: "Sedang Haid (Al-Baqarah: 222)",
    };
  }
  return {
    isHaidActive: false,
  };
}
