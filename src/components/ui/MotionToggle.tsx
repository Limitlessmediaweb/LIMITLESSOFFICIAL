"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Ferma/riavvia i nastri in movimento della sezione che lo contiene (WCAG 2.2.2:
 * contenuti che si muovono da soli per più di 5 s devono poter essere messi in pausa).
 */
export function MotionToggle({ className }: { className?: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={(e) => {
        const next = !paused;
        setPaused(next);
        const section = e.currentTarget.closest("section");
        if (section) {
          if (next) section.setAttribute("data-paused", "");
          else section.removeAttribute("data-paused");
        }
      }}
      className={cn("grid size-11 place-items-center border border-line bg-bg/80 text-fg-muted backdrop-blur hover:text-fg motion-reduce:hidden", className)}
      aria-label={paused ? "Riavvia lo scorrimento del testo" : "Ferma lo scorrimento del testo"}
    >
      {paused ? <Play size={15} aria-hidden /> : <Pause size={15} aria-hidden />}
    </button>
  );
}
