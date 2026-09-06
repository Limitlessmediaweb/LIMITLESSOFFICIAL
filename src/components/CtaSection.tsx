import Link from "next/link";
import { Reveal } from "@/components/gsap/Reveal";
import { MagneticButton } from "@/components/gsap/MagneticButton";
import { PRIMARY_CTA, SOCIAL_PROOF } from "@/lib/content";

type CtaSectionProps = {
  title?: string;
  subtitle?: string;
};

export function CtaSection({
  title = "Parliamo della tua attività",
  subtitle = SOCIAL_PROOF.freeConsult + " · " + SOCIAL_PROOF.responseTime,
}: CtaSectionProps) {
  return (
    <section className="border-t border-border bg-card px-5 py-24 md:px-8 md:py-32">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <h2 className="font-display text-3xl leading-[1.1] tracking-[-0.03em] sm:text-5xl">
          {title}
        </h2>
        <p className="text-muted-foreground">{subtitle}</p>
        <MagneticButton>
          <Link href="/contatti" className="btn-lime">
            {PRIMARY_CTA} →
          </Link>
        </MagneticButton>
      </Reveal>
    </section>
  );
}
