// Elenca in console tutti i segnaposto [DA COMPLETARE] / [DA CONFERMARE] nei sorgenti.
// Non blocca la build: serve come promemoria prima del lancio.
// Con --strict esce con errore se ne trova (da usare al lancio).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const re = /\[DA (COMPLETARE|CONFERMARE)[^\]]*\]/g;

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|md)$/.test(f) ? [p] : [];
  });
}

const found = [];
for (const file of [...walk(join(root, "src"))]) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((l, i) => {
    // salta i commenti che documentano il meccanismo
    if (/^\s*(\*|\/\/)/.test(l) || l.includes("PLACEHOLDER_RE")) return;
    const hits = l.match(re);
    if (!hits) return;
    const context = l.trim().replace(/\s+/g, " ").slice(0, 110);
    found.push({ where: `${relative(root, file)}:${i + 1}`, tags: hits.join(" "), context });
  });
}

if (!found.length) {
  console.log("✓ check-placeholders: nessun segnaposto");
} else {
  console.log(`\n⚠ check-placeholders: ${found.length} segnaposto da completare prima del lancio\n`);
  for (const f of found) console.log(`  ${f.where}\n    ${f.tags}  ${f.context}`);
  console.log("");
  if (process.argv.includes("--strict")) process.exit(1);
}
