import type { Metadata } from "next";
import { SiklusClient } from "./siklus-client";

export const metadata: Metadata = {
  title: "Siklus Haid & Masa Subur Islami — Qurrotul Uyun",
  description:
    "Pencatatan siklus haid, masa subur, perkiraan ovulasi, panduan mandi wajib thaharah, dan pelacak qadha puasa Ramadhan terpadu berbasis Fiqih Mazhab Syafi'i. 100% data lokal tanpa server tracking.",
  keywords: [
    "siklus haid",
    "kalkulator masa subur islami",
    "fiqih haid syafi'i",
    "darah istihadlah",
    "mandi wajib haid",
    "qadha puasa ramadhan",
    "qurrotul uyun haid",
    "flo muslimah",
  ],
  openGraph: {
    title: "Siklus Haid & Masa Subur Islami — Qurrotul Uyun",
    description:
      "Pelacak siklus haid, masa subur, dan thaharah islami terintegrasi dengan hukum Fiqih Mazhab Syafi'i dan Kitab Qurrotul Uyun.",
    url: "/siklus-haid",
    type: "website",
  },
};

export default function SiklusHaidPage() {
  return <SiklusClient />;
}
