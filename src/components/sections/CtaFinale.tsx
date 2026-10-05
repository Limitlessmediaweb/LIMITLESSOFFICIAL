import { SmartVideo } from "@/components/media/SmartVideo";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { BadgeConsulenza, ConsulenzaButton } from "@/components/ui/ConsulenzaButton";
import { SocialIcon, SocialLink } from "@/components/ui/Social";
import { showreel } from "@/lib/media";

/** CTA finale a tutto schermo sopra lo showreel velato. */
export function CtaFinale({ title = "Il prossimo progetto può essere il tuo.", messaggio }: { title?: string; messaggio?: string }) {
  return (
    <section aria-labelledby="cta-title" className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      {showreel.desktop && (
        <div className="absolute inset-0 -z-10">
          <SmartVideo src={showreel.desktop} mobile={showreel.mobile} label="Showreel LIMITLESS" className="h-full w-full" controlsClassName="right-4 top-4 md:right-8 md:top-8" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[rgb(8_8_8/0.78)]" />
        </div>
      )}
      <div className="wrap py-28 text-[#f2f0ea]">
        <SplitReveal id="cta-title" className="max-w-[13ch] text-display-xl">
          {title}
        </SplitReveal>
        <BadgeConsulenza onMedia className="mt-8" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <MagneticButton>
            <ConsulenzaButton posizione="cta_finale" messaggio={messaggio} className="w-full sm:w-auto" />
          </MagneticButton>
          <SocialLink rete="instagram" posizione="cta_finale" className="btn btn-on-media">
            <SocialIcon rete="instagram" />
            Instagram
          </SocialLink>
          <SocialLink rete="tiktok" posizione="cta_finale" className="btn btn-on-media">
            <SocialIcon rete="tiktok" />
            TikTok
          </SocialLink>
        </div>
      </div>
    </section>
  );
}
