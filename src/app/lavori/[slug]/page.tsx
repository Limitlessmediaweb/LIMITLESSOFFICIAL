import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Reveal } from "@/components/gsap/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { CtaSection } from "@/components/CtaSection";
import { CASE_STUDIES } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = CASE_STUDIES.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: `${cs.title} — case study`,
    description: cs.dopo,
    alternates: { canonical: `/lavori/${cs.slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const caseStudy = CASE_STUDIES.find((c) => c.slug === slug);
  if (!caseStudy) notFound();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border px-5 pt-32 pb-16 md:px-8 md:pt-40 md:pb-20">
        <div className="relative mx-auto max-w-4xl">
          <Reveal className="flex flex-col gap-4">
            <Link href="/lavori" className="text-sm text-muted-foreground hover:text-lime">
              ← Tutti i lavori
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              {caseStudy.isConcept && (
                <span className="rounded-full bg-lime-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-lime">
                  Progetto concept
                </span>
              )}
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {caseStudy.sector} · {caseStudy.location}
              </span>
            </div>
            <h1 className="font-display text-4xl leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              {caseStudy.title}
            </h1>
            {caseStudy.isConcept && (
              <p className="max-w-2xl text-sm text-muted-foreground">
                Redesign dimostrativo creato da LIMITLESS per mostrare il proprio lavoro: non è un
                cliente reale con risultati misurati. Il confronto qui sotto usa un&apos;
                interfaccia generica e illustrativa come &quot;prima&quot;, non lo screenshot del
                sito reale di questa attività (che è un&apos;attività di fantasia).
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-4xl">
          <Reveal className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="eyebrow">Prima</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{caseStudy.prima}</p>
            </div>
            <div>
              <p className="eyebrow">Intervento</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                {caseStudy.intervento}
              </p>
            </div>
            <div>
              <p className="eyebrow">Dopo</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{caseStudy.dopo}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="mx-auto max-w-5xl">
          <BeforeAfterSlider
            beforeSrc={caseStudy.beforeSrc}
            beforeAlt={caseStudy.beforeAlt}
            beforeLabel="Prima (esempio illustrativo)"
            afterSrc={caseStudy.image}
            afterAlt={caseStudy.imageAlt}
            afterLabel="Dopo"
          />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Trascina per confrontare. Il lato &quot;prima&quot; è uno schema generico e
            illustrativo, non lo screenshot di un sito reale.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {caseStudy.services.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
