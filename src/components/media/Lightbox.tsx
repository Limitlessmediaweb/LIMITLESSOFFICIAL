"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaSource } from "@/lib/media";
import { getLenis } from "@/components/motion/SmoothScroll";

export type LightboxItem = {
  id: string;
  title: string;
  subtitle?: string;
  media: MediaSource;
  vertical: boolean;
};

/**
 * Lightbox a schermo intero su <dialog> nativo: focus trap e Esc dal browser,
 * frecce da tastiera, swipe orizzontale su touch.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const open = index !== null;
  const item = open ? items[index] : null;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      getLenis()?.stop();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const handleClose = () => {
      getLenis()?.start();
      onClose();
    };
    d.addEventListener("close", handleClose);
    return () => d.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    const v = video.current;
    if (!v || !item) return;
    v.load();
    v.play().catch(() => {});
  }, [item]);

  const go = (dir: 1 | -1) => {
    if (index === null) return;
    onIndex((index + dir + items.length) % items.length);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  const startX = useRef<number | null>(null);

  return (
    <dialog
      ref={dialog}
      onKeyDown={onKey}
      aria-label={item ? `Video: ${item.title}` : "Video"}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-[#050505]/95 p-0 text-[#f2f0ea] backdrop:bg-black/80"
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      }}
    >
      {item && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-extrabold md:text-2xl">{item.title}</p>
              {item.subtitle && <p className="truncate text-sm text-white/60">{item.subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="mono text-white/60" aria-live="polite">
                {String(index! + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                className="grid size-11 place-items-center border border-white/30 hover:border-white"
                aria-label="Chiudi"
                autoFocus
              >
                <X size={18} aria-hidden />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-20">
            <video
              ref={video}
              key={item.id}
              className="max-h-full max-w-full bg-black"
              style={{ aspectRatio: item.vertical ? "9 / 16" : "16 / 9" }}
              controls
              playsInline
              loop
              poster={item.media.poster ?? undefined}
              aria-label={item.title}
            >
              {item.media.mp4Mobile && <source src={item.media.mp4Mobile} type="video/mp4" media="(max-width: 767px)" />}
              <source src={item.media.mp4} type="video/mp4" />
            </video>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-white/30 bg-black/50 hover:border-white md:left-6"
                  aria-label="Video precedente"
                >
                  <ChevronLeft size={20} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-white/30 bg-black/50 hover:border-white md:right-6"
                  aria-label="Video successivo"
                >
                  <ChevronRight size={20} aria-hidden />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
