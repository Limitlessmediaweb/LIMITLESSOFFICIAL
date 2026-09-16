import type { MetadataRoute } from "next";
import { CASE_STUDIES } from "@/lib/content";

const SITE_URL = "https://limitlessmedia.it";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/ristoranti",
    "/hotel",
    "/immobiliare",
    "/automazioni",
    "/lavori",
    "/pacchetti",
    "/chi-siamo",
    "/contatti",
    "/privacy",
    "/cookie",
    "/termini",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const caseStudyRoutes = CASE_STUDIES.map((cs) => ({
    url: `${SITE_URL}/lavori/${cs.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...caseStudyRoutes];
}
