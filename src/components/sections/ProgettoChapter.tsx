"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SmartVideo } from "@/components/media/SmartVideo";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { BrowserFrame } from "@/components/media/BrowserFrame";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { T } from "@/components/ui/T";
import type { Progetto } from "@/data/progetti";
import type { MediaSource } from "@/lib/media";
import { track } from "@/lib/analytics";
import { clean } from "@/lib/placeholder";
import { cn } from "@/lib/cn";

export type ChapterMedia = {
  spot: MediaSource | null;
  sitoMobile: MediaSource | null;
  sitoDesktop: MediaSource | null;
};

/** Un capitolo: smartphone con lo spot (o il sito mobile, se lo spot manca) + browser con il sito. */
export function ProgettoChapter({
  p,
  media,
  index,
  total,
  headingLevel: H = "h3",
}: {
  p: Progetto;
  media: ChapterMedia;
  index: number;
  total: number;
  headingLevel?: "h2" | "h3";
}) {
  const phone = media.spot ?? media.sitoMobile;
  const phoneIsSpot = Boolean(media.spot);
  const hasBoth = Boolean(phone && media.sitoDesktop);
  const [tab, setTab] = useState<"phone" | "browser">("phone");
  const num = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const nome = p.nome;

  return (
    <article className="flex min-h-[100dvh] flex-col justify-center bg-bg pb-24 pt-20 lg:pb-10" aria-labelledby={`cap-${p.slug}`}>
      <div className="wrap grid items-center gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] lg:gap-14">
        {/* testo */}
        <div className="flex flex-col gap-4 lg:gap-6">
          <div className="flex items-center gap-3 text-fg-muted">
            <ScrambleText text={num} className="mono text-accent-text" />
            <span className="h-px w-8 bg-line-strong" aria-hidden />
            <span className="mono">{p.settore}</span>
          </div>
          <H id={`cap-${p.slug}`} className="text-[clamp(3rem,1rem+6vw,7.5rem)] leading-[0.88]">
            {nome}
          </H>
          <p className="max-w-[38ch] text-lead text-fg-muted">
            <T>{p.frase}</T>
          </p>
          {p.concept && <span className="tag-concept self-start">Concept</span>}
          <div className="mt-2 flex flex-wrap gap-3">
            {p.sitoUrl && (
              <a
                href={p.sitoUrl}
                target="_blank"
                rel="noopener"
                className="btn btn-ghost"
                onClick={() => track("progetto_live_click", { progetto: p.slug })}
              >
                Apri il sito live
                <ArrowUpRight size={17} aria-hidden />
                <span className="sr-only"> di {clean(nome)} (si apre in una nuova scheda)</span>
              </a>
            )}
            <Link href={`/lavori/${p.slug}`} className="btn link-line px-1 text-fg-muted hover:text-fg">
              Vedi il progetto
            </Link>
          </div>
        </div>

        {/* media */}
        <div>
          {hasBoth && (
            <div role="tablist" aria-label={`Video di ${nome}`} className="mb-4 inline-flex border border-line lg:hidden">
              {(["phone", "browser"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  type="button"
                  aria-selected={tab === t}
                  aria-controls={`panel-${p.slug}-${t}`}
                  id={`tab-${p.slug}-${t}`}
                  onClick={() => setTab(t)}
                  className={cn(
                    "min-h-11 px-5 text-sm font-semibold transition-colors",
                    tab === t ? "bg-fg text-bg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {t === "phone" ? (phoneIsSpot ? "Spot" : "Sito mobile") : "Sito"}
                </button>
              ))}
            </div>
          )}

          <div className="relative flex items-end gap-6 lg:gap-10">
            {phone && (
              <div
                id={`panel-${p.slug}-phone`}
                role={hasBoth ? "tabpanel" : undefined}
                aria-labelledby={hasBoth ? `tab-${p.slug}-phone` : undefined}
                className={cn(
                  "mx-auto w-[min(62vw,250px)] shrink-0 lg:mx-0 lg:block lg:w-[clamp(200px,17vw,280px)]",
                  hasBoth && tab !== "phone" && "hidden",
                )}
              >
                <PhoneFrame screenAspect={phoneIsSpot ? "9 / 16" : "390 / 844"}>
                  <SmartVideo
                    src={phone}
                    label={phoneIsSpot ? `Spot di ${clean(nome)}` : `Sito di ${clean(nome)} su smartphone`}
                    description={
                      phoneIsSpot
                        ? `Spot verticale per i social di ${clean(nome)}, ${p.settore.toLowerCase()}.`
                        : `Registrazione dello scroll del sito di ${clean(nome)} su uno smartphone.`
                    }
                    className="absolute inset-0"
                    showAudio={phoneIsSpot}
                    controlsPosition="bottom-right"
                  />
                </PhoneFrame>
              </div>
            )}
            {media.sitoDesktop && p.sitoUrl && (
              <div
                id={`panel-${p.slug}-browser`}
                role={hasBoth ? "tabpanel" : undefined}
                aria-labelledby={hasBoth ? `tab-${p.slug}-browser` : undefined}
                className={cn("min-w-0 flex-1 lg:block", hasBoth && tab !== "browser" && "hidden")}
              >
                <BrowserFrame url={p.sitoUrl} aspect="1440 / 900">
                  <SmartVideo
                    src={media.sitoDesktop}
                    label={`Sito di ${clean(nome)} su desktop`}
                    description={`Registrazione dello scroll del sito di ${clean(nome)} su desktop.`}
                    className="absolute inset-0"
                    fit="cover"
                  />
                </BrowserFrame>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
