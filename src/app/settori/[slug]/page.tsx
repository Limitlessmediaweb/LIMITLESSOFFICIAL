import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/ui/JsonLd";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { azienda } from "@/data/azienda";
import { getSettore, settori } from "@/data/settori";
import { clean, hasPlaceholder } from "@/lib/placeholder";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return settori.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSettore(slug);
  if (!s) return {};
  const meta = pageMetadata({ title: s.title, description: s.description, path: `/settori/${s.slug}` });
  // bozza: non indicizzata finché Riccardo non la approva
  return s.pubblica ? meta : { ...meta, robots: { index: false, follow: false } };
}

/** Nelle bozze i segnaposto restano visibili (evidenziati), così si vede cosa manca. */
function Testo({ children }: { children: string }) {
  if (!hasPlaceholder(children)) return <>{children}</>;
  return <mark className="todo">{children}</mark>;
}

const euro = (n: number) => `${n.toLocaleString("it-IT")} €`;

export default async function SettorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSettore(slug);
  if (!s) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: clean(s.h1),
    serviceType: s.etichetta,
    description: s.description,
    provider: { "@id": `${SITE_URL}/#service` },
    areaServed: azienda.zoneServite.map((name) => ({ "@type": "AdministrativeArea", name })),
    offers: { "@type": "Offer", priceCurrency: "EUR", price: s.prezzo.da, description: `da ${s.prezzo.da} €${s.prezzo.unita ?? ""}` },
  };

  return (
    <>
      {!s.pubblica && (
        <p className="mono fixed inset-x-0 top-16 z-40 bg-accent px-4 py-2 text-center text-accent-ink">Bozza da approvare · non indicizzata</p>
      )}
      <section className="wrap pb-16 pt-32 md:pt-40">
        <p className="mono text-accent-text">{s.etichetta}</p>
        <h1 className="mt-4 max-w-[22ch] text-[clamp(2.2rem,1rem+4vw,4.6rem)] leading-[0.95]">{s.h1}</h1>
        <p className="mt-6 max-w-[56ch] text-lead text-fg-muted">{s.intro}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <WhatsAppButton sezione={s.sezioneWa} posizione={`settore_${s.slug}_hero`} className="w-full sm:w-auto" />
          <span className="text-fg-muted">
            da <strong className="text-fg">{euro(s.prezzo.da)}</strong>
            {s.prezzo.unita}
            {s.prezzo.nota && <span className="block text-sm">{s.prezzo.nota}</span>}
          </span>
        </div>
      </section>

      <section aria-labelledby="problemi-title" className="border-t border-line bg-bg-raised">
        <div className="wrap py-16 md:py-24">
          <h2 id="problemi-title" className="max-w-[18ch] text-title">Ti suona familiare?</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {s.problemi.map((p) => (
              <li key={p} className="border border-line bg-bg p-5">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="cosa-title" className="wrap py-16 md:py-24">
        <h2 id="cosa-title" className="max-w-[18ch] text-title">Cosa facciamo</h2>
        <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-2">
          {s.cosa.map((c) => (
            <div key={c.t} className="bg-bg p-6 md:p-8">
              <h3 className="text-2xl leading-none">{c.t}</h3>
              <p className="mt-3 text-fg-muted">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="caso-title" className="border-t border-line bg-bg-raised">
        <div className="wrap py-16 md:py-24">
          <p className="mono text-accent-text">Un lavoro</p>
          <h2 id="caso-title" className="mt-4 max-w-[24ch] text-title">
            <Testo>{s.caso.titolo}</Testo>
          </h2>
          {s.caso.concept && <span className="tag-concept mt-4 inline-block">Concept</span>}
          <p className="mt-4 max-w-[60ch] text-fg-muted">
            <Testo>{s.caso.testo}</Testo>
          </p>
          {s.caso.link && (
            <a href={s.caso.link} target="_blank" rel="noopener" className="link-line mt-6 inline-flex min-h-11 items-center gap-2 font-semibold">
              Apri il sito
              <ArrowUpRight size={17} aria-hidden />
              <span className="sr-only"> (si apre in una nuova scheda)</span>
            </a>
          )}
        </div>
      </section>

      <section aria-labelledby="faq-title" className="wrap py-16 md:py-24">
        <h2 id="faq-title" className="text-title">Domande</h2>
        <dl className="mt-8 grid gap-6 md:grid-cols-3">
          {s.faq.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-fg-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="zona-title" className="border-t border-line">
        <div className="wrap flex flex-col gap-6 py-16 md:py-24">
          <h2 id="zona-title" className="max-w-[20ch] text-title">Dove lavoriamo</h2>
          <p className="max-w-[60ch] text-lead text-fg-muted">{s.zona}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <WhatsAppButton sezione={s.sezioneWa} posizione={`settore_${s.slug}_fine`} className="w-full sm:w-auto" />
            <Link href="/servizi" className="link-line inline-flex min-h-11 items-center gap-2 font-semibold">
              Tutti i servizi
              <ArrowRight size={17} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      <JsonLd data={jsonLd} />
    </>
  );
}
