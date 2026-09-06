import { ClipboardList, PenTool, Cpu, Rocket } from "lucide-react";
import { Reveal } from "@/components/gsap/Reveal";
import { PROCESS_STEPS } from "@/lib/content";

const ICONS = [ClipboardList, PenTool, Cpu, Rocket];

export function ProcessSection() {
  return (
    <section id="processo" className="scroll-mt-24 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Processo</p>
          <h2 className="mt-4 font-display text-3xl leading-[1.08] sm:text-5xl">
            Quattro step, zero sorprese
          </h2>
        </Reveal>
        <Reveal className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {PROCESS_STEPS.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <article
                key={s.n}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-colors hover:border-lime/60"
              >
                {i < PROCESS_STEPS.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute top-1/2 -right-3 z-10 hidden h-px w-6 bg-lime/50 lg:block"
                  />
                )}
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lime/15 text-lime transition-colors group-hover:bg-lime group-hover:text-primary-foreground">
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <span className="font-display text-4xl font-bold text-foreground/10 transition-colors group-hover:text-lime/30">
                    {s.n}
                  </span>
                </div>
                <h3 className="font-display mt-6 text-xl tracking-tight">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
