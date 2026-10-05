import { ScrubText } from "@/components/motion/ScrubText";

/** Il problema in tre righe: le parole si accendono mentre scorri. */
export function Problema() {
  return (
    <section aria-labelledby="problema-title" className="wrap py-28 md:py-44">
      <h2 id="problema-title" className="sr-only">
        Il problema
      </h2>
      <ScrubText className="max-w-[22ch] font-display text-[clamp(2.4rem,1rem+5.2vw,7rem)] font-extrabold leading-[0.95]">
        La tua attività è ottima. Ma online sembra uguale a tutte le altre. Le persone scelgono quello che vedono.{" "}
        <span className="text-accent-text">Facciamoti vedere.</span>
      </ScrubText>
    </section>
  );
}
