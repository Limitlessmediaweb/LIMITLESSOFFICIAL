import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { automazioni, MANUTENZIONE_TESTO, servizi } from "@/data/servizi";
import { NotaPrezzo } from "@/components/ui/Prezzo";
import { BadgeConsulenza } from "@/components/ui/ConsulenzaButton";
import { T } from "@/components/ui/T";
import { media } from "@/lib/media";
import { ServizioBlock } from "./ServizioBlock";

const LAYOUTS = ["wide", "tall", "split"] as const;

export function Servizi() {
  return (
    <section aria-labelledby="servizi-title" className="wrap py-24 md:py-36">
      <SplitReveal id="servizi-title" className="max-w-[16ch] text-display">
        Tre modi per farti scegliere.
      </SplitReveal>
      <p className="mt-6 max-w-[50ch] text-lead text-fg-muted">Prezzi chiari, sempre &ldquo;a partire da&rdquo;.</p>
      <NotaPrezzo className="mt-5 max-w-[60ch] text-base" />
      <BadgeConsulenza className="mt-6" />

      <Reveal className="mt-14 grid gap-4 lg:grid-cols-[1fr_1.35fr]" stagger={0.1}>
        {servizi.map((s, i) => (
          <ServizioBlock key={s.id} s={s} media={media(s.video.kind, s.video.slug)} layout={LAYOUTS[i]} index={i} />
        ))}
      </Reveal>
      <div className="mt-8 grid gap-3 text-fg-muted md:grid-cols-2 md:gap-10">
        <p>
          <T>{MANUTENZIONE_TESTO}</T>
        </p>
        <p>{automazioni}</p>
      </div>
    </section>
  );
}
