import Link from "next/link";
import { Reveal } from "@/components/gsap/Reveal";

const NOTTEA_URL = "https://nottea.vercel.app";

/** "Esempio di sito" block — live NÒTTEA demo, shown right under Ultimi lavori. */
export function NotteaShowcase() {
  return (
    <Reveal className="mx-auto mt-14 max-w-5xl">
      <div className="grid items-center gap-8 rounded-3xl border border-border bg-card p-6 sm:grid-cols-[auto_1fr] sm:p-8">
        <div className="relative mx-auto flex items-end justify-center gap-4">
          {/* desktop browser-window mockup — hidden on mobile */}
          <div className="relative hidden w-72 overflow-hidden rounded-xl border border-border bg-background shadow-xl md:block">
            <div className="flex items-center gap-1.5 border-b border-border bg-secondary px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lavori/nottea/desktop.jpg"
              alt="Homepage del sito NÒTTEA su desktop"
              className="w-full"
            />
          </div>

          {/* phone mockup — always visible */}
          <div className="relative w-36 shrink-0 overflow-hidden rounded-[1.6rem] border-4 border-neutral-800 bg-background shadow-xl sm:w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lavori/nottea/mobile.jpg"
              alt="Homepage del sito NÒTTEA su smartphone"
              className="w-full"
            />
          </div>
        </div>

        <div className="text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <p className="font-display text-xl tracking-tight">NÒTTEA · Sito premium animato</p>
            <span className="rounded-full bg-lime-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-lime">
              Concept
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Un sito scroll-driven per un brand di profumeria di lusso — identico nello stile ai
            progetti che costruiamo per i nostri clienti.
          </p>
          <Link
            href={NOTTEA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lime mt-6 inline-flex"
          >
            Guarda il sito live →
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
