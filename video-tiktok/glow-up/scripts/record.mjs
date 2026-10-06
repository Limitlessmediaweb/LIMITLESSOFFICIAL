/**
 * Registra le clip grezze del video "glow up" (vecchio sito → nuovo sito → lavori → prezzi).
 *
 * Uso:  node video-tiktok/glow-up/scripts/record.mjs            # tutte le clip
 *       node video-tiktok/glow-up/scripts/record.mjs nottea      # solo una
 *
 * Stesso metodo di scripts/media/record-sites.ts:
 *  - niente recordVideo: CDP Page.startScreencast (jpeg 100) con timestamp, poi 30 fps costanti
 *    (per ogni istante l'ultimo fotogramma arrivato) e ffmpeg;
 *  - scroll guidato in pagina a ~60 Hz con piccoli eventi di rotellina (Lenis) o passi nativi;
 *  - visita di riscaldamento (cache, font, immagini lazy) prima della registrazione.
 * Usa Google Chrome (channel "chrome") perché Chromium non riproduce i video H.264, in modalità
 * con finestra: in headless i fotogrammi escono a 540x960 invece di 1080x1920.
 *
 * URL locali: nuovo sito  → http://localhost:3200 (limitless-v3, npm run build && next start -p 3200)
 *             vecchio sito → http://localhost:3100 (cartella LIMITLESS-SITE = ramo sito-precedente)
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const OUT = join(ROOT, "clips");
const FRAMES = join(ROOT, "frames");
const FPS = 30;
const NEW = process.env.NEW_URL ?? "http://localhost:3200";
const OLD = process.env.OLD_URL ?? "http://localhost:3100";

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";
const MOBILE = { w: 540, h: 960, dpr: 2, mobile: true };
// il nuovo sito si registra nel suo tema predefinito (scuro); Chrome headless altrimenti segue il chiaro
const DESKTOP = { w: 1440, h: 900, dpr: 1, mobile: false };
const SKIP_INTRO = "try{sessionStorage.setItem('ls-intro','1')}catch(e){}";

/** hold = ms fermi prima dello scroll, scroll = px, scrollMs = durata, tail = ms fermi alla fine */
const CLIPS = [
  { name: "old-mobile", url: OLD, ...MOBILE, hold: 300, scroll: 520, scrollMs: 3200, tail: 300 },
  // il nuovo sito si ricarica con l'intro (sessionStorage vuoto) e si registra dal primo frame
  { name: "new-intro", url: NEW, ...MOBILE, scheme: "dark", replay: true, hold: 7500, scroll: 0, scrollMs: 0, tail: 0 },
  { name: "new-servizi-mobile", url: NEW, ...MOBILE, scheme: "dark", init: SKIP_INTRO, startAt: "#servizi-title", startOffset: -200, hold: 400, scroll: 1500, scrollMs: 4200, tail: 300 },
  { name: "new-servizi-desktop", url: NEW, ...DESKTOP, scheme: "dark", init: SKIP_INTRO, startAt: "#servizi-title", startOffset: -140, hold: 400, scroll: 700, scrollMs: 4200, tail: 300 },
  { name: "nottea", url: "https://nottea.vercel.app/", ...MOBILE, replay: true, hold: 7000, scroll: 900, scrollMs: 3000, tail: 300 },
  { name: "ordito", url: "https://ordito-flame.vercel.app/", ...MOBILE, replay: true, hold: 7000, scroll: 900, scrollMs: 3000, tail: 300 },
  { name: "osteria", url: "https://osteria-del-borgo-virid.vercel.app/", ...MOBILE, replay: true, hold: 7000, scroll: 900, scrollMs: 3000, tail: 300 },
  { name: "volta", url: "https://volta-puce.vercel.app/", ...MOBILE, replay: true, hold: 7000, scroll: 900, scrollMs: 3000, tail: 300 },
  { name: "flusso", url: "https://flusso-six.vercel.app/", ...MOBILE, replay: true, hold: 7000, scroll: 900, scrollMs: 3000, tail: 300 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitReady(page, extra = 1500) {
  await page.waitForLoadState("networkidle", { timeout: 45_000 }).catch(() => {});
  await page.evaluate("document.fonts && document.fonts.ready");
  await page
    .waitForFunction(
      `[...document.images].filter(i => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }).every(i => i.complete)`,
      undefined,
      { timeout: 15_000 },
    )
    .catch(() => {});
  await sleep(extra);
}

const hasLenis = (page) => page.evaluate("document.documentElement.classList.contains('lenis')");
async function wheelTo(page, y) {
  if (await hasLenis(page)) await page.evaluate(`window.dispatchEvent(new WheelEvent('wheel', { deltaY: ${y} - scrollY, bubbles: true, cancelable: true }))`);
  else await page.evaluate(`window.scrollTo(0, ${y})`);
}

async function warm(page, c) {
  // scorre fino in fondo a passi (immagini lazy, video) e torna su
  for (let i = 0; i < 30; i++) {
    const [y, max] = await page.evaluate("[scrollY, document.documentElement.scrollHeight - innerHeight]");
    if (y >= max - 2) break;
    await wheelTo(page, y + c.h * 0.9);
    await sleep(180);
  }
  await page.waitForFunction(`[...document.images].every(i => i.complete)`, undefined, { timeout: 15_000 }).catch(() => {});
  await page.evaluate(`window.dispatchEvent(new WheelEvent('wheel', { deltaY: -scrollY - 2000, bubbles: true })); window.scrollTo(0, 0)`);
  await sleep(2500);
  await page.evaluate("window.scrollTo(0, 0)");
}

async function record(browser, c) {
  const context = await browser.newContext({
    viewport: { width: c.w, height: c.h },
    deviceScaleFactor: c.dpr,
    isMobile: c.mobile,
    hasTouch: c.mobile,
    userAgent: c.mobile ? IPHONE_UA : undefined,
    reducedMotion: "no-preference",
    colorScheme: c.scheme ?? "no-preference",
    locale: "it-IT",
  });
  if (c.init) await context.addInitScript(c.init);
  await context.addInitScript(() => {
    const s = document.createElement("style");
    s.textContent = "html::-webkit-scrollbar,body::-webkit-scrollbar{display:none!important}html,body{scrollbar-width:none!important}";
    document.addEventListener("DOMContentLoaded", () => document.head.appendChild(s));
  });
  const page = await context.newPage();
  await page.goto(c.url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await waitReady(page, 5000); // anche intro dei siti
  await page.mouse.move(c.w / 2, c.h / 2);
  await warm(page, c);
  // banner cookie / avvisi: si chiudono (solo cookie tecnici, nessun consenso extra)
  for (const label of [/^Ho capito$/i, /^Rifiuta/i, /^Solo necessari/i, /^Chiudi$/i]) {
    const b = page.getByRole("button", { name: label }).first();
    if (await b.isVisible().catch(() => false)) await b.click().catch(() => {});
  }
  await sleep(1000);

  if (c.startAt) {
    const y = await page.evaluate(`document.querySelector(${JSON.stringify(c.startAt)}).getBoundingClientRect().top + scrollY + ${c.startOffset ?? 0}`);
    await wheelTo(page, Math.max(0, y));
    await sleep(2500);
    await page.waitForFunction(`[...document.images].every(i => i.complete)`, undefined, { timeout: 15_000 }).catch(() => {});
    await sleep(800);
  }

  const frames = [];
  const cdp = await context.newCDPSession(page);
  cdp.on("Page.screencastFrame", async (f) => {
    frames.push({ t: (f.metadata.timestamp ?? Date.now() / 1000) * 1000, data: Buffer.from(f.data, "base64") });
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  const startCast = () =>
    cdp.send("Page.startScreencast", { format: "jpeg", quality: 100, maxWidth: c.w * c.dpr, maxHeight: c.h * c.dpr, everyNthFrame: 1 });

  let t0;
  if (c.replay) {
    // seconda visita: tutto in cache, intro di nuovo attiva; registra dal caricamento
    await page.evaluate("try{sessionStorage.clear()}catch(e){}");
    await startCast();
    t0 = Date.now();
    await page.reload({ waitUntil: "commit" });
  } else {
    await startCast();
    t0 = Date.now();
  }
  await sleep(c.hold);
  if (c.scroll) {
    const lenis = await hasLenis(page);
    await page.evaluate(`new Promise((done) => {
      const dist = ${c.scroll}, ms = ${c.scrollMs}, lenis = ${lenis};
      const base = scrollY; let sent = 0; const t0 = performance.now();
      const ease = (p) => p < 0.5 ? 4*p*p*p : 1 - Math.pow(-2*p + 2, 3) / 2;
      const guard = setTimeout(() => { clearInterval(timer); done(); }, ms + 3000);
      const timer = setInterval(() => {
        const p = Math.min(1, (performance.now() - t0) / ms);
        const target = Math.round(ease(p) * dist);
        const d = target - sent;
        if (d) { if (lenis) window.dispatchEvent(new WheelEvent('wheel', { deltaY: d, bubbles: true, cancelable: true })); else window.scrollTo(0, base + target); sent = target; }
        if (p >= 1) { clearInterval(timer); clearTimeout(guard); done(); }
      }, 16);
    })`);
  }
  await sleep(c.tail + (c.scroll ? 600 : 0));
  await cdp.send("Page.stopScreencast");
  const durationMs = Date.now() - t0;
  await context.close();

  const dir = join(FRAMES, c.name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  frames.sort((a, b) => a.t - b.t);
  const total = Math.floor((durationMs / 1000) * FPS);
  let k = 0;
  // prima del primo fotogramma ricevuto si ripete il primo (in montaggio si taglia)
  for (let i = 0; i < total; i++) {
    const t = t0 + (i * 1000) / FPS;
    while (k + 1 < frames.length && frames[k + 1].t <= t) k++;
    writeFileSync(join(dir, `${String(i).padStart(5, "0")}.jpg`), frames[k].data);
  }
  const dst = join(OUT, `${c.name}.mp4`);
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-framerate", String(FPS), "-i", join(dir, "%05d.jpg"),
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-c:v", "libx264", "-crf", "12", "-preset", "medium", "-pix_fmt", "yuv420p", dst,
  ]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`✓ ${c.name}: ${frames.length} fotogrammi catturati → ${total} a ${FPS} fps (${(durationMs / 1000).toFixed(1)} s)`);
}

const only = process.argv[2];
mkdirSync(OUT, { recursive: true });
// headed: in headless lo screencast (e lo screenshot) ignora il DPR 2 e restituisce 540x960
const browser = await chromium.launch({
  channel: "chrome",
  headless: false,
  args: ["--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling"],
});
for (const c of CLIPS.filter((c) => !only || c.name === only)) {
  try {
    await record(browser, c);
  } catch (e) {
    console.error(`✗ ${c.name}:`, e.message);
  }
}
await browser.close();
