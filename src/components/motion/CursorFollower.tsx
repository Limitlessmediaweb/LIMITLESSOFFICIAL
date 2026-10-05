"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * Etichetta che segue il puntatore: diventa "▶ Guarda" sopra i video ([data-cursor="video"]).
 * Il cursore di sistema resta visibile (accessibilità): questo è solo un indicatore.
 * Solo puntatore fine e senza reduced motion.
 */
export function CursorFollower() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
      let shown = false;
      const move = (e: PointerEvent) => {
        xTo(e.clientX + 18);
        yTo(e.clientY + 18);
        const over = (e.target as Element | null)?.closest?.('[data-cursor="video"]');
        const overControl = (e.target as Element | null)?.closest?.("button, a");
        const show = Boolean(over) && !overControl;
        if (show !== shown) {
          shown = show;
          gsap.to(el, { opacity: show ? 1 : 0, scale: show ? 1 : 0.85, duration: 0.3, ease: "power3.out" });
        }
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    });
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[85] hidden bg-accent px-3 py-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-accent-ink opacity-0 [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      ▶ Guarda
    </div>
  );
}
