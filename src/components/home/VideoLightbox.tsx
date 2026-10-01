"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { LavoroRecente } from "@/lib/lavori-recenti";

type VideoLightboxProps = {
  lavoro: LavoroRecente;
  onClose: () => void;
};

/** Fullscreen tap-to-play overlay, with sound, for a single "Ultimi lavori" video. */
export function VideoLightbox({ lavoro, onClose }: VideoLightboxProps) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${lavoro.title} — video a schermo intero`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-4 py-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>
      <video
        src={lavoro.videoSrc}
        poster={lavoro.posterSrc}
        autoPlay
        controls
        playsInline
        loop
        className="max-h-full max-w-full rounded-xl"
        style={{ aspectRatio: "9 / 16" }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
