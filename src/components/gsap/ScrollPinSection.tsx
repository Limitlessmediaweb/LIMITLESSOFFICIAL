"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollPinSectionProps = {
  children: ReactNode;
  className?: string;
  /** Extra scroll distance to pin for, as a ScrollTrigger `end` value (e.g. "+=150%"). */
  distance?: string;
  onUpdate?: (progress: number) => void;
  disabled?: boolean;
  /** Progress value reported once when pinning is skipped (reduced motion / disabled). */
  reducedMotionProgress?: number;
};

/**
 * Generic pinned + scrubbed section wrapper. Reports scroll progress (0-1)
 * through the pin range via `onUpdate`, called imperatively (no React state)
 * so consumers can drive their own timelines without extra re-renders.
 */
export function ScrollPinSection({
  children,
  className,
  distance = "+=150%",
  onUpdate,
  disabled,
  reducedMotionProgress = 1,
}: ScrollPinSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (disabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onUpdate?.(reducedMotionProgress);
        return;
      }

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: distance,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => onUpdate?.(self.progress),
      });

      return () => st.kill();
    },
    { scope: ref, dependencies: [distance, disabled] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
