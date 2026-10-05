// Lighthouse mobile su home e una pagina progetto. Uso: avvia il sito, poi BASE=http://localhost:3000 npm run lighthouse
// (Chromium di Playwright con porta di debug: evita i problemi di chrome-launcher su Windows)
const BASE = process.env.BASE ?? "http://localhost:3000";
import { chromium } from "playwright";
import lighthouse from "lighthouse";
import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync("docs/lighthouse", { recursive: true });
const b = await chromium.launch({ args: ["--remote-debugging-port=9334"] });
for (const [name, path] of [["home", "/"], ["nottea", "/lavori/nottea"]]) {
  const t0 = Date.now();
  const r = await lighthouse(`${BASE}${path}`, { port: 9334, output: ["html", "json"], logLevel: "error", formFactor: "mobile", maxWaitForLoad: 30000 });
  writeFileSync(`docs/lighthouse/${name}.html`, r.report[0]);
  writeFileSync(`docs/lighthouse/${name}.json`, r.report[1]);
  const c = r.lhr.categories, a = r.lhr.audits;
  console.log(name, Object.keys(c).map((k) => `${k}:${Math.round(c[k].score * 100)}`).join(" "),
    "| LCP", a["largest-contentful-paint"].displayValue, "| CLS", a["cumulative-layout-shift"].displayValue,
    "| TBT", a["total-blocking-time"].displayValue, "| FCP", a["first-contentful-paint"].displayValue,
    "| peso", a["total-byte-weight"].displayValue, `| ${Math.round((Date.now() - t0) / 1000)}s`, r.lhr.runtimeError?.message ?? "");
}
await b.close();
