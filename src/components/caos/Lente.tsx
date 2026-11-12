"use client";

import { useEffect, useRef } from "react";
import { coppie, cose } from "@/data/home";
import { Messy, Tidy } from "./Cose";
import { clamp, lerp, smooth, tilt, tiltAuto, viewLoop } from "./fisica";

/** Dove sta ogni cosa nel disordine: x e y in percentuale del riquadro, rotazione in gradi. */
const POSTI: [number, number, number][] = [
  [24, 20, -11],
  [72, 15, 8],
  [45, 44, -5],
  [80, 55, 13],
  [20, 68, 9],
  [58, 82, -14],
  [88, 86, 6],
  [10, 42, 16],
];

/**
 * Prima e dopo: sotto c'è la giornata di oggi, dentro la lente la stessa giornata in ordine.
 * La lente segue il mouse, il dito (trascinandola) o l'inclinazione del telefono; scorrendo si allarga e prende tutto.
 * Senza JS o con «riduci movimento» si vede l'elenco in ordine, e sotto le tre coppie prima → dopo.
 */
export function Lente() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = box.querySelector<HTMLElement>(".lente-wrap")!;
    const ord = box.querySelector<HTMLElement>(".lente-ordine")!;
    const rim = box.querySelector<HTMLElement>(".lente-rim")!;
    const caos = box.querySelector<HTMLElement>(".lente-caos")!;

    let W = 0;
    let H = 0;
    let r0 = 90;
    let lastR = -1;
    let holding = false;
    let user = 0;
    const L = { x: 0, y: 0, tx: 0, ty: 0, r: 90 };

    function size() {
      W = box.clientWidth;
      H = box.clientHeight;
      r0 = W < 700 ? Math.min(92, W * 0.26) : Math.min(175, H * 0.32);
      ord.style.width = `${W}px`;
      ord.style.height = `${H}px`;
      L.x = L.tx = W * 0.5;
      L.y = L.ty = H * 0.45;
      lastR = -1;
    }
    function sizeLens(r: number) {
      L.r = r;
      const d = `${(r * 2).toFixed(1)}px`;
      wrap.style.width = d;
      wrap.style.height = d;
      rim.style.width = d;
      rim.style.height = d;
    }
    const local = (e: PointerEvent) => {
      const b = box.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top] as const;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || holding) {
        [L.tx, L.ty] = local(e);
        user = performance.now();
      }
    };
    const onDown = (e: PointerEvent) => {
      holding = true;
      rim.style.cursor = "grabbing";
      try {
        rim.setPointerCapture(e.pointerId);
      } catch {}
      [L.tx, L.ty] = local(e);
      user = performance.now();
    };
    const onUp = () => {
      holding = false;
      rim.style.cursor = "";
    };

    function frame(dt: number, t: number) {
      const b = box.getBoundingClientRect();
      const vh = window.innerHeight;
      // la lente cresce mentre il riquadro sale: a un quarto dello schermo ha preso tutto
      const g = smooth(vh * 0.42, vh * 0.2, b.top + H / 2);
      const idle = performance.now() - user > 2600 && !holding;
      if (tilt.on && !holding && performance.now() - user > 800) {
        L.tx = W / 2 + tilt.x * W * 0.42;
        L.ty = H * 0.45 + tilt.y * H * 0.34;
      } else if (idle) {
        L.tx = W * (0.5 + 0.3 * Math.sin(t * 0.55));
        L.ty = H * (0.45 + 0.26 * Math.sin(t * 0.83 + 1));
      }
      const k = 1 - Math.exp(-(idle ? 2.2 : 11) * dt);
      L.x += (clamp(L.tx, 0, W) - L.x) * k;
      L.y += (clamp(L.ty, 0, H) - L.y) * k;
      const cover = Math.hypot(W, H) * 0.5 + 8;
      const x = lerp(L.x, W / 2, g);
      const y = lerp(L.y, H / 2, g);
      const r = lerp(r0, cover, g * g);
      if (Math.abs(r - lastR) > 0.25) {
        lastR = r;
        sizeLens(r);
      }
      const m = lerp(1.05, 1, g);
      const tr = `translate3d(${(x - L.r).toFixed(1)}px,${(y - L.r).toFixed(1)}px,0)`;
      wrap.style.transform = tr;
      rim.style.transform = tr;
      ord.style.transform = `translate3d(${L.r.toFixed(1)}px,${L.r.toFixed(1)}px,0) scale(${m.toFixed(4)}) translate3d(${(-x).toFixed(1)}px,${(-y).toFixed(1)}px,0)`;
      rim.style.opacity = (1 - smooth(0.35, 0.8, g)).toFixed(2);
      rim.style.pointerEvents = g > 0.5 ? "none" : "";
      caos.style.visibility = g > 0.98 ? "hidden" : "visible";
    }

    box.classList.add("is-live");
    size();
    tiltAuto();
    const stop = viewLoop(box, frame);
    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(size, 150);
    };
    box.addEventListener("pointermove", onMove, { passive: true });
    rim.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("resize", onResize);
    return () => {
      stop();
      window.clearTimeout(rt);
      box.removeEventListener("pointermove", onMove);
      rim.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
      box.classList.remove("is-live");
      for (const el of [wrap, ord, rim]) el.removeAttribute("style");
    };
  }, []);

  return (
    <section id="prima-dopo" aria-labelledby="lente-title" className="wrap scroll-mt-16 py-24 md:py-36">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
        <div>
          <p className="mono text-accent-text">Prima e dopo</p>
          <h2 id="lente-title" className="mt-4 max-w-[12ch] text-title">
            Stessa giornata. Vista in ordine.
          </h2>
        </div>
        <p className="max-w-[46ch] text-lead text-fg-muted">
          Passa la lente. Sotto c&apos;è oggi, dentro c&apos;è come diventa. Sono le cose di sempre: ognuna con un nome, una persona e uno stato.
        </p>
      </div>

      <div ref={boxRef} className="lente-box mt-10">
        <div className="lente-layer lente-caos" aria-hidden>
          {cose.slice(0, POSTI.length).map((c, i) => (
            <div key={c.t} style={{ position: "absolute", left: `${POSTI[i][0]}%`, top: `${POSTI[i][1]}%`, rotate: `${POSTI[i][2]}deg` }}>
              <Messy c={c} className="max-md:scale-[0.82]" />
            </div>
          ))}
        </div>
        <div className="lente-wrap">
          <ol className="lente-layer lente-ordine" aria-label="La stessa giornata, in ordine">
            {cose.map((c, i) => (
              <li key={c.t} className={i > 5 ? "max-md:hidden" : undefined}>
                <Tidy c={c} n={i + 1} />
              </li>
            ))}
          </ol>
        </div>
        <div className="lente-rim" aria-hidden />
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {coppie.map((c) => (
          <li key={c.dopo} className="border-l-2 border-accent pl-4">
            <p className="text-fg-muted line-through decoration-rec/70">{c.prima}</p>
            <p className="mt-1 font-semibold">{c.dopo}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
