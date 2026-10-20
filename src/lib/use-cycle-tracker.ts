"use client";

import { useMemo, useSyncExternalStore, useCallback } from "react";
import type {
  CycleStorageSchema,
  DailyCycleLog,
  UserCycleProfile,
  QadhaPuasaEntry,
  EvaluatedDayStatus,
  CyclePrediction,
} from "@/types/cycle-tracker";
import {
  evaluateCycleDay,
  calculatePredictions,
  recalculateRamadhanQadha,
} from "./cycle-engine";
import { formatToISODate } from "./calendar-engine";

export const CYCLE_STORAGE_KEY = "qurrotul_cycle_storage_v1";
export const PANDUAN_HAID_KEY = "qurrotul_haid_tracker";

const DEFAULT_PROFILE: UserCycleProfile = {
  lastPeriodStartDate: formatToISODate(new Date()),
  averageCycleLength: 28,
  averagePeriodDuration: 7,
  lutealPhaseDays: 14,
  isOnboardingCompleted: false,
};

const DEFAULT_SCHEMA: CycleStorageSchema = {
  version: 1,
  profile: DEFAULT_PROFILE,
  logs: {},
  qadhaEntries: [],
};

const listeners = new Set<() => void>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function readStorageSnapshot(): string {
  if (typeof window === "undefined") return JSON.stringify(DEFAULT_SCHEMA);
  try {
    const raw = localStorage.getItem(CYCLE_STORAGE_KEY);
    if (!raw) {
      return JSON.stringify(DEFAULT_SCHEMA);
    }
    return raw;
  } catch {
    return JSON.stringify(DEFAULT_SCHEMA);
  }
}

function parseSchema(raw: string): CycleStorageSchema {
  try {
    const parsed = JSON.parse(raw) as Partial<CycleStorageSchema>;
    if (!parsed || typeof parsed !== "object") return DEFAULT_SCHEMA;

    return {
      version: parsed.version ?? 1,
      profile: {
        ...DEFAULT_PROFILE,
        ...(parsed.profile ?? {}),
      },
      logs: parsed.logs ?? {},
      qadhaEntries: Array.isArray(parsed.qadhaEntries) ? parsed.qadhaEntries : [],
    };
  } catch {
    return DEFAULT_SCHEMA;
  }
}

function writeSchemaToStorage(schema: CycleStorageSchema) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(schema);
    localStorage.setItem(CYCLE_STORAGE_KEY, serialized);

    // Synchronize with /panduan-waktu storage key
    const today = new Date();
    const todayStatus = evaluateCycleDay(today, schema.profile, schema.logs);
    const haidConfig = {
      startDate: schema.profile.lastPeriodStartDate,
      durationDays: schema.profile.averagePeriodDuration,
      active: todayStatus.syariStatus === "haid",
    };
    localStorage.setItem(PANDUAN_HAID_KEY, JSON.stringify(haidConfig));

    // Dispatch window storage event so other tabs/components react immediately
    window.dispatchEvent(new Event("storage"));
    notifyListeners();
  } catch {
    // Graceful fallback for quota or private mode issues
  }
}

export function useCycleTracker() {
  const subscribe = useCallback((callback: () => void) => {
    listeners.add(callback);
    const handleStorageEvent = (e: StorageEvent | Event) => {
      if (e instanceof StorageEvent && e.key && e.key !== CYCLE_STORAGE_KEY) {
        return;
      }
      callback();
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  const rawSnapshot = useSyncExternalStore(
    subscribe,
    readStorageSnapshot,
    () => JSON.stringify(DEFAULT_SCHEMA)
  );

  const schema = useMemo(() => {
    return parseSchema(rawSnapshot);
  }, [rawSnapshot]);

  const profile = schema.profile;
  const logs = schema.logs;
  const qadhaEntries = schema.qadhaEntries;

  // Predictions derived from profile
  const predictions: CyclePrediction = useMemo(() => {
    return calculatePredictions(profile);
  }, [profile]);

  // Evaluated status for today
  const todayStatus: EvaluatedDayStatus = useMemo(() => {
    return evaluateCycleDay(new Date(), profile, logs);
  }, [profile, logs]);

  // Helper to evaluate any specific date
  const getEvaluatedDay = useCallback(
    (targetDate: Date): EvaluatedDayStatus => {
      return evaluateCycleDay(targetDate, profile, logs);
    },
    [profile, logs]
  );

  // Actions
  const saveProfile = useCallback(
    (updates: Partial<UserCycleProfile>) => {
      const nextProfile: UserCycleProfile = {
        ...schema.profile,
        ...updates,
      };

      const nextSchema: CycleStorageSchema = {
        ...schema,
        profile: nextProfile,
      };

      writeSchemaToStorage(nextSchema);
    },
    [schema]
  );

  const saveDailyLog = useCallback(
    (isoDate: string, logData: Partial<DailyCycleLog>) => {
      const existing = schema.logs[isoDate];
      const merged: DailyCycleLog = {
        isoDate,
        flow: logData.flow ?? existing?.flow ?? "none",
        fiqihColor: logData.fiqihColor ?? existing?.fiqihColor,
        isGhuslDone: logData.isGhuslDone ?? existing?.isGhuslDone ?? false,
        cessationSign: logData.cessationSign !== undefined ? logData.cessationSign : (existing?.cessationSign ?? null),
        symptoms: logData.symptoms ?? existing?.symptoms ?? [],
        moods: logData.moods ?? existing?.moods ?? [],
        discharge: logData.discharge ?? existing?.discharge,
        intimateActivity: logData.intimateActivity ?? existing?.intimateActivity,
        notes: logData.notes ?? existing?.notes,
        updatedAt: new Date().toISOString(),
      };

      const nextLogs = {
        ...schema.logs,
        [isoDate]: merged,
      };

      // Recalculate Qadha Puasa if haid occurred in Ramadhan
      const nextQadha = recalculateRamadhanQadha(nextLogs, schema.qadhaEntries);

      // If user logs heavy/medium/light flow on an earlier or new period start, update profile if needed
      let nextProfile = schema.profile;
      if (merged.flow !== "none" && !nextProfile.isOnboardingCompleted) {
        nextProfile = {
          ...nextProfile,
          lastPeriodStartDate: isoDate,
          isOnboardingCompleted: true,
        };
      }

      const nextSchema: CycleStorageSchema = {
        ...schema,
        profile: nextProfile,
        logs: nextLogs,
        qadhaEntries: nextQadha,
      };

      writeSchemaToStorage(nextSchema);
    },
    [schema]
  );

  const deleteDailyLog = useCallback(
    (isoDate: string) => {
      const nextLogs = { ...schema.logs };
      delete nextLogs[isoDate];

      const nextSchema: CycleStorageSchema = {
        ...schema,
        logs: nextLogs,
      };

      writeSchemaToStorage(nextSchema);
    },
    [schema]
  );

  const confirmGhuslForDate = useCallback(
    (isoDate: string) => {
      const existing = schema.logs[isoDate];
      saveDailyLog(isoDate, {
        isGhuslDone: true,
        cessationSign: existing?.cessationSign ?? "jufuf",
        flow: "none",
      });
    },
    [schema.logs, saveDailyLog]
  );

  const toggleQadhaPayment = useCallback(
    (id: string) => {
      const nextEntries = schema.qadhaEntries.map((entry) => {
        if (entry.id === id) {
          const nextPaid = !entry.isPaid;
          return {
            ...entry,
            isPaid: nextPaid,
            datePaid: nextPaid ? formatToISODate(new Date()) : null,
          };
        }
        return entry;
      });

      const nextSchema: CycleStorageSchema = {
        ...schema,
        qadhaEntries: nextEntries,
      };

      writeSchemaToStorage(nextSchema);
    },
    [schema]
  );

  const addQadhaDebtManually = useCallback(
    (dateOwedIso: string) => {
      const newEntry: QadhaPuasaEntry = {
        id: `qadha-manual-${Date.now()}`,
        hijriYear: 1448, // reasonable fallback or computed
        dateOwed: dateOwedIso,
        isPaid: false,
        datePaid: null,
      };

      const nextSchema: CycleStorageSchema = {
        ...schema,
        qadhaEntries: [...schema.qadhaEntries, newEntry],
      };

      writeSchemaToStorage(nextSchema);
    },
    [schema]
  );

  const payNextQadhaOneDay = useCallback(() => {
    const firstUnpaid = schema.qadhaEntries.find((e) => !e.isPaid);
    if (!firstUnpaid) return;
    toggleQadhaPayment(firstUnpaid.id);
  }, [schema.qadhaEntries, toggleQadhaPayment]);

  const exportData = useCallback((): string => {
    return JSON.stringify(schema, null, 2);
  }, [schema]);

  const importData = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") return false;

      const validated: CycleStorageSchema = {
        version: parsed.version ?? 1,
        profile: {
          ...DEFAULT_PROFILE,
          ...(parsed.profile ?? {}),
          isOnboardingCompleted: Boolean(parsed.profile?.isOnboardingCompleted),
        },
        logs: parsed.logs ?? {},
        qadhaEntries: Array.isArray(parsed.qadhaEntries) ? parsed.qadhaEntries : [],
      };

      writeSchemaToStorage(validated);
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetAllData = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(CYCLE_STORAGE_KEY);
      localStorage.removeItem(PANDUAN_HAID_KEY);
      window.dispatchEvent(new Event("storage"));
      notifyListeners();
    } catch {
      // ignore
    }
  }, []);

  return {
    schema,
    profile,
    logs,
    qadhaEntries,
    predictions,
    todayStatus,
    getEvaluatedDay,
    saveProfile,
    saveDailyLog,
    deleteDailyLog,
    confirmGhuslForDate,
    toggleQadhaPayment,
    addQadhaDebtManually,
    payNextQadhaOneDay,
    exportData,
    importData,
    resetAllData,
  };
}
