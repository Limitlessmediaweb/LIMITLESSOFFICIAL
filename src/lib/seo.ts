import type { Metadata } from "next";
import { azienda } from "@/data/azienda";
import { clean } from "@/lib/placeholder";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.limitlessmedia.it").replace(/\/$/, "");
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
export const SITE_NAME = "LIMITLESS";

/** Metadati di pagina: titolo ≤ 60, description ≤ 155, canonical, OG e Twitter. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = true,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const desc = clean(description);
  if (process.env.NODE_ENV !== "production") {
    if (title.length > 60) console.warn(`[seo] titolo > 60 caratteri (${title.length}): ${title}`);
    if (desc.length > 155) console.warn(`[seo] description > 155 caratteri (${desc.length}): ${path}`);
  }
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: desc,
      url: path,
      siteName: SITE_NAME,
      locale: "it_IT",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

/** JSON-LD dell'organizzazione: Organization + WebSite + ProfessionalService (indirizzo: solo comune e provincia). */
export function organizationJsonLd() {
  const sameAs = [azienda.instagram.url, azienda.tiktok.url];
  const telephone = azienda.telefono.replace(/\s/g, "");
  const address = {
    "@type": "PostalAddress",
    addressLocality: azienda.sede.comune,
    addressRegion: azienda.sede.provincia,
    addressCountry: azienda.sede.paese,
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: azienda.ragioneSociale,
        vatID: azienda.vatID,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo.png`,
        email: azienda.email,
        telephone,
        address,
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "it-IT",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#service`,
        name: SITE_NAME,
        legalName: azienda.ragioneSociale,
        vatID: azienda.vatID,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        description:
          "Siti web animati, spot video promo e video walk tour per attività locali, location, immobili e piccoli brand. Consulenza gratuita.",
        telephone,
        email: azienda.email,
        address,
        areaServed: { "@type": "Country", name: azienda.areaServed },
        priceRange: "€",
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
        sameAs,
      },
    ],
  };
}
