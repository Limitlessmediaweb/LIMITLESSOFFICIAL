import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Nastri } from "@/components/sections/Nastri";
import { Problema } from "@/components/sections/Problema";
import { LavoriEvidenza } from "@/components/sections/LavoriEvidenza";
import { HubBlocco } from "@/components/sections/HubBlocco";
import { VideoESiti } from "@/components/sections/VideoESiti";
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
import { spotCards, tours } from "@/lib/cards";
import { clean } from "@/lib/placeholder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "LIMITLESS | HUB, il gestionale su misura, e video e siti web",
  description:
    "LIMITLESS HUB, il gestionale su misura per qualsiasi attività, poi spot video e siti web. Spot di Natale per produttori a 99 € fino al 30/11. Demo e consulenza gratuite.",
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
      <Hero />
      <HubBlocco />
      <VideoESiti />
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
