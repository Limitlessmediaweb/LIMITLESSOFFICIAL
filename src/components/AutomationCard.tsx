import Link from "next/link";
import type { Automation } from "@/lib/content";
import { PRIMARY_CTA } from "@/lib/content";

export function AutomationCard({ automation }: { automation: Automation }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-lime/60">
      <div className="relative aspect-video w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={automation.demoImage}
          alt={automation.demoImageAlt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          Esempio dimostrativo
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7 md:p-8">
        <h3 className="font-display text-xl tracking-tight md:text-2xl">{automation.name}</h3>

        <div className="mt-6 flex-1 space-y-5 border-t border-border pt-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-lime">Per chi è</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{automation.perChi}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-lime">Perché conviene</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
            {automation.percheConviene}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-lime">Cosa include</p>
          <ul className="mt-2 space-y-2.5">
            {automation.items.map((i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/90">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                {i}
              </li>
            ))}
          </ul>
        </div>
        </div>

        <Link href={`/contatti?automazione=${automation.slug}`} className="btn-lime mt-8 w-full">
          {PRIMARY_CTA}
        </Link>
      </div>
    </article>
  );
}
