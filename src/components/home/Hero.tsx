"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ScrollPinSection } from "@/components/gsap/ScrollPinSection";
import { HeroLaptop, HERO_SEGMENTS, type HeroLaptopHandle } from "@/components/HeroLaptop";
import { SplitTextReveal } from "@/components/gsap/SplitTextReveal";
import { MagneticButton } from "@/components/gsap/MagneticButton";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/content";

export function Hero() {
  const laptopRef = useRef<HeroLaptopHandle>(null);
  const lastIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleUpdate(progress: number) {
    laptopRef.current?.update(progress);
    const idx = Math.min(HERO_SEGMENTS.length - 1, Math.floor(progress * HERO_SEGMENTS.length));
    if (idx !== lastIndexRef.current) {
      lastIndexRef.current = idx;
      setActiveIndex(idx);
    }
  }

  return (
    <ScrollPinSection
      distance="+=175%"
      onUpdate={handleUpdate}
      reducedMotionProgress={0}
      className="relative overflow-hidden bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-15%] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-lime/10 blur-[140px]"
      />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 py-28 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="eyebrow">Digital studio · Siti · Video</p>
          <SplitTextReveal
            as="h1"
            immediate
            text="La tua attività merita di sembrare online come merita dal vivo."
            className="mt-4 font-display text-4xl leading-[1.06] tracking-[-0.03em] sm:text-5xl md:text-6xl"
          />
          <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
            Siti web, video e contenuti premium per trasformare la tua presenza online in uno
            strumento che porta clienti.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton>
              <Link href="/contatti" className="btn-lime">
                {PRIMARY_CTA} →
              </Link>
            </MagneticButton>
            <Link href="/lavori" className="btn-ghost">
              {SECONDARY_CTA}
            </Link>
          </div>
          <p className="mt-6 text-xs tracking-wide text-muted-foreground">
            Consulenza e preventivo gratuiti · Rispondiamo in tempi brevi
          </p>

          <ul className="mt-12 flex flex-col gap-2.5">
            {HERO_SEGMENTS.map((seg, i) => (
              <li
                key={seg.key}
                className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
                  i === activeIndex ? "text-lime" : "text-muted-foreground"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                    i === activeIndex ? "bg-lime" : "bg-muted-foreground/40"
                  }`}
                  aria-hidden
                />
                {seg.label}
              </li>
            ))}
          </ul>
        </div>

        <HeroLaptop ref={laptopRef} />
      </div>
    </ScrollPinSection>
  );
}
