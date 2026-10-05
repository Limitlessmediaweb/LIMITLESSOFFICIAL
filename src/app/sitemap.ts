import type { MetadataRoute } from "next";
import { sitoSpot } from "@/data/progetti";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statiche: { path: string; priority: number; freq: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/lavori", priority: 0.9, freq: "weekly" },
    { path: "/servizi", priority: 0.9, freq: "monthly" },
    { path: "/contatti", priority: 0.7, freq: "yearly" },
    { path: "/privacy", priority: 0.2, freq: "yearly" },
    { path: "/termini", priority: 0.2, freq: "yearly" },
  ];
  return [
    ...statiche.map((s) => ({ url: `${SITE_URL}${s.path === "/" ? "" : s.path}`, lastModified: now, changeFrequency: s.freq, priority: s.priority })),
    ...sitoSpot.map((p) => ({ url: `${SITE_URL}/lavori/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
