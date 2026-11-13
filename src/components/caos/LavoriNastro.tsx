"use client";

import { useEffect, useRef } from "react";
import { lavoriHome } from "@/data/home";

/**
 * Lavori in home: quattro schede. Ogni video parte solo quando la scheda è sullo schermo e si ferma quando esce.
 * Il file non viene scaricato prima (preload="none" + copertina). Su telefono ne gira uno solo alla volta,
 * quello più vicino al centro. Tutti i video sono senza audio. I concept sono sempre segnati.
 */
export function LavoriGriglia() {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const cards = Array.from(ref.current!.querySelectorAll<HTMLElement>("[data-lavoro]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (reduce || saveData) return; // restano le copertine
    const unoAllaVolta = window.matchMedia("(pointer: coarse), (max-width: 767.98px)").matches;
    const visibili = new Set<HTMLElement>();

    const play = (c: HTMLElement, on: boolean) => {
      const v = c.querySelector("video");
      if (!v) return;
      if (on) {
        if (!v.src) v.src = v.dataset.src!;
        if (v.paused) v.play().catch(() => {});
      } else if (!v.paused) v.pause();
    };
    const aggiorna = () => {
      let scelto: HTMLElement | null = null;
      if (unoAllaVolta) {
        let best = Infinity;
        for (const c of visibili) {
          const r = c.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - window.innerHeight / 2) + Math.abs(r.left + r.width / 2 - window.innerWidth / 2) * 0.2;
          if (d < best) {
            best = d;
            scelto = c;
          }
        }
      }
      for (const c of cards) play(c, unoAllaVolta ? c === scelto : visibili.has(c));
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visibili.add(e.target as HTMLElement);
          else visibili.delete(e.target as HTMLElement);
        }
        aggiorna();
      },
      { threshold: 0.5 },
    );
    cards.forEach((c) => io.observe(c));

    // su telefono, mentre si scorre cambia la scheda più vicina al centro
    let raf = 0;
    const onScroll = () => {
      if (!raf && visibili.size > 1)
        raf = requestAnimationFrame(() => {
          raf = 0;
          aggiorna();
        });
    };
    if (unoAllaVolta) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      cards.forEach((c) => c.querySelector("video")?.pause());
    };
  }, []);

  return (
    <ul ref={ref} className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
      {lavoriHome.map((l) => (
        <li key={l.slug} data-lavoro className="min-w-0 border border-line bg-bg-raised">
          <div className="relative aspect-[9/16] overflow-hidden bg-bg-sunken">
            <video
              muted
              loop
              playsInline
              preload="none"
              poster={`/media/home/${l.slug}.jpg`}
              data-src={`/media/home/${l.slug}.mp4`}
              aria-label={l.alt}
              className="absolute inset-0 size-full object-cover"
            />
            {l.concept && <span className="tag-concept absolute right-2 top-2 border-[#f2f0ea]/50 bg-black/70 !text-[#f2f0ea]">Concept</span>}
          </div>
          <div className="p-3 md:p-4">
            <p className="mono text-accent-text">{l.tipo}</p>
            <h3 className="mt-1.5 text-xl leading-none md:text-2xl">{l.nome}</h3>
            <p className="mt-2 text-sm text-fg-muted">{l.riga}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
