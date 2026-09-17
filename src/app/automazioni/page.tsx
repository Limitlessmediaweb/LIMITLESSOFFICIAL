import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { AutomationCard } from "@/components/AutomationCard";
import { Reveal } from "@/components/gsap/Reveal";
import { CtaSection } from "@/components/CtaSection";
import { AUTOMATIONS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Automazioni AI",
  description:
    "Recensioni automatiche, chat AI nel sito, risposta a chiamate perse e follow-up sui preventivi: strumenti che continuano a lavorare per la tua attività anche quando tu non puoi.",
  alternates: { canonical: "/automazioni" },
};

export default function AutomazioniPage() {
  return (
    <>
      <PageHero
        eyebrow="Automazioni AI"
        title="Strumenti che continuano a lavorare anche quando tu non puoi"
        subtitle="Rispondere a una chiamata persa, chiedere una recensione, ricontattare un preventivo rimasto senza risposta: automazioni pensate per non far sparire mai un cliente interessato."
      />

      <section className="px-5 py-16 md:px-8 md:py-20">
        <Reveal className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2" stagger={0.1}>
          {AUTOMATIONS.map((a) => (
            <AutomationCard key={a.slug} automation={a} />
          ))}
        </Reveal>
      </section>

      <section className="bg-card px-5 py-10 md:px-8 md:py-12">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">
            Nessuno dei moduli qui sopra ha ancora un cliente attivo con dati misurati: le immagini
            sono esempi dimostrativi costruiti per mostrare come funziona ogni automazione, non
            risultati reali.
          </p>
        </Reveal>
      </section>

      <CtaSection
        title="Aggiungi un'automazione al tuo pacchetto"
        subtitle="Le automazioni si integrano nei pacchetti Presenza Base, Crescita e Identità Completa — parliamone in consulenza."
      />
    </>
  );
}
