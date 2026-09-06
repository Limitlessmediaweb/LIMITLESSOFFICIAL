"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export type HeroLaptopHandle = {
  update: (progress: number) => void;
};

export const HERO_SEGMENTS = [
  {
    key: "sito",
    label: "Sito web",
    kind: "image" as const,
    src: "/media/portfolio/mockup-dariccardo.jpg",
  },
  {
    key: "tour",
    label: "Video tour",
    kind: "video" as const,
    src: "/media/video/villa-tour.mp4",
    poster: "/media/video/villa-tour-poster.jpg",
  },
  {
    key: "ads",
    label: "Video ads",
    kind: "video" as const,
    src: "/media/video/vino-ad.mp4",
    poster: "/media/video/vino-ad-poster.jpg",
  },
];

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function segmentOpacity(p: number, i: number, total: number, fade = 0.12) {
  const start = i / total;
  const end = (i + 1) / total;
  if (p <= start - fade || p >= end + fade) return 0;
  if (p < start + fade) return clamp01((p - (start - fade)) / (2 * fade));
  if (p > end - fade) return clamp01(1 - (p - (end - fade)) / (2 * fade));
  return 1;
}

/**
 * The hero's signature visual — a stylised, non-photorealistic pseudo-3D
 * laptop (CSS perspective + 3D transforms). `update(progress)` is called
 * imperatively from the scroll-pin driver so the crossfade/rotation never
 * triggers React re-renders on every scroll tick.
 */
export const HeroLaptop = forwardRef<HeroLaptopHandle>(function HeroLaptop(_props, ref) {
  const groupRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      videoRefs.current.forEach((v) => v?.pause());
    }
  }, []);

  function toggleVideos() {
    const next = !playing;
    setPlaying(next);
    videoRefs.current.forEach((v) => {
      if (!v) return;
      if (next) v.play().catch(() => {});
      else v.pause();
    });
  }

  useImperativeHandle(ref, () => ({
    update(progress: number) {
      const rotateY = -22 + progress * 14; // settles from -22deg to -8deg
      const rotateX = 10 - progress * 3;
      if (groupRef.current) {
        groupRef.current.style.setProperty("--ry", `${rotateY}deg`);
        groupRef.current.style.setProperty("--rx", `${rotateX}deg`);
      }
      HERO_SEGMENTS.forEach((_seg, i) => {
        const el = layerRefs.current[i];
        if (el) el.style.opacity = String(segmentOpacity(progress, i, HERO_SEGMENTS.length));
      });
    },
  }));

  return (
    <div className="mx-auto w-full max-w-[560px] [perspective:2000px]" role="group" aria-label="Anteprima animata dei nostri lavori: sito web, video tour, video ads">
      <div
        ref={groupRef}
        className="relative"
        style={
          {
            "--rx": "10deg",
            "--ry": "-22deg",
            transform: "rotateX(var(--rx)) rotateY(var(--ry))",
          } as React.CSSProperties
        }
      >
        {/*
         * Deliberately NOT transform-style:preserve-3d — video elements
         * nested inside a preserve-3d ancestor render unreliably (blank/
         * black) on several GPU/compositor combinations. Keeping the whole
         * card as one flat plane rotated in 3D space avoids that risk
         * entirely while still giving the tilted, floating-laptop look.
         */}
        {/* screen panel */}
        <div className="relative rounded-[20px] border border-white/10 bg-neutral-900 p-[10px] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.7)]">
          <div className="relative aspect-[16/10.4] overflow-hidden rounded-[12px] bg-black">
            {HERO_SEGMENTS.map((seg, i) => (
              <div
                key={seg.key}
                ref={(el) => {
                  layerRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                {seg.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={seg.src}
                    alt=""
                    className="h-full w-full object-cover object-top"
                    loading="eager"
                  />
                ) : (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={seg.src}
                    poster={seg.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            ))}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/[0.04]" />
          </div>
          {/* camera notch */}
          <div className="absolute left-1/2 top-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/20" />

          {/* WCAG 2.2.2 — visible control to pause the autoplaying loop videos */}
          <button
            type="button"
            onClick={toggleVideos}
            aria-pressed={!playing}
            aria-label={playing ? "Metti in pausa le anteprime video" : "Riprendi le anteprime video"}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
          >
            {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
          </button>
        </div>

        {/* base — a flat bar with a squash to suggest the keyboard deck's foreshortening */}
        <div
          className="relative mx-auto h-[22px] w-[104%] origin-top -translate-x-[2%] scale-y-[0.45] rounded-b-[10px] border border-t-0 border-white/10 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.6)]"
          style={{ background: "linear-gradient(to bottom, #3a3a3a, #202020)" }}
        >
          <div className="absolute left-1/2 top-1/2 h-[3px] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40" />
        </div>
      </div>
    </div>
  );
});
