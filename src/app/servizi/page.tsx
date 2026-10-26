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
import { NotaPrezzo, Prezzo, VociPrezzo } from "@/components/ui/Prezzo";
import { mensili, REGOLE, servizi, type Voce } from "@/data/servizi";
import { media } from "@/lib/media";
import { clean } from "@/lib/placeholder";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "Servizi e prezzi | LIMITLESS",
  description:
    "Spot 99 € fino al 30/11, walk tour da 190 €, siti da 750 €, Mese Brand da 390 €/mese, HUB da 290 €/mese. Listino chiaro. Consulenza gratuita.",
  path: "/servizi",
});

/** Offerta schema.org per una riga del listino. */
function offerta(servizio: string, v: Voce) {
  const nome = v.nome === servizio ? servizio : `${servizio}: ${v.nome}`;
  const priceSpecification = v.mese
    ? {
        "@type": "UnitPriceSpecification",
        priceCurrency: "EUR",
        unitText: "mese",
        ...(v.fino ? { minPrice: v.prezzo, maxPrice: v.fino } : { price: v.prezzo }),
      }
    : { "@type": "PriceSpecification", priceCurrency: "EUR", price: v.prezzo };
  return {
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: nome, provider: { "@id": `${SITE_URL}/#organization` } },
    priceSpecification,
  };
}

export default function ServiziPage() {
  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Servizi LIMITLESS",
    url: `${SITE_URL}/servizi`,
    itemListElement: [
      ...servizi.flatMap((s) => s.voci.map((v) => offerta(s.nome, v))),
      ...mensili.flatMap((m) => m.voci.map((v) => offerta(m.nome, v))),
      offerta("LIMITLESS HUB", { nome: "Prova di 30 giorni", prezzo: 300 }),
    ],
  };

  return (
    <>
      <section className="wrap pb-16 pt-32 md:pt-40">
        <SplitReveal as="h1" immediate className="max-w-[12ch] text-display-xl">
          Servizi e prezzi
        </SplitReveal>
        <p className="mt-6 max-w-[52ch] text-lead text-fg-muted">
          Spot, walk tour, siti e servizi mensili, con i prezzi di listino. Fino a metà dicembre la prima offerta è lo spot di Natale per chi produce: vino,
          birra, moto, artigianato. Si comincia con una consulenza gratuita di 15 minuti.
        </p>
        <NotaPrezzo className="mt-5 max-w-[60ch] text-base" />
        <BadgeConsulenza className="mt-6" />
        <nav aria-label="Vai al servizio" className="mt-10 flex flex-wrap gap-2">
          {[...servizi, ...mensili].map((s) => (
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
                  <Prezzo voci={s.voci} />
                  {s.voci.length > 1 && <VociPrezzo voci={s.voci} className="mt-6" />}
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

      {mensili.map((m) => (
        <section key={m.id} id={m.id} aria-labelledby={`t-${m.id}`} className="scroll-mt-20 border-t border-line">
          <div className="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <p className="mono text-fg-muted">{m.nome}</p>
              <h2 id={`t-${m.id}`} className="mt-3 max-w-[14ch] text-title">
                {m.titolo}
              </h2>
              <p className="mt-5 max-w-[50ch] text-lead text-fg-muted">{m.ottieni}</p>
              <div className="mt-8">
                <ConsulenzaButton posizione={`servizi_${m.id}`} messaggio={`Ciao! Vorrei una consulenza gratuita per: ${m.nome}.`} />
                <p className="mt-3 text-sm text-fg-muted">Consulenza gratuita, senza impegno.</p>
              </div>
            </div>
            <div className="lg:pt-8">
              <Prezzo voci={m.voci} />
              <VociPrezzo voci={m.voci} className="mt-6" />
              {m.extra?.map((x) => (
                <p key={x} className="mt-4 border-l-2 border-accent pl-3 font-medium">
                  {x}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section aria-labelledby="regole-title" className="wrap border-t border-line py-16">
        <h2 id="regole-title" className="font-sans text-lg font-semibold tracking-normal">
          Valido per tutti i lavori
        </h2>
        <ul className="mt-5 grid gap-3 text-lead text-fg-muted md:grid-cols-2 md:gap-x-12">
          {REGOLE.map((r) => (
            <li key={r} className="flex gap-3">
              <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent-text" />
              <span>{r}</span>
            </li>
          ))}
          <li className="flex gap-3">
            <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent-text" />
            <span>La manutenzione del sito si concorda nel preventivo</span>
          </li>
        </ul>
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
