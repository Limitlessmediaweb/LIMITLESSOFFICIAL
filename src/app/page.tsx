import type { Metadata } from "next";
import { Intro } from "@/components/sections/Intro";
import { Hero } from "@/components/sections/Hero";
import { Nastri } from "@/components/sections/Nastri";
import { Problema } from "@/components/sections/Problema";
import { LavoriEvidenza } from "@/components/sections/LavoriEvidenza";
import { SpotCarousel } from "@/components/sections/SpotCarousel";
import { WalkTour } from "@/components/sections/WalkTour";
import { Servizi } from "@/components/sections/Servizi";
import { ComeLavoriamo } from "@/components/sections/ComeLavoriamo";
import { Configuratore } from "@/components/sections/Configuratore";
import { ChiSiamo } from "@/components/sections/ChiSiamo";
import { FaqList } from "@/components/sections/Faq";
import { CtaFinale } from "@/components/sections/CtaFinale";
import { JsonLd } from "@/components/ui/JsonLd";
import { faq } from "@/data/faq";
import { introFrames, spotCards, tours } from "@/lib/cards";
import { showreel } from "@/lib/media";
import { clean } from "@/lib/placeholder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "LIMITLESS | Siti web e video per attività locali",
  description:
    "Siti web animati, spot video e walk tour per attività locali e piccoli brand. Più clienti, pronti in pochi giorni. Scrivici su WhatsApp.",
  path: "/",
});

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: clean(f.a) },
    })),
  };

  return (
    <>
      {showreel.desktop && <Intro frames={introFrames()} finale={showreel.desktop} finaleMobile={showreel.mobile} />}
      <Hero />
      <Nastri />
      <Problema />
      <LavoriEvidenza />
      <SpotCarousel cards={spotCards()} />
      <WalkTour tours={tours()} />
      <Servizi />
      <ComeLavoriamo />
      <Configuratore />
      <ChiSiamo />
      <FaqList items={faq} />
      <CtaFinale />
      <JsonLd data={faqJsonLd} />
    </>
  );
}
