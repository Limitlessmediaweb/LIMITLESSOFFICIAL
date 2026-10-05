"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Barra sottile in alto, in stile timeline di montaggio, che segue l'avanzamento della pagina. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.set(bar.current, { scaleX: 0 });
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
    });
  });
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px]">
      <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
