"use client";

import { useEffect, useRef, useState } from "react";
import { tasti } from "@/data/home";
import { cn } from "@/lib/cn";
import { stageProgress } from "./fisica";

/**
 * Tre tasti: la sezione resta ferma mentre scorri e i tasti si accendono uno alla volta;
 * la riga del lavoro cambia stato a ogni tocco. Senza JS o con «riduci movimento»: i tre passi in elenco.
 */
export function TreTasti() {
  const stageRef = useRef<HTMLElement>(null);
  /** null = versione ferma (tutti i passi leggibili). */
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = stageProgress(stage);
      setStep(Math.min(tasti.length - 1, Math.floor(p * tasti.length * 0.999)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const attivo = step == null ? null : tasti[step];

  return (
    <section ref={stageRef} id="tre-tasti" aria-labelledby="tasti-title" className="tasti-stage scroll-mt-16 border-y border-line bg-bg-raised">
      <div className="tasti-pin flex items-start lg:items-center">
        <div className="wrap grid gap-6 pb-10 pt-24 lg:grid-cols-[1fr_1fr] lg:gap-x-20 lg:gap-y-8 lg:py-24">
          <div className="min-w-0 lg:self-end">
            <p className="mono text-accent-text">Come funziona</p>
            <h2 id="tasti-title" className="mt-4 text-title">
              Tre tasti e basta.
            </h2>
            <p className="mt-4 max-w-[44ch] text-fg-muted">Chi lavora tocca Inizio, Fatto o Problema. Dal telefono, dal tablet o dal PC.</p>
          </div>

          {/* dimostrazione: decorativa, il contenuto è nell'elenco */}
          <div className="tasti-panel mx-auto w-full max-w-[420px] p-4 md:p-7 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center" aria-hidden>
            <p className="mono text-fg-muted">Lavoro 01 · oggi</p>
            <div className="mt-3 flex items-center justify-between gap-3 border border-line bg-bg px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">Ordine Bianchi</p>
                <p className="text-sm text-fg-muted">Marco</p>
              </div>
              <span className={cn("pill", attivo?.tono === "ok" && "ok", attivo?.tono === "ko" && "ko")}>{attivo ? attivo.stato : "Da iniziare"}</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 lg:mt-5 lg:grid-cols-1 lg:gap-3">
              {tasti.map((t, i) => (
                <div key={t.nome} className="tasto" data-on={step === i} data-tono={t.tono}>
                  {t.nome}
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:self-start">
            <ol className="grid gap-4">
              {tasti.map((t, i) => (
                <li key={t.nome} className="tasti-step border-l-2 border-accent pl-4" data-on={step == null || step === i}>
                  <h3 className="font-sans text-lg font-bold tracking-normal">
                    {i + 1}. {t.nome}. <span className="font-normal text-fg-muted">{t.frase}</span>
                  </h3>
                  <p className="mt-1 text-fg-muted">{t.d}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 font-semibold lg:mt-8">Chi sa usare WhatsApp, sa usare questo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
