// Screenshot di ogni scena della pagina /reparto a 1440x900 e 390x844, in docs/screenshots/reparto/.
// Uso: avvia il sito e poi  BASE=http://localhost:3000 node scripts/reparto-screenshots.mjs
// Usa il Chrome installato (CHANNEL=chrome): non scarica nessun browser.
//  - <device>-0N-<scena>.png   le scene con il 3D
//  - <device>-statica.png      pagina intera con «riduci movimento»
//  - <device>-azienda.png      primo schermo con ?azienda=Meccanica%20Rossi
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = join(import.meta.dirname, "..", "docs", "screenshots", "reparto");
mkdirSync(OUT, { recursive: true });

const DEVICES = [
  ["desktop", { width: 1440, height: 900 }, false],
  ["mobile", { width: 390, height: 844 }, true],
];
/** [nome, palco, avanzamento 0..1, azione facoltativa] */
const SCENE = [
  ["01-primo-schermo", "a", 0.0],
  ["02-caos-in-ordine", "a", 0.235],
  ["02-ordine", "a", 0.3],
  ["03-commesse", "a", 0.46],
  ["03-macchina-aperta", "a", 0.46, "macchina"],
  ["04-camioncino-esce", "a", 0.62],
  ["04-terzista-in-ritardo", "a", 0.74],
  ["05-telefono", "a", 0.9],
  ["05-telefono-risposto", "a", 0.9, "gioco"],
  ["06-teca-si-apre", "b", 0.22],
  ["06-dall-alto", "b", 0.5],
  ["06-planning", "b", 0.79],
  ["06-chiusura", "b", 1],
];

const vai = (page, palco, p) =>
  page.evaluate(
    ([palco, p]) => {
      const el = document.querySelector(palco === "a" ? ".rv-a" : ".rv-b");
      window.scrollTo(0, el.offsetTop + p * (el.offsetHeight - innerHeight));
    },
    [palco, p],
  );

const browser = await chromium.launch({ channel: process.env.CHANNEL ?? "chrome", args: ["--use-angle=default", "--enable-gpu", "--ignore-gpu-blocklist"] });
const errori = [];
for (const [dname, viewport, mobile] of DEVICES) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, colorScheme: "dark" });
  await ctx.addInitScript(() => sessionStorage.setItem("ls-intro", "1"));
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errori.push(`${dname}: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errori.push(`${dname} console: ${m.text()}`));
  await page.goto(`${BASE}/reparto`, { waitUntil: "networkidle" });
  // prima del 3D: il poster
  await page.waitForSelector(".rv[data-pronto]", { timeout: 30000 });
  await page.waitForTimeout(1800);
  for (const [nome, palco, p, azione] of SCENE) {
    await vai(page, palco, p);
    await page.waitForTimeout(2600);
    if (azione === "macchina") {
      await page.locator(".rv-labels button.rv-lab").nth(2).click();
      await page.waitForTimeout(5200);
    }
    if (azione === "gioco") {
      await page.locator(".rv-rispondi").click();
      await page.waitForTimeout(1300);
      const cliente = (await page.locator(".rv-domanda .rv-gioco-t").textContent()).match(/Sono di (.+?)\./)[1];
      await page.locator(".rv-labels button.rv-lab", { hasText: cliente }).click();
      await page.waitForTimeout(900);
    }
    await page.screenshot({ path: join(OUT, `${dname}-${nome}.png`) });
    if (azione === "macchina") {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(600);
    }
    console.log("✓", dname, nome);
  }
  // «Provalo tu»
  await page.evaluate(() => document.querySelector("#provalo").scrollIntoView());
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, innerWidth < 900 ? 520 : 300));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(OUT, `${dname}-provalo.png`) });
  await ctx.close();

  // nome dell'azienda dal link
  const ctxA = await browser.newContext({ viewport, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, colorScheme: "dark" });
  const pa = await ctxA.newPage();
  await pa.goto(`${BASE}/reparto?azienda=Meccanica%20Rossi`, { waitUntil: "networkidle" });
  await pa.waitForSelector(".rv[data-pronto]", { timeout: 30000 });
  await pa.waitForTimeout(2500);
  await pa.screenshot({ path: join(OUT, `${dname}-azienda.png`) });
  const wa = await pa.locator(".rv-cta a").getAttribute("href");
  console.log("  WhatsApp:", decodeURIComponent(wa));
  await ctxA.close();

  // versione statica
  const ctxS = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, colorScheme: "dark", reducedMotion: "reduce" });
  const ps = await ctxS.newPage();
  ps.on("pageerror", (e) => errori.push(`${dname} statica: ${e.message}`));
  await ps.goto(`${BASE}/reparto`, { waitUntil: "networkidle" });
  await ps.waitForTimeout(1500);
  await ps.screenshot({ path: join(OUT, `${dname}-statica-primo-schermo.png`) });
  await ps.screenshot({ path: join(OUT, `${dname}-statica.png`), fullPage: true });
  console.log("✓", dname, "statica");
  await ctxS.close();
}
await browser.close();
if (errori.length) {
  console.log("\nErrori in pagina:\n" + [...new Set(errori)].join("\n"));
  process.exitCode = 1;
} else console.log("\nNessun errore in pagina.");
