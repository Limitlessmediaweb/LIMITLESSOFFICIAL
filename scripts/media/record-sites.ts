/**
 * Registra uno scroll lento e fluido dei siti live dei progetti "Sito + Spot".
 *
 * Uso:
 *   npx tsx scripts/media/record-sites.ts            # tutti i progetti con URL
 *   npx tsx scripts/media/record-sites.ts ordito     # solo uno
 *   FORCE=1 bash scripts/media/compress.sh siti      # poi comprimi
 *
 * Come funziona (perché non usa recordVideo né window.scrollTo):
 *  - recordVideo di Playwright perde fotogrammi e non segue il DPR; qui si usa CDP
 *    `Page.startScreencast` con i timestamp di ogni fotogramma e si ricostruisce un video
 *    a 30 fps costanti (ogni istante prende l'ultimo fotogramma disponibile).
 *  - `window.scrollTo` a salti litiga con lo smooth scroll (Lenis) e con le sezioni fissate
 *    di GSAP (l'esploso della giacca di ORDITO andava avanti e indietro). Qui lo scroll è guidato
 *    da un ciclo requestAnimationFrame dentro la pagina: se il sito usa Lenis (classe "lenis"
 *    su <html>) invia a ogni frame un piccolo evento di rotellina, che Lenis segue in modo fluido;
 *    altrimenti muove lo scroll nativo di pochi pixel per frame. (Con mouse.wheel da Playwright
 *    ogni passo costava ~80 ms: scatti e pixel persi.)
 *  - Le sezioni fissate (`.pin-spacer` di GSAP) vengono attraversate più lentamente, e ancora più
 *    lentamente quella indicata in SLOW_TEXT (l'esploso della giacca di ORDITO).
 *  - Prima di registrare: fine dell'intro, font, immagini, scroll di riscaldamento fino in
 *    fondo (carica le immagini lazy) e ritorno in cima; scrollbar nascosta.
 *
 * Output: .cache/recordings/<slug>-mobile.mp4 e <slug>-desktop.mp4 (alta qualità, poi compress.sh)
 * Screenshot dell'hero: public/media/siti/<slug>-hero.jpg (usato anche per l'Open Graph)
 */
import { chromium, type Browser, type Page } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { progetti } from "../../src/data/progetti";

const ROOT = join(__dirname, "..", "..");
const OUT = join(ROOT, ".cache", "recordings");
const FRAMES = join(ROOT, ".cache", "frames");
const HERO = join(ROOT, "public", "media", "siti");

const FPS = 30;
const SCROLL_MS = 14_000; // durata dello scroll
const HOLD_START_MS = 600; // hero fermo all'inizio
const HOLD_END_MS = 700; // fondo fermo alla fine
const PIN_SLOWDOWN = 1.5; // quanto più lente sono le sezioni fissate
const FOCUS_SLOWDOWN = 5; // sezione fissata principale (testo in SLOW_TEXT)
/** Testo che identifica la sezione da mostrare con calma, per progetto. */
const SLOW_TEXT: Record<string, RegExp> = { ordito: /anatomia/i };

const VARIANTS = [
  { name: "mobile", viewport: { width: 390, height: 844 }, dpr: 2, isMobile: true },
  { name: "desktop", viewport: { width: 1440, height: 900 }, dpr: 2, isMobile: false },
] as const;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Aspetta font, immagini visibili e la fine dell'intro (nessun overlay a tutto schermo). */
async function waitReady(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
  await page.evaluate("document.fonts && document.fonts.ready");
  await sleep(4500); // intro dei siti (≈3-4 s)
  await page
    .waitForFunction(
      `[...document.images].filter(i => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }).every(i => i.complete)`,
      undefined,
      { timeout: 15_000 },
    )
    .catch(() => {});
}

/** Restituisce l'altezza scrollabile, le zone fissate e se c'è un'istanza Lenis raggiungibile. */
async function analyse(page: Page) {
  return page.evaluate(`(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pins = [...document.querySelectorAll('.pin-spacer')].map(el => {
      const top = el.getBoundingClientRect().top + scrollY;
      return { from: Math.max(0, top - innerHeight * 0.3), to: Math.min(max, top + el.offsetHeight - innerHeight * 0.7), text: (el.innerText || '').slice(0, 200) };
    }).filter((p) => p.to > p.from);
    return { max, pins, hasLenis: document.documentElement.classList.contains('lenis') };
  })()`) as Promise<{ max: number; pins: { from: number; to: number; text: string }[]; hasLenis: boolean }>;
}

/** Curva tempo → posizione: easing in/out, più lenta dentro le sezioni fissate. */
function buildCurve(max: number, pins: { from: number; to: number; w: number }[]) {
  const N = 2000;
  const weight = (y: number) => pins.reduce((w, p) => (y >= p.from && y <= p.to ? Math.max(w, p.w) : w), 1);
  // tempo cumulato necessario a percorrere ogni tratto
  const ys: number[] = [];
  const ts: number[] = [0];
  for (let i = 0; i <= N; i++) ys.push((max * i) / N);
  for (let i = 1; i <= N; i++) ts.push(ts[i - 1] + weight(ys[i]));
  const total = ts[N];
  return (p: number) => {
    // easing sul tempo (partenza e arrivo morbidi)
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    const target = e * total;
    let lo = 0;
    let hi = N;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ts[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return ys[lo];
  };
}

/** Scroll istantaneo (solo per riscaldamento e ritorno in cima, mai durante la registrazione). */
async function jump(page: Page, y: number, hasLenis: boolean) {
  if (hasLenis) {
    // Lenis segue la rotellina: un evento grande per arrivare in fondo, poi si aspetta
    await page.evaluate(`window.dispatchEvent(new WheelEvent('wheel', { deltaY: ${y} - scrollY, bubbles: true, cancelable: true }))`);
  } else {
    await page.evaluate(`window.scrollTo(0, ${y})`);
  }
}

async function record(browser: Browser, slug: string, url: string, v: (typeof VARIANTS)[number]) {
  const context = await browser.newContext({
    viewport: v.viewport,
    deviceScaleFactor: v.dpr,
    isMobile: v.isMobile,
    hasTouch: v.isMobile,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.addStyleTag({ content: "html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important}html,body{scrollbar-width:none!important}" });
  await waitReady(page);
  await page.mouse.move(v.viewport.width / 2, v.viewport.height / 2);

  // Riscaldamento: scorre fino in fondo (carica immagini lazy e inizializza le animazioni) e torna su
  for (let i = 0; i < 40; i++) {
    const pre = await analyse(page);
    if ((await page.evaluate("scrollY")) as number >= pre.max - 2) break;
    await jump(page, (await page.evaluate("scrollY")) as number + v.viewport.height * 0.8, pre.hasLenis);
    await sleep(160);
  }
  await page
    .waitForFunction(`[...document.images].every(i => i.complete)`, undefined, { timeout: 15_000 })
    .catch(() => {});
  await page.evaluate(`window.dispatchEvent(new WheelEvent('wheel', { deltaY: -scrollY - 1000, bubbles: true })); window.scrollTo(0, 0)`);
  await sleep(3000);
  await page.evaluate("window.scrollTo(0, 0)");
  await sleep(1000);

  if (v.name === "desktop") {
    await page.screenshot({ path: join(HERO, `${slug}-hero.jpg`), type: "jpeg", quality: 82, scale: "css" });
  }

  const { max, pins, hasLenis } = await analyse(page);
  // Calibrazione: alcuni siti moltiplicano la rotellina (es. wheelMultiplier 0.9 in Lenis).
  // Un passo di prova da 1000 px, misura di quanto si è mosso davvero, ritorno in cima.
  let gain = 1;
  if (hasLenis) {
    await page.evaluate("window.dispatchEvent(new WheelEvent('wheel', { deltaY: 1000, bubbles: true, cancelable: true }))");
    await sleep(2500);
    const moved = (await page.evaluate("scrollY")) as number;
    if (moved > 100) gain = 1000 / moved;
    await page.evaluate("window.dispatchEvent(new WheelEvent('wheel', { deltaY: -5000, bubbles: true, cancelable: true }))");
    await sleep(2500);
    await page.evaluate("window.scrollTo(0, 0)");
    await sleep(800);
  }
  const focus = SLOW_TEXT[slug];
  const weighted = pins.map((p) => ({ ...p, w: focus && focus.test(p.text) ? FOCUS_SLOWDOWN : PIN_SLOWDOWN }));
  console.log(
    `  ${slug}-${v.name}: altezza ${Math.round(max)}px, sezioni fissate ${pins.length}` +
      `${weighted.some((p) => p.w === FOCUS_SLOWDOWN) ? " (una rallentata)" : ""}, scroll via ${hasLenis ? `rotellina → Lenis (correzione ×${gain.toFixed(2)})` : "scroll nativo"}`,
  );
  const curve = buildCurve(max, weighted);
  // curva campionata a 120 Hz, passata alla pagina
  const nSamples = Math.round((SCROLL_MS / 1000) * 120) + 1;
  const samples = Array.from({ length: nSamples }, (_, i) => Math.round(curve(i / (nSamples - 1))));

  // Screencast CDP con timestamp
  const dir = join(FRAMES, `${slug}-${v.name}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const frames: { t: number; data: Buffer }[] = [];
  const cdp = await context.newCDPSession(page);
  cdp.on("Page.screencastFrame", async (f: { data: string; metadata: { timestamp?: number }; sessionId: number }) => {
    frames.push({ t: (f.metadata.timestamp ?? Date.now() / 1000) * 1000, data: Buffer.from(f.data, "base64") });
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", {
    format: "jpeg",
    quality: 92,
    maxWidth: v.viewport.width * v.dpr,
    maxHeight: v.viewport.height * v.dpr,
    everyNthFrame: 1,
  });

  const t0 = Date.now();
  await sleep(HOLD_START_MS);
  // motore di scroll dentro la pagina: un piccolo passo ogni ~16 ms, nessun salto
  await page.evaluate(`new Promise((done) => {
    const S = ${JSON.stringify(samples)}, ms = ${SCROLL_MS}, lenis = ${hasLenis}, gain = ${gain};
    let sent = 0; const t0 = performance.now();
    // ritmo a ~60 Hz con setInterval (non si ferma se la pagina rallenta i frame) + uscita di sicurezza
    const guard = setTimeout(() => { clearInterval(timer); done(); }, ms + 4000);
    const step = () => {
      const now = performance.now();
      const p = Math.min(1, (now - t0) / ms);
      const target = S[Math.round(p * (S.length - 1))];
      const d = target - sent;
      if (d !== 0) {
        if (lenis) window.dispatchEvent(new WheelEvent('wheel', { deltaY: d * gain, deltaMode: 0, bubbles: true, cancelable: true }));
        else window.scrollTo(0, target);
        sent = target;
      }
      if (p >= 1) { clearInterval(timer); clearTimeout(guard); done(); }
    };
    const timer = setInterval(step, 16);
  })`);
  await sleep(HOLD_END_MS);
  const fine = (await page.evaluate("[scrollY, document.documentElement.scrollHeight - innerHeight]")) as number[];
  console.log(`    arrivato a ${Math.round(fine[0])} / ${Math.round(fine[1])} px`);
  await cdp.send("Page.stopScreencast");
  const durationMs = Date.now() - t0;
  await context.close();

  // Ricostruzione a 30 fps costanti: per ogni istante l'ultimo fotogramma arrivato
  frames.sort((a, b) => a.t - b.t);
  const start = Math.min(frames[0]?.t ?? 0, t0);
  const total = Math.floor((durationMs / 1000) * FPS);
  let k = 0;
  for (let i = 0; i < total; i++) {
    const t = t0 + (i * 1000) / FPS;
    while (k + 1 < frames.length && frames[k + 1].t <= t) k++;
    writeFileSync(join(dir, `${String(i).padStart(5, "0")}.jpg`), frames[k].data);
  }
  void start;
  const dst = join(OUT, `${slug}-${v.name}.mp4`);
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-framerate", String(FPS), "-i", join(dir, "%05d.jpg"),
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-c:v", "libx264", "-crf", "15", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst,
  ]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`  ✓ ${slug}-${v.name} (${frames.length} fotogrammi catturati → ${total} a ${FPS} fps)`);
}

async function main() {
  const only = process.argv[2];
  mkdirSync(OUT, { recursive: true });
  mkdirSync(HERO, { recursive: true });
  const list = progetti.filter((p) => p.sitoUrl && (!only || p.slug === only));
  const browser = await chromium.launch();
  for (const p of list) {
    console.log(`> ${p.nome} (${p.sitoUrl})`);
    for (const v of VARIANTS) await record(browser, p.slug, p.sitoUrl!, v);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
