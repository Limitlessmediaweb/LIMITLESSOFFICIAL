"use client";

import { useState } from "react";
import { SmartVideo } from "@/components/media/SmartVideo";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { CropMarks, Rec } from "@/components/ui/Viewfinder";
import { T } from "@/components/ui/T";
import type { MediaSource } from "@/lib/media";
import { clean } from "@/lib/placeholder";
import { cn } from "@/lib/cn";

export type Tour = { slug: string; nome: string; settore: string; frase: string; media: MediaSource; vertical: boolean };

/** Player cinematografico dei walk tour con selettore a chip. */
export function WalkTour({ tours }: { tours: Tour[] }) {
  const [i, setI] = useState(0);
  const t = tours[i];
  if (!t) return null;

  return (
    <section aria-labelledby="walktour-title" className="wrap py-24 md:py-36">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-end lg:gap-16">
        <div>
          <SplitReveal id="walktour-title" className="max-w-[14ch] text-title">
            Fai entrare i clienti prima che arrivino.
          </SplitReveal>
          <p className="mt-6 max-w-[42ch] text-lead text-fg-muted">
            <T>{"Un tour video della tua location o del tuo immobile. Partiamo dalle foto che hai già, senza sopralluogo. [DA CONFERMARE: frase sulle foto]"}</T>
          </p>

          <div role="radiogroup" aria-label="Scegli il walk tour" className="mt-8 flex flex-wrap gap-2">
            {tours.map((x, k) => (
              <button
                key={x.slug}
                type="button"
                role="radio"
                aria-checked={k === i}
                onClick={() => setI(k)}
                className={cn(
                  "min-h-11 border px-4 text-sm font-semibold transition-colors",
                  k === i ? "border-accent bg-accent text-accent-ink" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
                )}
              >
                {x.nome}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="mb-3 flex items-center justify-between text-fg-muted">
            <Rec label="Walk tour" />
            <span className="mono">
              {clean(t.settore)}
              <span className="ml-3 tag-concept py-0.5">Concept</span>
            </span>
          </div>
          <div className="relative">
            <SmartVideo
              key={t.slug}
              src={t.media}
              label={`Walk tour ${clean(t.nome)}`}
              description={`Video walk tour di ${clean(t.nome)} (${clean(t.settore).toLowerCase()}): la camera attraversa gli ambienti stanza per stanza.`}
              aspect={t.vertical ? "9 / 16" : "16 / 9"}
              className={cn(t.vertical ? "mx-auto h-[min(70vh,calc((100vw-2rem)*16/9))] w-auto" : "w-full")}
              showAudio
            />
            {!t.vertical && <CropMarks inset={-10} />}
          </div>
          <p className="mt-4 text-fg-muted">
            <T>{t.frase}</T>
          </p>
        </div>
      </div>
    </section>
  );
}
