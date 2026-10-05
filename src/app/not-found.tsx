import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Rec } from "@/components/ui/Viewfinder";

export const metadata: Metadata = {
  title: { absolute: "Segnale perso | LIMITLESS" },
  description: "Questa pagina non esiste. Torna alla home o guarda i lavori di LIMITLESS.",
  robots: { index: false, follow: true },
};

/** 404 "segnale perso": schermo con disturbo, timecode fermo su 404. */
export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#070707] text-[#f2f0ea]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="signal-noise" />
        <div className="signal-roll" />
      </div>
      <div className="wrap py-28">
        <div className="mb-8 flex flex-wrap items-center gap-4 text-white/70">
          <Rec label="Nessun segnale" />
          <span className="mono">00:00:04:04</span>
        </div>
        <p aria-hidden className="font-display text-[clamp(7rem,30vw,22rem)] font-extrabold leading-[0.8]">
          404
        </p>
        <h1 id="nf-title" className="mt-6 max-w-[18ch] text-title">
          Segnale perso. Questa pagina non esiste.
        </h1>
        <p className="mt-4 max-w-[46ch] text-lead text-white/75">Forse il link è vecchio o c&apos;è un errore di battitura. Riprendiamo da qui.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-accent">
            Torna alla home
          </Link>
          <Link href="/lavori" className="btn btn-on-media">
            Guarda i lavori
            <ArrowRight size={17} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
