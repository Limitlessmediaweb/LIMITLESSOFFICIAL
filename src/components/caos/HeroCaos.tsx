"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { cose } from "@/data/home";
import { useHydrated } from "@/lib/hooks";
import { Messy, Tidy } from "./Cose";
import { clamp, lerp, rng, smooth, stageProgress, tilt, tiltAuto, tiltEnable, tiltNeedsTap, viewLoop } from "./fisica";

/** Fogli nel mucchio: meno su telefono (prestazioni), tutti su computer. */
const FOGLI_TELEFONO = 6;
const RIGHE = 7;
const G = 1700;

type Body = {
  el: HTMLElement;
  kind: "row" | "clip";
  /** Riga o miniatura ordinata verso cui va (null = foglio in più, che sparisce). */
  target: HTMLElement | null;
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  w: number;
  r: number;
  tx: number;
  ty: number;
  sc: number;
  stag: number;
  spawn: number;
  px: number;
  py: number;
  fo: string;
  to: string;
};

/**
 * Hero della home: il motto, e accanto l'immagine del «dentro»: il disordine di ogni giorno (fogli, post-it, messaggi)
 * che scorrendo va al suo posto. Senza JS o con «riduci movimento» si vede subito la versione in ordine.
 * Telefono: meno fogli e niente ombre.
 */
export function HeroCaos() {
  const stageRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const [tapDone, setTapDone] = useState(false);
  const needsTap = hydrated && !tapDone && tiltNeedsTap();

  useEffect(() => {
    const stage = stageRef.current!;
    const pin = pinRef.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const q = <T extends HTMLElement>(s: string) => pin.querySelector<T>(s)!;
    const qa = <T extends HTMLElement>(s: string) => Array.from(pin.querySelectorAll<T>(s));
    const field = q<HTMLDivElement>(".caos-field");
    const hints = q<HTMLDivElement>(".caos-hints");
    const labels = qa<HTMLElement>(".caos-lab");
    const more = q<HTMLElement>(".caos-more");
    const letters = qa<HTMLElement>(".caos-ch");
    const stato = q<HTMLElement>(".caos-stato");
    const bar = document.querySelector<HTMLElement>('aside[aria-label="Contatto rapido"]');
    const rand = rng(7);
    const lettere = letters.map(() => ({ r: (rand() - 0.5) * 34, y: (rand() - 0.5) * 0.22, x: (rand() - 0.5) * 0.08 }));

    let W = 0;
    let H = 0;
    let floor = 0;
    let bodies: Body[] = [];
    let p = 0;
    let lastP = -1;
    let shownP = -1;
    let still = 0;
    let ordered: boolean | null = null;
    let lite = false;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const isMobile = () => window.innerWidth < 1024;

    function build() {
      const rowEls = qa<HTMLElement>(".caos-rows > li").filter((el) => el.offsetParent !== null);
      const clipEls = qa<HTMLElement>(".caos-strip > li");
      const its = qa<HTMLElement>(".caos-field > .it").filter((el) => el.offsetParent !== null);
      let r = 0;
      let c = 0;
      bodies = its.map((el, i) => {
        const kind = el.dataset.kind === "clip" ? "clip" : "row";
        const target = kind === "clip" ? clipEls[c++] ?? null : rowEls[r++] ?? null;
        return {
          el, kind, target,
          x: 0, y: 0, vx: 0, vy: 0, a: (rand() - 0.5) * 1.2, w: (rand() - 0.5) * 3,
          r: 40, tx: 0, ty: 0, sc: 1, stag: rand(), spawn: i, px: 0, py: 0, fo: "", to: "",
        };
      });
      const extra = bodies.filter((b) => b.kind === "row" && !b.target).length;
      more.textContent = extra > 0 ? `+ ${extra} già sistemati` : "";
      measure(true);
    }

    function measure(respawn: boolean) {
      const pr = pin.getBoundingClientRect();
      W = pin.clientWidth;
      H = pin.clientHeight;
      floor = H;
      const mobile = isMobile();
      const ms = mobile ? 0.74 : 1.08;
      const mr = more.getBoundingClientRect();
      // prima tutte le letture, poi tutte le scritture: una sola passata di layout
      const misure = bodies.map((b) => ({ tr: b.target?.getBoundingClientRect(), w: b.el.offsetWidth, h: b.el.offsetHeight }));
      bodies.forEach((b, i) => {
        const { tr, w, h } = misure[i];
        if (b.kind === "row") {
          b.el.style.margin = `${-h / 2}px 0 0 ${-w / 2}px`;
          b.sc = ms;
          b.r = Math.min(w, h) * 0.5 * ms * 1.02;
          if (tr) {
            b.tx = tr.left - pr.left + tr.width / 2;
            b.ty = tr.top - pr.top + tr.height / 2;
          } else {
            b.tx = mr.left - pr.left + mr.width / 2;
            b.ty = mr.top - pr.top + mr.height / 2;
          }
        } else if (tr) {
          // la miniatura nel mucchio è la stessa della striscia, solo più piccola e storta
          b.el.style.width = `${tr.width}px`;
          b.el.style.height = `${tr.height}px`;
          b.el.style.margin = `${-tr.height / 2}px 0 0 ${-tr.width / 2}px`;
          const mw = mobile ? 58 : 104;
          b.sc = mw / tr.width;
          b.r = mw * 0.62;
          b.tx = tr.left - pr.left + tr.width / 2;
          b.ty = tr.top - pr.top + tr.height / 2;
        }
        if (respawn) {
          b.x = b.r + rand() * Math.max(1, W - 2 * b.r);
          b.y = -b.r - 40 - b.spawn * (mobile ? 70 : 60) - rand() * 60;
          b.vx = (rand() - 0.5) * 200;
          b.vy = 0;
        } else {
          b.x = clamp(b.x, b.r, W - b.r);
          b.y = Math.min(b.y, H - b.r);
        }
        b.fo = "";
        b.to = "";
      });
      lastP = -1;
      shownP = -1;
      still = 0;
    }

    // trascinamento e lancio
    let held: { b: Body; ox: number; oy: number; sx: number; sy: number; moved: boolean } | null = null;
    const ptr = { x: 0, y: 0, vx: 0, vy: 0, t: 0, mouse: false };
    const local = (e: PointerEvent) => {
      const r = pin.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onDown = (e: PointerEvent) => {
      if (p > 0.35) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>(".it");
      const b = el && bodies.find((x) => x.el === el);
      if (!b) return;
      const [x, y] = local(e);
      held = { b, ox: b.x - x, oy: b.y - y, sx: x, sy: y, moved: false };
      ptr.x = x;
      ptr.y = y;
      b.el.classList.add("drag");
      if (e.pointerType === "mouse") {
        try {
          b.el.setPointerCapture(e.pointerId);
        } catch {}
        e.preventDefault();
      }
    };
    const onMove = (e: PointerEvent) => {
      const [x, y] = local(e);
      const now = performance.now();
      const dt = Math.max(8, now - ptr.t);
      ptr.vx = lerp(ptr.vx, ((x - ptr.x) / dt) * 1000, 0.5);
      ptr.vy = lerp(ptr.vy, ((y - ptr.y) / dt) * 1000, 0.5);
      ptr.x = x;
      ptr.y = y;
      ptr.t = now;
      ptr.mouse = e.pointerType === "mouse";
      if (held && Math.hypot(x - held.sx, y - held.sy) > 6) held.moved = true;
    };
    const release = (cancelled: boolean) => {
      if (!held) return;
      const b = held.b;
      b.el.classList.remove("drag");
      if (!held.moved && !cancelled) {
        // tocco: il foglio salta
        b.vy = -900 - rand() * 300;
        b.vx += (rand() - 0.5) * 700;
        b.w += (rand() - 0.5) * 14;
      } else {
        b.vx = clamp(ptr.vx, -2600, 2600);
        b.vy = clamp(ptr.vy, -2600, 2600);
      }
      held = null;
    };
    const onUp = () => release(false);
    const onCancel = () => release(true);

    // lo scroll scuote il mucchio
    let lastY = window.scrollY;
    const onScroll = () => {
      const d = window.scrollY - lastY;
      lastY = window.scrollY;
      if (p < 0.3 && Math.abs(d) > 2) {
        const k = clamp(Math.abs(d), 0, 60);
        for (const b of bodies) {
          b.vy -= k * (5 + b.stag * 7);
          b.vx += (b.stag - 0.5) * k * 8;
          b.w += (b.stag - 0.5) * k * 0.3;
        }
      }
    };

    function physics(dt: number) {
      let gx = 0;
      let gy = G;
      if (tilt.on) {
        gx = tilt.x * 2600;
        gy = G * (1 - 0.45 * Math.abs(tilt.x)) + tilt.y * 500;
      }
      const sub = 2;
      const h = dt / sub;
      for (let s = 0; s < sub; s++) {
        for (const b of bodies) {
          if (held && held.b === b) {
            b.vx = (ptr.x + held.ox - b.x) * 22;
            b.vy = (ptr.y + held.oy - b.y) * 22;
            b.w *= 0.9;
          } else {
            b.vx += gx * h;
            b.vy += gy * h;
            if (ptr.mouse && !held) {
              const d = Math.hypot(b.x - ptr.x, b.y - ptr.y);
              if (d < b.r + 26) {
                b.vx += ptr.vx * 0.05;
                b.vy += ptr.vy * 0.05;
              }
            }
          }
          b.vx *= 1 - 0.35 * h;
          b.vy *= 1 - 0.35 * h;
          b.x += b.vx * h;
          b.y += b.vy * h;
          b.a += b.w * h;
          if (b.x < b.r) {
            b.x = b.r;
            b.vx = Math.abs(b.vx) * 0.3;
          }
          if (b.x > W - b.r) {
            b.x = W - b.r;
            b.vx = -Math.abs(b.vx) * 0.3;
          }
          if (b.y > floor - b.r) {
            b.y = floor - b.r;
            if (b.vy > 0) b.vy = -b.vy * 0.22;
            b.vx *= 1 - 3 * h;
            b.w = lerp(b.w, b.vx / b.r, 0.25);
          }
        }
        for (let i = 0; i < bodies.length; i++) {
          const a = bodies[i];
          for (let j = i + 1; j < bodies.length; j++) {
            const b = bodies[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const min = (a.r + b.r) * 0.92;
            const d2 = dx * dx + dy * dy;
            if (d2 >= min * min || d2 === 0) continue;
            const d = Math.sqrt(d2);
            const nx = dx / d;
            const ny = dy / d;
            const ov = (min - d) * 0.5;
            a.x -= nx * ov;
            a.y -= ny * ov;
            b.x += nx * ov;
            b.y += ny * ov;
            const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (rv < 0) {
              const imp = -rv * 0.6;
              a.vx -= nx * imp;
              a.vy -= ny * imp;
              b.vx += nx * imp;
              b.vy += ny * imp;
              const tv = (b.vx - a.vx) * -ny + (b.vy - a.vy) * nx;
              a.w += (tv / a.r) * 0.04;
              b.w -= (tv / b.r) * 0.04;
            }
          }
        }
        for (const b of bodies) b.w *= 1 - 1.6 * h;
      }
    }

    // video delle miniature: solo su computer, e solo quando tutto è in ordine
    let videos: HTMLVideoElement[] | null = null;
    function setVideos(on: boolean) {
      if (coarse || isMobile() || lite) return;
      if (on && !videos) {
        videos = qa<HTMLElement>(".caos-strip > li").map((li) => {
          const v = document.createElement("video");
          v.muted = true;
          v.loop = true;
          v.playsInline = true;
          v.preload = "none";
          v.setAttribute("aria-hidden", "true");
          v.tabIndex = -1;
          v.src = li.dataset.video!;
          li.appendChild(v);
          return v;
        });
      }
      videos?.forEach((v, i) => {
        if (on) window.setTimeout(() => ordered && v.play().catch(() => {}), i * 140);
        else v.pause();
      });
    }

    function render() {
      // a riposo non si tocca niente: zero lavoro
      let e = 0;
      for (const b of bodies) {
        e += Math.abs(b.x - b.px) + Math.abs(b.y - b.py);
        b.px = b.x;
        b.py = b.y;
      }
      if (e < 0.12 * bodies.length && Math.abs(p - lastP) < 0.0005 && !held) {
        if (++still > 30) return;
      } else still = 0;
      lastP = p;
      for (const b of bodies) {
        const k = smooth(0.08 + b.stag * 0.3, 0.58 + b.stag * 0.3, p);
        const x = lerp(b.x, b.tx, k);
        const y = lerp(b.y, b.ty, k);
        const a = b.a * (1 - k);
        if (b.kind === "row") {
          b.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${a.toFixed(3)}rad) scale(${b.sc})`;
          const fo = (1 - smooth(0.3, 0.62, k)).toFixed(2);
          if (fo !== b.fo) {
            b.fo = fo;
            b.el.style.opacity = fo;
            b.el.style.visibility = fo === "0.00" ? "hidden" : "visible";
          }
          if (b.target) {
            const to = smooth(0.5, 0.9, k).toFixed(2);
            if (to !== b.to) {
              b.to = to;
              b.target.style.opacity = to;
            }
          }
        } else {
          b.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${a.toFixed(3)}rad) scale(${lerp(b.sc, 1, k).toFixed(3)})`;
          // arrivata al suo posto, la miniatura del mucchio lascia il posto a quella vera (identica)
          const to = k > 0.999 ? "1" : "0";
          if (to !== b.to && b.target) {
            b.to = to;
            b.target.style.opacity = to;
            b.el.style.visibility = to === "1" ? "hidden" : "visible";
          }
        }
      }
      if (Math.abs(p - shownP) > 0.004) {
        shownP = p;
        const P = smooth(0.08, 0.9, p);
        const lo = smooth(0.7, 0.95, p).toFixed(2);
        for (const l of labels) l.style.opacity = lo;
        hints.style.opacity = (1 - smooth(0.05, 0.25, p)).toFixed(2);
        letters.forEach((s, i) => {
          const L = lettere[i];
          s.style.transform = `translate(${(L.x * (1 - P)).toFixed(3)}em,${(L.y * (1 - P)).toFixed(3)}em) rotate(${(L.r * (1 - P)).toFixed(2)}deg)`;
        });
      }
      const isO = p > 0.86;
      if (isO !== ordered) {
        ordered = isO;
        pin.classList.toggle("is-order", isO);
        stato.textContent = isO ? "Adesso: ordine" : "Adesso: caos";
        hints.style.visibility = isO ? "hidden" : "visible";
        setVideos(isO);
      }
    }

    function frame(dt: number) {
      p = stageProgress(stage);
      // su telefono il pavimento è il bordo della barra WhatsApp: quando si nasconde, il mucchio scende
      let f = H;
      if (bar && isMobile()) f =Math.min(H, bar.getBoundingClientRect().top - pin.getBoundingClientRect().top);
      if (Math.abs(f - floor) > 0.5) {
        floor = f;
        still = 0;
      }
      if (p < 0.93) physics(dt);
      render();
    }

    let stop: (() => void) | null = null;
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      pin.classList.add("is-live");
      build();
      stop = viewLoop(stage, frame, () => {
        // il dispositivo fatica: versione leggera (niente ombre, via i fogli in più, niente video)
        lite = true;
        pin.classList.add("is-lite");
        bodies = bodies.filter((b) => {
          const drop = b.kind === "row" && !b.target;
          if (drop) b.el.style.display = "none";
          return !drop;
        });
        videos?.forEach((v) => v.pause());
      });
    };
    // si parte quando il browser ha finito il primo disegno della pagina, per non rallentarlo
    const quandoLibero = (fn: () => void) => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(fn, { timeout: 900 });
      else window.setTimeout(fn, 200);
    };
    (document.fonts?.ready ?? Promise.resolve()).then(() => quandoLibero(start));

    tiltAuto();

    let rt = 0;
    let lw = window.innerWidth;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        if (!stop) return;
        if (Math.abs(window.innerWidth - lw) > 2) {
          lw = window.innerWidth;
          build();
        } else measure(false);
      }, 150);
    };

    field.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      stop?.();
      window.clearTimeout(rt);
      field.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      pin.classList.remove("is-live", "is-order", "is-lite");
    };
  }, []);

  return (
    <section ref={stageRef} aria-labelledby="hero-title" className="caos-stage border-b border-line">
      <div ref={pinRef} className="caos-pin">
        <div className="wrap caos-grid">
          <div className="caos-copy">
            <p className="mono text-fg-muted">LIMITLESS · gestionale, software su misura, siti, video</p>
            <h1 id="hero-title" className="caos-h1">
              <span className="caos-ord">Lavorare meglio.</span> <span className="caos-due">Farsi vedere meglio.</span>
            </h1>
            <p className="max-w-[40ch] text-lead text-fg-muted">
              <strong className="font-semibold text-fg">Dentro</strong> mettiamo ordine nel lavoro. <strong className="font-semibold text-fg">Fuori</strong> facciamo vedere la
              tua attività come merita.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              {/* su telefono il pulsante è la barra fissa in basso: qui non si ripete */}
              <WhatsAppButton sezione="iniziale (in alto)" posizione="hero" className="max-lg:hidden" />
              <a href="#prodotti" className="link-line inline-flex min-h-11 items-center gap-2 self-start font-semibold sm:self-auto">
                Vedi cosa facciamo
                <ArrowDown size={16} aria-hidden />
              </a>
            </div>
          </div>

          <div className="caos-board">
          <div className="caos-hints">
            <span className="caos-hint">
              <span className="caos-stato">Adesso: caos</span>
            </span>
            <span className="caos-hint">Prova a spostarli. Poi scorri ↓</span>
            {needsTap && (
              <button
                type="button"
                className="caos-hint tap"
                onClick={async () => {
                  await tiltEnable();
                  setTapDone(true);
                }}
              >
                Attiva il movimento
              </button>
            )}
          </div>
            <p className="caos-lab mono">
              <span className="text-accent-text" aria-hidden>
                ●
              </span>{" "}
              Oggi · tutto al suo posto
            </p>
            <ol className="caos-rows" aria-label="La giornata di lavoro, in ordine">
              {cose.slice(0, RIGHE).map((c, i) => (
                <li key={c.t}>
                  <Tidy c={c} n={i + 1} />
                </li>
              ))}
            </ol>
            <p className="caos-lab mono flex justify-end">
              <span className="caos-more" aria-hidden />
            </p>
          </div>
        </div>

        {/* il mucchio: decorativo, le stesse cose sono nell'elenco ordinato qui sopra */}
        <div className="caos-field" aria-hidden>
          {cose.map((c, i) => (
            <div key={c.t} className="it" data-kind="row" data-solo-desktop={i >= FOGLI_TELEFONO ? "" : undefined}>
              <Messy c={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
