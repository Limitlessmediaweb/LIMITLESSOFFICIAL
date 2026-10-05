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

/**
 * Titolo che sale dal basso dietro una maschera, riga per riga (o lettera per lettera).
 * Lo split si fa solo quando il titolo sta per entrare nello schermo (IntersectionObserver),
 * non al caricamento: meno lavoro sul main thread all'avvio. Finita l'animazione il testo
 * torna al DOM originale (split.revert), quindi niente ricalcoli al resize.
 */
export function SplitReveal({ children, as: Tag = "h2", className, by = "lines", delay = 0, immediate = false, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current!;
        let split: SplitText | null = null;

        const play = () => {
          gsap.set(el, { opacity: 1 });
          split = SplitText.create(el, {
            type: by === "chars" ? "chars,words,lines" : by === "words" ? "words,lines" : "lines",
            mask: by === "chars" ? "chars" : by === "words" ? "words" : "lines",
            linesClass: "split-line",
            wordsClass: "split-word",
            charsClass: "split-char",
            aria: typeof Tag === "string" && /^h[1-6]$/.test(Tag) ? "auto" : "none",
          });
          const targets = by === "chars" ? split.chars : by === "words" ? split.words : split.lines;
          gsap.from(targets, {
            yPercent: 110,
            duration: by === "chars" ? 0.9 : 1.1,
            ease: "expo.out",
            stagger: by === "chars" ? 0.035 : by === "words" ? 0.04 : 0.09,
            delay,
            onComplete: () => {
              split?.revert();
              split = null;
            },
          });
        };

        if (immediate) {
          play();
          return () => split?.revert();
        }
        // parte quando il titolo arriva all'85% dell'altezza dello schermo
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io.disconnect();
              play();
            }
          },
          { rootMargin: "0px 0px -15% 0px" },
        );
        io.observe(el);
        return () => {
          io.disconnect();
          split?.revert();
        };
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
