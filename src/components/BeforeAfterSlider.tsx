"use client";

import { useId, useRef, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type BeforeAfterSliderProps = {
  beforeSrc: string;
  beforeAlt: string;
  beforeLabel?: string;
  afterSrc: string;
  afterAlt: string;
  afterLabel?: string;
  className?: string;
};

/**
 * Drag-to-compare slider — one of the two "signature" moments allowed to
 * stand out visually (see the animation principle: sober everywhere else).
 * Built on a native <input type="range"> for full keyboard/screen-reader
 * support; the visual handle and clip-path just mirror its value.
 */
export function BeforeAfterSlider({
  beforeSrc,
  beforeAlt,
  beforeLabel = "Prima",
  afterSrc,
  afterAlt,
  afterLabel = "Dopo",
  className,
}: BeforeAfterSliderProps) {
  const [value, setValue] = useState(50);
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        el,
        { autoAlpha: 0, scale: 0.97 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className={`relative aspect-[16/10] w-full touch-pan-y select-none overflow-hidden rounded-2xl border border-border bg-black ${className ?? ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterSrc}
        alt={afterAlt}
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
      />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt={beforeAlt}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
        {afterLabel}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/85"
        style={{ left: `${value}%` }}
      />
      <div
        className="pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
        style={{ left: `${value}%` }}
        aria-hidden
      >
        <ArrowLeftRight className="h-4 w-4" />
      </div>

      <label htmlFor={id} className="sr-only">
        Confronta {beforeLabel.toLowerCase()} e {afterLabel.toLowerCase()}: trascina per rivelare
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
