import type { Metadata } from "next";
import "./caos.css";
import { HashScroll } from "@/components/caos/HashScroll";
import { HeroCaos } from "@/components/caos/HeroCaos";
import { ComeSiParte, Contatti, DueLati, HubBreve, Lavori, Prodotti, QuizSezione } from "@/components/caos/SezioniHome";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "LIMITLESS – Gestionali, siti web e video per aziende | Pavia",
  description:
    "Gestionali su misura, siti web, video e spot per aziende di Pavia, Lodi, Piacenza e Milano sud. Consulenza gratuita su WhatsApp al 350 070 4573.",
  path: "/",
});

/**
 * Home in 8 sezioni: 1 hero (il motto) · 2 due lati dello stesso lavoro · 3 prodotti · 4 HUB in breve ·
 * 5 lavori · 6 come si parte · 7 quiz · 8 contatti. Piani, prezzi e domande dell'HUB stanno su /hub.
 */
export default function Home() {
  return (
    <>
      <HashScroll />
      <HeroCaos />
      <DueLati />
      <Prodotti />
      <HubBreve />
      <Lavori />
      <ComeSiParte />
      <QuizSezione />
      <Contatti />
    </>
  );
}
