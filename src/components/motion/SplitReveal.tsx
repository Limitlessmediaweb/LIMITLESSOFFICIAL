"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  /** "lines" per i titoli lunghi, "chars" per parole singole (wordmark). */
  by?: "lines" | "words" | "chars";
  delay?: number;
  /** Parte subito (hero) invece che allo scroll. */
  immediate?: boolean;
  id?: string;
};

/** Titolo che sale dal basso dietro una maschera, riga per riga (o lettera per lettera). */
export function SplitReveal({ children, as: Tag = "h2", className, by = "lines", delay = 0, immediate = false, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current!;
        gsap.set(el, { opacity: 1 });
        const split = SplitText.create(el, {
          type: by === "chars" ? "chars,words,lines" : by === "words" ? "words,lines" : "lines",
          mask: by === "chars" ? "chars" : by === "words" ? "words" : "lines", linesClass: "split-line", wordsClass: "split-word", charsClass: "split-char",
          aria: typeof Tag === "string" && /^h[1-6]$/.test(Tag) ? "auto" : "none",
          autoSplit: by !== "chars",
          onSplit(self) {
            const targets = by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
            return gsap.from(targets, {
              yPercent: 110,
              duration: by === "chars" ? 0.9 : 1.1,
              ease: "expo.out",
              stagger: by === "chars" ? 0.035 : by === "words" ? 0.04 : 0.09,
              delay,
              scrollTrigger: immediate ? undefined : { trigger: el, start: "top 85%", once: true },
            });
          },
        });
        return () => split.revert();
      });
      mm.add(MQ.reduce, () => gsap.set(ref.current, { opacity: 1 }));
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={cn("js-reveal", className)}>
      {children}
    </Tag>
  );
}
