"use client";

import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

type SplitTextRevealProps = {
  text: string;
  as?: ElementType;
  className?: string;
  splitBy?: "words" | "chars" | "lines";
  delay?: number;
  /** Trigger immediately on mount instead of on scroll (e.g. hero H1). */
  immediate?: boolean;
};

/**
 * Word/char/line reveal used for headings. Clean fade + slide, no bounce —
 * this is one of the base (non-signature) animation moments.
 */
export function SplitTextReveal({
  text,
  as: Tag = "h2",
  className,
  splitBy = "words",
  delay = 0,
  immediate = false,
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }

      gsap.set(el, { autoAlpha: 1 });

      const split = SplitText.create(el, {
        type: splitBy,
        mask: splitBy,
      });

      const targets =
        splitBy === "words" ? split.words : splitBy === "chars" ? split.chars : split.lines;

      gsap.fromTo(
        targets,
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.9,
          delay,
          ease: "power3.out",
          stagger: splitBy === "chars" ? 0.02 : 0.06,
          scrollTrigger: immediate
            ? undefined
            : { trigger: el, start: "top 88%", once: true },
        },
      );

      return () => split.revert();
    },
    { scope: ref, dependencies: [text, splitBy, delay, immediate] },
  );

  return (
    <Tag ref={ref as never} className={className} style={{ visibility: "hidden" }}>
      {text}
    </Tag>
  );
}
