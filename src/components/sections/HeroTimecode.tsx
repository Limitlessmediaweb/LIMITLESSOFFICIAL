"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Timecode che avanza con lo scroll della pagina (come la testina di una timeline di montaggio).
 * Aggiorna il testo direttamente, senza re-render React.
 */
export function HeroTimecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const el = ref.current!;
    const pad = (n: number) => String(n).padStart(2, "0");
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const secs = self.progress * 92; // l'intera pagina = 1:32 di "girato"
        el.textContent = `00:${pad(Math.floor(secs / 60))}:${pad(Math.floor(secs % 60))}:${pad(Math.floor((secs % 1) * 25))}`;
      },
    });
    return () => st.kill();
  });
  return (
    <span ref={ref} className="mono" aria-hidden>
      00:00:00:00
    </span>
  );
}
