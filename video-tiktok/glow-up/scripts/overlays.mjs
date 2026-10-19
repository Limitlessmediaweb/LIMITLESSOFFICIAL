/**
 * Disegna in HTML (font del sito) i livelli grafici del video, tutti 1080x1920:
 *  - overlays/*.png  livelli trasparenti (testi, watermark, cornici dei dispositivi) e sfondi opachi
 *  - frames/finale/  i 75 fotogrammi del finale (animazione calcolata fotogramma per fotogramma)
 * Uso: node video-tiktok/glow-up/scripts/overlays.mjs
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { L } from "./layout.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const OUT = join(ROOT, "overlays");
const FONTS = join(ROOT, "..", "..", "src", "assets", "fonts");
// incorporati in base64: una pagina about:blank non può leggere file locali
const font = (f) => `data:font/ttf;base64,${readFileSync(join(FONTS, f)).toString("base64")}`;

const C = { bg: "#0a0a0a", fg: "#f2f0ea", muted: "#a39f95", accent: "#e8ff3a" };

const BASE = `
@font-face { font-family: Display; src: url(${font("ArchivoCondensed-ExtraBold.ttf")}); }
@font-face { font-family: Body; src: url(${font("Archivo-Medium.ttf")}); }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1920px; background: transparent; overflow: hidden; }
body { position: relative; color: ${C.fg}; -webkit-font-smoothing: antialiased; }
.abs { position: absolute; }
.display { font-family: Display; line-height: .94; letter-spacing: -0.01em; }
.body { font-family: Body; }
.acc { color: ${C.accent}; }
.shadow { text-shadow: 0 2px 24px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.5); }
`;

// Testi grandi: a sinistra, dentro la safe zone (x 64..940, da y 190)
const big = (html, size = 132) =>
  `<div class="abs display shadow" style="left:64px; top:${L.textTop}px; width:876px; font-size:${size}px">${html}</div>`;

/** Sfondo del brand: nero, alone lime morbido in alto (come l'hero del sito), vignetta. */
const bg = (extra = "") => `
<div class="abs" style="inset:0; background:${C.bg}"></div>
<div class="abs" style="left:50%; top:-260px; width:1100px; height:1100px; transform:translateX(-50%); border-radius:50%; background:radial-gradient(closest-side, rgba(232,255,58,.13), rgba(232,255,58,0))"></div>
<div class="abs" style="inset:0; background:radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,.6))"></div>
${extra}`;

/** Ombra sotto un dispositivo (va nello sfondo). */
const shadow = (r, radius) =>
  `<div class="abs" style="left:${r.x}px; top:${r.y + 24}px; width:${r.w}px; height:${r.h}px; border-radius:${radius}px; box-shadow:0 40px 90px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.02)"></div>`;

/** Cornice del telefono: bordo pieno, schermo trasparente (il video sta sotto). */
const phone = (r, b, radius) => `
<div class="abs" style="left:${r.x}px; top:${r.y}px; width:${r.w}px; height:${r.h}px; border-radius:${radius}px; border:${b}px solid #121212;
  box-shadow: inset 0 0 0 1.5px #2c2c2a, 0 0 0 1.5px #3a3a37"></div>
<div class="abs" style="left:${r.x + b}px; top:${r.y + b}px; width:${r.w - 2 * b}px; height:${r.h - 2 * b}px; border-radius:${radius - b}px; box-shadow:0 0 0 1px rgba(255,255,255,.06)"></div>`;

/** Laptop: cornice dello schermo + base. */
const laptop = (r, b) => `
<div class="abs" style="left:${r.x}px; top:${r.y}px; width:${r.w}px; height:${r.h}px; border-radius:22px 22px 6px 6px; border:${b}px solid #121212; box-shadow: inset 0 0 0 1.5px #2c2c2a, 0 0 0 1.5px #3a3a37"></div>
<div class="abs" style="left:${r.x - 46}px; top:${r.y + r.h}px; width:${r.w + 92}px; height:24px; border-radius:2px 2px 18px 18px; background:linear-gradient(#3a3a37, #1a1a19 60%, #0e0e0e)"></div>
<div class="abs" style="left:${r.x + r.w / 2 - 80}px; top:${r.y + r.h}px; width:160px; height:9px; border-radius:0 0 10px 10px; background:#0c0c0c"></div>`;

const scrimTop = `<div class="abs" style="left:0; top:0; width:1080px; height:760px; background:linear-gradient(rgba(0,0,0,.78) 0%, rgba(0,0,0,.55) 45%, rgba(0,0,0,0) 100%)"></div>`;

const label = (name, sector, y) => `
<div class="abs shadow" style="left:0; width:${L.safeRight}px; top:${y}px; text-align:center; white-space:nowrap">
  <span class="display" style="font-size:58px; letter-spacing:.02em">${name}</span>
  <span class="body" style="font-size:40px; color:${C.muted}; margin-left:10px">· ${sector}</span>
</div>`;

const LAYERS = {
  wm: `<div class="abs display" style="right:${1080 - L.safeRight}px; top:${L.safeTop + 16}px; font-size:34px; letter-spacing:.14em; color:rgba(255,255,255,.6)">LIMITLESS</div>`,
  "scrim-top": scrimTop,
  "t-hook": big("Il nostro<br>vecchio sito…"),
  "t-new": big(`…e quello <span class="acc">nuovo.</span>`, 104), // una riga: sta sopra la cornice dell'intro
  "t-lavori": big(`Lo facciamo anche<br>per la <span class="acc">tua attività.</span>`, 92),
  "t-prezzi": big(`Siti da <span class="acc">500 €</span><br>Spot da <span class="acc">99 €</span>`, 118),
  "bg-lavori": bg(shadow(L.phone, 70)),
  "fg-lavori": phone(L.phone, L.phoneB, 70),
  "bg-grid": bg(L.grid.map((r) => shadow(r, 44)).join("")),
  "fg-grid": L.grid.map((r) => phone(r, L.gridB, 44)).join(""),
  "bg-split": bg(shadow(L.laptop, 22) + shadow(L.small, 52)),
  "fg-split-laptop": laptop(L.laptop, L.laptopB),
  "fg-split-phone": phone(L.small, L.smallB, 52),
  "bg-plain": bg(),
};
for (const s of L.sites) LAYERS[`lab-${s.id}`] = label(s.name, s.sector, L.labelY);

// Copertina: testo sopra il fotogramma scelto (il fotogramma si aggiunge con ffmpeg)
LAYERS["cover-text"] = `${scrimTop}
<div class="abs display shadow" style="left:64px; top:${L.textTop + 10}px; width:876px; font-size:168px; line-height:.9">Prima<br>→ <span class="acc">Dopo</span></div>
<div class="abs body shadow" style="left:66px; top:${L.textTop + 340}px; font-size:40px; color:${C.fg}">Abbiamo rifatto il nostro sito da zero</div>`;

/** Finale: wordmark che sale lettera per lettera, poi consulenza e link. t in secondi. */
const FINALE = `${bg()}
<div class="abs" style="left:0; width:${L.safeRight + 0}px; top:700px; text-align:center">
  <div id="word" class="display" style="font-size:178px; letter-spacing:.02em; line-height:1; display:inline-block; white-space:nowrap; overflow:hidden; padding:0 4px">
    ${"LIMITLESS".split("").map((c) => `<span style="display:inline-block">${c}</span>`).join("")}
  </div>
  <div id="line" style="height:4px; width:0; background:${C.accent}; margin:26px auto 0"></div>
  <div id="pill" class="body" style="display:inline-block; margin-top:54px; padding:22px 42px; background:${C.accent}; color:#0a0a0a; font-size:54px; letter-spacing:.005em">Consulenza gratuita</div>
  <div id="url" class="body" style="margin-top:40px; font-size:50px; color:${C.fg}">limitlessmedia.it <span style="color:${C.muted}">·</span> scrivici in DM</div>
</div>
<script>
  const expoOut = (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
  const p3Out = (p) => 1 - Math.pow(1 - p, 3);
  const prog = (t, start, dur) => Math.min(1, Math.max(0, (t - start) / dur));
  window.setT = (t) => {
    [...document.querySelectorAll('#word span')].forEach((s, i) => {
      const p = expoOut(prog(t, 0.08 + i * 0.03, 0.6));
      s.style.transform = 'translateY(' + (1 - p) * 110 + '%)';
    });
    document.getElementById('line').style.width = 560 * p3Out(prog(t, 0.45, 0.6)) + 'px';
    for (const [id, start] of [['pill', 0.8], ['url', 1.1]]) {
      const p = p3Out(prog(t, start, 0.5));
      const el = document.getElementById(id);
      el.style.opacity = p; el.style.transform = 'translateY(' + (1 - p) * 24 + 'px)';
    }
  };
</script>`;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const html = (body) => `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}</style></head><body>${body}</body></html>`;
for (const [name, body] of Object.entries(LAYERS)) {
  await page.setContent(html(body));
  await page.evaluate("document.fonts.ready");
  await page.screenshot({ path: join(OUT, `${name}.png`), omitBackground: true });
}
const fin = join(ROOT, "frames", "finale");
rmSync(fin, { recursive: true, force: true });
mkdirSync(fin, { recursive: true });
await page.setContent(html(FINALE));
await page.evaluate("document.fonts.ready");
for (let i = 0; i < L.finaleFrames; i++) {
  await page.evaluate(`setT(${i / 30})`);
  await page.screenshot({ path: join(fin, `${String(i).padStart(5, "0")}.png`) });
}
await browser.close();
console.log(`✓ ${Object.keys(LAYERS).length} livelli, ${L.finaleFrames} fotogrammi del finale`);
