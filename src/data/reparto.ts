import { azienda } from "@/data/azienda";

/**
 * Hub Reparto: testi e dati della pagina /reparto («Il reparto di vetro»).
 * Pagina per aziende metalmeccaniche conto terzi di Pavia, Lodi e Piacenza.
 * Con ?azienda=Nome il nome entra nel titolo, sulla targhetta della teca e nel messaggio WhatsApp.
 */

export const REPARTO_TITLE = "Hub Reparto – gestionale conto terzi a Pavia | LIMITLESS";
export const REPARTO_DESCRIPTION =
  "Commesse, ore e terzisti in una schermata. Hub Reparto è il gestionale su misura per le aziende conto terzi di Pavia, Lodi e Piacenza.";

/** Pulisce il nome arrivato dal link: niente simboli strani, massimo 40 caratteri. */
export function pulisciAzienda(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .replace(/[\u0000-\u001f<>{}[\]\\`|^~]/g, " ")
    .replace(/[-_]{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40)
    .trim();
}

export function titoloReparto(nome: string) {
  return nome ? `Il reparto di ${nome}, in una schermata.` : "Il tuo reparto, in una schermata.";
}

export function messaggioReparto(nome: string) {
  return nome
    ? `Ciao, ho visto la pagina dell'Hub Reparto per ${nome}. Mi fate vedere come funzionerebbe con le nostre commesse?`
    : "Ciao, ho visto la pagina dell'Hub Reparto. Mi fate vedere come funzionerebbe con le nostre commesse?";
}

export function waReparto(nome: string) {
  return `https://wa.me/${azienda.whatsapp}?text=${encodeURIComponent(messaggioReparto(nome))}`;
}

/** Le postazioni dentro la teca, nell'ordine del giro. */
export const POSTAZIONI = [
  { id: "taglio", nome: "Taglio laser", breve: "Taglio" },
  { id: "piega", nome: "Piegatura", breve: "Piega" },
  { id: "sald", nome: "Saldatura", breve: "Saldatura" },
  { id: "coll", nome: "Collaudo", breve: "Collaudo" },
  { id: "pronto", nome: "Pronto", breve: "Pronto" },
] as const;
export type PostazioneId = (typeof POSTAZIONI)[number]["id"];

/** Commesse della storia: stessi clienti di esempio della simulazione. */
export const COMMESSE_STORIA = [
  { code: "C-2408", cliente: "Fratelli Bossi", pezzo: "400 staffe a L", prev: 3.5, ritmo: 1 },
  { code: "C-2410", cliente: "Serramenti Lodigiani", pezzo: "24 ringhiere modulari", prev: 4, ritmo: 1.05 },
  { code: "C-2407", cliente: "Agrimec Srl", pezzo: "40 telai saldati", prev: 4.5, ritmo: 1.42 },
  { code: "C-2411", cliente: "Movitalia", pezzo: "80 supporti motore", prev: 2.5, ritmo: 0.95 },
  { code: "C-2406", cliente: "Scaffalature Riva", pezzo: "18 strutture scaffale", prev: 3, ritmo: 1 },
  { code: "C-2412", cliente: "Carpenteria Nord", pezzo: "6 basamenti", prev: 5, ritmo: 0.98 },
  { code: "C-2413", cliente: "Termica Padana", pezzo: "250 piastre forate", prev: 3, ritmo: 1.1 },
] as const;

/** Bigliettini e fogli che volano nel primo schermo. */
export const FOGLI = [
  { tipo: "postit", testo: "C-2411\ndov'è??" },
  { tipo: "postit", testo: "chiamare\nzincatura" },
  { tipo: "postit", testo: "urgente\nAgrimec" },
  { tipo: "foglio", testo: "C-2407" },
  { tipo: "msg", testo: "A che punto siamo?" },
  { tipo: "postit", testo: "ore\nBossi??" },
  { tipo: "foglio", testo: "C-2409" },
  { tipo: "msg", testo: "Mi richiami?" },
  { tipo: "postit", testo: "manca\nlamiera 3" },
  { tipo: "foglio", testo: "BOLLA" },
  { tipo: "postit", testo: "consegna\nvenerdì!!" },
  { tipo: "msg", testo: "È pronto il mio ordine?" },
  { tipo: "foglio", testo: "C-2410" },
  { tipo: "postit", testo: "chi ce l'ha\nil disegno?" },
] as const;

export const SCENE = [
  {
    n: "01",
    etichetta: "Oggi",
    titolo: "",
    testo: "",
  },
  {
    n: "02",
    etichetta: "Dal caos all'ordine",
    titolo: "Ogni foglio diventa una scheda. Al suo posto.",
    testo: "Niente più bigliettini sulle macchine e telefonate per sapere chi ha cosa. Ogni commessa ha la sua scheda, sopra la sua fase.",
  },
  {
    n: "03",
    etichetta: "Le commesse si muovono",
    titolo: "Vedi dove sono, e quante ore stanno costando.",
    testo: "Ogni commessa avanza da una fase all'altra. Le ore reali sono accanto a quelle preventivate: se una sfora, lo vedi mentre il pezzo è ancora in macchina.",
    invito: "Tocca una macchina",
  },
  {
    n: "04",
    etichetta: "Il terzista",
    titolo: "Quando i pezzi sono fuori, non sei al buio.",
    testo: "La commessa esce per la zincatura con la data di rientro. Se il terzista ritarda, lo sai il giorno dopo. Non quando chiama il cliente.",
  },
  {
    n: "05",
    etichetta: "Il telefono squilla",
    titolo: "«A che punto è il mio ordine?»",
    testo: "Rispondi tu. Tocca la commessa giusta e guarda quanto ci metti.",
  },
] as const;

export const AVVISO_TERZISTA = {
  titolo: "Zincheria in ritardo su C-2409.",
  testo: "Il cliente non sa ancora niente, hai margine.",
};

export const CONFRONTI = [
  {
    titolo: "Il cliente chiama",
    oggi: "Lo metti in attesa, vai in reparto, chiedi a tre persone, lo richiami.",
    hub: "Cerchi il nome e rispondi mentre è ancora al telefono.",
  },
  {
    titolo: "Le ore di lavoro",
    oggi: "Scopri a fine mese che una commessa ti è costata il doppio.",
    hub: "Vedi le ore reali contro il preventivo mentre il pezzo è ancora in macchina.",
  },
  {
    titolo: "Il terzista in ritardo",
    oggi: "Te ne accorgi quando il cliente chiede dove sono i pezzi.",
    hub: "Il giorno dopo la data promessa ricevi l'avviso, prima che lo scopra il cliente.",
  },
] as const;

export const CHIUSURA = {
  titolo: "Lo vuoi vedere con le tue commesse vere?",
  testo:
    "Lo costruiamo sul tuo reparto: le tue macchine, le tue fasi, i tuoi terzisti. Usi il tablet che hai già e i ragazzi imparano in cinque minuti. Prima una prova sul lavoro di tutti i giorni, poi decidi.",
};

export const FOOTER_REPARTO = `LIMITLESS · Lavorare meglio. Farsi vedere meglio. · P.IVA ${azienda.piva}`;
