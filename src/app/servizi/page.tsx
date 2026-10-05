import type { Metadata } from "next";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SmartVideo } from "@/components/media/SmartVideo";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { FaqList } from "@/components/sections/Faq";
import { CtaFinale } from "@/components/sections/CtaFinale";
import { JsonLd } from "@/components/ui/JsonLd";
import { T } from "@/components/ui/T";
import { BadgeConsulenza, ConsulenzaButton } from "@/components/ui/ConsulenzaButton";
import { NotaPrezzo, Prezzo } from "@/components/ui/Prezzo";
import { automazioni, MANUTENZIONE_MESE, MANUTENZIONE_TESTO, servizi } from "@/data/servizi";
import { media } from "@/lib/media";
import { clean } from "@/lib/placeholder";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "Servizi e prezzi | LIMITLESS",
  description:
    "Siti web da 500 €, spot video e walk tour da 99 €, manutenzione 9 €/mese. Cosa include ogni servizio e domande frequenti. Consulenza gratuita.",
  path: "/servizi",
});

export default function ServiziPage() {
  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Servizi LIMITLESS",
    url: `${SITE_URL}/servizi`,
    itemListElement: [
      ...servizi.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.nome, provider: { "@id": `${SITE_URL}/#organization` } },
        priceSpecification: { "@type": "PriceSpecification", minPrice: s.da, priceCurrency: "EUR" },
      })),
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Manutenzione del sito", provider: { "@id": `${SITE_URL}/#organization` } },
        priceSpecification: { "@type": "UnitPriceSpecification", price: MANUTENZIONE_MESE, priceCurrency: "EUR", unitText: "mese" },
      },
    ],
  };

  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <SplitReveal as="h1" immediate className="max-w-[12ch] text-display-xl">
          Servizi e prezzi
        </SplitReveal>
        <p className="mt-6 max-w-[52ch] text-lead text-fg-muted">
          Tre servizi, prezzi sempre &ldquo;a partire da&rdquo;. Si comincia con una consulenza gratuita di 15 minuti.
        </p>
        <NotaPrezzo className="mt-5 max-w-[60ch] text-base" />
        <BadgeConsulenza className="mt-6" />
        <nav aria-label="Vai al servizio" className="mt-10 flex flex-wrap gap-2">
          {servizi.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="min-h-11 border border-line px-4 py-2.5 font-semibold hover:border-line-strong">
              {s.nome}
            </a>
          ))}
        </nav>
      </section>

      {servizi.map((s, i) => {
        const v = media(s.video.kind, s.video.slug);
        const vertical = v?.vertical ?? false;
        return (
          <section key={s.id} id={s.id} aria-labelledby={`t-${s.id}`} className="scroll-mt-20 border-t border-line">
            <div className={cn("wrap grid gap-12 py-20 md:py-28 lg:items-center lg:gap-20", vertical ? "lg:grid-cols-[1.4fr_1fr]" : "lg:grid-cols-[1fr_1.2fr]")}>
              <div className={cn(i % 2 === 1 && !vertical && "lg:order-2")}>
                <p className="mono text-fg-muted">{s.nome}</p>
                <h2 id={`t-${s.id}`} className="mt-3 max-w-[14ch] text-title">
                  {s.titolo}
                </h2>
                <p className="mt-5 max-w-[50ch] text-lead text-fg-muted">{s.ottieni}</p>

                <div className="mt-10 border-t border-line-strong pt-5">
                  <Prezzo da={s.da} />
                  <NotaPrezzo className="mt-4" />
                </div>

                <h3 className="mt-10 font-sans text-lg font-semibold tracking-normal">Cosa include</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {s.include.map((x) => (
                    <li key={x} className="flex gap-3 text-fg-muted">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent-text" />
                      <span>
                        <T>{x}</T>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-fg-muted">
                  <strong className="font-semibold text-fg">Tempi:</strong> <T>{s.tempi}</T>
                </p>
                <div className="mt-8">
                  <ConsulenzaButton posizione={`servizi_${s.id}`} messaggio={`Ciao! Vorrei una consulenza gratuita per: ${s.nome.toLowerCase()}.`} />
                  <p className="mt-3 text-sm text-fg-muted">Consulenza gratuita, senza impegno.</p>
                </div>
              </div>

              {v && (
                <Reveal className={cn(vertical ? "mx-auto w-[min(70vw,320px)]" : "w-full")}>
                  {vertical ? (
                    <PhoneFrame screenAspect="9 / 16">
                      <SmartVideo src={v} label={`Esempio di ${s.nome.toLowerCase()}`} description={`Esempio di ${s.nome.toLowerCase()} realizzato da LIMITLESS.`} className="absolute inset-0" />
                    </PhoneFrame>
                  ) : (
                    <SmartVideo
                      src={v}
                      label={`Esempio di ${s.nome.toLowerCase()}`}
                      description={`Esempio di ${s.nome.toLowerCase()} realizzato da LIMITLESS.`}
                      aspect={`${v.width} / ${v.height}`}
                      className="w-full border border-line"
                    />
                  )}
                </Reveal>
              )}
            </div>
            <FaqList items={s.faq.map((f) => ({ q: f.q, a: f.a }))} title={s.faqTitolo} headingLevel="h3" />
          </section>
        );
      })}

      <section className="wrap border-t border-line py-16">
        <div className="grid gap-4 text-lead text-fg-muted md:grid-cols-2 md:gap-12">
          <p>
            <T>{MANUTENZIONE_TESTO}</T>
          </p>
          <p>{automazioni}</p>
        </div>
      </section>
      <CtaFinale />
      <JsonLd data={offerJsonLd} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: servizi.flatMap((s) => s.faq).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: clean(f.a) } })),
        }}
      />
    </>
  );
}
