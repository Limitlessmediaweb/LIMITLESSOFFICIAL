import { readFileSync } from "node:fs";

/** Layout condiviso con build.py (stesso file JSON). */
export const L = JSON.parse(readFileSync(new URL("./layout.json", import.meta.url), "utf8"));
