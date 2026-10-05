import { Marquee } from "@/components/motion/Marquee";
import { MotionToggle } from "@/components/ui/MotionToggle";

const SERVIZI = ["Siti web", "Spot video", "Walk tour", "Video social"];
const SETTORI = ["Ristoranti", "Saloni", "Location", "Immobiliare", "Vino", "Moda", "Moto", "Artigiani", "B&B"];

/** Due nastri in direzioni opposte: cosa facciamo e per chi. */
export function Nastri() {
  return (
    <section aria-label="Servizi e settori" className="relative overflow-hidden border-y border-line bg-bg py-6 md:py-8">
      <h2 className="sr-only">Cosa facciamo e per chi</h2>
      <p className="sr-only">Servizi: {SERVIZI.join(", ")}. Settori: {SETTORI.join(", ")}.</p>
      <div aria-hidden>
        <Marquee
          items={SERVIZI}
          speed={28}
          itemClassName="font-display text-[clamp(2.4rem,1rem+5vw,6rem)] font-extrabold leading-none uppercase"
        />
        <Marquee
          items={SETTORI}
          reverse
          speed={36}
          className="mt-3 md:mt-4"
          itemClassName="font-display text-[clamp(1.6rem,0.8rem+2.6vw,3.25rem)] font-bold leading-none text-fg-muted uppercase"
          separator="/"
        />
      </div>
      <MotionToggle className="absolute bottom-2 right-2 md:right-4" />
    </section>
  );
}
