"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { INTRO_DONE } from "./Intro";

/**
 * Testi dell'hero, visibili subito nell'HTML (sono l'LCP quando l'intro non c'è).
 * Se l'intro sta per partire (li copre), si preparano nascosti e salgono quando finisce.
 */
export function HeroCopy({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // intro già vista: i testi restano come sono, nessuna animazione
        if (window.__introDone || document.documentElement.classList.contains("intro-seen")) return;
        const h1 = el.querySelector("h1")!;
        const rest = el.querySelectorAll("[data-hero-fade]");
        const split = SplitText.create(h1, { type: "lines", mask: "lines", linesClass: "split-line", wordsClass: "split-word", charsClass: "split-char", aria: "auto" });
        const tl = gsap.timeline({ paused: true });
        tl.from(split.lines, { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.1 }).from(
          rest,
          { opacity: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.08 },
          "-=0.7",
        );
        const play = () => tl.play();
        window.addEventListener(INTRO_DONE, play, { once: true });
        return () => {
          window.removeEventListener(INTRO_DONE, play);
          split.revert();
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}
