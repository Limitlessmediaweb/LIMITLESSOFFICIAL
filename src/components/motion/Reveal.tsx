"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  y?: number;
  delay?: number;
  /** Anima i figli diretti in sequenza (Stagger) invece del blocco intero. */
  stagger?: number;
};

/** Dissolvenza dal basso quando entra nello schermo. Senza JS e con reduced motion: visibile subito. */
export function Reveal({ children, className, as: Tag = "div", y = 32, delay = 0, stagger }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current!;
        const targets = stagger ? Array.from(el.children) : [el];
        gsap.set(el, { opacity: 1 });
        gsap.from(targets, {
          opacity: 0,
          y,
          duration: 1,
          ease: "expo.out",
          delay,
          stagger: stagger ?? 0,
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      mm.add(MQ.reduce, () => gsap.set(ref.current, { opacity: 1 }));
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn("js-reveal", className)}>
      {children}
    </Tag>
  );
}

/** Alias semantico: rivela i figli uno dopo l'altro. */
export function Stagger(props: Omit<Props, "stagger"> & { each?: number }) {
  const { each = 0.08, ...rest } = props;
  return <Reveal {...rest} stagger={each} />;
}
