"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SmartVideo } from "@/components/media/SmartVideo";
import { T } from "@/components/ui/T";
import { euro, type Servizio } from "@/data/servizi";
import type { MediaSource } from "@/lib/media";
import { cn } from "@/lib/cn";

/**
 * Blocco servizio con video di sfondo che parte al passaggio del mouse
 * (su touch resta il poster). Tre composizioni diverse: "wide", "tall", "split".
 */
export function ServizioBlock({
  s,
  media,
  layout,
  index,
}: {
  s: Servizio;
  media: MediaSource | null;
  layout: "wide" | "tall" | "split";
  index: number;
}) {
  const [hover, setHover] = useState(false);

  return (
    <article
      aria-labelledby={`srv-${s.id}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={cn(
        "group relative isolate flex overflow-hidden border border-line bg-bg-raised",
        layout === "wide" && "min-h-[34rem] flex-col justify-end lg:col-span-2 lg:min-h-[38rem]",
        layout === "tall" && "min-h-[40rem] flex-col justify-end",
        layout === "split" && "min-h-[40rem] flex-col justify-end",
      )}
    >
      {media && (
        <div aria-hidden className="absolute inset-0 -z-10 opacity-45 transition-opacity duration-700 group-hover:opacity-80">
          <SmartVideo
            src={media}
            label={`Esempio: ${s.nome}`}
            autoPlay
            active={hover}
            showPause={false}
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(8_8_8/0.96)_15%,rgb(8_8_8/0.7)_55%,rgb(8_8_8/0.35))]" />
        </div>
      )}

      <div className="relative p-6 text-[#f2f0ea] md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <span className="mono text-white/70">
            {String(index + 1).padStart(2, "0")} {s.nome}
          </span>
        </div>
        <h3 id={`srv-${s.id}`} className={cn("max-w-[14ch] leading-[0.92]", layout === "wide" ? "text-[clamp(2.6rem,1rem+4.6vw,6rem)]" : "text-[clamp(2.4rem,1rem+3vw,4.5rem)]")}>
          {s.titolo}
        </h3>
        <p className="mt-4 max-w-[44ch] text-white/80">{s.ottieni}</p>

        <div className={cn("mt-8 grid gap-8", layout === "wide" && "md:grid-cols-[1.2fr_1fr] md:items-end")}>
          <ul className="flex flex-col gap-2 text-sm text-white/80">
            {s.include.slice(0, 4).map((x) => (
              <li key={x} className="flex gap-3">
                <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-accent" />
                <span>
                  <T>{x}</T>
                </span>
              </li>
            ))}
          </ul>
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {s.prezzi.map((pr) => (
              <div key={pr.voce}>
                <dt className="text-sm text-white/70">
                  {pr.voce} {pr.nota && <T>{pr.nota}</T>}
                </dt>
                <dd className="font-display text-4xl font-extrabold md:text-5xl">
                  <span className="mr-1 align-top font-sans text-sm font-medium text-white/70">da</span>
                  {euro(pr.da)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Link href={`/servizi#${s.id}`} className="mt-8 inline-flex items-center gap-2 font-semibold text-[#e8ff3a] link-line">
          Scopri cosa include
          <ArrowRight size={16} aria-hidden />
          <span className="sr-only"> il servizio {s.nome}</span>
        </Link>
      </div>
    </article>
  );
}
