import type { MetadataRoute } from "next";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/seo";

/** Finché NEXT_PUBLIC_ALLOW_INDEXING non è "true" il sito non viene indicizzato. */
export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
