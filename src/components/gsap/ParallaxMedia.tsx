"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ParallaxMediaProps = {
  children: ReactNode;
  className?: string;
  /** Vertical travel in pixels over the scroll range. Keep small — light parallax only. */
  amount?: number;
};

/** Light parallax on editorial images/video — part of the sober, default motion set. */
export function ParallaxMedia({ children, className, amount = 40 }: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        el,
        { y: -amount },
        {
          y: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [amount] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
