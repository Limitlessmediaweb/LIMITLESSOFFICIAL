import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PackCard } from "@/components/PackCard";
import { Reveal } from "@/components/gsap/Reveal";
import { PACKS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pacchetti",
  description:
    "Sei pacchetti pensati per obiettivi diversi: dal primo sito web alla presenza completa con prenotazione, video e contenuti social. Consulenza e preventivo gratuiti.",
  alternates: { canonical: "/pacchetti" },
};

export default function PacchettiPage() {
  return (
    <>
      <PageHero
        eyebrow="Pacchetti"
        title="Scegli in base a dove sei, non a cosa contiene"
        subtitle="Vedi per chi è pensato ogni pacchetto e perché conviene, prima ancora della lista delle feature. Nessun impegno: si parte sempre da una consulenza gratuita."
      />
      <section className="px-5 py-16 md:px-8 md:py-20">
        <Reveal className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {PACKS.map((p) => (
            <PackCard key={p.slug} pack={p} />
          ))}
        </Reveal>
        <Reveal className="mx-auto mt-10 max-w-7xl">
          <p className="rounded-2xl border border-border bg-card/60 px-6 py-5 text-sm text-foreground/90">
            Consulenza e preventivo sempre gratuiti. Offriamo anche un&apos;anteprima gratuita, la
            valutiamo insieme durante la consulenza.
          </p>
        </Reveal>
      </section>
    </>
  );
}
