"use client";

import { MessageCircle } from "lucide-react";
import { waLink } from "@/data/azienda";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Pulsante WhatsApp delle sezioni sull'HUB: stessa etichetta del resto del sito,
 * ma il messaggio chiede la demo di 10 minuti e dice da dove arriva.
 */
export function DemoHubButton({
  posizione,
  sezione = "HUB",
  variant = "accent",
  className,
}: {
  posizione: string;
  sezione?: string;
  variant?: "accent" | "ghost" | "media";
  className?: string;
}) {
  return (
    <a
      href={waLink(`Ciao, vengo dalla sezione ${sezione} del sito e vorrei vedere la demo di 10 minuti del gestionale.`)}
      target="_blank"
      rel="noopener"
      onClick={() => {
        track("demo_hub_click", { posizione });
        track("whatsapp_click", { posizione });
      }}
      className={cn("btn", variant === "accent" && "btn-accent", variant === "ghost" && "btn-ghost", variant === "media" && "btn-on-media", className)}
    >
      <MessageCircle size={18} strokeWidth={2} aria-hidden />
      <span>Scrivici su WhatsApp</span>
      <span className="sr-only"> (si apre WhatsApp)</span>
    </a>
  );
}
