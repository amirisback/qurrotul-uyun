"use client";

import { useSyncExternalStore, useCallback } from "react";

const FAVORITE_BABS_KEY = "qurrotul_uyun_fav_babs";
const FAVORITE_DOAS_KEY = "qurrotul_uyun_fav_doas";
const EVENT_NAME = "qurrotul_uyun_favorites_change";

function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

const emptyBabs: number[] = [];
const emptyDoas: string[] = [];

let cachedBabsRaw: string | null = null;
let cachedBabs: number[] = [];

function getBabsSnapshot(): number[] {
  if (typeof window === "undefined") return emptyBabs;
  const raw = localStorage.getItem(FAVORITE_BABS_KEY);
  if (raw !== cachedBabsRaw) {
    cachedBabsRaw = raw;
    try {
      cachedBabs = raw ? JSON.parse(raw) : [];
    } catch {
      cachedBabs = [];
    }
  }
  return cachedBabs;
}

let cachedDoasRaw: string | null = null;
let cachedDoas: string[] = [];

function getDoasSnapshot(): string[] {
  if (typeof window === "undefined") return emptyDoas;
  const raw = localStorage.getItem(FAVORITE_DOAS_KEY);
  if (raw !== cachedDoasRaw) {
    cachedDoasRaw = raw;
    try {
      cachedDoas = raw ? JSON.parse(raw) : [];
    } catch {
      cachedDoas = [];
    }
  }
  return cachedDoas;
}

function getServerSnapshotBabs(): number[] {
  return emptyBabs;
}

function getServerSnapshotDoas(): string[] {
  return emptyDoas;
}

export function useFavorites() {
  const favoriteBabs = useSyncExternalStore(
    subscribe,
    getBabsSnapshot,
    getServerSnapshotBabs
  );

  const favoriteDoas = useSyncExternalStore(
    subscribe,
    getDoasSnapshot,
    getServerSnapshotDoas
  );

  const toggleFavoriteBab = useCallback((babId: number) => {
    const current = getBabsSnapshot();
    const exists = current.includes(babId);
    const next = exists ? current.filter((id) => id !== babId) : [...current, babId];
    try {
      localStorage.setItem(FAVORITE_BABS_KEY, JSON.stringify(next));
      notifyChange();
    } catch {
      // Storage error
    }
  }, []);

  const toggleFavoriteDoa = useCallback((doaId: string) => {
    const current = getDoasSnapshot();
    const exists = current.includes(doaId);
    const next = exists ? current.filter((id) => id !== doaId) : [...current, doaId];
    try {
      localStorage.setItem(FAVORITE_DOAS_KEY, JSON.stringify(next));
      notifyChange();
    } catch {
      // Storage error
    }
  }, []);

  const isBabFavorited = useCallback(
    (babId: number): boolean => favoriteBabs.includes(babId),
    [favoriteBabs]
  );

  const isDoaFavorited = useCallback(
    (doaId: string): boolean => favoriteDoas.includes(doaId),
    [favoriteDoas]
  );

  const totalFavorites = favoriteBabs.length + favoriteDoas.length;

  return {
    favoriteBabs,
    favoriteDoas,
    totalFavorites,
    isBabFavorited,
    isDoaFavorited,
    toggleFavoriteBab,
    toggleFavoriteDoa,
    isLoaded: true,
  };
}
