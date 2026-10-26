import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { mensili, servizi } from "@/data/servizi";
import { NotaPrezzo, Prezzo } from "@/components/ui/Prezzo";
import { BadgeConsulenza } from "@/components/ui/ConsulenzaButton";
import { media } from "@/lib/media";
import { ServizioBlock } from "./ServizioBlock";

const LAYOUTS = ["wide", "tall", "split"] as const;

export function Servizi() {
  return (
    <section aria-labelledby="servizi-title" className="wrap py-24 md:py-36">
      <SplitReveal id="servizi-title" className="max-w-[16ch] text-display">
        Tre modi per farti scegliere.
      </SplitReveal>
      <p className="mt-6 max-w-[50ch] text-lead text-fg-muted">Prezzi chiari, di listino. Fino al 30/11 lo spot di Natale per chi produce costa 99 €.</p>
      <NotaPrezzo className="mt-5 max-w-[60ch] text-base" />
      <BadgeConsulenza className="mt-6" />

      <Reveal className="mt-14 grid gap-4 lg:grid-cols-[1fr_1.35fr]" stagger={0.1}>
        {servizi.map((s, i) => (
          <ServizioBlock key={s.id} s={s} media={media(s.video.kind, s.video.slug)} layout={LAYOUTS[i]} index={i} />
        ))}
      </Reveal>

      <h3 className="mt-16 font-sans text-lg font-semibold tracking-normal">E ogni mese</h3>
      <Reveal className="mt-5 grid gap-4 md:grid-cols-3" stagger={0.08}>
        {mensili.map((m) => (
          <article key={m.id} aria-labelledby={`mens-${m.id}`} className="flex flex-col border border-line bg-bg-raised p-6 md:p-8">
            <p className="mono text-fg-muted">{m.nome}</p>
            <h4 id={`mens-${m.id}`} className="mt-3 font-display text-[clamp(1.8rem,1rem+1.6vw,2.6rem)] font-extrabold leading-[0.95]">
              {m.titolo}
            </h4>
            <p className="mt-3 text-fg-muted">{m.ottieni}</p>
            <Prezzo voci={m.voci} className="mt-auto pt-6 text-4xl md:text-5xl" />
            <Link href={`/servizi#${m.id}`} className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-accent-text link-line">
              Vedi il listino
              <ArrowRight size={16} aria-hidden />
              <span className="sr-only"> di {m.nome}</span>
            </Link>
          </article>
        ))}
      </Reveal>
    </section>
  );
}
