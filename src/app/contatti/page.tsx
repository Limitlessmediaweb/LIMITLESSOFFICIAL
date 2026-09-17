import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal } from "@/components/gsap/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { BUSINESS, SOCIAL_PROOF } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Parliamo del tuo progetto: consulenza e preventivo sempre gratuiti, rispondiamo in tempi brevi.",
  alternates: { canonical: "/contatti" },
};

export default function ContattiPage() {
  return (
    <section className="px-5 pt-32 pb-24 md:px-8 md:pt-40 md:pb-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Contatti</p>
          <h1 className="mt-4 font-display text-3xl leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            Parliamo del tuo progetto
          </h1>
          <p className="mt-5 font-display text-lg text-lime">{SOCIAL_PROOF.responseTime}.</p>
          <div className="mt-8 space-y-3">
            <a
              href={`mailto:${BUSINESS.email}`}
              className="block text-lg text-foreground underline-offset-4 hover:text-lime hover:underline"
            >
              {BUSINESS.email}
            </a>
            <a
              href={`tel:${BUSINESS.phoneHref}`}
              className="block text-lg text-foreground underline-offset-4 hover:text-lime hover:underline"
            >
              {BUSINESS.phone}
            </a>
            <a
              href={`https://wa.me/${BUSINESS.phoneHref.replace("+", "")}`}
              target="_blank"
              rel="noreferrer"
              className="block text-lg text-foreground underline-offset-4 hover:text-lime hover:underline"
            >
              WhatsApp
            </a>
            <p className="text-lg text-foreground">
              <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                PEC:{" "}
              </span>
              <a
                href={`mailto:${BUSINESS.pec}`}
                className="underline-offset-4 hover:text-lime hover:underline"
              >
                {BUSINESS.pec}
              </a>
            </p>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            {SOCIAL_PROOF.freeConsult}. {BUSINESS.city} — {BUSINESS.areaServed}.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Avviando una chat WhatsApp accetti che il messaggio venga gestito tramite Meta/WhatsApp
            — vedi la{" "}
            <a href="/privacy" className="underline-offset-4 hover:text-lime hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </Reveal>

        <Reveal>
          <Suspense fallback={<div className="panel h-[520px] animate-pulse" />}>
            <ContactForm />
          </Suspense>
        </Reveal>
      </div>
    </section>
  );
}
