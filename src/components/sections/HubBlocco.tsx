import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { HUB_PROVA } from "@/data/hub";

const punti = [
  { t: "Tre pulsanti per chi lavora", d: "Inizio, Fatto, Problema. Uguali su telefono, tablet e PC." },
  { t: "Le tue fasi, i tuoi nomi", d: "Ogni lavoro passa da una fase all'altra e vedi i ritardi prima che chiami il cliente." },
  { t: "Il portale del cliente", d: "Un link, e il cliente vede da solo a che punto è il suo lavoro." },
];

/** Secondo blocco della home, dopo l'hero: come funziona LIMITLESS HUB, in tre punti, con link a /hub. */
export function HubBlocco() {
  return (
    <section id="hub" aria-labelledby="hub-blocco-title" className="scroll-mt-16 border-b border-line bg-bg-raised">
      <div className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <p className="mono text-accent-text">LIMITLESS HUB · come funziona</p>
          <SplitReveal id="hub-blocco-title" className="mt-4 max-w-[14ch] text-title">
            A che punto è il lavoro? Adesso lo sai.
          </SplitReveal>
          <Reveal className="mt-8 grid gap-5" stagger={0.08}>
            {punti.map((p) => (
              <div key={p.t} className="border-l-2 border-accent pl-4">
                <h3 className="font-sans text-lg font-bold tracking-normal">{p.t}</h3>
                <p className="mt-1 text-fg-muted">{p.d}</p>
              </div>
            ))}
          </Reveal>
          <p className="mt-8 max-w-[50ch] text-fg-muted">
            <strong className="text-fg">{HUB_PROVA.titolo}:</strong> se continui, li scaliamo dal canone; se smetti, non devi nient&apos;altro.
          </p>
          <Link href="/hub" className="btn btn-accent mt-8 w-full sm:w-auto">
            <span>Scopri LIMITLESS HUB</span>
            <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
        <Reveal className="min-w-0">
          <Link href="/hub" aria-label="Scopri LIMITLESS HUB" className="block overflow-hidden border border-line-strong">
            <Image
              src="/media/hub/pulsanti.webp"
              alt="Schermata di LIMITLESS HUB con un lavoro aperto e tre pulsanti grandi: Inizio, Fatto, Problema"
              width={1280}
              height={600}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
