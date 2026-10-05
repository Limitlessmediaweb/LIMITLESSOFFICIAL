import { cn } from "@/lib/cn";

/**
 * Marchio LIMITLESS: un'inquadratura 9:16 aperta (gli angoli non si chiudono: nessun limite)
 * con il puntino REC, accanto al wordmark nel font display condensato.
 * [DA COMPLETARE] sostituire con il logo ufficiale quando arriva in materiali/brand/.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 28" className={cn("h-[1.1em] w-auto", className)} aria-hidden fill="none">
      <path d="M1 8V1h6M17 20v7h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <circle cx="13.5" cy="4.5" r="2.5" fill="var(--accent)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display text-[1.35rem] font-extrabold leading-none tracking-[0.02em]", className)}>
      <LogoMark />
      <span>LIMITLESS</span>
    </span>
  );
}
