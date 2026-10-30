import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { DemoHubButton } from "@/components/ui/DemoHubButton";
import { CropMarks } from "@/components/ui/Viewfinder";
import { HUB_DA, HUB_DEMO_COME, HUB_PROVA } from "@/data/hub";

/** Hero della home: LIMITLESS HUB è il servizio principale. Video e siti vengono subito dopo. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-line">
      <div className="wrap grid min-h-[100svh] gap-14 pb-20 pt-28 md:pt-36 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pb-16">
        <div className="min-w-0">
          <p className="mono text-accent-text">LIMITLESS HUB · il gestionale su misura</p>
          <h1 id="hero-title" className="mt-5 max-w-[15ch] text-[clamp(2.6rem,1rem+5vw,6.2rem)] leading-[0.92]">
            Il gestionale su misura per la tua attività.
          </h1>
          <p className="mt-6 max-w-[48ch] text-lead text-fg-muted">
            Lavori, ordini e clienti in un posto solo, fase per fase, da telefono, tablet o PC. Il tuo cliente vede da solo a che punto è il suo lavoro. Ci adattiamo
            alla tua attività, non il contrario.
          </p>
          <p className="mt-6 text-fg-muted">
            <span>da </span>
            <span className="font-display text-4xl font-extrabold text-fg">{HUB_DA} €</span>
            <span>/mese · {HUB_PROVA.breve}</span>
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <MagneticButton>
              <DemoHubButton posizione="hero" className="w-full sm:w-auto" />
            </MagneticButton>
            <Link href="/hub" className="btn btn-ghost w-full sm:w-auto">
              <span>Scopri LIMITLESS HUB</span>
              <ArrowRight size={17} aria-hidden />
            </Link>
          </div>
          <p className="mt-4 text-sm text-fg-muted">{HUB_DEMO_COME}</p>
          <a href="#video-e-siti" className="mt-10 inline-flex items-center gap-2 font-semibold text-fg-muted link-line hover:text-fg">
            Cerchi uno spot o un sito web? Guarda i lavori
            <ArrowDown size={16} aria-hidden />
          </a>
        </div>

        <div className="relative min-w-0 pb-10 sm:pb-14">
          <figure className="overflow-hidden border border-line-strong bg-bg-sunken shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)]">
            <Image
              src="/media/hub/titolare.webp"
              alt="LIMITLESS HUB, il punto del titolare: lavori in ritardo, problemi aperti, consegne della settimana e lavori a rischio"
              width={1280}
              height={800}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 48vw, 100vw"
              priority
            />
          </figure>
          <div className="absolute -bottom-2 right-3 w-[32%] max-w-[170px] sm:right-6">
            <PhoneFrame screenAspect="600 / 1100">
              {/* spazio in alto per l'isola dinamica della cornice, nel grigio del portale */}
              <div className="h-full bg-[#eef1f4] pt-[10%]">
                <Image
                  src="/media/hub/portale-telefono.webp"
                  alt="Il portale del cliente sul telefono: un ordine con le sue fasi e la consegna prevista"
                  width={600}
                  height={996}
                  className="h-auto w-full"
                  sizes="170px"
                />
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
      <CropMarks className="hidden md:block" inset={24} size={22} />
    </section>
  );
}
