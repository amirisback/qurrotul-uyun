import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qurrotul Uyun — Panduan Rumah Tangga Islami",
    short_name: "Qurrotul Uyun",
    description: "Panduan lengkap adab pernikahan, malam pertama, dan rumah tangga sakinah berdasarkan Kitab Qurrotul Uyun.",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfbf9",
    theme_color: "#064e3b",
    icons: [
      {
        src: "/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
