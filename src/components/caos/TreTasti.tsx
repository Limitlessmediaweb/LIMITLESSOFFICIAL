"use client";

import { useEffect, useRef, useState } from "react";
import { tasti } from "@/data/home";
import { cn } from "@/lib/cn";

/**
 * I tre tasti dell'HUB, in piccolo: si possono toccare, e la riga del lavoro cambia stato.
 * Finché nessuno li tocca si accendono da soli, uno alla volta, solo mentre sono sullo schermo.
 * Con «riduci movimento» restano fermi sul primo.
 */
export function TreTasti({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [mano, setMano] = useState(false);

  useEffect(() => {
    if (mano || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(() => setStep((s) => (s + 1) % tasti.length), 2400);
    });
    io.observe(ref.current!);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, [mano]);

  const attivo = tasti[step];

  return (
    <div ref={ref} className={cn("tasti-panel p-4 md:p-6", className)}>
      <p className="mono text-fg-muted">Lavoro 01 · oggi</p>
      <div className="mt-3 flex items-center justify-between gap-3 border border-line bg-bg px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">Ordine Bianchi</p>
          <p className="text-sm text-fg-muted">Marco</p>
        </div>
        <span className={cn("pill", attivo.tono === "ok" && "ok", attivo.tono === "ko" && "ko")} aria-live="polite">
          {attivo.stato}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Prova i tre tasti">
        {tasti.map((t, i) => (
          <button
            key={t.nome}
            type="button"
            className="tasto"
            data-on={step === i}
            data-tono={t.tono}
            aria-pressed={step === i}
            onClick={() => {
              setMano(true);
              setStep(i);
            }}
          >
            {t.nome}
          </button>
        ))}
      </div>
      <p className="mt-4 min-h-[3rem] text-fg-muted">
        <strong className="text-fg">{attivo.nome}.</strong> {attivo.d}
      </p>
    </div>
  );
}
