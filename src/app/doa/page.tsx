import type { Metadata } from "next";
import { getAllDoa } from "@/lib/kitab-data";
import { DoaClient } from "./doa-client";

export const metadata: Metadata = {
  title: "Kumpulan Doa Pernikahan & Rumah Tangga — Qurrotul Uyun",
  description: "Kumpulan doa lengkap pernikahan Islami: doa mencari jodoh, usai akad nikah, memegang kening istri di malam pertama, doa sebelum & sesudah jima', serta doa memohon anak saleh.",
};

export default function DoaPage() {
  const doas = getAllDoa();

  return <DoaClient initialDoas={doas} />;
}
