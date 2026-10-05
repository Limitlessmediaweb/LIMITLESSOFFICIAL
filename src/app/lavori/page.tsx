import type { Metadata } from "next";
import { LavoriGrid, type LavoroCard } from "@/components/sections/LavoriGrid";
import { CONCEPT_LINE } from "@/components/sections/LavoriEvidenza";
import { CtaFinale } from "@/components/sections/CtaFinale";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { mediaProgetto, progettiConMedia } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Lavori | LIMITLESS",
  description:
    "Siti web animati, spot video e walk tour creati da LIMITLESS per profumi, ristoranti, artigiani, immobili e brand. Guarda i video e scegli il tuo.",
  path: "/lavori",
});

export default function LavoriPage() {
  const cards: LavoroCard[] = progettiConMedia().flatMap((p) => {
    const m = mediaProgetto(p);
    const media = m.spot ?? m.sitoMobile ?? m.sitoDesktop;
    return media ? [{ slug: p.slug, nome: p.nome, tipo: p.tipo, settore: p.settore, frase: p.frase, concept: p.concept, media }] : [];
  });

  return (
    <>
      <section className="wrap pb-24 pt-32 md:pt-40">
        <SplitReveal as="h1" immediate className="max-w-[14ch] text-display-xl">
          Lavori
        </SplitReveal>
        <p className="mt-6 max-w-[56ch] text-lead text-fg-muted">Siti, spot e walk tour. Guarda i video e scegli quello che fa per te.</p>
        <p className="mt-3 flex max-w-[60ch] items-start gap-3 text-fg-muted">
          <span className="tag-concept mt-0.5 shrink-0">Concept</span>
          <span>{CONCEPT_LINE}</span>
        </p>
        <div className="mt-12">
          <LavoriGrid cards={cards} />
        </div>
      </section>
      <CtaFinale />
    </>
  );
}
