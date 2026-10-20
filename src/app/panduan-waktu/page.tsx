import type { Metadata } from "next";
import { getPanduanWaktu } from "@/lib/kitab-data";
import { WaktuClient } from "./waktu-client";

export const metadata: Metadata = {
  title: "Panduan Waktu & Adab Hubungan Suami Istri | Qurrotul Uyun",
  description: "Pedoman hari dan waktu terbaik untuk berhubungan intim menurut Kitab Qurrotul Uyun: fadhilah malam Jumat, hari Senin dan Kamis, serta waktu yang dimakruhkan dan dilarang.",
};

export default function PanduanWaktuPage() {
  const waktuItems = getPanduanWaktu();

  return <WaktuClient waktuItems={waktuItems} />;
}
