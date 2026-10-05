import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { LogoMark } from "@/components/ui/Logo";
import { T } from "@/components/ui/T";

/** Chi c'è dietro: breve e vero. Nessuna foto, solo il wordmark. */
export function ChiSiamo() {
  return (
    <section aria-labelledby="chi-title" className="wrap py-24 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div aria-hidden className="select-none overflow-hidden">
          <SplitReveal as="p" by="chars" className="flex items-center gap-[0.12em] whitespace-nowrap font-display text-[clamp(3rem,10.5vw,9.5rem)] font-extrabold leading-[0.85]">
            <LogoMark className="h-[0.8em] text-fg" />
            <span>LIMITLESS</span>
          </SplitReveal>
        </div>
        <Reveal>
          <h2 id="chi-title" className="text-title">
            Chi c&apos;è dietro
          </h2>
          <p className="mt-6 text-lead text-fg-muted">
            <T>
              {
                "LIMITLESS è uno studio giovane e nuovo. Usiamo le tecnologie più recenti, AI e sviluppo su misura, per dare alle attività locali una presenza online da grande brand, a prezzi da attività locale. [DA COMPLETARE: con Riccardo]"
              }
            </T>
          </p>
          <p className="mt-4 text-lead text-fg-muted">
            Stiamo costruendo il nostro portfolio adesso. Per te vuol dire attenzione diretta e prezzi d&apos;ingresso. Lavori con chi crea il tuo progetto, senza intermediari.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
