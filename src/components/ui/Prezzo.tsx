import { euro, NOTA_PREZZO, prezzoMinimo, prezzoVoce, type Voce } from "@/data/servizi";
import { cn } from "@/lib/cn";

/**
 * Prezzo in grande di un servizio, dal listino.
 * Una sola voce con prezzo di lancio: "119 € 99 €" (listino barrato) + nota.
 * Più voci: "a partire da" il prezzo più basso.
 */
export function Prezzo({ voci, className, onMedia = false }: { voci: Voce[]; className?: string; onMedia?: boolean }) {
  const muted = onMedia ? "text-white/75" : "text-fg-muted";
  const lancio = voci.length === 1 && voci[0].listino ? voci[0] : null;
  const mese = voci.every((v) => v.mese);

  if (lancio) {
    return (
      <div className={className}>
        <p className="font-display text-5xl font-extrabold leading-none md:text-6xl">
          <s className={cn("mr-2 align-top font-sans text-xl font-medium", muted)}>
            <span className="sr-only">invece di </span>
            {euro(lancio.listino!)}
          </s>
          {euro(lancio.prezzo)}
        </p>
        {lancio.nota && <p className={cn("mt-2 text-sm font-medium", muted)}>{lancio.nota}</p>}
      </div>
    );
  }

  return (
    <p className={cn("font-display text-5xl font-extrabold leading-none md:text-6xl", className)}>
      {voci.length > 1 && <span className={cn("mr-1.5 align-top font-sans text-base font-medium", muted)}>a partire da</span>}
      {voci.length === 1 ? prezzoVoce(voci[0]) : euro(prezzoMinimo(voci))}
      {mese && <span className={cn("ml-1.5 font-sans text-base font-medium", muted)}>al mese</span>}
    </p>
  );
}

/** Le righe del listino: nome e dettaglio a sinistra, prezzo a destra. */
export function VociPrezzo({ voci, className }: { voci: Voce[]; className?: string }) {
  return (
    <ul className={cn("border-t border-line", className)}>
      {voci.map((v) => (
        <li key={v.nome} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
          <span className="min-w-0">
            <span className="font-semibold">{v.nome}</span>
            {v.dettaglio && <span className="mt-0.5 block text-sm text-fg-muted">{v.dettaglio}</span>}
          </span>
          <span className="shrink-0 text-right font-semibold">
            {v.listino && (
              <s className="mr-1.5 text-sm font-normal text-fg-muted">
                <span className="sr-only">invece di </span>
                {euro(v.listino)}
              </s>
            )}
            {prezzoVoce(v)}
            {v.mese && <span className="text-sm font-normal text-fg-muted"> /mese</span>}
            {v.nota && <span className="block text-sm font-normal text-fg-muted">{v.nota}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Riga unica sotto i prezzi: le regole di pagamento. */
export function NotaPrezzo({ className, onMedia = false }: { className?: string; onMedia?: boolean }) {
  return (
    <p className={cn("border-l-2 border-accent pl-3 text-sm font-medium", onMedia ? "text-[#f2f0ea]" : "text-fg", className)}>
      {NOTA_PREZZO}
    </p>
  );
}
