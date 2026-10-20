export type CategoryType = "nikah" | "adab" | "jima" | "hak-kewajiban" | "doa";

export type DoaCategory = "jodoh" | "akad" | "malam-pertama" | "jima" | "kehamilan" | "keluarga";

export interface SubBabItem {
  id: string;
  subJudul: string;
  arab?: string;
  latin?: string;
  arti?: string;
  penjelasan: string;
  haditsTerkait?: string[];
}

export interface BabItem {
  id: number;
  nomor: string;
  judul: string;
  deskripsiRingkas: string;
  kategori: CategoryType;
  konten: SubBabItem[];
}

export interface DoaItem {
  id: string;
  judul: string;
  kategori: DoaCategory;
  arab: string;
  latin: string;
  arti: string;
  riwayat: string;
  faedah: string;
}

export interface PanduanWaktuItem {
  hari: string;
  status: "sangat-dianjurkan" | "baik" | "makruh" | "terlarang";
  alasan: string;
  keteranganKitab: string;
}

export interface QurrotulUyunData {
  kitab: BabItem[];
  doa: DoaItem[];
  panduanWaktu: PanduanWaktuItem[];
}
