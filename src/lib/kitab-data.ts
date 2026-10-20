import data from "@/data/qurrotul-uyun.json";
import type {
  BabItem,
  DoaItem,
  PanduanWaktuItem,
  DoaCategory,
  QurrotulUyunData,
} from "@/types/qurrotul-uyun";

const typedData = data as unknown as QurrotulUyunData;

export function getAllBab(): BabItem[] {
  return typedData.kitab;
}

export function getBabById(id: number): BabItem | undefined {
  return typedData.kitab.find((b) => b.id === id);
}

export function getAllDoa(): DoaItem[] {
  return typedData.doa;
}

export function getDoaById(id: string): DoaItem | undefined {
  return typedData.doa.find((d) => d.id === id);
}

export function getDoaByCategory(category: DoaCategory): DoaItem[] {
  return typedData.doa.filter((d) => d.kategori === category);
}

export function getPanduanWaktu(): PanduanWaktuItem[] {
  return typedData.panduanWaktu;
}

export interface SearchResult {
  type: "bab" | "doa";
  id: string | number;
  title: string;
  snippet: string;
  category: string;
  url: string;
}

export function searchKitabAndDoa(query: string): SearchResult[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search in Kitab Bab
  for (const bab of typedData.kitab) {
    const matchTitle = bab.judul.toLowerCase().includes(q);
    const matchDesc = bab.deskripsiRingkas.toLowerCase().includes(q);
    const matchContent = bab.konten.some(
      (c) =>
        c.subJudul.toLowerCase().includes(q) ||
        c.penjelasan.toLowerCase().includes(q) ||
        (c.arti && c.arti.toLowerCase().includes(q))
    );

    if (matchTitle || matchDesc || matchContent) {
      results.push({
        type: "bab",
        id: bab.id,
        title: `${bab.nomor}: ${bab.judul}`,
        snippet: bab.deskripsiRingkas,
        category: bab.kategori,
        url: `/kitab?bab=${bab.id}`,
      });
    }
  }

  // Search in Doa
  for (const doa of typedData.doa) {
    const matchTitle = doa.judul.toLowerCase().includes(q);
    const matchArti = doa.arti.toLowerCase().includes(q);
    const matchFaedah = doa.faedah.toLowerCase().includes(q);
    const matchLatin = doa.latin.toLowerCase().includes(q);

    if (matchTitle || matchArti || matchFaedah || matchLatin) {
      results.push({
        type: "doa",
        id: doa.id,
        title: doa.judul,
        snippet: doa.arti,
        category: doa.kategori,
        url: `/doa#${doa.id}`,
      });
    }
  }

  return results;
}
