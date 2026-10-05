"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Maximize2 } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);
import { SmartVideo } from "@/components/media/SmartVideo";
import { Lightbox, type LightboxItem } from "@/components/media/Lightbox";
import { T } from "@/components/ui/T";
import type { TipoLavoro } from "@/data/progetti";
import type { MediaSource } from "@/lib/media";
import { track } from "@/lib/analytics";
import { clean } from "@/lib/placeholder";
import { cn } from "@/lib/cn";

export type LavoroCard = {
  slug: string;
  nome: string;
  tipo: TipoLavoro;
  settore: string;
  frase: string;
  concept: boolean;
  media: MediaSource;
};

const FILTRI: { id: "tutti" | TipoLavoro; label: string }[] = [
  { id: "tutti", label: "Tutti" },
  { id: "sito-spot", label: "Sito + Spot" },
  { id: "spot", label: "Spot" },
  { id: "walktour", label: "Walk tour" },
];

const TIPO_LABEL: Record<TipoLavoro, string> = { "sito-spot": "Sito + Spot", spot: "Spot", walktour: "Walk tour" };

export function LavoriGrid({ cards }: { cards: LavoroCard[] }) {
  const [filtro, setFiltro] = useState<(typeof FILTRI)[number]["id"]>("tutti");
  const [open, setOpen] = useState<number | null>(null);
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visibili = cards.filter((c) => filtro === "tutti" || c.tipo === filtro);
  const items: LightboxItem[] = visibili.map((c) => ({
    id: c.slug,
    title: c.nome,
    subtitle: `${TIPO_LABEL[c.tipo]}, ${clean(c.settore)}`,
    media: c.media,
    vertical: c.media.vertical,
  }));

  const scegli = (id: typeof filtro) => {
    if (id === filtro) return;
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-flip]"));
    setFiltro(id);
    track("filtro_lavori", { filtro: id });
  };

  // anima il passaggio tra un filtro e l'altro (Flip), senza rimbalzi
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !grid.current) return;
    flipState.current = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    Flip.from(state, {
      targets: grid.current.querySelectorAll("[data-flip]"),
      duration: 0.7,
      ease: "power3.out",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
    });
  }, [filtro]);

  return (
    <>
      <div role="group" aria-label="Filtra i lavori" className="flex flex-wrap gap-2">
        {FILTRI.map((f) => {
          const n = f.id === "tutti" ? cards.length : cards.filter((c) => c.tipo === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={filtro === f.id}
              onClick={() => scegli(f.id)}
              className={cn(
                "min-h-11 border px-4 text-[0.95rem] font-semibold transition-colors",
                filtro === f.id ? "border-accent bg-accent text-accent-ink" : "border-line text-fg-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {f.label} <span className="ml-1 font-mono text-xs opacity-70">{n}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {visibili.length} lavori mostrati
      </p>

      <ul ref={grid} className="mt-10 grid grid-flow-dense grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {visibili.map((c, i) => {
          const wide = !c.media.vertical;
          return (
            <li key={c.slug} data-flip data-flip-id={c.slug} className={cn(wide && "col-span-2")}>
              <div className="relative">
                <SmartVideo
                  src={c.media}
                  label={`${TIPO_LABEL[c.tipo]} ${clean(c.nome)}`}
                  description={`${TIPO_LABEL[c.tipo]} di ${clean(c.nome)}, ${clean(c.settore).toLowerCase()}.`}
                  aspect={c.media.vertical ? "9 / 16" : `${c.media.width} / ${c.media.height}`}
                  className="w-full border border-line"
                  threshold={0.6}
                  onDoubleActivate={() => setOpen(i)}
                  controlsPosition="top-right"
                />
                {c.concept && <span className="tag-concept pointer-events-none absolute bottom-3 left-3 bg-black/60 text-[#f2f0ea] backdrop-blur">Concept</span>}
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="mono text-fg-muted">{TIPO_LABEL[c.tipo]}</p>
                  <h2 className="mt-1 text-2xl leading-none md:text-3xl">{c.nome}</h2>
                  <p className="mt-1 text-sm text-fg-muted">
                    <T>{c.settore}</T>
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
              </div>
              {c.tipo === "sito-spot" && (
                <Link href={`/lavori/${c.slug}`} className="mt-3 inline-flex items-center gap-2 font-semibold text-accent-text link-line">
                  Vedi il progetto
                  <ArrowRight size={15} aria-hidden />
                  <span className="sr-only"> {clean(c.nome)}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
