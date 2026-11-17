// Peso e tempi della pagina /reparto: byte trasferiti al primo caricamento e primo contenuto visibile (FCP).
// Uso: avvia la build (npm run build && npm start) e poi  node scripts/reparto-peso.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const browser = await chromium.launch({ channel: process.env.CHANNEL ?? "chrome" });
for (const [nome, viewport, mobile] of [
  ["desktop", { width: 1440, height: 900 }, false],
  ["mobile", { width: 390, height: 844 }, true],
]) {
  const ctx = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  let bytes = 0;
  const perTipo = {};
  const tipi = new Map();
  cdp.on("Network.responseReceived", (e) => tipi.set(e.requestId, e.type));
  cdp.on("Network.loadingFinished", (e) => {
    bytes += e.encodedDataLength;
    const t = tipi.get(e.requestId) ?? "Other";
    perTipo[t] = (perTipo[t] ?? 0) + e.encodedDataLength;
  });
  await page.goto(`${BASE}/reparto`, { waitUntil: "networkidle" });
  await page.waitForSelector(".rv[data-pronto]", { timeout: 30000 });
  await page.waitForTimeout(1500);
  const fcp = await page.evaluate(() => performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null);
  // fotogrammi al secondo con la teca a schermo
  const fps = await page.evaluate(
    () =>
      new Promise((r) => {
        let n = 0;
        const t0 = performance.now();
        const f = () => {
          n++;
          if (performance.now() - t0 < 3000) requestAnimationFrame(f);
          else r(Math.round(n / 3));
        };
        requestAnimationFrame(f);
      }),
  );
  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(`${nome}: ${kb(bytes)} trasferiti · FCP ${fcp ? Math.round(fcp) + " ms" : "n.d."} · ${fps} fps`);
  console.log("  " + Object.entries(perTipo).map(([k, v]) => `${k} ${kb(v)}`).join(" · "));
  await ctx.close();
}
await browser.close();
