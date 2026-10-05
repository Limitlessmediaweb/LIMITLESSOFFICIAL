"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** Sposta il livello in verticale a velocità diversa dallo scroll (speed: % dell'altezza). */
export function ParallaxLayer({ children, speed = 12, className }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: -speed / 2 },
          {
            yPercent: speed / 2,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
