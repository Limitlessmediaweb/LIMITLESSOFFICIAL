"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Desktop: la sezione si fissa e la traccia scorre in orizzontale mentre scorri in verticale.
 * Mobile / reduced motion: carosello nativo con scroll-snap (gestito dai figli via CSS).
 * Espone l'avanzamento con l'evento "hscroll-progress" per sapere quale card è al centro.
 */
export function HorizontalScroll({
  children,
  className,
  trackClassName,
  header,
}: {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  header?: React.ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const t = track.current!;
        const distance = () => t.scrollWidth - t.clientWidth;
        gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={cn("relative lg:flex lg:min-h-[100dvh] lg:flex-col lg:justify-center", className)}>
      {header}
      <div
        ref={track}
        className={cn(
          // mobile: carosello con snap; desktop (motion): traccia mossa da GSAP
          "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 [scrollbar-width:none] md:px-8",
          "lg:motion-safe:snap-none lg:motion-safe:overflow-visible lg:gap-8 lg:px-12",
          trackClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
