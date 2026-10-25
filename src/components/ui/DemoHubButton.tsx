"use client";

import { MessageCircle } from "lucide-react";
import { hubDemoLink } from "@/data/hub";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/** CTA di LIMITLESS HUB: "Prenota una demo di 10 minuti" su WhatsApp, con il messaggio precompilato. */
export function DemoHubButton({ posizione, variant = "accent", className }: { posizione: string; variant?: "accent" | "ghost" | "media"; className?: string }) {
  return (
    <a
      href={hubDemoLink}
      target="_blank"
      rel="noopener"
      onClick={() => {
        track("demo_hub_click", { posizione });
        track("whatsapp_click", { posizione });
      }}
      className={cn("btn", variant === "accent" && "btn-accent", variant === "ghost" && "btn-ghost", variant === "media" && "btn-on-media", className)}
    >
      <MessageCircle size={18} strokeWidth={2} aria-hidden />
      <span>Prenota una demo di 10 minuti</span>
      <span className="sr-only"> (si apre WhatsApp)</span>
    </a>
  );
}
