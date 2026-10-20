import type { Metadata } from "next";
import { FavoritClient } from "./favorit-client";

export const metadata: Metadata = {
  title: "Favorit & Bookmark Tersimpan — Qurrotul Uyun",
  description: "Daftar bab kitab dan doa pernikahan yang telah Anda tandai sebagai favorit untuk dibaca kembali kapan saja secara cepat.",
};

export default function FavoritPage() {
  return <FavoritClient />;
}
