"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let instance: Lenis | null = null;
export const getLenis = () => instance;

/**
 * Lenis sincronizzato con ScrollTrigger (un solo ticker, quello di GSAP).
 * Disattivato con prefers-reduced-motion e sui dispositivi touch (scroll nativo).
 * Rinfresca ScrollTrigger se i font arrivano dopo il load (al load ci pensa già ScrollTrigger).
 */
export function SmoothScroll() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let tick: ((t: number) => void) | null = null;
    if (!reduce && !coarse) {
      instance = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
      instance.on("scroll", ScrollTrigger.update);
      tick = (time: number) => instance?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // ScrollTrigger si aggiorna già da solo al "load": qui solo se i font arrivano dopo
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => {
      if (loaded) ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("load", onLoad);
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
    };
  }, []);

  return null;
}
