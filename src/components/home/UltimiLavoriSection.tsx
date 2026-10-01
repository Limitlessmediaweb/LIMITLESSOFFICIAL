"use client";

import { useState } from "react";
import { Reveal } from "@/components/gsap/Reveal";
import { LavoroCard } from "@/components/home/LavoroCard";
import { VideoLightbox } from "@/components/home/VideoLightbox";
import { NotteaShowcase } from "@/components/home/NotteaShowcase";
import { LAVORI_RECENTI, type LavoroRecente } from "@/lib/lavori-recenti";
import { BUSINESS } from "@/lib/content";

const WHATSAPP_MESSAGE = "Ciao Riccardo, ho visto i tuoi lavori sul sito";
const WHATSAPP_URL = `https://wa.me/${BUSINESS.phoneHref.replace("+", "")}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

/**
 * "Ultimi lavori" — second thing on the home page after the hero. Shows the
 * 5 most recent vertical videos so anyone opening the link from WhatsApp or
 * Instagram sees real work within 3 seconds, on mobile, without scrolling.
 */
export function UltimiLavoriSection() {
  const [openLavoro, setOpenLavoro] = useState<LavoroRecente | null>(null);

  return (
    <section className="border-b border-border px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Ultimi lavori</p>
          <h2 className="mt-3 font-display text-2xl leading-[1.1] tracking-[-0.02em] sm:text-3xl">
            Quello che stiamo facendo in questi giorni
          </h2>
        </Reveal>

        <Reveal className="mt-8">
          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:-mx-8 md:px-8">
            {LAVORI_RECENTI.map((lavoro) => (
              <LavoroCard key={lavoro.slug} lavoro={lavoro} onOpen={setOpenLavoro} />
            ))}
          </div>
        </Reveal>

        <NotteaShowcase />

        <div className="mt-12 flex justify-center">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lime"
          >
            Vuoi un video così per la tua attività? Scrivimi su WhatsApp
          </a>
        </div>
      </div>

      {openLavoro && <VideoLightbox lavoro={openLavoro} onClose={() => setOpenLavoro(null)} />}
    </section>
  );
}
