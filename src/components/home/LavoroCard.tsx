"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { LavoroRecente } from "@/lib/lavori-recenti";

type LavoroCardProps = {
  lavoro: LavoroRecente;
  onOpen: (lavoro: LavoroRecente) => void;
};

/**
 * Single vertical video card for "Ultimi lavori". The <video> itself is
 * only mounted once the card nears the viewport (keeps the other 4 cards'
 * network/decoder work off the critical path on first load — measured via
 * Lighthouse, see commit notes); among mounted videos, only the one
 * actually visible plays, the rest stay paused (battery/data). Tapping
 * opens the fullscreen lightbox with sound. A small corner button pauses
 * the loop in place, independent of the tap-to-open interaction (WCAG
 * 2.2.2).
 */
export function LavoroCard({ lavoro, onOpen }: LavoroCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const userPausedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0) setShouldLoad(true);

        if (reducedMotionRef.current || userPausedRef.current) return;
        const video = videoRef.current;
        if (!video) return;
        if (entry.intersectionRatio >= 0.6) {
          video.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: [0, 0.6], rootMargin: "200px" },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  function togglePlay(e: React.MouseEvent) {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
      userPausedRef.current = false;
    } else {
      video.pause();
      setPlaying(false);
      userPausedRef.current = true;
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="group relative w-[62vw] shrink-0 snap-start sm:w-[200px] md:w-[220px]"
    >
      <button
        type="button"
        onClick={() => onOpen(lavoro)}
        aria-label={`Apri a schermo intero: ${lavoro.title} — ${lavoro.subtitle}`}
        className="relative block aspect-[9/16] w-full overflow-hidden rounded-2xl border border-border bg-card text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
      >
        {shouldLoad ? (
          <video
            ref={videoRef}
            src={lavoro.videoSrc}
            poster={lavoro.posterSrc}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lavoro.posterSrc}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        {lavoro.isConcept && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            Concept
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-display text-base tracking-tight">{lavoro.title}</h3>
          <p className="mt-1 text-xs text-white/80">{lavoro.subtitle}</p>
        </div>
      </button>

      {shouldLoad && (
        <button
          type="button"
          onClick={togglePlay}
          aria-pressed={!playing}
          aria-label={playing ? `Metti in pausa: ${lavoro.title}` : `Riprendi: ${lavoro.title}`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
        >
          {playing ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
        </button>
      )}

      {lavoro.siteUrl && (
        <a
          href={lavoro.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 mt-2 inline-block text-xs text-lime underline-offset-4 hover:underline"
        >
          Vedi il sito →
        </a>
      )}
    </div>
  );
}
