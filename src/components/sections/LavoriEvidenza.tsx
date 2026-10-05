import { PinnedSteps } from "@/components/motion/PinnedSteps";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { mediaProgetto, progettiConMedia } from "@/lib/media";
import { ProgettoChapter } from "./ProgettoChapter";

export const CONCEPT_LINE =
  "Concept: progetti creati da noi per mostrarti cosa possiamo fare per un'attività come la tua.";

export function LavoriEvidenza() {
  const list = progettiConMedia("sito-spot");
  return (
    <section id="lavori" aria-labelledby="lavori-title" className="relative scroll-mt-16">
      <div className="wrap pb-6 pt-24 md:pt-36">
        <SplitReveal id="lavori-title" className="max-w-[14ch] text-display">
          Guarda cosa possiamo fare per te.
        </SplitReveal>
        <Reveal className="mt-6 flex max-w-[60ch] items-start gap-3 text-lead text-fg-muted">
          <span className="tag-concept mt-1 shrink-0">Concept</span>
          <p>{CONCEPT_LINE.replace("Concept: ", "")} Li abbiamo inventati per mettere alla prova le nostre idee, e ne andiamo fieri.</p>
        </Reveal>
      </div>

      <PinnedSteps
        steps={list.map((p, i) => (
          <ProgettoChapter key={p.slug} p={p} media={mediaProgetto(p)} index={i} total={list.length} />
        ))}
      />
    </section>
  );
}
