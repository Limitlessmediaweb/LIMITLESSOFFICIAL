/**
 * Segnaposto nei testi: "[DA COMPLETARE]", "[DA CONFERMARE]", "[DA COMPLETARE: nota]".
 * In sviluppo vengono evidenziati (componente <T>), in produzione il marcatore
 * sparisce e resta solo la bozza di testo. `npm run check:placeholders` li elenca.
 */
export const PLACEHOLDER_RE = /\s*\[DA (?:COMPLETARE|CONFERMARE)[^\]]*\]/g;

export const isDev = process.env.NODE_ENV !== "production";

export function hasPlaceholder(s: string) {
  PLACEHOLDER_RE.lastIndex = 0;
  return PLACEHOLDER_RE.test(s);
}

/** Testo pulito, senza marcatori (per meta tag, aria-label, messaggi WhatsApp). */
export function clean(s: string) {
  return s.replace(PLACEHOLDER_RE, "").trim();
}
