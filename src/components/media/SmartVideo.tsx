"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { MediaSource } from "@/lib/media";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { release, requestPlay, soloAudio } from "./video-registry";
import { useHydrated, useLowMotion } from "@/lib/hooks";

const MOBILE = "(max-width: 767px)";

type Props = {
  src: MediaSource;
  /** Versione per schermi stretti (art direction: es. showreel verticale su mobile). */
  mobile?: MediaSource | null;
  /** Nome breve del video per screen reader e pulsanti, es. "Spot di NÒTTEA". */
  label: string;
  /** Descrizione testuale del contenuto (letta dagli screen reader). */
  description?: string;
  className?: string;
  videoClassName?: string;
  /** Proporzioni fisse per evitare layout shift. */
  aspect?: string;
  /** Poster come candidato LCP (caricamento prioritario). */
  priority?: boolean;
  /** Se false il video non parte mai da solo. */
  autoPlay?: boolean;
  /** Condizione extra imposta dal genitore (es. card al centro del carosello). */
  active?: boolean;
  /** Soglia di visibilità per partire (0-1). */
  threshold?: number;
  showAudio?: boolean;
  showPause?: boolean;
  /** Tocco sul video = audio on/off. */
  tapForAudio?: boolean;
  onDoubleActivate?: () => void;
  /** Posizione dei controlli. */
  controlsPosition?: "bottom-right" | "top-right" | "bottom-left";
  /** Posizione personalizzata dei controlli (sostituisce controlsPosition). */
  controlsClassName?: string;
  fit?: "cover" | "contain";
  sizes?: string;
};

export function SmartVideo({
  src,
  mobile,
  label,
  description,
  className,
  videoClassName,
  aspect,
  priority = false,
  autoPlay = true,
  active = true,
  threshold = 0.45,
  showAudio = false,
  showPause = true,
  tapForAudio = false,
  onDoubleActivate,
  controlsPosition = "bottom-right",
  controlsClassName,
  fit = "cover",
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const hydrated = useHydrated();
  const lowMotion = useLowMotion();
  const [userStarted, setUserStarted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const descId = useId();

  // Senza JS restano i controlli nativi; dopo l'idratazione decide JS.
  // Con reduced motion o Risparmio dati il video parte solo se lo chiede l'utente.
  const canAuto = !lowMotion || userStarted;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold });
    io.observe(v);
    const onPause = () => setUserPaused((u) => u); // forza un render dopo pausa dal registro
    const onMute = () => setMuted(true);
    v.addEventListener("registry-pause", onPause);
    v.addEventListener("registry-mute", onMute);
    return () => {
      io.disconnect();
      v.removeEventListener("registry-pause", onPause);
      v.removeEventListener("registry-mute", onMute);
      release(v);
    };
  }, [threshold]);

  const shouldPlay = hydrated && autoPlay && active && visible && !userPaused && canAuto;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldPlay) requestPlay(v);
    else if (!v.paused) {
      v.pause();
      release(v);
    }
  }, [shouldPlay]);

  const togglePlay = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      setUserStarted(true);
      requestPlay(v);
    } else {
      setUserPaused(true);
      v.pause();
      release(v);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    const next = !v.muted;
    v.muted = next;
    setMuted(next);
    if (!next) {
      soloAudio(v);
      track("video_audio_on", { video: label });
      if (v.paused) {
        setUserPaused(false);
        requestPlay(v);
      }
    }
  }, [label]);

  const clickTimer = useRef<number | null>(null);
  const onSurfaceClick = () => {
    if (!tapForAudio && !onDoubleActivate) return;
    if (onDoubleActivate) {
      if (clickTimer.current) {
        window.clearTimeout(clickTimer.current);
        clickTimer.current = null;
        onDoubleActivate();
        return;
      }
      clickTimer.current = window.setTimeout(() => {
        clickTimer.current = null;
        if (tapForAudio) toggleAudio();
      }, 260);
    } else if (tapForAudio) toggleAudio();
  };

  const pos = {
    "bottom-right": "bottom-3 right-3",
    "top-right": "top-3 right-3",
    "bottom-left": "bottom-3 left-3",
  }[controlsPosition];

  const objectFit = fit === "cover" ? "object-cover" : "object-contain";

  return (
    <div
      className={cn("group/video relative overflow-hidden bg-bg-sunken", className)}
      style={aspect ? { aspectRatio: aspect } : undefined}
      data-cursor="video"
    >
      {/* Senza JS: poster sotto il video (che è trasparente finché non parte) e controlli nativi. */}
      {src.poster && (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src.poster} alt="" className={cn("absolute inset-0 h-full w-full", objectFit)} />
        </noscript>
      )}
      <video
        ref={ref}
        data-smart=""
        className={cn("absolute inset-0 h-full w-full", objectFit, videoClassName)}
        muted
        playsInline
        loop
        preload="none"
        controls={!hydrated}
        aria-label={label}
        aria-describedby={description ? descId : undefined}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={onSurfaceClick}
      >
        {mobile ? (
          <source src={mobile.mp4Mobile ?? mobile.mp4} type="video/mp4" media={MOBILE} />
        ) : (
          src.mp4Mobile && <source src={src.mp4Mobile} type="video/mp4" media={MOBILE} />
        )}
        <source src={src.mp4} type="video/mp4" />
      </video>
      {/* Poster come immagine vera (AVIF + JPG, lazy salvo priority), sopra al video: copre il video
          finché non sta riproducendo (anche quando è in pausa). Niente attributo poster sul <video>,
          che il browser scaricherebbe subito per ogni video della pagina. */}
      {src.poster && (
        <picture className="smart-poster">
          {mobile?.posterAvif && <source srcSet={mobile.posterAvif} type="image/avif" media={MOBILE} />}
          {mobile?.poster && <source srcSet={mobile.poster} type="image/jpeg" media={MOBILE} />}
          {src.posterAvif && <source srcSet={src.posterAvif} type="image/avif" />}
          { }
          <img
            src={src.poster}
            alt=""
            aria-hidden="true"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className={cn(
              "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500",
              objectFit,
              isPlaying ? "opacity-0" : "opacity-100",
            )}
          />
        </picture>
      )}
      {description && (
        <p id={descId} className="sr-only">
          {description}
        </p>
      )}

      {hydrated && (
        <div className={cn("absolute z-[2] flex gap-2", controlsClassName ?? pos)}>
          {showPause && (
            <button
              type="button"
              onClick={togglePlay}
              className={cn(
                "grid size-11 place-items-center border border-white/30 bg-black/55 text-[#f2f0ea] backdrop-blur transition-opacity hover:border-white",
                !canAuto && !isPlaying ? "size-14 border-white/60" : "",
              )}
              aria-label={isPlaying ? `Metti in pausa: ${label}` : `Riproduci: ${label}`}
            >
              {isPlaying ? <Pause size={16} aria-hidden /> : <Play size={!canAuto ? 22 : 16} aria-hidden />}
            </button>
          )}
          {showAudio && (
            <button
              type="button"
              onClick={toggleAudio}
              className="grid size-11 place-items-center border border-white/30 bg-black/55 text-[#f2f0ea] backdrop-blur hover:border-white"
              aria-label={muted ? `Attiva audio: ${label}` : `Disattiva audio: ${label}`}
              aria-pressed={!muted}
            >
              {muted ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
