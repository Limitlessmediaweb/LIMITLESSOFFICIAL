import Link from "next/link";
import type { CaseStudy } from "@/lib/content";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Link
      href={`/lavori/${caseStudy.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-border bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={caseStudy.image}
          alt={caseStudy.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {caseStudy.isConcept && (
          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            Progetto concept
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-xs uppercase tracking-wide text-lime">
            {caseStudy.sector} · {caseStudy.location}
          </p>
          <h3 className="font-display mt-1 text-xl">{caseStudy.title}</h3>
          <p className="mt-2 grid grid-rows-[0fr] text-sm text-white/85 opacity-0 transition-all duration-300 ease-out group-hover:mt-2 group-hover:grid-rows-[1fr] group-hover:opacity-100">
            <span className="overflow-hidden">{caseStudy.dopo}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
