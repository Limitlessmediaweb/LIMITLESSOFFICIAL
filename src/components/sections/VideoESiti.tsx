import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SPOT_LANCIO, SPOT_LANCIO_FINE } from "@/data/servizi";

/** Passaggio in home dall'HUB ai servizi secondari: spot video, walk tour e siti web. */
export function VideoESiti() {
  return (
    <section id="video-e-siti" aria-labelledby="video-e-siti-title" className="wrap scroll-mt-16 pb-4 pt-24 md:pt-32">
      <p className="mono text-fg-muted">E poi · video e siti web</p>
      <SplitReveal id="video-e-siti-title" className="mt-4 max-w-[18ch] text-title">
        Facciamo anche spot video, walk tour e siti web.
      </SplitReveal>
      <p className="mt-6 max-w-[56ch] text-lead text-fg-muted">
        Per farti trovare e scegliere online. Fino al {SPOT_LANCIO_FINE} lo spot di Natale per chi produce costa {SPOT_LANCIO} €.
      </p>
      <Link href="/servizi" className="mt-6 inline-flex items-center gap-2 font-semibold text-accent-text link-line">
        Servizi e prezzi
        <ArrowRight size={16} aria-hidden />
      </Link>
    </section>
  );
}
