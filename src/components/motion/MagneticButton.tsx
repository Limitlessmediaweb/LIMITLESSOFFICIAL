"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * Attira leggermente il contenuto verso il puntatore. Solo desktop con puntatore fine
 * e senza reduced motion; ritorno morbido senza rimbalzi (power3.out).
 */
export function MagneticButton({ children, strength = 0.28 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className="inline-flex">
      {children}
    </span>
  );
}
