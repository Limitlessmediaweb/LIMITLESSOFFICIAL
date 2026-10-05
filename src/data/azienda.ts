/**
 * Dati dell'azienda: unica fonte per footer, contatti, pagine legali, JSON-LD e link WhatsApp.
 * Il regime fiscale non va indicato da nessuna parte.
 * Il comune compare solo nel footer e nelle pagine legali: nelle sezioni commerciali
 * si usa `disponibilita` ("Disponibile online in tutta Italia").
 */
export const azienda = {
  nome: "LIMITLESS",
  titolare: "Riccardo Pasquini",
  /** Denominazione completa: "LIMITLESS di Riccardo Pasquini". */
  ragioneSociale: "LIMITLESS di Riccardo Pasquini",
  piva: "03051470189",
  vatID: "IT03051470189",
  sede: { comune: "Miradolo Terme", provincia: "PV", paese: "IT" },
  disponibilita: "Disponibile online in tutta Italia",

  email: "limitlessmediaweb@gmail.com",
  pec: "info@pec.limitlessmedia.it",
  telefono: "+39 339 795 8873",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "393397958873",
  dominio: "limitlessmedia.it",

  instagram: { handle: "limitlessmediaweb", url: "https://www.instagram.com/limitlessmediaweb/" },
  /** [DA COMPLETARE: handle e link del profilo TikTok] — ora è un valore provvisorio (stesso nome di Instagram), da verificare. */
  tiktok: { handle: "limitlessmediaweb", url: "https://www.tiktok.com/@limitlessmediaweb", daConfermare: true },

  zona: "Disponibile online in tutta Italia",
  areaServed: "Italia",
  orari: "[DA COMPLETARE: orari di risposta]",
} as const;

/** Riga legale del footer. */
export const rigaLegale = `${azienda.ragioneSociale} · P.IVA ${azienda.piva} · ${azienda.sede.comune} (${azienda.sede.provincia}) · ${azienda.disponibilita}`;

export const telHref = `tel:${azienda.telefono.replace(/\s/g, "")}`;

export const MESSAGGIO_BASE = "Ciao LIMITLESS! Ho visto il vostro sito e vorrei qualche informazione.";
export const MESSAGGIO_CONSULENZA = "Ciao! Vorrei una consulenza gratuita per la mia attività.";

/** Link WhatsApp con messaggio precompilato. */
export function waLink(testo: string = MESSAGGIO_BASE) {
  return `https://wa.me/${azienda.whatsapp}?text=${encodeURIComponent(testo)}`;
}
