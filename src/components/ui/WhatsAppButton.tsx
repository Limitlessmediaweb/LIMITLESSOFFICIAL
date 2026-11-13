"use client";

import { MessageCircle } from "lucide-react";
import { waSezione } from "@/data/home";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * L'unica call to action del sito: scrivere su WhatsApp.
 * Il messaggio precompilato cambia con la sezione («Ciao, vengo dalla sezione Siti del sito…»),
 * così si sa da dove arriva ogni contatto. `href` permette un messaggio del tutto diverso (quiz).
 */
export function WhatsAppButton({
  sezione,
  posizione,
  href,
  label = "Scrivici su WhatsApp",
  variant = "accent",
  className,
}: {
  /** Nome della sezione, come compare nel messaggio. */
  sezione: string;
  /** Etichetta per le statistiche. */
  posizione: string;
  href?: string;
  label?: string;
  variant?: "accent" | "ghost" | "link";
  className?: string;
}) {
  return (
    <a
      href={href ?? waSezione(sezione)}
      target="_blank"
      rel="noopener"
      onClick={() => track("whatsapp_click", { posizione })}
      className={cn(
        variant === "link" ? "link-line inline-flex min-h-11 items-center gap-2 font-semibold" : "btn",
        variant === "accent" && "btn-accent",
        variant === "ghost" && "btn-ghost",
        className,
      )}
    >
      <MessageCircle size={18} strokeWidth={2} aria-hidden />
      <span>{label}</span>
      <span className="sr-only"> (si apre WhatsApp)</span>
    </a>
  );
}
