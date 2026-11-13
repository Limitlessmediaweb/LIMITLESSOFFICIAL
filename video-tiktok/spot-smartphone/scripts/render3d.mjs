/**
 * Renderizza sequenze 3D di ÈTERE One con Chrome headless (WebGL su GPU).
 * Uso: node scripts/render3d.mjs <jobs.json>
 * jobs.json: { "width":1080, "height":1920, "items":[ { "shot":"blade", "dur":2.4, "fps":30,
 *   "frames":[0,72] (intervallo [da,a)) | "times":[...], "out":"render/3d/916/blade", "opts":{}, "bg":"stock/frames/neon/%04d.jpg", "bgOffset":0, "samples":16, "format":"png" } ] }
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./server.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const jobs = JSON.parse(readFileSync(process.argv[2], "utf8"));
const force = process.argv.includes("--force");
const { srv, url } = await startServer();
const browser = await chromium.launch({
  channel: "chrome", headless: true,
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: jobs.width, height: jobs.height } });
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log("[page]", m.text()); });
page.on("pageerror", (e) => console.log("[pageerror]", e.message));
await page.goto(url + "/3d/index.html");
await page.waitForFunction(() => window.ENGINE_READY, null, { timeout: 60000 });
await page.evaluate(({ w, h }) => window.ENGINE.setup({ width: w, height: h }), { w: jobs.width, h: jobs.height });
console.log("GPU:", await page.evaluate(() => { const g = document.createElement("canvas").getContext("webgl2"); const d = g.getExtension("WEBGL_debug_renderer_info"); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : "?"; }));

for (const it of jobs.items) {
  const fps = it.fps ?? 30;
  const out = join(ROOT, it.out);
  mkdirSync(out, { recursive: true });
  const fmt = it.format ?? "png";
  const list = it.times ? it.times.map((t, i) => ({ i, t })) : [];
  if (!it.times) for (let f = it.frames[0]; f < it.frames[1]; f++) list.push({ i: f, t: f / fps });
  const t0 = Date.now();
  for (const { i, t } of list) {
    const file = join(out, `${String(i).padStart(4, "0")}.${fmt}`);
    if (!force && existsSync(file)) continue;
    let bg = null;
    if (it.bg) {
      const n = Math.round(t * fps) + (it.bgOffset ?? 0) + 1;
      bg = "/" + it.bg.replace("%04d", String(n).padStart(4, "0"));
    }
    const data = await page.evaluate((a) => window.ENGINE.renderFrame(a), {
      shot: it.shot, t, dur: it.dur, samples: it.samples ?? 16, fps, bg, format: fmt, opts: it.opts ?? {},
    });
    writeFileSync(file, Buffer.from(data.split(",")[1], "base64"));
  }
  console.log(`${it.shot} -> ${it.out}: ${list.length} fotogrammi in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
await browser.close();
srv.close();
