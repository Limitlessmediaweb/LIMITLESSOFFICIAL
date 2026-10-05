import { euro, NOTA_PREZZO } from "@/data/servizi";
import { cn } from "@/lib/cn";

/** "da 500 €": sempre a partire da, mai un prezzo fisso. */
export function Prezzo({ da, className, onMedia = false }: { da: number; className?: string; onMedia?: boolean }) {
  return (
    <p className={cn("font-display text-5xl font-extrabold leading-none md:text-6xl", className)}>
      <span className={cn("mr-1.5 align-top font-sans text-base font-medium", onMedia ? "text-white/75" : "text-fg-muted")}>a partire da</span>
      {euro(da)}
    </p>
  );
}

/** Riga unica sotto i prezzi: il prezzo finale si decide dopo la consulenza gratuita. */
export function NotaPrezzo({ className, onMedia = false }: { className?: string; onMedia?: boolean }) {
  return (
    <p className={cn("border-l-2 border-accent pl-3 text-sm font-medium", onMedia ? "text-[#f2f0ea]" : "text-fg", className)}>
      {NOTA_PREZZO}
    </p>
  );
}
