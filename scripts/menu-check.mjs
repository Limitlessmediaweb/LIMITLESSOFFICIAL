// Controllo veloce del menu: larghezze desktop e menu mobile aperto.
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3111";
const out = process.argv[3] ?? ".";
const b = await chromium.launch({ channel: "chrome" });
for (const [w, h] of [[1024, 700], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(`${base}/reparto`, { waitUntil: "load" });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Principale"]');
    const links = [...nav.querySelectorAll("a")].map((a) => ({ t: a.textContent, cur: a.getAttribute("aria-current"), h: Math.round(a.getBoundingClientRect().height) }));
    return { title: document.title, len: document.title.length, links, overflow: document.documentElement.scrollWidth > innerWidth };
  });
  console.log(w, JSON.stringify(r));
  await p.screenshot({ path: `${out}/menu-${w}.png`, clip: { x: 0, y: 0, width: w, height: 90 } });
  await p.close();
}
const m = await b.newPage({ viewport: { width: 390, height: 667 }, isMobile: true, hasTouch: true });
await m.goto(`${base}/`, { waitUntil: "load" });
await m.waitForTimeout(1500);
await m.click('button[aria-controls="menu-mobile"]');
await m.waitForTimeout(400);
await m.screenshot({ path: `${out}/menu-mobile.png` });
await b.close();
