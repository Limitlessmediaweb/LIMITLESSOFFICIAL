// Analisi su telefono della pagina /reparto: le scene alle altezze VERE di Safari su iPhone
// (con le barre del browser lo schermo utile è più basso di 844 px).
// Uso: node scripts/reparto-telefono.mjs <base> <cartella-uscita>
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.argv[2] ?? "https://www.limitlessmedia.it";
const OUT = process.argv[3] ?? ".";
mkdirSync(OUT, { recursive: true });

const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const DEVICES = [
  ["iphone-barre", { width: 390, height: 664 }], // iPhone 12-15 con le barre di Safari
  ["iphone-se", { width: 375, height: 553 }], // iPhone SE con le barre
  ["iphone-max", { width: 430, height: 739 }], // Pro Max con le barre
];
const SCENE = [
  ["01", "a", 0.0],
  ["01b", "a", 0.08],
  ["02a", "a", 0.2],
  ["02b", "a", 0.3],
  ["03", "a", 0.46],
  ["03m", "a", 0.46, "macchina"],
  ["04a", "a", 0.62],
  ["04b", "a", 0.74],
  ["05", "a", 0.9],
  ["05g", "a", 0.9, "gioco"],
  ["06a", "b", 0.22],
  ["06b", "b", 0.5],
  ["06c", "b", 0.79],
  ["06d", "b", 1],
];
const vai = (page, palco, p) =>
  page.evaluate(([palco, p]) => {
    const el = document.querySelector(palco === "a" ? ".rv-a" : ".rv-b");
    window.scrollTo(0, el.offsetTop + p * (el.offsetHeight - innerHeight));
  }, [palco, p]);

const browser = await chromium.launch({ channel: "chrome", args: ["--use-angle=default", "--enable-gpu", "--ignore-gpu-blocklist"] });
const errori = [];
for (const [dname, viewport] of DEVICES) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: "dark", userAgent: UA });
  await ctx.addInitScript(() => sessionStorage.setItem("ls-intro", "1"));
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errori.push(`${dname}: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errori.push(`${dname} console: ${m.text()}`));
  await page.goto(`${BASE}/reparto`, { waitUntil: "networkidle" });
  await page.waitForSelector(".rv[data-pronto]", { timeout: 30000 }).catch(() => errori.push(`${dname}: 3D non pronto`));
  await page.waitForTimeout(1800);
  for (const [nome, palco, p, azione] of SCENE) {
    await vai(page, palco, p);
    await page.waitForTimeout(2600);
    try {
      if (azione === "macchina") {
        await page.locator(".rv-labels button.rv-lab").nth(2).click({ timeout: 4000 });
        await page.waitForTimeout(5200);
      }
      if (azione === "gioco") {
        await page.locator(".rv-rispondi").click({ timeout: 4000 });
        await page.waitForTimeout(1300);
        const cliente = (await page.locator(".rv-domanda .rv-gioco-t").textContent()).match(/Sono di (.+?)\./)[1];
        await page.locator(".rv-labels button.rv-lab", { hasText: cliente }).click({ timeout: 4000 });
        await page.waitForTimeout(900);
      }
    } catch (e) {
      errori.push(`${dname} ${nome}: azione non riuscita (${e.message.split("\n")[0]})`);
    }
    await page.screenshot({ path: join(OUT, `${dname}-${nome}.png`) });
    if (azione === "macchina") {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(600);
    }
    // cose misurabili: scorrimento orizzontale, testi fuori schermo, bersagli piccoli
    const m = await page.evaluate(() => {
      const fuori = [];
      for (const el of document.querySelectorAll(".rv-copy, .rv-lab, .rv-pannello, .rv-avviso, .rv-gioco, .rv-cta, .rv-hero h1, .rv-lead")) {
        const s = getComputedStyle(el);
        if (s.visibility === "hidden" || s.display === "none" || +s.opacity < 0.5) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.bottom < 0 || r.top > innerHeight) continue;
        if (r.left < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.top < -1)
          fuori.push(`${el.className.toString().slice(0, 40)} [${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}]`);
      }
      return { ox: document.documentElement.scrollWidth - innerWidth, fuori };
    });
    console.log(dname, nome, JSON.stringify(m));
  }
  await page.evaluate(() => document.querySelector("#provalo").scrollIntoView());
  await page.waitForTimeout(2500);
  await page.screenshot({ path: join(OUT, `${dname}-provalo-1.png`) });
  await page.evaluate(() => window.scrollBy(0, innerHeight * 0.9));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: join(OUT, `${dname}-provalo-2.png`) });
  await page.evaluate(() => window.scrollBy(0, innerHeight * 0.9));
  await page.waitForTimeout(1800);
  await page.screenshot({ path: join(OUT, `${dname}-provalo-3.png`) });
  await ctx.close();
}
await browser.close();
console.log(errori.length ? "\nErrori:\n" + [...new Set(errori)].join("\n") : "\nNessun errore in pagina.");
