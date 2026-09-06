import { Globe, Video, Megaphone, Share2 } from "lucide-react";
import { Reveal } from "@/components/gsap/Reveal";
import { SERVICES, type Service } from "@/lib/content";

const ICONS: Record<Service["icon"], typeof Globe> = {
  globe: Globe,
  video: Video,
  megaphone: Megaphone,
  share2: Share2,
};

export function ServicesSection() {
  return (
    <section id="servizi" className="scroll-mt-24 bg-card px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Come lo facciamo</p>
          <h2 className="mt-4 font-display text-3xl leading-[1.08] sm:text-5xl">
            Un unico studio per tutta la tua presenza online
          </h2>
          <p className="mt-5 text-muted-foreground">
            Dal sito ai contenuti video, progettiamo ogni elemento per lavorare insieme: un&apos;unica
            identità curata, declinata su ogni canale.
          </p>
        </Reveal>
        <Reveal className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <article
                key={s.title}
                className="group rounded-3xl border border-border bg-background p-7 transition-colors hover:border-lime/60"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lime/15 text-lime transition-colors group-hover:bg-lime group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-display mt-5 text-xl tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
