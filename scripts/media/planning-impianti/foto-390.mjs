// Screenshot della pagina /impianti come su un telefono (390 px): primo schermo, pagina intera e sezioni.
// Uso: BASE=http://localhost:3410 node scripts/media/planning-impianti/foto-390.mjs  -> lavoro/390/
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE || "http://localhost:3410";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "lavoro", "390");
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "it-IT", reducedMotion: "reduce" });
const p = await ctx.newPage();
const errori = [];
p.on("console", (m) => m.type() === "error" && errori.push(m.text()));
p.on("pageerror", (e) => errori.push(String(e)));
await p.goto(BASE + "/impianti", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
await p.screenshot({ path: path.join(OUT, "01-primo-schermo.png") });
// scorre tutta la pagina per far comparire le animazioni, poi pagina intera
const h = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 400) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(150); }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
await p.screenshot({ path: path.join(OUT, "00-pagina-intera.png"), fullPage: true });
for (const [sel, nome] of [["#come", "02-come-funziona"], ["#risultati-title", "03-risultati"], ["#misura-title", "04-su-misura"], ["#domande", "05-domande"], ["#prova-title", "06-prova"]]) {
  await p.locator(sel).first().scrollIntoViewIfNeeded();
  await p.evaluate((s) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70); }, sel);
  await p.waitForTimeout(700);
  await p.screenshot({ path: path.join(OUT, `${nome}.png`) });
}
const info = await p.evaluate(() => ({
  larghezza: document.documentElement.scrollWidth,
  titolo: document.title,
  descrizione: document.querySelector('meta[name="description"]')?.content,
  whatsapp: [...document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]')].map((a) => decodeURIComponent(a.href)),
  video: (() => { const v = document.querySelector("video"); return v ? { src: v.currentSrc || v.querySelector("source")?.src, pronto: v.readyState } : null; })(),
}));
console.log(JSON.stringify({ ...info, errori }, null, 2));
await b.close();
