"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HorizontalScroll } from "@/components/motion/HorizontalScroll";
import { lavoriHome } from "@/data/home";

/**
 * Lavori 01–07: su computer lo scroll verticale diventa orizzontale, su telefono è un carosello.
 * Parte un solo video alla volta, quello al centro; gli altri restano fermi sulla copertina.
 * Tutti i video sono senza audio. I concept sono sempre segnati.
 */
export function LavoriNastro() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".lavoro-card"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    let current: HTMLElement | null = null;

    const focus = (card: HTMLElement | null) => {
      if (card === current) return;
      current = card;
      for (const c of cards) {
        const on = c === card;
        c.dataset.fuoco = String(on);
        const v = c.querySelector("video");
        if (!v) continue;
        if (on && !reduce && !saveData) {
          if (!v.src) v.src = v.dataset.src!;
          v.play().catch(() => {});
        } else v.pause();
      }
    };

    // «al centro» = dentro la fascia verticale centrale dello schermo
    const inside = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inside.add(e.target as HTMLElement);
          else inside.delete(e.target as HTMLElement);
        }
        let best: HTMLElement | null = null;
        let bestD = Infinity;
        for (const c of inside) {
          const r = c.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - window.innerWidth / 2);
          if (d < bestD) {
            bestD = d;
            best = c;
          }
        }
        focus(best);
      },
      { rootMargin: "0px -38% 0px -38%", threshold: 0 },
    );
    cards.forEach((c) => {
      c.dataset.fuoco = "false";
      io.observe(c);
    });
    return () => {
      io.disconnect();
      cards.forEach((c) => {
        delete c.dataset.fuoco;
        c.querySelector("video")?.pause();
      });
    };
  }, []);

  return (
    <section ref={ref} id="lavori" aria-labelledby="lavori-title" className="scroll-mt-16 overflow-x-clip border-b border-line py-24 lg:py-0">
      <HorizontalScroll
        className="lg:pt-24"
        header={
          <div className="wrap mb-8 grid gap-4 lg:mb-10 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="mono text-accent-text">Lavori 01–07</p>
              <h2 id="lavori-title" className="mt-4 max-w-[16ch] text-title">
                In ordine dentro. Poi ti fai vedere fuori.
              </h2>
            </div>
            <p className="max-w-[46ch] text-fg-muted">
              Quando il lavoro gira, è il momento di farlo vedere. Sito, video e spot li facciamo noi, con lo stesso metodo. Sette lavori: scorri.
            </p>
          </div>
        }
      >
        {lavoriHome.map((l, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <article key={l.slug} className="lavoro-card w-[68vw] max-w-[300px] shrink-0 snap-center border border-line bg-bg-raised lg:w-[min(22vw,30svh)] lg:max-w-none">
              <div className="relative aspect-[9/16] overflow-hidden bg-bg-sunken">
                <video
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={`/media/home/${l.slug}.jpg`}
                  data-src={`/media/home/${l.slug}.mp4`}
                  aria-label={`Video del lavoro ${n}: ${l.nome}${l.concept ? " (concept)" : ""}`}
                  className="absolute inset-0 size-full object-cover"
                />
                <span className="mono absolute left-2 top-2 bg-black/70 px-1.5 py-0.5 text-[#f2f0ea]">{n}</span>
                {l.concept && <span className="tag-concept absolute right-2 top-2 border-[#f2f0ea]/50 bg-black/70 !text-[#f2f0ea]">Concept</span>}
              </div>
              <div className="p-4">
                <h3 className="text-2xl leading-none">{l.nome}</h3>
                <p className="mono mt-2 text-fg-muted">{l.tipo}</p>
                <p className="mt-2 text-sm text-fg-muted">{l.riga}</p>
              </div>
            </article>
          );
        })}
        <div className="flex w-[68vw] max-w-[300px] shrink-0 snap-center flex-col justify-center gap-4 border border-line p-6 lg:w-[min(22vw,30svh)] lg:max-w-none">
          <p className="font-display text-4xl font-extrabold leading-none">Ce ne sono altri.</p>
          <p className="text-sm text-fg-muted">I lavori segnati «Concept» sono progetti nostri, per attività inventate: li usiamo per mostrare cosa sappiamo fare.</p>
          <Link href="/lavori" className="btn btn-ghost">
            <span>Tutti i lavori</span>
            <ArrowRight size={17} aria-hidden />
          </Link>
        </div>
      </HorizontalScroll>
    </section>
  );
}
