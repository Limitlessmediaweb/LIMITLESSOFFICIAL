import { euro, NOTA_PREZZO, prezzoMinimo, type Voce } from "@/data/servizi";
import { cn } from "@/lib/cn";

/**
 * Prezzo in grande di un servizio. Dal 13/11 sul sito non si mostra il listino:
 * c'è sempre e solo «da» il prezzo più basso. Il prezzo preciso sta nel preventivo.
 */
export function Prezzo({ voci, className, onMedia = false }: { voci: Voce[]; className?: string; onMedia?: boolean }) {
  const muted = onMedia ? "text-white/75" : "text-fg-muted";
  const mese = voci.every((v) => v.mese);
  // nota della voce più economica (es. spot: «fino al 30/11, poi da 119 €»)
  const nota = voci.find((v) => v.prezzo === prezzoMinimo(voci))?.nota;
  return (
    <p className={cn("font-display text-5xl font-extrabold leading-none md:text-6xl", className)}>
      <span className={cn("mr-1.5 align-top font-sans text-base font-medium", muted)}>da</span>
      {euro(prezzoMinimo(voci))}
      {mese && <span className={cn("ml-1.5 font-sans text-base font-medium", muted)}>al mese</span>}
      {nota && <span className={cn("mt-2 block font-sans text-sm font-medium leading-normal", muted)}>{nota}</span>}
    </p>
  );
}

/** Le versioni di un servizio: nome e cosa comprende. Senza prezzi: sul sito c'è solo il «da». */
export function VociPrezzo({ voci, className }: { voci: Voce[]; className?: string }) {
  return (
    <ul className={cn("border-t border-line", className)}>
      {voci.map((v) => (
        <li key={v.nome} className="border-b border-line py-3">
          <span className="font-semibold">{v.nome}</span>
          {v.dettaglio && <span className="mt-0.5 block text-sm text-fg-muted">{v.dettaglio}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Riga unica sotto i prezzi: come si arriva al prezzo preciso e le regole di pagamento. */
export function NotaPrezzo({ className, onMedia = false }: { className?: string; onMedia?: boolean }) {
  return (
    <p className={cn("border-l-2 border-accent pl-3 text-sm font-medium", onMedia ? "text-[#f2f0ea]" : "text-fg", className)}>
      {NOTA_PREZZO}
    </p>
  );
}
