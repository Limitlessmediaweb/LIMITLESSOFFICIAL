"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Testo grande che si "accende" parola per parola mentre scorri (scrub).
 * Le parole partono attenuate (contrasto AA per testo grande anche spente) e arrivano al colore pieno.
 */
export function ScrubText({ children, className, as: Tag = "p" }: { children: React.ReactNode; className?: string; as?: React.ElementType }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create(ref.current!, { type: "words", aria: "none" });
        gsap.fromTo(
          split.words,
          // parole normali al 45%, parole in accento al 72%: restano ≥ 3:1 in entrambi i temi
          { opacity: (_i: number, el: Element) => (el.closest(".text-accent-text") ? 0.72 : 0.45) },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
          },
        );
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
