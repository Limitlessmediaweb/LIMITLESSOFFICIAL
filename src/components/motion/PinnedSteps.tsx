"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Passi "fissati": ogni passo occupa uno schermo e resta fermo (sticky) mentre arriva il successivo,
 * che lo copre. Il passo precedente si riduce e si scurisce leggermente.
 * Con reduced motion i passi sono semplicemente uno sotto l'altro.
 * `onStep` riceve l'indice del passo attivo (per contatori, timecode, ecc.).
 */
export function PinnedSteps({
  steps,
  className,
  stepClassName,
  onStep,
}: {
  steps: React.ReactNode[];
  className?: string;
  stepClassName?: string;
  onStep?: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-step]", ref.current);
      els.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => self.isActive && onStep?.(i),
        });
      });
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        els.forEach((el, i) => {
          const next = els[i + 1];
          if (!next) return;
          gsap.to(el.firstElementChild, {
            scale: 0.94,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      {steps.map((s, i) => (
        <div
          key={i}
          data-step
          className={cn("motion-safe:sticky motion-safe:top-0 relative min-h-[100dvh]", stepClassName)}
          style={{ zIndex: i + 1 }}
        >
          <div className="min-h-[100dvh] origin-top will-change-transform">{s}</div>
        </div>
      ))}
    </div>
  );
}
