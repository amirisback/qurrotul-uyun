import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const staticRoutes = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/kitab", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/doa", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/panduan-waktu", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/siklus-haid", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/favorit", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/tentang", priority: 0.6, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
