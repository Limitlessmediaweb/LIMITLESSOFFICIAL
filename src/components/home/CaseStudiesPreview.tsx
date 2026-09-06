import Link from "next/link";
import { Reveal } from "@/components/gsap/Reveal";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CASE_STUDIES } from "@/lib/content";

export function CaseStudiesPreview() {
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">Risultati</p>
            <h2 className="mt-4 font-display text-3xl leading-[1.08] sm:text-5xl">
              Il lavoro parla prima di noi
            </h2>
          </div>
          <Link
            href="/lavori"
            className="btn-ghost shrink-0"
          >
            Guarda tutti i lavori
          </Link>
        </Reveal>

        <Reveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {CASE_STUDIES.map((cs) => (
            <CaseStudyCard key={cs.slug} caseStudy={cs} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
