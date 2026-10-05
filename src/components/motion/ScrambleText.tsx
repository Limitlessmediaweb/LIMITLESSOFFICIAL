"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/** Etichetta tecnica che si "decodifica" quando entra in vista (timecode, capitoli). */
export function ScrambleText({
  text,
  className,
  chars = "0123456789:/",
  duration = 0.9,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  chars?: string;
  duration?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.to(ref.current, {
          duration,
          scrambleText: { text, chars, speed: 0.6, revealDelay: 0.2 },
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top 92%", once: true },
        });
      });
    },
    { scope: ref, dependencies: [text] },
  );
  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
