import Link from "next/link";
import { Star, MessageCircle, PhoneMissed, Repeat } from "lucide-react";
import { Reveal } from "@/components/gsap/Reveal";
import { AUTOMATIONS } from "@/lib/content";

const ICONS = [Star, MessageCircle, PhoneMissed, Repeat];

export function AutomationsSection() {
  return (
    <section className="bg-card px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Novità</p>
            <h2 className="mt-4 font-display text-3xl leading-[1.08] sm:text-5xl">
              Automazioni AI: lavorano anche quando tu non puoi
            </h2>
            <p className="mt-5 text-muted-foreground">
              Recensioni, chat, chiamate perse, lead che non rispondono: strumenti che continuano a
              seguire i tuoi clienti mentre tu gestisci l&apos;attività.
            </p>
          </div>
          <Link href="/automazioni" className="btn-ghost shrink-0">
            Scopri le automazioni
          </Link>
        </Reveal>

        <Reveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {AUTOMATIONS.map((a, i) => {
            const Icon = ICONS[i];
            return (
              <Link
                key={a.slug}
                href="/automazioni"
                className="group flex flex-col rounded-3xl border border-border bg-background p-7 transition-colors hover:border-lime/60"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lime/15 text-lime transition-colors group-hover:bg-lime group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-display mt-5 text-lg tracking-tight">{a.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.perChi}</p>
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
