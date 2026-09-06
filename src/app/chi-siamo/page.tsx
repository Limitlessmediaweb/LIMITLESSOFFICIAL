import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/gsap/Reveal";
import { CtaSection } from "@/components/CtaSection";
import { BUSINESS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "LIMITLESS di Riccardo Pasquini: siti web, video walk tour e video ads premium per attività locali e agenzie immobiliari, con base a Miradolo Terme (PV).",
  alternates: { canonical: "/chi-siamo" },
};

export default function ChiSiamoPage() {
  return (
    <>
      <PageHero eyebrow="Chi siamo" title="Un unico studio per la tua presenza online" />

      <section className="px-5 py-16 md:px-8 md:py-20">
        <Reveal className="mx-auto max-w-3xl">
          <p className="font-display text-2xl leading-[1.4] tracking-[-0.02em] sm:text-4xl">
            LIMITLESS nasce dall&apos;idea che ogni attività locale meriti una presenza online
            all&apos;altezza della qualità del proprio lavoro. Uniamo design curato, tecnologie
            all&apos;avanguardia e un occhio per il dettaglio per creare siti, video e contenuti
            che fanno davvero la differenza.
          </p>
          <div className="mt-10 space-y-2 text-sm text-muted-foreground">
            <p>{BUSINESS.legalName} · P.IVA {BUSINESS.piva}</p>
            <p>
              {BUSINESS.city} — {BUSINESS.areaServed}
            </p>
          </div>
        </Reveal>
      </section>

      <CtaSection />
    </>
  );
}
