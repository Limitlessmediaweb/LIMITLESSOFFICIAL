"use client";

import { useRef, ViewTransition } from "react";
import { usePathname } from "next/navigation";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { getLenis } from "./SmoothScroll";

/**
 * Transizione tra le pagine.
 * Browser con View Transitions: <ViewTransition> di React (le navigazioni di Next sono transition)
 * fa la dissolvenza incrociata. Senza supporto: fallback GSAP con una dissolvenza breve.
 * A ogni cambio rotta: scroll in cima e ScrollTrigger aggiornato.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const first = useRef(true);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      getLenis()?.scrollTo(0, { immediate: true });
      const supportsVT = "startViewTransition" in document;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        if (!supportsVT) gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power3.out" });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { dependencies: [path], scope: ref },
  );

  return (
    <ViewTransition>
      <div ref={ref}>{children}</div>
    </ViewTransition>
  );
}
