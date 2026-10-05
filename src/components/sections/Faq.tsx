"use client";

import { useId, useState } from "react";
import { useHydrated } from "@/lib/hooks";
import { Plus } from "lucide-react";
import { T } from "@/components/ui/T";
import type { Faq as FaqItem } from "@/data/faq";
import { cn } from "@/lib/cn";

/** Accordion accessibile: button + aria-expanded + aria-controls. Senza JS le risposte sono visibili. */
export function FaqList({ items, title = "Domande frequenti", headingLevel: H = "h2" }: { items: FaqItem[]; title?: string; headingLevel?: "h2" | "h3" }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  // prima dell'idratazione (o senza JS) tutte le risposte sono visibili
  const hydrated = useHydrated();

  return (
    <section aria-labelledby={`${base}-t`} className="wrap py-24 md:py-36">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <H id={`${base}-t`} className="max-w-[10ch] text-title lg:sticky lg:top-28 lg:self-start">
          {title}
        </H>
        <ul className="border-t border-line">
          {items.map((f, i) => {
            const isOpen = !hydrated || open === i;
            return (
              <li key={f.q} className="border-b border-line">
                <h3 className="font-sans text-lg font-semibold tracking-normal md:text-xl">
                  <button
                    type="button"
                    id={`${base}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span>{f.q}</span>
                    <Plus size={20} aria-hidden className={cn("shrink-0 transition-transform duration-300", isOpen && "rotate-45")} />
                  </button>
                </h3>
                <div
                  id={`${base}-a${i}`}
                  role="region"
                  aria-labelledby={`${base}-q${i}`}
                  className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[60ch] pb-6 text-fg-muted" hidden={!isOpen}>
                      <T>{f.a}</T>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
