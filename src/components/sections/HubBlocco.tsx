import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { HUB_DA } from "@/data/hub";

/** Blocco in home che porta a /hub: LIMITLESS HUB, il gestionale su misura per qualsiasi attività. */
export function HubBlocco() {
  return (
    <section id="hub" aria-labelledby="hub-blocco-title" className="scroll-mt-16 border-y border-line bg-bg-raised">
      <div className="wrap grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <p className="mono text-accent-text">Novità · LIMITLESS HUB</p>
          <SplitReveal id="hub-blocco-title" className="mt-4 max-w-[13ch] text-title">
            Sai sempre a che punto è ogni lavoro.
          </SplitReveal>
          <Reveal className="mt-6 max-w-[50ch] text-lead text-fg-muted">
            <p>
              Lavori, ordini e clienti in un posto solo, fase per fase, da tablet, telefono o PC. E un portale dove i tuoi clienti vedono da soli a che punto è il loro lavoro. Su misura per aziende, laboratori, negozi, e-commerce e studi. Da{" "}
              {HUB_DA} €/mese.
            </p>
          </Reveal>
          <Link href="/hub" className="btn btn-accent mt-10 w-full sm:w-auto">
            <span>Scopri LIMITLESS HUB</span>
            <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
        <Reveal className="min-w-0">
          <Link href="/hub" aria-label="Scopri LIMITLESS HUB" className="block overflow-hidden border border-line-strong">
            <Image
              src="/media/hub/titolare.webp"
              alt="Schermata di LIMITLESS HUB: il punto del titolare con lavori in ritardo, consegne e lavori a rischio"
              width={1280}
              height={800}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
