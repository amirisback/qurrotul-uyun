import type {
  CalendarDayInfo,
  DaySlotDetail,
  HaidPeriodConfig,
  NextRecommendedTiming,
  TimingStatus,
} from "@/types/calendar-waktu";

const HIJRI_MONTH_NAMES = [
  "Muharram",
  "Safar",
  "Rabiul Awwal",
  "Rabiul Akhir",
  "Jumadil Ula",
  "Jumadil Akhirah",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const GREGORIAN_MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/**
 * Format Date to ISO string YYYY-MM-DD in local time
 */
export function formatToISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Native Intl Hijri parser - zero external dependencies.
 * Uses 'id-ID-u-ca-islamic-umalqura'
 */
export function getHijriDateDetails(date: Date): {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string;
} {
  try {
    const formatter = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const parts = formatter.formatToParts(date);
    let day = 1;
    let month = 1;
    let year = 1448;

    for (const part of parts) {
      if (part.type === "day") {
        day = parseInt(part.value, 10);
      } else if (part.type === "month") {
        month = parseInt(part.value, 10);
      } else if (part.type === "year") {
        year = parseInt(part.value, 10);
      }
    }

    const monthName =
      HIJRI_MONTH_NAMES[month - 1] ?? `Bulan ${month}`;
    const formatted = `${day} ${monthName} ${year} H`;

    return {
      day,
      month,
      monthName,
      year,
      formatted,
    };
  } catch {
    // Graceful fallback for non-supporting runtime
    return {
      day: date.getDate(),
      month: 1,
      monthName: "Muharram",
      year: 1448,
      formatted: `${date.getDate()} Muharram 1448 H`,
    };
  }
}

/**
 * Check whether a date is within active Haid range
 */
export function isDateInHaidRange(
  date: Date,
  haidConfig?: HaidPeriodConfig | null
): boolean {
  if (!haidConfig || haidConfig.active === false || !haidConfig.startDate) {
    return false;
  }

  const start = new Date(haidConfig.startDate);
  start.setHours(0, 0, 0, 0);

  const duration = Math.min(Math.max(haidConfig.durationDays || 7, 1), 15);
  const end = new Date(start);
  end.setDate(start.getDate() + duration - 1);
  end.setHours(23, 59, 59, 999);

  const current = new Date(date);
  current.setHours(12, 0, 0, 0);

  return current >= start && current <= end;
}

/**
 * Resolves Islamic fiqh timing status for a given Gregorian date based on Kitab Qurrotul Uyun.
 */
export function evaluateDateTiming(
  date: Date,
  haidConfig?: HaidPeriodConfig | null
): CalendarDayInfo {
  const isoDate = formatToISODate(date);
  const dayOfWeek = date.getDay();
  const dayName = DAY_NAMES[dayOfWeek];
  const gregorianDay = date.getDate();

  const hijri = getHijriDateDetails(date);
  const isRamadhan = hijri.month === 9;
  const isAwalBulan = hijri.day === 1;
  const isPurnama = hijri.day >= 14 && hijri.day <= 16;
  const isAkhirBulan = hijri.day >= 29;

  const isHaid = isDateInHaidRange(date, haidConfig);

  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  // 1. Evaluate Haid (Strict Prohibition)
  if (isHaid) {
    const haidSlot: DaySlotDetail = {
      status: "terlarang",
      label: "Haram Mutlak (Sedang Haid)",
      alasan: "Nash Al-Qur'an (Surat Al-Baqarah: 222)",
      hikmah:
        "Diharamkan bersenggama (penetrasi farji) saat istri dalam masa haid atau nifas. Syariat melindungi kesehatan reproduksi dan kesucian ibadah.",
    };

    return {
      date,
      isoDate,
      dayOfWeek,
      dayName,
      gregorianDay,
      hijriDay: hijri.day,
      hijriMonth: hijri.month,
      hijriMonthName: hijri.monthName,
      hijriYear: hijri.year,
      hijriFormatted: hijri.formatted,
      isToday,
      isCurrentMonth: true,
      isRamadhan,
      isHaid: true,
      isPurnama,
      isAwalBulan,
      isAkhirBulan,
      malamSlot: haidSlot,
      siangSlot: haidSlot,
      primaryStatus: "terlarang",
      primaryBadge: {
        label: "Haid",
        variant: "red",
        icon: "🚫",
      },
    };
  }

  // 2. Evaluate Daytime (Sesi Siang)
  let siangSlot: DaySlotDetail;
  if (isRamadhan) {
    siangSlot = {
      status: "terlarang",
      label: "Haram Mutlak (Siang Ramadhan)",
      alasan: "Ibadah Puasa Wajib Ramadhan",
      hikmah:
        "Diharamkan berhubungan intim di siang hari Ramadhan karena membatalkan puasa dan mewajibkan kifarat berat.",
    };
  } else if (dayOfWeek === 1) {
    // Senin
    siangSlot = {
      status: "sangat-dianjurkan",
      label: "Sangat Dianjurkan (Senin Siang)",
      alasan: "Hari Kelahiran & Kenabian Rasulullah SAW",
      hikmah:
        "Diterangkan dalam kitab bahwa anak yang tercipta di hari Senin cenderung ridha terhadap rezeki dari Allah, berhati lembut, dan mencintai ilmu.",
      doaIdRecommended: "doa-5",
    };
  } else if (dayOfWeek === 4) {
    // Kamis
    siangSlot = {
      status: "sangat-dianjurkan",
      label: "Dianjurkan (Kamis Siang)",
      alasan: "Hari Pengangkatan Amal Kebaikan",
      hikmah:
        "Waktu yang penuh keberkahan untuk keharmonisan dan ikhtiar keturunan yang arif bijaksana.",
      doaIdRecommended: "doa-5",
    };
  } else if (dayOfWeek === 6) {
    // Sabtu
    siangSlot = {
      status: "makruh",
      label: "Dimakruhkan (Sabtu Siang)",
      alasan: "Hari Tipu Muslihat & Maksiat Kaum Terdahulu",
      hikmah:
        "Nadzam Ibni Yamun menyebutkan hari Sabtu adalah hari turunnya tipu muslihat iblis, sebagian ulama memakruhkan jika dikhawatirkan tabiat anak terpengaruh.",
    };
  } else {
    // Ahad, Selasa, Rabu, Jumat
    siangSlot = {
      status: "baik",
      label: `Boleh / Mubah (${dayName} Siang)`,
      alasan: "Mubah & Diperbolehkan Syariat",
      hikmah:
        "Boleh dilakukan kapan saja saat pasangan saling menginginkan dengan menjaga kesiapan fisik dan adab bersuci.",
    };
  }

  // 3. Evaluate Nighttime (Sesi Malam, Ba'da Maghrib)
  // In Islamic calendar, evening begins the next Islamic day:
  // - Ahad evening = Malam Senin
  // - Senin evening = Malam Selasa
  // - Selasa evening = Malam Rabu
  // - Rabu evening = Malam Kamis
  // - Kamis evening = Malam Jumat (pinnacle)
  // - Jumat evening = Malam Sabtu
  // - Sabtu evening = Malam Ahad
  let malamSlot: DaySlotDetail;

  // Check lunar caution first
  const hasLunarCaution = isAwalBulan || isPurnama || isAkhirBulan;
  const lunarDesc = isPurnama
    ? "Malam Purnama (14-16 H)"
    : isAwalBulan
      ? "Malam Awal Bulan (1 H)"
      : "Malam Akhir Bulan (29-30 H)";

  if (hasLunarCaution) {
    malamSlot = {
      status: "makruh",
      label: `Dimakruhkan (${lunarDesc})`,
      alasan: "Pengaruh Siklus Bulan & Kestabilan Saraf",
      hikmah:
        "Kitab Qurrotul Uyun menukil pendapat medis klasik bahwa malam tanggal 1, 14-16, dan akhir bulan kamariah memiliki fluktuasi cairan tubuh yang kuat, sehingga dimakruhkan berjima' untuk menjaga ketenangan saraf.",
    };
  } else if (dayOfWeek === 4) {
    // Kamis malam = Malam Jumat
    malamSlot = {
      status: "sangat-dianjurkan",
      label: "Sangat Dianjurkan (Malam Jumat)",
      alasan: "Sunnah Muakkad & Waktu Paling Utama",
      hikmah:
        "Malam yang paling utama menurut mayoritas ulama. Mendapatkan pahala mandi sunnah Jumat keesokan harinya. Diharapkan anak yang dikandung menjadi seorang yang hafidz Al-Qur'an dan berbakti kepada orang tua.",
      doaIdRecommended: "doa-5",
    };
  } else if (dayOfWeek === 0) {
    // Ahad malam = Malam Senin
    malamSlot = {
      status: "sangat-dianjurkan",
      label: "Sangat Dianjurkan (Malam Senin)",
      alasan: "Malam Kelahiran & Kenabian Rasulullah SAW",
      hikmah:
        "Diterangkan dalam kitab bahwa anak yang tercipta di malam Senin berwatak mulia, berhati lembut, dan dikaruniai kemudahan dalam menuntut ilmu syar'i.",
      doaIdRecommended: "doa-5",
    };
  } else if (dayOfWeek === 3) {
    // Rabu malam = Malam Kamis
    malamSlot = {
      status: "sangat-dianjurkan",
      label: "Sangat Dianjurkan (Malam Kamis)",
      alasan: "Malam Pengangkatan Amal Kebaikan",
      hikmah:
        "Dianjurkan bagi suami istri. Anak yang lahir diharapkan menjadi insan yang berilmu, bijaksana, dan dihormati di tengah masyarakat.",
      doaIdRecommended: "doa-5",
    };
  } else if (dayOfWeek === 5) {
    // Jumat malam = Malam Sabtu
    malamSlot = {
      status: "makruh",
      label: "Dimakruhkan (Malam Sabtu)",
      alasan: "Hari Tipu Muslihat & Maksiat Kaum Terdahulu",
      hikmah:
        "Kitab menuturkan sebagian ulama memakruhkan hubungan intim pada malam Sabtu demi menghindari pengaruh watak tercela pada keturunan.",
    };
  } else {
    // Malam Selasa (Senin malam), Malam Rabu (Selasa malam), Malam Ahad (Sabtu malam)
    const malamName =
      dayOfWeek === 1
        ? "Malam Selasa"
        : dayOfWeek === 2
          ? "Malam Rabu"
          : "Malam Ahad";
    malamSlot = {
      status: "baik",
      label: `Boleh / Mubah (${malamName})`,
      alasan: "Mubah & Diperbolehkan",
      hikmah:
        "Tidak ada larangan syariat untuk menjalin keintiman pada malam ini. Utamakan saling ridha dan membaca doa perlindungan.",
      doaIdRecommended: "doa-5",
    };
  }

  // 4. Derive Primary Overall Status & Badge
  let primaryStatus: TimingStatus;
  let primaryBadge: {
    label: string;
    variant: "emerald" | "blue" | "amber" | "red";
    icon: string;
  };

  if (hasLunarCaution) {
    primaryStatus = "makruh";
    primaryBadge = {
      label: isPurnama ? "Purnama" : isAwalBulan ? "Awal Bln" : "Akhir Bln",
      variant: "amber",
      icon: isPurnama ? "🌕" : "🌑",
    };
  } else if (malamSlot.status === "sangat-dianjurkan") {
    primaryStatus = "sangat-dianjurkan";
    primaryBadge = {
      label: dayOfWeek === 4 ? "Malam Jumat" : "Dianjurkan",
      variant: "emerald",
      icon: "✨",
    };
  } else if (siangSlot.status === "sangat-dianjurkan") {
    primaryStatus = "sangat-dianjurkan";
    primaryBadge = {
      label: "Dianjurkan",
      variant: "emerald",
      icon: "✨",
    };
  } else if (malamSlot.status === "makruh" || siangSlot.status === "makruh") {
    primaryStatus = "makruh";
    primaryBadge = {
      label: "Dimakruhkan",
      variant: "amber",
      icon: "⚠️",
    };
  } else if (isRamadhan) {
    primaryStatus = "baik";
    primaryBadge = {
      label: "Ramadhan",
      variant: "blue",
      icon: "🌙",
    };
  } else {
    primaryStatus = "baik";
    primaryBadge = {
      label: "Mubah",
      variant: "blue",
      icon: "👍",
    };
  }

  return {
    date,
    isoDate,
    dayOfWeek,
    dayName,
    gregorianDay,
    hijriDay: hijri.day,
    hijriMonth: hijri.month,
    hijriMonthName: hijri.monthName,
    hijriYear: hijri.year,
    hijriFormatted: hijri.formatted,
    isToday,
    isCurrentMonth: true,
    isRamadhan,
    isHaid: false,
    isPurnama,
    isAwalBulan,
    isAkhirBulan,
    malamSlot,
    siangSlot,
    primaryStatus,
    primaryBadge,
  };
}

/**
 * Generates monthly grid days including leading/trailing offset days.
 */
export function getMonthCalendarDays(
  year: number,
  monthIndex: number,
  haidConfig?: HaidPeriodConfig | null
): CalendarDayInfo[] {
  const days: CalendarDayInfo[] = [];

  // First day of requested month
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  // Days in requested month
  const daysInCurrentMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Days in previous month
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  // 1. Leading days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, monthIndex - 1, daysInPrevMonth - i);
    const dayInfo = evaluateDateTiming(prevDate, haidConfig);
    dayInfo.isCurrentMonth = false;
    days.push(dayInfo);
  }

  // 2. Days in current month
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const date = new Date(year, monthIndex, day);
    const dayInfo = evaluateDateTiming(date, haidConfig);
    dayInfo.isCurrentMonth = true;
    days.push(dayInfo);
  }

  // 3. Trailing days from next month to complete 35 or 42 grid cells
  const totalCells = days.length <= 35 ? 35 : 42;
  const remainingCells = totalCells - days.length;

  for (let day = 1; day <= remainingCells; day++) {
    const nextDate = new Date(year, monthIndex + 1, day);
    const dayInfo = evaluateDateTiming(nextDate, haidConfig);
    dayInfo.isCurrentMonth = false;
    days.push(dayInfo);
  }

  return days;
}

/**
 * Finds the upcoming best recommended time starting from reference date.
 */
export function getNextRecommendedTiming(
  fromDate?: Date,
  haidConfig?: HaidPeriodConfig | null
): NextRecommendedTiming {
  const start = fromDate ? new Date(fromDate) : new Date();
  start.setHours(0, 0, 0, 0);

  // Look ahead up to 14 days
  for (let offset = 0; offset < 14; offset++) {
    const testDate = new Date(start);
    testDate.setDate(start.getDate() + offset);

    const info = evaluateDateTiming(testDate, haidConfig);
    if (info.isHaid) continue;

    // Check malam slot
    if (info.malamSlot.status === "sangat-dianjurkan") {
      let countdownText = `${offset} hari lagi`;
      if (offset === 0) {
        countdownText = "Malam ini ba'da Maghrib";
      } else if (offset === 1) {
        countdownText = "Besok ba'da Maghrib";
      } else if (offset === 2) {
        countdownText = "Lusa ba'da Maghrib";
      }

      const dayTitle =
        info.dayOfWeek === 4
          ? "Malam Jumat"
          : info.dayOfWeek === 0
            ? "Malam Senin"
            : "Malam Kamis";

      return {
        targetDate: testDate,
        slot: "malam",
        title: `${dayTitle} (${formatGregorianShort(testDate)})`,
        countdownText,
        fadhilah: info.malamSlot.hikmah,
        hijriFormatted: info.hijriFormatted,
      };
    }

    // Check siang slot
    if (info.siangSlot.status === "sangat-dianjurkan") {
      let countdownText = `${offset} hari lagi`;
      if (offset === 0) {
        countdownText = "Hari ini";
      } else if (offset === 1) {
        countdownText = "Besok siang";
      } else if (offset === 2) {
        countdownText = "Lusa siang";
      }

      return {
        targetDate: testDate,
        slot: "siang",
        title: `${info.dayName} Siang (${formatGregorianShort(testDate)})`,
        countdownText,
        fadhilah: info.siangSlot.hikmah,
        hijriFormatted: info.hijriFormatted,
      };
    }
  }

  // Fallback default
  const defaultDate = new Date(start);
  return {
    targetDate: defaultDate,
    slot: "malam",
    title: "Malam Jumat Mendatang",
    countdownText: "Segera",
    fadhilah:
      "Malam paling afdhal menurut mayoritas ulama. Memperoleh fadhilah mandi sunnah Jumat dan doa mustajab untuk keturunan yang saleh.",
    hijriFormatted: getHijriDateDetails(defaultDate).formatted,
  };
}

/**
 * Format Gregorian date into short string: e.g. "24 Okt 2026"
 */
export function formatGregorianShort(date: Date): string {
  const d = date.getDate();
  const m = GREGORIAN_MONTH_NAMES[date.getMonth()].slice(0, 3);
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

/**
 * Format Gregorian date into full localized Indonesian string: e.g. "Kamis, 24 Oktober 2026"
 */
export function formatGregorianFull(date: Date): string {
  const dayName = DAY_NAMES[date.getDay()];
  const d = date.getDate();
  const m = GREGORIAN_MONTH_NAMES[date.getMonth()];
  const y = date.getFullYear();
  return `${dayName}, ${d} ${m} ${y}`;
}

/**
 * Get Month name and year in Indonesian
 */
export function getMonthYearDisplay(year: number, monthIndex: number): string {
  return `${GREGORIAN_MONTH_NAMES[monthIndex]} ${year}`;
}

/**
 * Get Hijri range summary for a Gregorian month (e.g. "Rabiul Akhir - Jumadil Ula 1448 H")
 */
export function getHijriMonthRangeForGregorian(
  year: number,
  monthIndex: number
): string {
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0);

  const startHijri = getHijriDateDetails(start);
  const endHijri = getHijriDateDetails(end);

  if (startHijri.monthName === endHijri.monthName) {
    return `${startHijri.monthName} ${startHijri.year} H`;
  }

  if (startHijri.year === endHijri.year) {
    return `${startHijri.monthName} - ${endHijri.monthName} ${startHijri.year} H`;
  }

  return `${startHijri.monthName} ${startHijri.year} H - ${endHijri.monthName} ${endHijri.year} H`;
}

/**
 * Check whether a given date falls within the holy month of Ramadan (Hijri month 9).
 * Defaults to current date.
 */
export function isRamadanSeason(date: Date = new Date()): boolean {
  const hijri = getHijriDateDetails(date);
  return hijri.month === 9;
}
