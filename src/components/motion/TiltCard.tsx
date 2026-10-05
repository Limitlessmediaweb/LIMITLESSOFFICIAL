"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** Inclinazione leggera (max ~5°) seguendo il puntatore. Solo puntatore fine, niente con reduced motion. */
export function TiltCard({ children, className, max = 5 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
        gsap.set(el, { transformPerspective: 900 });
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * max * 2);
          rx(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
