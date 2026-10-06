/**
 * Disegna in HTML i livelli di testo (PNG trasparenti) per ogni formato.
 * Grottesco bold (Archivo Condensed) + una parola chiave in serif corsivo (Instrument Serif).
 * Uso: node scripts/overlays.mjs   -> overlays/<formato>/<id>.png
 * Safe zone: TikTok/Reels 9:16 (alto 150, basso 380, destra 140), Stories 14% alto/basso,
 * 4:5 niente testo nel 20% inferiore, 16:9 margini 6%.
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FONTS = join(ROOT, "..", "..", "src", "assets", "fonts");
const b64 = (p) => readFileSync(p).toString("base64");
const CSS = `
@font-face { font-family: Display; src: url(data:font/ttf;base64,${b64(join(FONTS, "ArchivoCondensed-ExtraBold.ttf"))}); }
@font-face { font-family: Body; src: url(data:font/ttf;base64,${b64(join(FONTS, "Archivo-Medium.ttf"))}); }
@font-face { font-family: Serif; font-style: italic; src: url(data:font/ttf;base64,${b64(join(ROOT, "3d", "assets", "InstrumentSerif-Italic.ttf"))}); }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { background: transparent; overflow: hidden; }
body { position: relative; color: #f4efe6; -webkit-font-smoothing: antialiased; }
.a { position: absolute; }
.d { font-family: Display; line-height: .95; letter-spacing: -0.005em; text-transform: none; }
.s { font-family: Serif; font-style: italic; font-weight: 400; letter-spacing: 0; }
.b { font-family: Body; }
.sh { text-shadow: 0 2px 30px rgba(0,0,0,.6), 0 1px 4px rgba(0,0,0,.55); }
.cu { color: #e9a27a; }
.lime { color: #e8ff3a; }
`;

// Marchio LIMITLESS: angoli + punto lime (dal logo del sito) + scritta
const mark = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64" style="display:block"><path d="M14 30V12h16M50 34v18H34" fill="none" stroke="#f2f0ea" stroke-width="5" stroke-linecap="square"/><circle cx="44" cy="20" r="6" fill="#e8ff3a"/></svg>`;
const logo = (size) => `<div style="display:flex;align-items:center;gap:${size * 0.28}px">${mark(size)}<span class="d" style="font-size:${size * 0.62}px;letter-spacing:.06em">LIMITLESS</span></div>`;

// Geometria per formato: area di testo utile
const FORMATS = {
  social: { w: 1080, h: 1920, x: 72, right: 140, top: 150, bottom: 380 },
  ads916: { w: 1080, h: 1920, x: 72, right: 140, top: 269, bottom: 269 },
  ads45: { w: 1080, h: 1350, x: 64, right: 64, top: 64, bottom: 270 },
  yt169: { w: 1920, h: 1080, x: 116, right: 116, top: 65, bottom: 80 },
};

// Testi: (f) => html. f = formato con w/h/margini
const feat = (key, rest) => (f) => {
  const big = f.w > f.h ? 150 : 168, small = f.w > f.h ? 64 : 72;
  const y = f.w > f.h ? f.h - f.bottom - 280 : f.h - f.bottom - 330;
  return `<div class="a sh" style="left:${f.x}px; top:${y}px; width:${f.w - f.x - f.right}px">
    <div class="s" style="font-size:${big}px; line-height:.9">${key}</div>
    <div class="d" style="font-size:${small}px; margin-top:14px">${rest}</div></div>`;
};

const TEXTS = {
  wm: (f) => `<div class="a b" style="right:${f.right + 4}px; top:${f.top + 20}px; font-size:${f.w > f.h ? 26 : 28}px; letter-spacing:.24em; color:rgba(255,255,255,.6)">LIMITLESS</div>`,
  head: (f) => `<div class="a sh d" style="left:${f.x}px; top:${Math.round(f.h * 0.25)}px; width:${f.w - f.x - f.right}px; font-size:84px">
     Come farei io lo spot di uno smartphone da <span class="s cu" style="font-size:98px">1.500 €</span></div>`,
  f1: feat("Notte.", "Vede anche al buio."),
  f2: feat("Titanio.", "Leggero come l'aria."),
  f3: feat("Giorni.", "Non solo ore."),
  pack: (f) => {
    const land = f.w > f.h;
    const top = land ? 150 : f.top + (f.h > 1500 ? 260 : 60);
    return `<div class="a sh" style="left:0; width:${f.w}px; top:${top}px; text-align:center">
      <div class="d" style="font-size:${land ? 140 : 150}px; letter-spacing:.04em">ÈTERE <span class="s cu" style="font-size:${land ? 160 : 172}px; letter-spacing:0">One</span></div></div>`;
  },
  cta: (f) => `<div class="a" style="inset:0; background:linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.7) 45%, rgba(0,0,0,.82))"></div>
    <div class="a sh" style="left:${f.x}px; top:${Math.round(f.h * 0.3)}px; width:${f.w - f.x - f.right}px">
      <div class="d" style="font-size:86px">Vuoi uno spot così per il tuo <span class="s cu" style="font-size:100px">prodotto?</span></div>
      <div class="d" style="font-size:118px; margin-top:60px">Commenta <span class="lime">SPOT</span></div>
      <div style="margin-top:90px">${logo(78)}</div></div>`,
  concept: (f) => {
    const y = f.h - f.bottom - (f.w > f.h ? 10 : 40);
    return `<div class="a b" style="left:0; width:${f.w}px; top:${y - 34}px; text-align:center; font-size:${f.w > f.h ? 26 : 28}px; color:rgba(244,239,230,.78)">Concept LIMITLESS – ÈTERE è un brand inventato</div>`;
  },
  nonexist: (f) => {
    // in alto, dove stava "ÈTERE One": il telefono resta libero sotto
    const land = f.w > f.h;
    const top = land ? 130 : f.top + (f.h > 1500 ? 240 : 50);
    return `<div class="a sh" style="left:0; width:${f.w}px; top:${top}px; text-align:center">
      <div class="d" style="font-size:${land ? 92 : 96}px">Questo telefono</div>
      <div class="s cu" style="font-size:${land ? 116 : 124}px; line-height:1">non esiste.</div>
      <div class="b" style="font-size:${land ? 36 : 40}px; margin-top:14px; color:rgba(244,239,230,.85)">L'abbiamo creato noi, in 3D.</div></div>`;
  },
  endcard: (f) => {
    const land = f.w > f.h;
    const cw = f.w - f.x - f.right;
    const top = land ? 170 : f.top + (f.h > 1500 ? 140 : 40);
    return `<div class="a" style="inset:0; background:radial-gradient(120% 90% at 50% 40%, rgba(12,10,9,.86), rgba(0,0,0,.95))"></div>
    <div class="a" style="left:${f.x}px; top:${top}px; width:${cw}px">
      ${logo(land ? 64 : 72)}
      <div class="d" style="font-size:${land ? 120 : 128}px; margin-top:${land ? 60 : 90}px">Spot per il tuo <span class="s cu" style="font-size:${land ? 136 : 146}px">prodotto</span></div>
      <div class="d" style="font-size:${land ? 92 : 100}px; margin-top:28px">da <span class="lime">99 €</span></div>
      <div class="b" style="font-size:${land ? 42 : 46}px; margin-top:34px; color:rgba(244,239,230,.85)">limitlessmedia.it</div>
      <div style="margin-top:${land ? 50 : 70}px; display:inline-flex; align-items:center; gap:18px; background:#e8ff3a; color:#0a0a0a; border-radius:999px; padding:${land ? "22px 52px" : "26px 60px"}">
        <span class="d" style="font-size:${land ? 54 : 60}px; letter-spacing:.02em">Scrivici</span>
        <svg width="${land ? 40 : 44}" height="${land ? 40 : 44}" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="#0a0a0a" stroke-width="2.6" stroke-linecap="square"/></svg>
      </div></div>`;
  },
  bumper: (f) => `<div class="a" style="inset:0; background:rgba(0,0,0,.55)"></div>
    <div class="a" style="left:0; width:${f.w}px; top:${Math.round(f.h * 0.36)}px; display:flex; flex-direction:column; align-items:center">
      ${logo(96)}
      <div class="d" style="font-size:120px; margin-top:70px">Spot che <span class="s cu" style="font-size:138px">vendono</span></div></div>`,
};

const PLAN = {
  social: ["wm", "head", "f1", "f2", "f3", "pack", "cta", "concept"],
  ads916: ["wm", "f1", "f2", "f3", "pack", "nonexist", "endcard", "concept", "bumper"],
  ads45: ["wm", "f1", "f2", "f3", "pack", "nonexist", "endcard", "concept"],
  yt169: ["wm", "f1", "f2", "f3", "pack", "endcard", "concept"],
};

const browser = await chromium.launch();
for (const [fmt, ids] of Object.entries(PLAN)) {
  const f = FORMATS[fmt];
  const page = await browser.newPage({ viewport: { width: f.w, height: f.h } });
  const out = join(ROOT, "overlays", fmt);
  mkdirSync(out, { recursive: true });
  for (const id of ids) {
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS} html,body{width:${f.w}px;height:${f.h}px}</style></head><body>${TEXTS[id](f)}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(out, `${id}.png`), omitBackground: true });
  }
  await page.close();
  console.log(fmt, ids.length, "livelli");
}
await browser.close();
