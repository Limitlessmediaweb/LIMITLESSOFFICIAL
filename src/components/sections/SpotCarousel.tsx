"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { SmartVideo } from "@/components/media/SmartVideo";
import { Lightbox, type LightboxItem } from "@/components/media/Lightbox";
import { T } from "@/components/ui/T";
import { clean } from "@/lib/placeholder";

export type SpotCard = {
  slug: string;
  nome: string;
  settore: string;
  frase: string;
  concept: boolean;
  item: LightboxItem;
};

/**
 * Spot e video promo. Desktop: scorrimento orizzontale fissato. Mobile: carosello con snap.
 * Il video parte quando la card è (quasi) tutta visibile. Tocco = audio, doppio tocco o pulsante = lightbox.
 */
export function SpotCarousel({ cards }: { cards: SpotCard[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = cards.map((c) => c.item);

  return (
    <section aria-labelledby="spot-title" className="relative overflow-hidden py-24 lg:py-0">
      <HorizontalScroll
        header={
          <div className="wrap mb-10 lg:mb-8 lg:pt-20">
            <SplitReveal id="spot-title" className="max-w-[20ch] text-title">
              Il tuo prodotto, come un grande brand.
            </SplitReveal>
            <p className="mt-4 max-w-[52ch] text-fg-muted">
              Video verticali per Instagram, TikTok e WhatsApp. Tocca un video per l&apos;audio, toccalo due volte per vederlo a tutto schermo.
            </p>
          </div>
        }
      >
        {cards.map((c, i) => (
          <figure key={c.slug} className="w-[68vw] max-w-[300px] shrink-0 snap-center sm:w-[42vw] lg:w-[clamp(190px,14.5vw,250px)]">
            <PhoneFrame screenAspect="9 / 16">
              <SmartVideo
                src={c.item.media}
                label={`Spot ${clean(c.nome)}`}
                description={`Spot verticale di ${clean(c.nome)}, settore ${clean(c.settore).toLowerCase()}.`}
                className="absolute inset-0"
                threshold={0.8}
                tapForAudio
                showAudio
                onDoubleActivate={() => setOpen(i)}
              />
            </PhoneFrame>
            <figcaption className="mt-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-2xl font-extrabold leading-none">{c.nome}</p>
                <p className="mt-1 text-sm text-fg-muted">
                  <T>{c.settore}</T>
                  {c.concept && <span className="ml-2 tag-concept py-0.5 text-[0.6rem]">Concept</span>}
                </p>
                <p className="mt-2 text-sm text-fg-muted">
                  <T>{c.frase}</T>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="grid size-11 shrink-0 place-items-center border border-line hover:border-line-strong"
                aria-label={`Guarda ${clean(c.nome)} a schermo intero`}
              >
                <Maximize2 size={16} aria-hidden />
              </button>
            </figcaption>
          </figure>
        ))}
      </HorizontalScroll>
      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </section>
  );
}
