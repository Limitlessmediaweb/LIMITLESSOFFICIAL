import Link from "next/link";
import { UtensilsCrossed, BedDouble, Building2 } from "lucide-react";
import { Reveal } from "@/components/gsap/Reveal";
import { VERTICALS } from "@/lib/content";

const ICONS = {
  ristoranti: UtensilsCrossed,
  hotel: BedDouble,
  immobiliare: Building2,
} as const;

export function VerticalsSection() {
  return (
    <section className="bg-card px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Settori</p>
          <h2 className="mt-4 font-display text-3xl leading-[1.08] sm:text-5xl">
            Soluzioni pensate per il tuo settore
          </h2>
        </Reveal>
        <Reveal className="mt-10 grid gap-6 sm:grid-cols-3" stagger={0.1}>
          {VERTICALS.map((v) => {
            const Icon = ICONS[v.slug];
            return (
              <Link
                key={v.slug}
                href={`/${v.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-background p-7 transition-colors hover:border-lime/60"
              >
                <div>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lime/15 text-lime transition-colors group-hover:bg-lime group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="font-display mt-5 text-xl tracking-tight">{v.label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {v.heroTitle}
                  </p>
                </div>
                <span className="mt-6 text-sm font-semibold text-lime">Scopri di più →</span>
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
