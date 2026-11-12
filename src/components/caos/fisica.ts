/** Funzioni comuni alle sezioni animate della home (nessuna libreria). */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Generatore casuale ripetibile: la stessa «confusione» a ogni visita. */
export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Avanzamento dello scroll dentro una sezione alta con contenuto fissato (0 = inizio, 1 = fine). */
export function stageProgress(stage: HTMLElement) {
  const r = stage.getBoundingClientRect();
  const span = stage.offsetHeight - window.innerHeight;
  return span <= 0 ? 1 : clamp(-r.top / span);
}

/**
 * Inclinazione del telefono, tra -1 e 1 (x: sinistra/destra, y: avanti/indietro).
 * Su iPhone serve un tocco dell'utente: `needsTap` è true e si chiama `enable()` dal pulsante.
 */
export const tilt = { x: 0, y: 0, on: false };
let base: number | null = null;
let listening = false;

function onOri(e: DeviceOrientationEvent) {
  if (e.gamma == null || e.beta == null) return;
  if (base == null) base = e.beta;
  base += (e.beta - base) * 0.002; // segue piano la posizione naturale della mano
  tilt.x = clamp(e.gamma / 28, -1, 1);
  tilt.y = clamp((e.beta - base) / 24, -1, 1);
  tilt.on = true;
}

type DOEStatic = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };

export function tiltNeedsTap() {
  if (typeof window === "undefined" || !window.DeviceOrientationEvent) return false;
  const D = window.DeviceOrientationEvent as DOEStatic;
  return typeof D.requestPermission === "function" && window.matchMedia("(pointer: coarse)").matches && !listening;
}

/** Avvia l'ascolto dove non serve permesso (Android). Si può chiamare più volte. */
export function tiltAuto() {
  if (listening || typeof window === "undefined" || !window.DeviceOrientationEvent) return;
  const D = window.DeviceOrientationEvent as DOEStatic;
  if (typeof D.requestPermission === "function") return;
  window.addEventListener("deviceorientation", onOri);
  listening = true;
}

/** iPhone: da chiamare dentro un tocco. */
export async function tiltEnable() {
  try {
    const D = window.DeviceOrientationEvent as DOEStatic | undefined;
    if (!D) return false;
    if (typeof D.requestPermission === "function") {
      const res = await D.requestPermission();
      if (res !== "granted") return false;
    }
    if (!listening) window.addEventListener("deviceorientation", onOri);
    listening = true;
    return true;
  } catch {
    return false;
  }
}

/**
 * Ciclo di animazione che gira solo mentre l'elemento è sullo schermo.
 * `onSlow` scatta una volta sola dopo 3 secondi di fila sotto i 45 fotogrammi al secondo.
 * Con `?fps` nell'indirizzo mostra il contatore in alto al centro.
 */
export function viewLoop(el: HTMLElement, frame: (dt: number, t: number) => void, onSlow?: () => void) {
  let raf = 0;
  let prev = 0;
  let visible = false;
  let acc = 0;
  let n = 0;
  let secs = 0;
  let slowN = 0;
  let slow = false;
  const counter = typeof location !== "undefined" && location.search.includes("fps") ? fpsCounter() : null;

  const tick = (t: number) => {
    const raw = t - prev;
    prev = t;
    if (raw > 0 && raw < 1000) {
      acc += raw;
      n++;
      if (acc >= 1000) {
        const fps = Math.round((n * 1000) / acc);
        secs++;
        if (counter) counter(fps, slow);
        if (secs > 2 && !slow && !document.hidden) {
          slowN = fps < 45 ? slowN + 1 : 0;
          if (slowN >= 3) {
            slow = true;
            onSlow?.();
          }
        }
        acc = 0;
        n = 0;
      }
    }
    frame(Math.min(0.034, Math.max(0, raw) / 1000), t / 1000);
    if (visible) raf = requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    ([e]) => {
      const now = e.isIntersecting;
      if (now === visible) return;
      visible = now;
      cancelAnimationFrame(raf);
      if (visible) {
        prev = performance.now();
        acc = 0;
        n = 0;
        raf = requestAnimationFrame(tick);
      }
    },
    { rootMargin: "10% 0px 10% 0px" },
  );
  io.observe(el);

  return () => {
    visible = false;
    cancelAnimationFrame(raf);
    io.disconnect();
  };
}

let fpsEl: HTMLDivElement | null = null;
function fpsCounter() {
  if (!fpsEl) {
    fpsEl = document.createElement("div");
    fpsEl.className = "fps-counter";
    fpsEl.textContent = "-- fps";
    document.body.appendChild(fpsEl);
  }
  return (fps: number, lite: boolean) => {
    if (!fpsEl) return;
    fpsEl.textContent = `${fps} fps${lite ? " · leggera" : ""}`;
    fpsEl.classList.toggle("low", fps < 50);
  };
}
