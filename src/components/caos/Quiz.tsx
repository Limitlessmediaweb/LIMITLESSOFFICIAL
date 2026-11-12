"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle, RotateCcw } from "lucide-react";
import { azienda } from "@/data/azienda";
import { QUIZ_WHATSAPP, quizDemoLink, quizDomande, quizPersone, quizRisultato } from "@/data/home";
import { HUB_PROVA_PREZZO } from "@/data/hub";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const TOT = quizDomande.length + 1;

/**
 * Quiz «Quanto caos c'è da te?»: 7 domande a punti (0, 1, 2) più una sul numero di persone, che propone il pacchetto.
 * Il risultato si vede subito, senza lasciare dati. Niente viene salvato o inviato: il messaggio WhatsApp lo manda l'utente.
 */
export function Quiz() {
  /** -1 = schermata iniziale, 0…7 = domande, 8 = risultato. */
  const [passo, setPasso] = useState(-1);
  const [risposte, setRisposte] = useState<(number | null)[]>(() => Array(TOT).fill(null));
  const boxRef = useRef<HTMLDivElement>(null);

  const vai = (n: number) => {
    setPasso(n);
    // il fuoco torna in cima al riquadro: chi usa la tastiera o lo screen reader sente la nuova domanda
    requestAnimationFrame(() => boxRef.current?.focus({ preventScroll: true }));
  };
  const scegli = (i: number) => setRisposte((r) => r.map((v, k) => (k === passo ? i : v)));

  const punti = risposte.slice(0, quizDomande.length).reduce<number>((s, v) => s + (v ?? 0), 0);
  const persone = quizPersone.r[risposte[TOT - 1] ?? 0];
  const ris = quizRisultato(punti);
  const scelta = passo >= 0 && passo < TOT ? risposte[passo] : null;
  const ultima = passo === TOT - 1;
  const opzioni = passo >= 0 && passo < quizDomande.length ? quizDomande[passo].r : quizPersone.r.map((r) => r.label);
  const domanda = passo >= 0 && passo < quizDomande.length ? quizDomande[passo].q : quizPersone.q;

  const condividi = `https://wa.me/?text=${encodeURIComponent(
    `Ho fatto il quiz di LIMITLESS sul disordine in azienda: mi è uscito «${ris.titolo}». Provalo anche tu: https://${azienda.dominio}/#quiz`,
  )}`;

  return (
    <div ref={boxRef} tabIndex={-1} className="border border-line-strong bg-bg p-5 outline-none md:p-10" aria-live="polite">
      {passo === -1 && (
        <div className="grid gap-5">
          <h3 className="max-w-[16ch] text-title">Quanto caos c&apos;è nella tua attività?</h3>
          <p className="max-w-[48ch] text-fg-muted">Rispondi d&apos;istinto, pensando a una settimana normale. Non ci sono risposte giuste.</p>
          <button
            type="button"
            className="btn btn-accent w-full sm:w-auto sm:justify-self-start"
            onClick={() => {
              track("quiz_inizio");
              vai(0);
            }}
          >
            <span>Inizia il quiz</span>
            <ArrowRight size={17} aria-hidden />
          </button>
        </div>
      )}

      {passo >= 0 && passo < TOT && (
        <div className="grid gap-6">
          <div className="flex items-center justify-between gap-4">
            <p className="mono text-fg-muted">
              Domanda {passo + 1} di {TOT}
            </p>
            <div className="h-1 w-28 bg-line" aria-hidden>
              <div className="h-full origin-left bg-accent transition-transform duration-300" style={{ transform: `scaleX(${(passo + 1) / TOT})` }} />
            </div>
          </div>
          <fieldset className="grid gap-3">
            <legend className="mb-5 font-display text-[clamp(1.6rem,1rem+2.4vw,2.8rem)] font-extrabold leading-[1]">{domanda}</legend>
            {opzioni.map((o, i) => (
              <label
                key={o}
                className={cn(
                  "flex min-h-14 cursor-pointer items-center gap-3 border px-4 py-3 transition-colors",
                  scelta === i ? "border-accent bg-accent text-accent-ink" : "border-line-strong hover:border-fg",
                )}
              >
                <input type="radio" name={`quiz-${passo}`} className="sr-only" checked={scelta === i} onChange={() => scegli(i)} />
                <span aria-hidden className={cn("size-3 shrink-0 border", scelta === i ? "border-accent-ink bg-accent-ink" : "border-line-strong")} />
                <span className="font-medium">{o}</span>
              </label>
            ))}
          </fieldset>
          <div className="flex items-center justify-between gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => vai(passo - 1)}>
              <ArrowLeft size={17} aria-hidden />
              <span>Indietro</span>
            </button>
            <button
              type="button"
              className="btn btn-accent disabled:cursor-not-allowed disabled:opacity-40"
              disabled={scelta == null}
              onClick={() => {
                if (ultima) track("quiz_fine", { fascia: punti <= 4 ? "ordine" : punti <= 9 ? "regge" : "testa" });
                vai(passo + 1);
              }}
            >
              <span>{ultima ? "Vedi il risultato" : "Avanti"}</span>
              <ArrowRight size={17} aria-hidden />
            </button>
          </div>
        </div>
      )}

      {passo === TOT && (
        <div className="grid gap-5">
          <p className="mono text-accent-text">Il tuo risultato</p>
          <h3 className="max-w-[14ch] text-title">{ris.titolo}</h3>
          <p className="max-w-[56ch] text-lead text-fg-muted">{ris.testo}</p>
          {ris.demo && (
            <p className="max-w-[56ch]">
              Per voi andrebbe bene il pacchetto <strong>{persone.pacchetto}</strong>.
              {ris.prova && ` Si prova 30 giorni a ${HUB_PROVA_PREZZO} €, scalati se continui.`}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {ris.demo ? (
              <a
                href={quizDemoLink(ris.titolo, persone.numero)}
                target="_blank"
                rel="noopener"
                className="btn btn-accent"
                onClick={() => {
                  track("demo_hub_click", { posizione: "quiz" });
                  track("whatsapp_click", { posizione: "quiz" });
                }}
              >
                <MessageCircle size={18} aria-hidden />
                <span>Prenota la demo di 10 minuti</span>
                <span className="sr-only"> (si apre WhatsApp)</span>
              </a>
            ) : (
              <>
                <Link href="/lavori" className="btn btn-accent">
                  <span>Guarda i nostri lavori</span>
                  <ArrowRight size={17} aria-hidden />
                </Link>
                <a href={QUIZ_WHATSAPP} target="_blank" rel="noopener" className="btn btn-ghost" onClick={() => track("whatsapp_click", { posizione: "quiz" })}>
                  <MessageCircle size={18} aria-hidden />
                  <span>Scrivici su WhatsApp</span>
                  <span className="sr-only"> (si apre WhatsApp)</span>
                </a>
              </>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
            <button
              type="button"
              className="link-line inline-flex min-h-11 items-center gap-2 hover:text-fg"
              onClick={() => {
                setRisposte(Array(TOT).fill(null));
                vai(0);
              }}
            >
              <RotateCcw size={15} aria-hidden />
              Rifai il quiz
            </button>
            <a href={condividi} target="_blank" rel="noopener" className="link-line inline-flex min-h-11 items-center hover:text-fg">
              Manda il risultato a un socio
              <span className="sr-only"> (si apre WhatsApp)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
