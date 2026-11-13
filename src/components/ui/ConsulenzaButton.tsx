"use client";

import { MessageCircle } from "lucide-react";
import { waLink } from "@/data/azienda";
import { waSezione } from "@/data/home";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Pulsante WhatsApp delle pagine interne. Dal 13/11 il sito ha una sola call to action:
 * stessa etichetta ovunque («Scrivici su WhatsApp»), cambia solo il messaggio precompilato,
 * che dice da quale pagina o sezione arriva il contatto.
 */
export function ConsulenzaButton({
  posizione,
  sezione = "del sito",
  messaggio,
  variant = "accent",
  className,
}: {
  /** Etichetta per le statistiche. */
  posizione: string;
  /** Nome della sezione, come compare nel messaggio («Ciao, vengo dalla sezione … del sito»). */
  sezione?: string;
  /** Messaggio del tutto diverso (es. pagina di un progetto). */
  messaggio?: string;
  variant?: "accent" | "ghost" | "media";
  className?: string;
}) {
  return (
    <a
      href={messaggio ? waLink(messaggio) : waSezione(sezione)}
      target="_blank"
      rel="noopener"
      onClick={() => track("whatsapp_click", { posizione })}
      className={cn(
        "btn",
        variant === "accent" && "btn-accent",
        variant === "ghost" && "btn-ghost",
        variant === "media" && "btn-on-media",
        className,
      )}
    >
      <MessageCircle size={18} strokeWidth={2} aria-hidden />
      <span>Scrivici su WhatsApp</span>
      <span className="sr-only"> (si apre WhatsApp)</span>
    </a>
  );
}

/** Riga «Consulenza e preventivo gratuiti». */
export function BadgeConsulenza({ className, onMedia = false }: { className?: string; onMedia?: boolean }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 border px-3 py-1.5 text-sm font-semibold",
        onMedia ? "border-[#e8ff3a]/60 bg-black/50 text-[#f2f0ea] backdrop-blur" : "border-accent text-fg",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 bg-accent" />
      Consulenza e preventivo gratuiti
    </p>
  );
}
