"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type VideoShowcaseProps = {
  src: string;
  poster?: string;
  label: string;
  draftNote?: string;
  aspectClassName?: string;
  className?: string;
};

/**
 * Autoplay-muted-on-scroll-into-view video card with a minimal custom
 * pause control (WCAG 2.2.2 — required since the loop runs longer than 5s).
 */
export function VideoShowcase({
  src,
  poster,
  label,
  draftNote,
  aspectClassName = "aspect-video",
  className,
}: VideoShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPausedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (userPausedRef.current) return;
        if (entry.isIntersecting) {
          video.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggle() {
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
    <figure className={`overflow-hidden rounded-2xl border border-border bg-card ${className ?? ""}`}>
      <div className={`relative ${aspectClassName}`}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          loop
          muted
          playsInline
          preload="metadata"
          aria-label={label}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={toggle}
          aria-pressed={!playing}
          aria-label={playing ? `Metti in pausa: ${label}` : `Riproduci: ${label}`}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
        </button>
      </div>
      <figcaption className="px-5 py-4 text-sm text-muted-foreground">
        {label}
        {draftNote && <span className="mt-1 block text-xs text-foreground/70">{draftNote}</span>}
      </figcaption>
    </figure>
  );
}
