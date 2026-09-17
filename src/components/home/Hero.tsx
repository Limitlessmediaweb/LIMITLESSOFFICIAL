import Link from "next/link";
import { SplitTextReveal } from "@/components/gsap/SplitTextReveal";
import { MagneticButton } from "@/components/gsap/MagneticButton";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/content";

/**
 * Minimal hero: headline (reveal), subtitle, CTA — nothing else. No
 * device mockup, no cycling label.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background px-5 pt-36 pb-24 md:px-8 md:pt-44 md:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-15%] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-lime/10 blur-[140px]"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <SplitTextReveal
          as="h1"
          immediate
          text="La tua attività merita di sembrare online come merita dal vivo."
          className="font-display text-4xl leading-[1.06] tracking-[-0.03em] sm:text-5xl md:text-6xl"
        />
        <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
          Siti web, video e contenuti premium per trasformare la tua presenza online in uno
          strumento che porta clienti.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <MagneticButton>
            <Link href="/contatti" className="btn-lime">
              {PRIMARY_CTA} →
            </Link>
          </MagneticButton>
          <Link href="/lavori" className="btn-ghost">
            {SECONDARY_CTA}
          </Link>
        </div>
      </div>
    </section>
  );
}
