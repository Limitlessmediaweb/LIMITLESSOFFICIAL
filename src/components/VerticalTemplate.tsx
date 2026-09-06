import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/gsap/Reveal";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CtaSection } from "@/components/CtaSection";
import { CASE_STUDIES, type Vertical } from "@/lib/content";

export function VerticalTemplate({ vertical }: { vertical: Vertical }) {
  const relevantCaseStudies = CASE_STUDIES.filter((cs) =>
    vertical.caseStudySlugs.includes(cs.slug),
  );

  return (
    <>
      <PageHero eyebrow={vertical.label} title={vertical.heroTitle} subtitle={vertical.heroSub} />

      <section className="px-5 py-20 md:px-8 md:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Il problema</p>
          <p className="mt-4 text-lg leading-relaxed text-foreground/90">{vertical.problem}</p>
        </Reveal>
      </section>

      <section className="bg-card px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Come lo risolviamo</p>
            <h2 className="mt-4 font-display text-3xl leading-[1.08] sm:text-4xl">
              Cosa costruiamo per {vertical.label.toLowerCase()}
            </h2>
          </Reveal>
          <Reveal className="mt-10 grid gap-6 sm:grid-cols-2" stagger={0.1}>
            {vertical.solution.map((item) => (
              <div key={item.title} className="rounded-3xl border border-border bg-background p-7">
                <h3 className="font-display text-lg tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {relevantCaseStudies.length > 0 && (
        <section className="px-5 py-20 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <p className="eyebrow">Progetti rilevanti</p>
              <h2 className="mt-4 font-display text-3xl leading-[1.08] sm:text-4xl">
                Esempi del nostro lavoro
              </h2>
            </Reveal>
            <Reveal className="mt-10 grid gap-6 sm:grid-cols-2" stagger={0.1}>
              {relevantCaseStudies.map((cs) => (
                <CaseStudyCard key={cs.slug} caseStudy={cs} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
