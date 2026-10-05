import type { Metadata } from "next";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SmartVideo } from "@/components/media/SmartVideo";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { FaqList } from "@/components/sections/Faq";
import { CtaFinale } from "@/components/sections/CtaFinale";
import { JsonLd } from "@/components/ui/JsonLd";
import { T } from "@/components/ui/T";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { automazioni, euro, servizi } from "@/data/servizi";
import { media } from "@/lib/media";
import { clean } from "@/lib/placeholder";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "Servizi e prezzi | LIMITLESS",
  description:
    "Siti web da 700 €, spot video da 119 €, walk tour da 149 €. Cosa include ogni servizio, tempi di consegna e domande frequenti. Preventivo su WhatsApp.",
  path: "/servizi",
});

export default function ServiziPage() {
  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Servizi LIMITLESS",
    url: `${SITE_URL}/servizi`,
    itemListElement: servizi.flatMap((s) =>
      s.prezzi.map((pr) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: `${s.nome}: ${pr.voce}`, provider: { "@id": `${SITE_URL}/#organization` } },
        priceSpecification: { "@type": "PriceSpecification", minPrice: pr.da, priceCurrency: "EUR" },
      })),
    ),
  };

  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <SplitReveal as="h1" immediate className="max-w-[12ch] text-display-xl">
          Servizi e prezzi
        </SplitReveal>
        <p className="mt-6 max-w-[52ch] text-lead text-fg-muted">
          Tre servizi, prezzi &ldquo;a partire da&rdquo; e nessuna sorpresa. Ti mandiamo il preventivo esatto su WhatsApp, di solito in giornata.
        </p>
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

                <dl className="mt-10 grid gap-6 sm:grid-cols-2">
                  {s.prezzi.map((pr) => (
                    <div key={pr.voce} className="border-t border-line-strong pt-4">
                      <dt className="text-fg-muted">
                        {pr.voce} {pr.nota && <T>{pr.nota}</T>}
                      </dt>
                      <dd className="mt-1 font-display text-5xl font-extrabold md:text-6xl">
                        <span className="mr-1.5 align-top font-sans text-base font-medium text-fg-muted">da</span>
                        {euro(pr.da)}
                      </dd>
                    </div>
                  ))}
                </dl>

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
                  <WhatsAppButton posizione={`servizi_${s.id}`} messaggio={`Ciao LIMITLESS! Vorrei un preventivo per: ${s.nome.toLowerCase()}.`} />
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
        <p className="text-lead text-fg-muted">{automazioni}</p>
      </section>
      <CtaFinale messaggio="Ciao LIMITLESS! Ho visto i servizi e vorrei un preventivo." />
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
