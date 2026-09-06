import type { ReactNode } from "react";
import { Reveal } from "@/components/gsap/Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

/** Reduced hero band used as a consistent "banner" across interior pages. */
export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border px-5 pt-32 pb-16 md:px-8 md:pt-40 md:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-30%] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-lime/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <Reveal className="flex flex-col items-center gap-4">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="font-display text-3xl leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            {title}
          </h1>
          {subtitle && <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{subtitle}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
