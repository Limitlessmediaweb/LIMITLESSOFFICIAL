"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** Linea verticale (o orizzontale) che si disegna seguendo lo scroll del contenitore indicato. */
export function DrawLine({
  className,
  orientation = "vertical",
  triggerSelector,
}: {
  className?: string;
  orientation?: "vertical" | "horizontal";
  /** Selettore del contenitore che guida lo scrub (default: il genitore). */
  triggerSelector?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    const line = ref.current!.querySelector("line")!;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const trigger = triggerSelector ? document.querySelector(triggerSelector) : ref.current!.parentElement;
      gsap.fromTo(
        line,
        { drawSVG: "0%" },
        { drawSVG: "100%", ease: "none", scrollTrigger: { trigger, start: "top 60%", end: "bottom 60%", scrub: true } },
      );
    });
  });
  const v = orientation === "vertical";
  return (
    <svg
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none overflow-visible", className)}
      viewBox={v ? "0 0 2 100" : "0 0 100 2"}
      preserveAspectRatio="none"
    >
      <line
        x1={v ? 1 : 0}
        y1={v ? 0 : 1}
        x2={v ? 1 : 100}
        y2={v ? 100 : 1}
        stroke="currentColor"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
