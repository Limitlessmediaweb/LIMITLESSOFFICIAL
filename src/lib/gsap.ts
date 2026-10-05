"use client";
/** Registra i plugin GSAP una sola volta (tutti gratuiti da GSAP 3.13; verificato su 3.15). */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

/** Media query condivise con gsap.matchMedia(). */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023.98px)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

// Flip si registra solo dove serve (pagina /lavori), per non appesantire la home.
export { gsap, ScrollTrigger, SplitText, useGSAP };
