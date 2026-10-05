"use client";

import { MessageCircle } from "lucide-react";
import { MESSAGGIO_CONSULENZA, waLink } from "@/data/azienda";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * CTA principale del sito: "Prenota la consulenza gratuita" (o la versione breve).
 * Apre WhatsApp con il messaggio precompilato e traccia consulenza_click + whatsapp_click con la posizione.
 */
export function ConsulenzaButton({
  posizione,
  breve = false,
  messaggio = MESSAGGIO_CONSULENZA,
  variant = "accent",
  className,
}: {
  posizione: string;
  /** "Consulenza gratuita" invece di "Prenota la consulenza gratuita" (header, barra mobile). */
  breve?: boolean;
  messaggio?: string;
  variant?: "accent" | "ghost" | "media";
  className?: string;
}) {
  return (
    <a
      href={waLink(messaggio)}
      target="_blank"
      rel="noopener"
      onClick={() => {
        track("consulenza_click", { posizione });
        track("whatsapp_click", { posizione });
      }}
      className={cn(
        "btn",
        variant === "accent" && "btn-accent",
        variant === "ghost" && "btn-ghost",
        variant === "media" && "btn-on-media",
        className,
      )}
    >
      <MessageCircle size={18} strokeWidth={2} aria-hidden />
      <span>{breve ? "Consulenza gratuita" : "Prenota la consulenza gratuita"}</span>
      <span className="sr-only"> (si apre WhatsApp)</span>
    </a>
  );
}

/** Badge "Consulenza gratuita · senza impegno". */
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
      Consulenza gratuita · senza impegno
    </p>
  );
}
