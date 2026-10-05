"use client";

import { ArrowUpRight } from "lucide-react";
import { track } from "@/lib/analytics";

/** "Apri il sito live ↗": nuova scheda, evento progetto_live_click. */
export function LiveLink({ href, slug, nome }: { href: string; slug: string; nome: string }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="btn btn-ghost" onClick={() => track("progetto_live_click", { progetto: slug })}>
      Apri il sito live
      <ArrowUpRight size={17} aria-hidden />
      <span className="sr-only"> di {nome} (si apre in una nuova scheda)</span>
    </a>
  );
}
