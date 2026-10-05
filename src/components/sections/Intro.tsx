"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import type { MediaSource } from "@/lib/media";
import { getLenis } from "@/components/motion/SmoothScroll";

export const INTRO_KEY = "ls-intro";
export const INTRO_DONE = "intro:done";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

function finish() {
  window.__introDone = true;
  window.dispatchEvent(new Event(INTRO_DONE));
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {}
}

/**
 * Animazione iniziale "Senza limiti" (max ~4 s, una volta per sessione).
 * 1. Si disegna una cornice 9:16 con crop marks, REC e timecode.
 * 2. Dentro passano i poster dei lavori (~3 cambi al secondo, sotto la soglia WCAG dei lampi).
 * 3. Sull'ultimo fotogramma la cornice si allarga oltre lo schermo: si scopre l'hero (lo showreel).
 * 4. Sale il wordmark LIMITLESS, poi parte il titolo dell'hero.
 * L'hero esiste già sotto (l'LCP è il suo poster). Reduced motion: dissolvenza di 0,4 s.
 * Visibile solo con JS e solo alla prima visita della sessione (classe "intro-seen" impostata nel <head>).
 */
export function Intro({ frames, finale, finaleMobile }: { frames: string[]; finale: MediaSource; finaleMobile: MediaSource | null }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = root.current!;
      if (document.documentElement.classList.contains("intro-seen")) {
        el.style.display = "none";
        finish();
        return;
      }
      document.documentElement.classList.add("intro-playing");
      getLenis()?.stop();
      const done = () => {
        getLenis()?.start();
        document.documentElement.classList.remove("intro-playing");
        el.style.display = "none";
        finish();
      };

      // i fotogrammi dopo il primo e il finale si caricano solo adesso (non competono con l'LCP)
      el.querySelectorAll<HTMLSourceElement>("source[data-srcset]").forEach((s) => (s.srcset = s.dataset.srcset!));
      el.querySelectorAll<HTMLImageElement>("img[data-src]").forEach((i) => (i.src = i.dataset.src!));

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        tl.current = gsap.timeline({ onComplete: done }).to(el, { opacity: 0, duration: 0.4, ease: "power3.out", delay: 0.2 });
        return;
      }

      const q = gsap.utils.selector(el);
      const box = q("[data-box]")[0] as HTMLElement;
      const imgs = q("[data-frame]") as HTMLElement[];
      const fin = q("[data-finale]")[0] as HTMLElement;
      const tc = q("[data-tc]")[0] as HTMLElement;
      const word = q("[data-word]")[0] as HTMLElement;

      // rettangolo della cornice → clip-path del fotogramma finale a tutto schermo
      const r = box.getBoundingClientRect();
      const inset = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`;
      const scaleOut = Math.max(innerWidth / r.width, innerHeight / r.height) * 1.25;

      const split = SplitText.create(word, { type: "chars", mask: "chars", linesClass: "split-line", wordsClass: "split-word", charsClass: "split-char", aria: "none" });
      gsap.set(split.chars, { yPercent: 110 });
      gsap.set(word, { visibility: "visible" });
      // il primo fotogramma è già visibile nell'HTML (candidato LCP) ma coperto dall'otturatore
      const shutter = q("[data-shutter]")[0] as HTMLElement;
      gsap.set(imgs.slice(1), { opacity: 0 });
      gsap.set(fin, { clipPath: inset, opacity: 0 });

      const clock = { t: 0 };
      const FRAME = 0.34;

      const t = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: done });
      tl.current = t;
      t.fromTo(q("[data-draw]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, ease: "power2.inOut", stagger: 0.04 })
        .from(q("[data-hud]"), { opacity: 0, duration: 0.3 }, 0.2)
        .to(clock, {
          t: 3.6,
          duration: 3.6,
          ease: "none",
          onUpdate: () => {
            const s = clock.t;
            const f = Math.floor((s % 1) * 25);
            tc.textContent = `00:00:${String(Math.floor(s)).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
          },
        }, 0);
      t.to(shutter, { opacity: 0, duration: 0.08, ease: "none" }, 0.55);
      imgs.forEach((img, i) => {
        if (i > 0) t.to(img, { opacity: 1, duration: 0.08, ease: "none" }, 0.55 + i * FRAME);
      });
      const endFrames = 0.55 + imgs.length * FRAME;
      t.set(fin, { opacity: 1 }, endFrames)
        .set(imgs, { opacity: 0 }, endFrames + 0.02)
        .to(fin, { clipPath: "inset(0px 0px 0px 0px)", duration: 0.8, ease: "expo.inOut" }, endFrames + 0.05)
        .to(box, { scale: scaleOut, duration: 0.8, ease: "expo.inOut" }, endFrames + 0.05)
        .to(q("[data-hud]"), { opacity: 0, duration: 0.3 }, endFrames + 0.05)
        .to(split.chars, { yPercent: 0, duration: 0.55, ease: "expo.out", stagger: 0.025 }, endFrames + 0.4)
        .to(el, { opacity: 0, duration: 0.35, ease: "power2.out" }, endFrames + 0.85); // fine a ~3,8 s

      return () => split.revert();
    },
    { scope: root },
  );

  const skip = () => {
    tl.current?.progress(1);
  };

  return (
    <div
      ref={root}
      id="intro"
      className="fixed inset-0 z-[95] overflow-hidden bg-[#050505] text-[#f2f0ea]"
    >
      {/* fotogramma finale: lo stesso poster dell'hero, scoperto allargando la cornice */}
      <picture>
        {finaleMobile?.posterAvif && <source data-srcset={finaleMobile.posterAvif} type="image/avif" media="(max-width: 767px)" />}
        {finaleMobile?.poster && <source data-srcset={finaleMobile.poster} type="image/jpeg" media="(max-width: 767px)" />}
        {finale.posterAvif && <source data-srcset={finale.posterAvif} type="image/avif" />}
        { }
        <img data-finale data-src={finale.poster ?? ""} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0" />
      </picture>

      <div className="absolute inset-0 grid place-items-center">
        <div data-box className="relative h-[58dvh] max-h-[640px]" style={{ aspectRatio: "9 / 16" }}>
          {frames.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} data-frame src={i === 0 ? src : undefined} data-src={i === 0 ? undefined : src} alt="" fetchPriority={i === 0 ? "high" : "auto"} className={`absolute inset-0 h-full w-full object-cover ${i === 0 ? "" : "opacity-0"}`} style={{ zIndex: i }} />
          ))}
          <div data-shutter aria-hidden className="absolute inset-0 z-[8] bg-[#050505]" />
          {/* cornice + crop marks disegnati */}
          <svg className="pointer-events-none absolute -inset-3 z-10 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <rect data-draw x="3" y="2" width="94" height="96" fill="none" stroke="#f2f0ea" strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path data-draw d="M0 6V0h8M92 0h8v6M100 94v6h-8M8 100H0v-6" fill="none" stroke="#e8ff3a" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>

      <div data-hud className="absolute left-4 top-4 flex items-center gap-4 md:left-8 md:top-6">
        <span className="mono inline-flex items-center gap-2">
          <span className="rec-dot" aria-hidden />
          REC
        </span>
        <span data-tc className="mono text-white/70">00:00:00:00</span>
      </div>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <p data-word aria-hidden className="invisible font-display text-[clamp(3.5rem,16vw,15rem)] font-extrabold leading-none [text-shadow:0_4px_40px_rgb(0_0_0/0.5)]">
          LIMITLESS
        </p>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute bottom-6 right-4 z-20 min-h-11 border border-white/40 bg-black/40 px-5 font-medium backdrop-blur hover:border-white md:right-8"
      >
        Salta l&apos;intro
      </button>
    </div>
  );
}
