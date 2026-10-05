/**
 * Registra uno scroll lento e fluido dei siti live dei progetti "Sito + Spot".
 *
 * Uso:
 *   npx tsx scripts/media/record-sites.ts            # tutti i progetti con URL
 *   npx tsx scripts/media/record-sites.ts nottea     # solo uno
 *   bash scripts/media/compress.sh siti              # poi comprimi
 *
 * Output (grezzi, non versionati): .cache/recordings/<slug>-mobile.mp4 e <slug>-desktop.mp4
 * Screenshot dell'hero: public/media/siti/<slug>-hero.jpg (usato anche per l'Open Graph)
 */
import { chromium, type Browser } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { progetti } from "../../src/data/progetti";

const ROOT = join(__dirname, "..", "..");
const RAW = join(ROOT, ".cache", "recordings-raw");
const OUT = join(ROOT, ".cache", "recordings");
const HERO = join(ROOT, "public", "media", "siti");

const SCROLL_MS = 13_000; // durata dello scroll (12-15 s)
const INTRO_WAIT_MS = 4_500; // attesa per l'intro del sito
const TAIL_MS = 600;

const VARIANTS = [
  { name: "mobile", viewport: { width: 390, height: 844 }, dpr: 2, isMobile: true },
  { name: "desktop", viewport: { width: 1440, height: 900 }, dpr: 1, isMobile: false },
] as const;

async function record(browser: Browser, slug: string, url: string, v: (typeof VARIANTS)[number]) {
  const dir = join(RAW, `${slug}-${v.name}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  // Playwright non ingrandisce i fotogrammi: il video ha la stessa misura del viewport
  const size = { ...v.viewport };
  const context = await browser.newContext({
    viewport: v.viewport,
    deviceScaleFactor: v.dpr,
    isMobile: v.isMobile,
    hasTouch: v.isMobile,
    reducedMotion: "no-preference",
    recordVideo: { dir, size },
  });
  const t0 = Date.now();
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 }).catch(() => {});
  await page.waitForTimeout(INTRO_WAIT_MS);

  if (v.name === "desktop") {
    await page.screenshot({ path: join(HERO, `${slug}-hero.jpg`), type: "jpeg", quality: 82 });
  }

  const start = (Date.now() - t0) / 1000;
  // Scroll con easing morbido: funziona anche con siti che usano Lenis
  // perché muove lo scroll nativo a ogni frame.
  // (passato come stringa: tsx inietta helper che nel browser non esistono)
  await page.evaluate(`new Promise((done) => {
    const ms = ${SCROLL_MS};
    const max = document.documentElement.scrollHeight - innerHeight;
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const s = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - s) / ms);
      window.scrollTo(0, max * (0.08 * p + 0.92 * ease(p)));
      if (p < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  })`);
  await page.waitForTimeout(TAIL_MS);
  await context.close();

  const webm = readdirSync(dir).find((f) => f.endsWith(".webm"));
  if (!webm) throw new Error(`Nessun video per ${slug}-${v.name}`);
  const src = join(dir, webm);
  const dst = join(OUT, `${slug}-${v.name}.mp4`);
  // Taglia l'attesa iniziale e converte in mp4 di alta qualità (la compressione finale la fa compress.sh)
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-ss", start.toFixed(2), "-i", src,
    "-t", ((SCROLL_MS + TAIL_MS) / 1000).toFixed(2),
    "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-an", dst,
  ]);
  renameSync(src, join(dir, "raw.webm"));
  console.log(`  ✓ ${slug}-${v.name}`);
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
