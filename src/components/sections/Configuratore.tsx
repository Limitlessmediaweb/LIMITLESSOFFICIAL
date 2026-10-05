"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/data/azienda";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/** etichetta del chip → come suona nel messaggio */
const ATTIVITA: Record<string, string> = {
  "Ristorante o bar": "un ristorante o un bar",
  "Salone o estetica": "un salone o un centro estetico",
  "Location o eventi": "una location per eventi",
  "B&B o agriturismo": "un B&B o un agriturismo",
  "Agenzia immobiliare": "un'agenzia immobiliare",
  "Brand di prodotto": "un brand di prodotti",
  Artigiano: "un'attività artigiana",
  Altro: "un'attività",
};
const SERVIZI: Record<string, string> = {
  "Sito web": "un sito web",
  "Spot video": "uno spot video",
  "Walk tour": "un video walk tour",
  "Non lo so ancora": "",
};
const elenco = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} e ${xs.at(-1)}`);

/**
 * "Cosa ti serve?": due scelte a chip generano un messaggio WhatsApp precompilato.
 * Nessun dato viene salvato: il testo resta nel link.
 */
export function Configuratore({ headingLevel: H = "h2" }: { headingLevel?: "h2" | "h3" }) {
  const [attivita, setAttivita] = useState<string | null>(null);
  const [servizi, setServizi] = useState<string[]>([]);

  const toggleServizio = (s: string) =>
    setServizi((cur) => {
      if (s === "Non lo so ancora") return cur.includes(s) ? [] : [s];
      const base = cur.filter((x) => x !== "Non lo so ancora");
      return base.includes(s) ? base.filter((x) => x !== s) : [...base, s];
    });

  const pronto = Boolean(attivita && servizi.length);
  const chi = attivita ? `Vorrei una consulenza gratuita per la mia attività: ho ${ATTIVITA[attivita]}.` : "Vorrei una consulenza gratuita per la mia attività.";
  const cosa = servizi.includes("Non lo so ancora")
    ? "Non so ancora cosa mi serve: mi date un consiglio?"
    : servizi.length
      ? `Mi interessa ${elenco(servizi.map((s) => SERVIZI[s]))}.`
      : "";
  const messaggio = `Ciao! ${chi} ${cosa}`.trim();

  const chip = (active: boolean) =>
    cn(
      "min-h-11 border px-4 text-[0.95rem] font-medium transition-colors",
      active ? "border-accent bg-accent text-accent-ink" : "border-line text-fg hover:border-line-strong",
    );

  return (
    <section aria-labelledby="config-title" className="border-y border-line bg-bg-raised">
      <div className="wrap py-20 md:py-28">
        <H id="config-title" className="text-title">
          Cosa ti serve?
        </H>
        <p className="mt-4 max-w-[48ch] text-fg-muted">Due tocchi e ti prepariamo il messaggio. Non salviamo niente: decidi tu se inviarlo.</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <fieldset>
            <legend className="mb-4 font-semibold">
              <span className="mono mr-3 text-accent-text">1</span>Che attività hai?
            </legend>
            <div className="flex flex-wrap gap-2">
              {Object.keys(ATTIVITA).map((a) => (
                <button key={a} type="button" aria-pressed={attivita === a} onClick={() => setAttivita(a === attivita ? null : a)} className={chip(attivita === a)}>
                  {a}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-4 font-semibold">
              <span className="mono mr-3 text-accent-text">2</span>Cosa ti interessa?
            </legend>
            <div className="flex flex-wrap gap-2">
              {Object.keys(SERVIZI).map((s) => (
                <button key={s} type="button" aria-pressed={servizi.includes(s)} onClick={() => toggleServizio(s)} className={chip(servizi.includes(s))}>
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[60ch] text-fg-muted" aria-live="polite">
            <span className="sr-only">Anteprima del messaggio: </span>&ldquo;{messaggio}&rdquo;
          </p>
          <a
            href={waLink(messaggio)}
            target="_blank"
            rel="noopener"
            aria-disabled={!pronto}
            aria-describedby={pronto ? undefined : "config-hint"}
            onClick={(e) => {
              if (!pronto) {
                e.preventDefault();
                return;
              }
              track("configuratore_invio", { attivita: attivita!, servizi: servizi.join("+") });
              track("consulenza_click", { posizione: "configuratore" });
              track("whatsapp_click", { posizione: "configuratore" });
            }}
            className={cn("btn btn-accent shrink-0", !pronto && "cursor-not-allowed opacity-50")}
          >
            <MessageCircle size={18} aria-hidden />
            Invia su WhatsApp
          </a>
        </div>
        {!pronto && <p id="config-hint" className="mt-3 text-sm text-fg-muted">Scegli un&apos;attività e almeno un servizio.</p>}
      </div>
    </section>
  );
}
