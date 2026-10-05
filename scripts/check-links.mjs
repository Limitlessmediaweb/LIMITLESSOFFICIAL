// Controlla tutti i link del sito: pagine interne (status 200), ancore, link esterni,
// e che non ci siano example.com / localhost. Uso: avvia il sito, poi BASE=http://localhost:3000 node scripts/check-links.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PAGES = ["/", "/lavori", "/servizi", "/contatti", "/privacy", "/termini", "/lavori/nottea", "/lavori/ordito", "/lavori/osteria-del-borgo", "/lavori/volta", "/lavori/flusso"];

const b = await chromium.launch();
const ctx = await b.newContext({ reducedMotion: "reduce" });
await ctx.addInitScript(() => sessionStorage.setItem("ls-intro", "1"));
const page = await ctx.newPage();
const links = new Map(); // href -> set di pagine
const consoleErrors = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && consoleErrors.push(`${page.url()} [${m.type()}] ${m.text().slice(0, 200)}`));
page.on("pageerror", (e) => consoleErrors.push(`${page.url()} [pageerror] ${e.message}`));

for (const p of PAGES) {
  const res = await page.goto(BASE + p, { waitUntil: "networkidle" });
  if (res?.status() !== 200) console.log(`✗ ${p} → ${res?.status()}`);
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs) {
    if (!links.has(h)) links.set(h, new Set());
    links.get(h).add(p);
  }
}

const bad = [];
const results = [];
for (const [href, from] of links) {
  if (/example\.com|localhost|127\.0\.0\.1/.test(href)) bad.push(`${href} (in ${[...from].join(", ")})`);
  let url = href;
  if (href.startsWith("#")) continue;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    results.push(`ok   ${href}`);
    continue;
  }
  if (href.startsWith("/")) url = BASE + href.split("#")[0];
  try {
    const r = await fetch(url, { method: "GET", redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (link check)" } });
    results.push(`${r.status < 400 ? "ok  " : "ERR "} ${r.status} ${href}`);
    if (r.status >= 400) bad.push(`${href} → ${r.status} (in ${[...from].join(", ")})`);
  } catch (e) {
    results.push(`ERR  ${href} ${e.message}`);
    bad.push(`${href} → ${e.message}`);
  }
}
console.log(results.sort().join("\n"));
console.log(`\n${links.size} link unici, ${bad.length} problemi`);
bad.forEach((x) => console.log("  ✗ " + x));
console.log(`\nConsole: ${consoleErrors.length} errori/warning`);
consoleErrors.forEach((x) => console.log("  " + x));
await b.close();
