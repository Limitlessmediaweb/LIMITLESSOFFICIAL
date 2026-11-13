import type { Metadata } from "next";
import { LavoriGrid, type LavoroCard } from "@/components/sections/LavoriGrid";
import { CONCEPT_LINE } from "@/components/sections/LavoriEvidenza";
import { CtaFinale } from "@/components/sections/CtaFinale";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { mediaProgetto, progettiConMedia } from "@/lib/media";
import { ArrowUpRight } from "lucide-react";
import { PORTFOLIO_URL } from "@/data/nav";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Lavori | LIMITLESS",
  description:
    "Siti web, spot video e walk tour di LIMITLESS per profumi, ristoranti, artigiani, immobili e brand. I concept sono progetti nostri per attività inventate.",
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
        <p className="mt-6 max-w-[56ch] text-lead text-fg-muted">Farsi vedere, fatto bene: siti, spot e walk tour. Guarda i video.</p>
        <p className="mt-3 flex max-w-[60ch] items-start gap-3 text-fg-muted">
          <span className="tag-concept mt-0.5 shrink-0">Concept</span>
          <span>{CONCEPT_LINE.replace("Concept: p", "P")}</span>
        </p>
        <div className="mt-12">
          <LavoriGrid cards={cards} />
        </div>
        <p className="mt-12 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:gap-6">
          <span className="text-fg-muted">Qui c&apos;è una scelta. Tutti gli altri lavori sono nel portfolio.</span>
          <a href={PORTFOLIO_URL} target="_blank" rel="noopener" className="btn btn-ghost w-full shrink-0 sm:w-auto">
            <span>Portfolio completo</span>
            <ArrowUpRight size={17} aria-hidden />
            <span className="sr-only"> (si apre in una nuova scheda)</span>
          </a>
        </p>
      </section>
      <CtaFinale sezione="finale della pagina Lavori" />
    </>
  );
}
