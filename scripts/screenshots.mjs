// Screenshot di tutte le pagine a 390x844 e 1440x900 in docs/screenshots/.
// Uso: avvia il sito (npm run build && npm start) e poi:  BASE=http://localhost:3000 npm run screenshots
//  - <pagina>-<device>.png       primo schermo, animazioni attive (intro saltata)
//  - <pagina>-<device>-full.png  pagina intera con reduced motion (layout statico, poster dei video)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = join(import.meta.dirname, "..", "docs", "screenshots");
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ["home", "/"],
  ["lavori", "/lavori"],
  ["progetto-nottea", "/lavori/nottea"],
  ["progetto-ordito", "/lavori/ordito"],
  ["servizi", "/servizi"],
  ["contatti", "/contatti"],
  ["privacy", "/privacy"],
  ["termini", "/termini"],
  ["404", "/pagina-che-non-esiste"],
];
const DEVICES = [
  ["mobile", { width: 390, height: 844 }, true],
  ["desktop", { width: 1440, height: 900 }, false],
];

const browser = await chromium.launch();
for (const [dname, viewport, mobile] of DEVICES) {
  for (const reduce of [false, true]) {
    const ctx = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      isMobile: mobile,
      hasTouch: mobile,
      reducedMotion: reduce ? "reduce" : "no-preference",
      colorScheme: "dark",
    });
    await ctx.addInitScript(() => sessionStorage.setItem("ls-intro", "1"));
    const page = await ctx.newPage();
    for (const [name, path] of PAGES) {
      const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(reduce ? 400 : 2200);
      const file = join(OUT, `${name}-${dname}${reduce ? "-full" : ""}.png`);
      await page.screenshot({ path: file, fullPage: reduce });
      console.log(`${res?.status()} ${file}`);
    }
    await ctx.close();
  }
}
await browser.close();
