import { AtSign } from "lucide-react";
import { SmartVideo } from "@/components/media/SmartVideo";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { contatti } from "@/data/contatti";
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
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <MagneticButton>
            <WhatsAppButton posizione="cta_finale" messaggio={messaggio} className="w-full sm:w-auto" />
          </MagneticButton>
          <a href={contatti.instagramUrl} target="_blank" rel="noopener" className="btn btn-on-media">
            <AtSign size={18} aria-hidden />
            Seguici su Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
