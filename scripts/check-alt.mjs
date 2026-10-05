// Fa fallire la build se trova un <img> o <Image> senza attributo alt nei sorgenti.
// (alt="" è consentito: indica un'immagine decorativa.)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const src = join(root, "src");

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx|jsx)$/.test(f) ? [p] : [];
  });
}

/** Estrae il tag JSX che parte da `start`, tenendo conto delle graffe annidate. */
function readTag(code, start) {
  let depth = 0;
  for (let i = start; i < code.length; i++) {
    const c = code[i];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === ">" && depth === 0) return code.slice(start, i + 1);
  }
  return code.slice(start);
}

const errors = [];
for (const file of walk(src)) {
  const code = readFileSync(file, "utf8");
  const re = /<(img|Image)\b/g;
  let m;
  while ((m = re.exec(code))) {
    const tag = readTag(code, m.index);
    if (!/\balt\s*=/.test(tag)) {
      const line = code.slice(0, m.index).split("\n").length;
      errors.push(`${relative(root, file)}:${line}  <${m[1]}> senza alt`);
    }
  }
}

if (errors.length) {
  console.error(`\n✗ check-alt: ${errors.length} immagini senza alt\n  ${errors.join("\n  ")}\n`);
  process.exit(1);
}
console.log("✓ check-alt: tutte le immagini hanno l'attributo alt");
