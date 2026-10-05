// Elenca i media presenti in public/media e scrive src/data/media-manifest.json.
// Il sito legge questo file per sapere quali video esistono: se uno spot manca,
// il progetto mostra solo la registrazione del sito, senza errori.
import { readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const media = join(root, "public", "media");
const manifest = {};

function size(file) {
  const out = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file]).toString();
  const [width, height] = out.trim().split(",").map(Number);
  return { width, height, vertical: height > width };
}

for (const kind of ["spot", "walktour", "siti", "showreel"]) {
  const dir = join(media, kind);
  manifest[kind] = {};
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".mp4") || file.endsWith("-m.mp4")) continue;
    const slug = file.replace(/\.mp4$/, "");
    const has = (f) => existsSync(join(dir, f));
    manifest[kind][slug] = {
      mp4: `/media/${kind}/${slug}.mp4`,
      mp4Mobile: has(`${slug}-m.mp4`) ? `/media/${kind}/${slug}-m.mp4` : null,
      poster: has(`${slug}.jpg`) ? `/media/${kind}/${slug}.jpg` : null,
      posterAvif: has(`${slug}.avif`) ? `/media/${kind}/${slug}.avif` : null,
      bytes: statSync(join(dir, file)).size,
      ...size(join(dir, file)),
    };
  }
}

writeFileSync(join(root, "src", "data", "media-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
const count = Object.values(manifest).reduce((n, k) => n + Object.keys(k).length, 0);
console.log(`media-manifest.json: ${count} video`);
