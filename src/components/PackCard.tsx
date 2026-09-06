import Link from "next/link";
import type { Pack } from "@/lib/content";
import { PRIMARY_CTA } from "@/lib/content";

export function PackCard({ pack }: { pack: Pack }) {
  return (
    <article
      className={`flex flex-col rounded-3xl border p-7 transition-colors md:p-8 ${
        pack.featured ? "border-lime bg-lime-soft" : "border-border bg-card hover:border-muted-foreground/40"
      }`}
    >
      {pack.featured && (
        <span className="mb-4 self-start rounded-full bg-lime px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground">
          Il più scelto
        </span>
      )}
      <h3 className="font-display text-xl tracking-tight md:text-2xl">{pack.name}</h3>

      <div className="mt-6 space-y-5 border-t border-border pt-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-lime">Per chi è</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{pack.perChi}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-lime">Perché conviene</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{pack.percheConviene}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-lime">Cosa include</p>
          <ul className="mt-2 space-y-2.5">
            {pack.items.map((i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/90">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link href={`/contatti?pacchetto=${pack.slug}`} className="btn-lime mt-8 w-full">
        {PRIMARY_CTA}
      </Link>
    </article>
  );
}
