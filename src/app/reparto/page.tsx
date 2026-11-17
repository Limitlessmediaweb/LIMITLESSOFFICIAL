import type { Metadata } from "next";
import "./reparto.css";
import { Esperienza } from "@/components/reparto/Esperienza";
import { JsonLd } from "@/components/ui/JsonLd";
import { REPARTO_DESCRIPTION, REPARTO_TITLE } from "@/data/reparto";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: REPARTO_TITLE,
  description: REPARTO_DESCRIPTION,
  path: "/reparto",
});

/**
 * Gira prima del primo disegno, senza aspettare React:
 * - con «riduci movimento» attiva subito la versione statica (niente salti di pagina);
 * - con ?azienda=Nome scrive il nome nel titolo e sulla targhetta, così non si vede mai «Il tuo reparto» per un attimo.
 * La stessa pulizia del nome è in pulisciAzienda() (src/data/reparto.ts).
 */
const primaDelDisegno = String.raw`(function(){try{var r=document.querySelector('.rv');if(!r)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)r.setAttribute('data-statico','');var n=new URLSearchParams(location.search).get('azienda');if(!n)return;n=n.replace(/[\u0000-\u001f<>{}\[\]\\` + "`" + String.raw`|^~]/g,' ').replace(/[-_]{2,}/g,' ').replace(/\s+/g,' ').trim().slice(0,40).trim();if(!n)return;var t=document.querySelector('[data-rv-titolo]');if(t)t.textContent='Il reparto di '+n+', in una schermata.';document.querySelectorAll('[data-rv-targa]').forEach(function(e){e.textContent=n.toUpperCase()})}catch(e){}})();`;

export default function RepartoPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hub Reparto",
    serviceType: "Gestionale su misura per aziende metalmeccaniche conto terzi",
    description: REPARTO_DESCRIPTION,
    url: `${SITE_URL}/reparto`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: ["Pavia", "Lodi", "Piacenza"],
    audience: { "@type": "BusinessAudience", name: "Aziende metalmeccaniche conto terzi" },
  };
  return (
    <>
      <Esperienza />
      <script dangerouslySetInnerHTML={{ __html: primaDelDisegno }} />
      <JsonLd data={serviceJsonLd} />
    </>
  );
}
