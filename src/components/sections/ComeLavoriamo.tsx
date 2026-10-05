"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { DrawLine } from "@/components/motion/DrawLine";
import { T } from "@/components/ui/T";

const PASSI = [
  { t: "Ci scrivi su WhatsApp", d: "Ci racconti la tua attività in due righe. Rispondiamo in giornata. [DA CONFERMARE]" },
  { t: "Ti mostriamo un esempio", d: "Prepariamo un'anteprima pensata per un'attività come la tua. Così vedi la direzione prima di decidere." },
  { t: "Confermi con un acconto", d: "Il 50% per partire, il resto alla consegna. Nessun costo nascosto." },
  {
    t: "Consegna in pochi giorni",
    d: "Spot in 3-5 giorni, walk tour in 5-7, sito in circa una settimana. Due giri di revisioni inclusi. [DA CONFERMARE: tempi]",
  },
];

/**
 * Come lavoriamo: a sinistra il titolo e il numero del passo restano fissi,
 * a destra i passi scorrono lungo una linea che si disegna.
 */
export function ComeLavoriamo() {
  const ref = useRef<HTMLElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-passo]", ref.current);
      steps.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => {
            el.dataset.active = String(self.isActive);
            if (self.isActive && num.current) {
              num.current.textContent = String(i + 1).padStart(2, "0");
              gsap.fromTo(num.current, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" });
            }
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="come-title" className="wrap py-24 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="come-title" className="max-w-[12ch] text-title">
            Dal primo messaggio alla consegna.
          </h2>
          <p className="mt-6 hidden items-baseline gap-3 lg:flex" aria-hidden>
            <span ref={num} className="font-display text-[10rem] font-extrabold leading-none text-accent-text">
              01
            </span>
            <span className="mono text-fg-muted">/ 04</span>
          </p>
        </div>

        <ol className="relative pl-10 md:pl-14">
          <DrawLine className="absolute bottom-0 left-[7px] top-2 h-[calc(100%-0.5rem)] w-[2px] text-accent md:left-[11px]" />
          <span aria-hidden className="absolute bottom-0 left-[7px] top-2 w-px bg-line md:left-[11px]" />
          {PASSI.map((p, i) => (
            <li
              key={p.t}
              data-passo
              data-active="false"
              className="group relative pb-20 last:pb-0 md:min-h-[42vh] md:pb-28"
            >
              <span
                aria-hidden
                className="absolute -left-10 top-1 grid size-4 place-items-center border border-line-strong bg-bg group-data-[active=true]:border-accent group-data-[active=true]:bg-accent md:-left-14 md:size-6"
              />
              <span className="mono text-fg-muted">Passo {i + 1}</span>
              <h3 className="mt-3 text-[clamp(2rem,1rem+2.6vw,3.75rem)] leading-[0.95]">{p.t}</h3>
              <p className="mt-4 max-w-[44ch] text-lead text-fg-muted">
                <T>{p.d}</T>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
