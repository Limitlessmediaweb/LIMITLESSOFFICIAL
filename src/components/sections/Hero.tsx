import { ArrowDown } from "lucide-react";
import { HeroVideo } from "./HeroVideo";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CropMarks, Rec } from "@/components/ui/Viewfinder";
import { showreel } from "@/lib/media";
import { HeroCopy } from "./HeroCopy";
import { HeroTimecode } from "./HeroTimecode";

export function Hero() {
  const desktop = showreel.desktop;
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {desktop && (
          <HeroVideo
            src={desktop}
            mobile={showreel.mobile}
            label="Showreel LIMITLESS"
            description="Montaggio di spot, siti web e walk tour realizzati da LIMITLESS: profumi, orologi, cerchi racing, ville, ristoranti e artigiani."
            priority
            threshold={0.1}
            className="h-full w-full"
            controlsClassName="right-4 top-20 md:right-12 md:top-24"
          />
        )}
        {/* velatura: garantisce il contrasto AA del testo sopra il video, in entrambi i temi */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(8_8_8/0.92)_0%,rgb(8_8_8/0.72)_38%,rgb(8_8_8/0.15)_70%,rgb(8_8_8/0.35)_100%)]" />
      </div>

      <div className="wrap relative pb-28 pt-28 text-[#f2f0ea] md:pb-16 lg:pb-14">
        <div className="mb-6 flex items-center gap-4 text-white/75 md:mb-8">
          <Rec label="Showreel" />
          <HeroTimecode />
        </div>

        <HeroCopy>
          <h1 id="hero-title" className="max-w-[18ch] text-[clamp(2.7rem,1rem+5.6vw,7rem)] leading-[0.92] md:max-w-[21ch]">
            Più clienti per la tua attività. Con siti e video che si fanno guardare.
          </h1>
          <p data-hero-fade className="mt-6 max-w-[46ch] text-lead text-white/80">
            Siti web animati, spot video e walk tour per attività locali e brand. Pronti in pochi giorni.
          </p>
          <div data-hero-fade className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* su mobile e tablet il pulsante WhatsApp è la barra fissa in basso: qui non lo ripetiamo */}
            <div className="hidden lg:block">
              <MagneticButton>
                <WhatsAppButton posizione="hero" />
              </MagneticButton>
            </div>
            <a href="#lavori" className="btn btn-on-media">
              Guarda i lavori
              <ArrowDown size={17} aria-hidden />
            </a>
          </div>
        </HeroCopy>
      </div>

      <CropMarks className="hidden md:block" inset={24} size={22} />
    </section>
  );
}
