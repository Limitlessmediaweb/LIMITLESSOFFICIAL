"use client";

import { MessageCircle } from "lucide-react";
import { waLink } from "@/data/contatti";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Link WhatsApp tracciato. `posizione` finisce nell'evento whatsapp_click (es. "hero", "header").
 * Unica etichetta per l'intento "contatto": "Scrivici su WhatsApp".
 */
export function WhatsAppButton({
  posizione,
  messaggio,
  label = "Scrivici su WhatsApp",
  variant = "accent",
  className,
  icon = true,
}: {
  posizione: string;
  messaggio?: string;
  label?: string;
  variant?: "accent" | "ghost" | "media" | "plain";
  className?: string;
  icon?: boolean;
}) {
  return (
    <a
      href={waLink(messaggio)}
      target="_blank"
      rel="noopener"
      onClick={() => track("whatsapp_click", { posizione })}
      className={cn(
        variant !== "plain" && "btn",
        variant === "accent" && "btn-accent",
        variant === "ghost" && "btn-ghost",
        variant === "media" && "btn-on-media",
        className,
      )}
    >
      {icon && <MessageCircle size={18} strokeWidth={2} aria-hidden />}
      <span>{label}</span>
      <span className="sr-only"> (si apre WhatsApp)</span>
    </a>
  );
}
