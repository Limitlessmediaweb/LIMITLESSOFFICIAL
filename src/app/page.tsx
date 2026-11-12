import type { Metadata } from "next";
import "./caos.css";
import { HeroCaos } from "@/components/caos/HeroCaos";
import { Lente } from "@/components/caos/Lente";
import { TreTasti } from "@/components/caos/TreTasti";
import { LavoriNastro } from "@/components/caos/LavoriNastro";
import { ComeSiParte, PerTe, Prezzi, QuizFinale, Riconosci } from "@/components/caos/SezioniHome";
import { FaqList } from "@/components/sections/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { domandeHome } from "@/data/home";
import { clean } from "@/lib/placeholder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "LIMITLESS | Dal caos all'ordine: gestionale su misura",
  description:
    "Mettiamo in ordine il lavoro della tua attività con LIMITLESS HUB, il gestionale su misura da 190 €/mese. Poi la facciamo crescere con sito e video. Fai il quiz.",
  path: "/",
});

/**
 * Home «Dal caos all'ordine» in 10 sezioni:
 * 1 hero (caos fisico) · 2 lo riconosci? · 3 prima e dopo (lente) · 4 tre tasti · 5 per te che decidi ·
 * 6 lavori 01–07 · 7 come si parte · 8 prezzi · 9 domande · 10 quiz e contatto.
 */
export default function Home() {
  // le domande con la risposta ancora da completare non si mostrano
  const domande = domandeHome.filter((f) => clean(f.a));
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: domande.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <HeroCaos />
      <Riconosci />
      <Lente />
      <TreTasti />
      <PerTe />
      <LavoriNastro />
      <ComeSiParte />
      <Prezzi />
      <FaqList items={domande} title="Le domande che ci fanno tutti." />
      <QuizFinale />
      <JsonLd data={faqJsonLd} />
    </>
  );
}
