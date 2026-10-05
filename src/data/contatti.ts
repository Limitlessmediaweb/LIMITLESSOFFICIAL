export const contatti = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "393397958873",
  telefono: "+39 339 795 8873",
  email: "limitlessmediaweb@gmail.com",
  pec: "info@pec.limitlessmedia.it",
  instagram: "limitlessmediaweb",
  instagramUrl: "https://www.instagram.com/limitlessmediaweb/",
  dominio: "limitlessmedia.it",
  zona: "Lombardia, Piemonte, Emilia-Romagna e online in tutta Italia [DA CONFERMARE]",
  areaServed: ["Lombardia", "Piemonte", "Emilia-Romagna", "Italia"],
  orari: "[DA COMPLETARE: orari di risposta]",
  piva: "[DA COMPLETARE: P.IVA]",
  titolare: "[DA COMPLETARE: titolare del trattamento]",
} as const;

export const MESSAGGIO_BASE = "Ciao LIMITLESS! Ho visto il vostro sito e vorrei qualche informazione.";

/** Link WhatsApp con messaggio precompilato. */
export function waLink(testo: string = MESSAGGIO_BASE) {
  return `https://wa.me/${contatti.whatsapp}?text=${encodeURIComponent(testo)}`;
}
