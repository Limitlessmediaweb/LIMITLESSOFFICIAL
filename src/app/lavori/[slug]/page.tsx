import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { statSync } from "node:fs";
import { join } from "node:path";
import { ArrowRight } from "lucide-react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { BrowserFrame } from "@/components/media/BrowserFrame";
import { SmartVideo } from "@/components/media/SmartVideo";
import { LiveLink } from "@/components/ui/LiveLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { T } from "@/components/ui/T";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CropMarks } from "@/components/ui/Viewfinder";
import { getProgetto, sitoSpot } from "@/data/progetti";
import { mediaProgetto } from "@/lib/media";
import { clean } from "@/lib/placeholder";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return sitoSpot.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProgetto(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.nome} – Sito e spot | LIMITLESS`,
    description: `${clean(p.frase)} Progetto concept di LIMITLESS: guarda il sito animato e lo spot per ${clean(p.settore).toLowerCase()}.`.slice(0, 155),
    path: `/lavori/${p.slug}`,
  });
}

export default async function ProgettoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProgetto(slug);
  if (!p || p.tipo !== "sito-spot") notFound();

  const m = mediaProgetto(p);
  const idx = sitoSpot.findIndex((x) => x.slug === p.slug);
  const next = sitoSpot[(idx + 1) % sitoSpot.length];
  const nome = clean(p.nome);
  const heroMedia = m.spot ?? m.sitoMobile;
  const messaggio = `Ciao LIMITLESS! Ho visto il progetto ${nome} e vorrei qualcosa di simile per la mia attività.`;

  const videoJsonLd = m.spot && {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `Spot ${nome}`,
    description: clean(p.frase),
    thumbnailUrl: [`${SITE_URL}${m.spot.poster}`],
    contentUrl: `${SITE_URL}${m.spot.mp4}`,
    uploadDate: statSync(join(process.cwd(), "public", m.spot.mp4)).mtime.toISOString(),
    inLanguage: "it-IT",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      {/* HERO: lo spot */}
      <section className="wrap grid items-center gap-10 pb-20 pt-28 md:pt-36 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="mono flex items-center gap-3 text-fg-muted">
            <Link href="/lavori" className="link-line hover:text-fg">
              Lavori
            </Link>
            <span aria-hidden>/</span>
            <span>{p.settore}</span>
          </p>
          <SplitReveal as="h1" immediate className="mt-5 text-display-xl">
            {p.nome}
          </SplitReveal>
          <p className="mt-6 max-w-[40ch] text-lead text-fg-muted">
            <T>{p.frase}</T>
          </p>
          {p.concept && <span className="tag-concept mt-6">Concept</span>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton posizione={`progetto_${p.slug}_hero`} messaggio={messaggio} />
            {p.sitoUrl && <LiveLink href={p.sitoUrl} slug={p.slug} nome={nome} />}
          </div>
        </div>
        {heroMedia && (
          <div className="order-1 mx-auto w-[min(70vw,330px)] lg:order-2">
            <PhoneFrame screenAspect={m.spot ? "9 / 16" : "390 / 844"}>
              <SmartVideo
                src={heroMedia}
                label={m.spot ? `Spot di ${nome}` : `Sito di ${nome} su smartphone`}
                description={m.spot ? `Spot verticale di ${nome} per i social.` : `Registrazione del sito di ${nome} su smartphone.`}
                className="absolute inset-0"
                priority
                showAudio={Boolean(m.spot)}
              />
            </PhoneFrame>
          </div>
        )}
      </section>

      {/* L'IDEA IN 3 RIGHE */}
      {p.idea && (
        <section aria-labelledby="idea-title" className="border-y border-line bg-bg-raised">
          <div className="wrap py-20 md:py-32">
            <h2 id="idea-title" className="text-title">
              L&apos;idea
            </h2>
            <Reveal as="ol" stagger={0.12} className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
              {p.idea.map((riga, i) => (
                <li key={i} className="border-t border-line-strong pt-5">
                  <span className="mono text-accent-text">0{i + 1}</span>
                  <p className="mt-3 text-[clamp(1.35rem,1rem+1vw,1.9rem)] font-medium leading-snug">
                    <T>{riga}</T>
                  </p>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* IL SITO */}
      {(m.sitoDesktop || m.sitoMobile) && (
        <section aria-labelledby="sito-title" className="wrap py-20 md:py-32">
          <SplitReveal id="sito-title" className="max-w-[16ch] text-title">
            Il sito, su telefono e computer.
          </SplitReveal>
          <div className="mt-12 flex flex-col items-center gap-10 lg:flex-row lg:items-end lg:gap-12">
            {m.sitoMobile && (
              <div className="w-[min(62vw,260px)] shrink-0">
                <PhoneFrame screenAspect="390 / 844">
                  <SmartVideo src={m.sitoMobile} label={`Sito di ${nome} su smartphone`} description={`Scroll del sito di ${nome} su smartphone.`} className="absolute inset-0" />
                </PhoneFrame>
              </div>
            )}
            {m.sitoDesktop && p.sitoUrl && (
              <div className="relative w-full min-w-0 flex-1">
                <BrowserFrame url={p.sitoUrl} aspect="1440 / 900">
                  <SmartVideo src={m.sitoDesktop} label={`Sito di ${nome} su desktop`} description={`Scroll del sito di ${nome} su desktop.`} className="absolute inset-0" />
                </BrowserFrame>
                <CropMarks inset={-12} />
              </div>
            )}
          </div>
          {p.sitoUrl && (
            <div className="mt-10">
              <LiveLink href={p.sitoUrl} slug={p.slug} nome={nome} />
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <section aria-labelledby="cta-progetto" className="border-t border-line">
        <div className="wrap py-24 md:py-36">
          <SplitReveal id="cta-progetto" className="max-w-[16ch] text-display">
            Vuoi qualcosa così per la tua attività?
          </SplitReveal>
          <div className="mt-10">
            <WhatsAppButton posizione={`progetto_${p.slug}_cta`} messaggio={messaggio} />
          </div>
        </div>
      </section>

      {/* PROSSIMO */}
      {next && next.slug !== p.slug && (
        <Link
          href={`/lavori/${next.slug}`}
          className="group block border-t border-line"
          aria-label={`Progetto successivo: ${clean(next.nome)}`}
        >
          <div className="wrap flex items-end justify-between gap-6 py-14 md:py-20">
            <div>
              <p className="mono text-fg-muted">Progetto successivo</p>
              <p className="mt-3 font-display text-[clamp(2.8rem,1rem+7vw,8rem)] font-extrabold leading-[0.88] transition-colors group-hover:text-accent-text">
                {next.nome}
              </p>
            </div>
            <ArrowRight className="mb-3 size-10 shrink-0 transition-transform duration-500 group-hover:translate-x-2 md:size-16" aria-hidden />
          </div>
        </Link>
      )}
      {videoJsonLd && <JsonLd data={videoJsonLd} />}
    </>
  );
}
