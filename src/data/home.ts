import { waLink } from "@/data/azienda";
import { HUB_DA } from "@/data/hub";
import { prezzoMinimo, servizi, SITO_DA, SITO_MANUTENZIONE_DA, SPOT_NOTA } from "@/data/servizi";

/**
 * Testi e dati della home (riorganizzata il 12/11/2026).
 * Identità: «Lavorare meglio. Farsi vedere meglio.» Dentro mettiamo ordine nel lavoro (HUB e software su misura),
 * fuori facciamo vedere l'attività come merita (siti, video e spot). L'HUB è uno dei prodotti, non il centro.
 * Sul sito non si nominano mai strumenti o tecnologie usate per i lavori, né il regime fiscale.
 * I prezzi vengono sempre da data/hub.ts e data/servizi.ts, mai scritti a mano qui.
 */

export const MOTTO = "Lavorare meglio. Farsi vedere meglio.";

/** Ogni pulsante WhatsApp dice da quale sezione arriva il contatto. */
export const waSezione = (sezione: string) => waLink(`Ciao, vengo dalla sezione ${sezione} del sito e vorrei sapere di più.`);

/* ── Le cose che il titolare ha in giro oggi → la stessa cosa, in ordine ───────── */

export type Cosa = {
  /** Tipo di oggetto nel disordine. */
  k: "chat" | "postit" | "xls" | "paper" | "call";
  /** Riga piccola sopra (mittente, nome del file…). */
  s?: string;
  /** Testo dell'oggetto in disordine. */
  m?: string;
  /** Solo per il foglio Excel: righe nome/stato. */
  rows?: [string, string][];
  /** La stessa cosa, in ordine: titolo, persona, stato. */
  t: string;
  who?: string;
  st: string;
  c?: "ok" | "ko";
};

export const cose: Cosa[] = [
  { k: "chat", s: "WhatsApp · 23:47", m: "«È pronto il mio ordine?»", t: "Ordine Bianchi", who: "Marco", st: "In corso" },
  { k: "postit", m: "Richiamare Rossi!!", t: "Richiamare Rossi", who: "Tu", st: "Fatto", c: "ok" },
  { k: "paper", s: "Foglio sul bancone", m: "Consegna venerdì (forse)", t: "Consegna Verdi · venerdì", who: "Luca", st: "Confermata", c: "ok" },
  { k: "call", s: "Chiamate perse", m: "3 dallo stesso cliente", t: "Cliente Ferri richiamato", who: "Sara", st: "Fatto", c: "ok" },
  { k: "xls", s: "ordini_DEFINITIVO_v7.xlsx", rows: [["Bianchi", "???"], ["Verdi", "chiedere"], ["Rossi", "boh"]], t: "Elenco ordini", who: "Ufficio", st: "Aggiornato", c: "ok" },
  { k: "paper", s: "Preventivo", m: "Dove l'ho messo?", t: "Materiale in arrivo", who: "Luca", st: "Problema", c: "ko" },
  { k: "chat", s: "Vocale · 2:14", m: "«Chi lo sta facendo, quello?»", t: "Preventivo Colombo", who: "Sara", st: "Inviato" },
  { k: "postit", m: "Manca il materiale?", t: "Ordine Galli", who: "Marco", st: "In corso" },
  { k: "chat", s: "WhatsApp · gruppo", m: "«Ma quello di ieri è partito?»", t: "Spedizione Riva", who: "Luca", st: "Partita", c: "ok" },
  { k: "paper", s: "Agenda", m: "Giovedì: tutto insieme", t: "Giovedì: 4 lavori, 3 persone", st: "Pianificato", c: "ok" },
  { k: "postit", m: "Fattura?? chiedere", t: "Da fatturare: 2", who: "Ufficio", st: "In corso" },
  { k: "call", s: "Segreteria", m: "«Richiamatemi, è urgente»", t: "Urgenza Moretti", who: "Tu", st: "Presa in carico" },
];

/* ── 2 · Due lati dello stesso lavoro ─────────────────────────────────────────── */

export const lati = [
  {
    id: "dentro",
    etichetta: "Dentro",
    titolo: "Lavorare meglio.",
    frase: "Mettiamo ordine nel lavoro: ogni cosa ha un nome, una persona e uno stato.",
    prodotti: ["Gestionale HUB", "Sviluppi su misura"],
  },
  {
    id: "fuori",
    etichetta: "Fuori",
    titolo: "Farsi vedere meglio.",
    frase: "Facciamo vedere la tua attività come merita: chi ti cerca capisce subito perché scegliere te.",
    prodotti: ["Siti web", "Video e spot"],
  },
] as const;

/* ── 3 · Prodotti ─────────────────────────────────────────────────────────────── */

const spot = servizi.find((s) => s.id === "spot")!;

export type Prodotto = {
  id: string;
  nome: string;
  lato: "Dentro" | "Fuori";
  perChi: string;
  risolve: string;
  /** Prezzo «da …» preso dal listino del sito; null = a preventivo. */
  da: number | null;
  unita?: string;
  /** Riga piccola sotto il prezzo. */
  nota?: string;
  /** Pagina di approfondimento; null = si parla su WhatsApp. */
  href: string | null;
  linkLabel: string;
  /** Nome della sezione nel messaggio WhatsApp. */
  sezione: string;
};

export const prodotti: Prodotto[] = [
  {
    id: "hub",
    nome: "Gestionale HUB",
    lato: "Dentro",
    perChi: "Per aziende, laboratori, negozi e studi.",
    risolve: "Lavori, ordini e clienti sotto controllo, dal telefono.",
    da: HUB_DA,
    unita: "/mese",
    href: "/hub",
    linkLabel: "Scopri l'HUB",
    sezione: "Gestionale HUB",
  },
  {
    id: "siti",
    nome: "Siti web",
    lato: "Fuori",
    perChi: "Per chi vuole farsi scegliere da chi lo cerca.",
    risolve: "Sito vetrina o premium, anche con le prenotazioni.",
    da: SITO_DA,
    nota: `manutenzione da ${SITO_MANUTENZIONE_DA} €/mese`,
    href: "/servizi#sito",
    linkLabel: "Vedi i siti",
    sezione: "Siti",
  },
  {
    id: "video",
    nome: "Video e spot",
    lato: "Fuori",
    perChi: "Per brand, prodotti, immobili e strutture.",
    risolve: "Spot per brand e prodotti, video tour per immobili e strutture.",
    da: prezzoMinimo(spot.voci),
    nota: SPOT_NOTA,
    href: "/servizi#spot",
    linkLabel: "Vedi video e spot",
    sezione: "Video e spot",
  },
  {
    id: "su-misura",
    nome: "Sviluppi su misura",
    lato: "Dentro",
    perChi: "Per chi ha un lavoro che nessun programma copre.",
    risolve: "Software pensato per il tuo tipo di attività.",
    da: null,
    href: null,
    linkLabel: "Parliamone",
    sezione: "Sviluppi su misura",
  },
];

/* ── 4 · HUB in breve: le tre coppie della lente e i tre tasti ────────────────── */

export const coppie = [
  { prima: "«Chi lo sta facendo, quello?»", dopo: "Ordine Bianchi · Marco · In corso" },
  { prima: "Consegna venerdì (forse)", dopo: "Consegna Verdi · venerdì · Confermata" },
  { prima: "3 chiamate perse", dopo: "Cliente Ferri · richiamato · Fatto" },
];

export const tasti = [
  { nome: "Inizio", d: "«Ho cominciato.» Tu lo vedi subito.", stato: "In corso", tono: "neutro" },
  { nome: "Fatto", d: "«Finito.» Passa a chi viene dopo.", stato: "Fatto", tono: "ok" },
  { nome: "Problema", d: "«C'è un intoppo.» Lo sai adesso.", stato: "Problema · manca il materiale", tono: "ko" },
] as const;

/* ── 5 · Lavori: quattro, i migliori (un gestionale, un sito, due spot) ───────── */

export type LavoroHome = {
  slug: string;
  nome: string;
  tipo: string;
  riga: string;
  /** Brand o attività inventati da LIMITLESS: sulla scheda compare sempre «Concept». */
  concept: boolean;
  /** Descrizione del video per chi non lo vede. */
  alt: string;
};

/** I file stanno in public/media/home/<slug>.mp4 (muto) e <slug>.jpg. Tutti i video sono senza audio. */
export const lavoriHome: LavoroHome[] = [
  {
    slug: "hub-il-foglio",
    nome: "HUB · «Il foglio»",
    tipo: "Gestionale",
    riga: "Dal foglio sul bancone alla schermata.",
    concept: false,
    alt: "La scheda di un ordine nel gestionale HUB, con le fasi di lavoro che si completano una dopo l'altra",
  },
  {
    slug: "nottea",
    nome: "NÒTTEA",
    tipo: "Sito web",
    riga: "Un profumo che nasce di notte.",
    concept: true,
    alt: "Il sito di un profumo di lusso: una boccetta ambrata su fondo nero con le note che compaiono intorno",
  },
  {
    slug: "scarico-titanio",
    nome: "Scarico titanio",
    tipo: "Spot",
    riga: "Uno scarico, ripreso come merita.",
    concept: true,
    alt: "Spot di uno scarico da moto in titanio e carbonio, ripreso da vicino con luci di taglio",
  },
  {
    slug: "ombralta",
    nome: "Tenuta Ombralta",
    tipo: "Spot",
    riga: "Il regalo di Natale di una cantina.",
    concept: true,
    alt: "Spot di una cantina: botti in penombra, grappoli e un calice di vino rosso",
  },
];

/* ── 6 · Come si parte ────────────────────────────────────────────────────────── */

export const passi = [
  { t: "Un messaggio, o una demo di 10 minuti.", d: "Ci racconti cosa fai e cosa non gira. Per l'HUB ti facciamo vedere come funziona, in chat o in chiamata." },
  { t: "Una proposta su misura.", d: "Ti diciamo cosa faremmo, in quanto tempo e a che prezzo. Niente pacchetti standard: parte da come lavori tu." },
  { t: "Si parte.", d: "Confermi e cominciamo. Parli sempre con chi fa il lavoro." },
];

/* ── Domande sull'HUB (mostrate su /hub) ──────────────────────────────────────── */

/** Le risposte ancora [DA COMPLETARE] non vengono mostrate finché Riccardo non dà il dato vero. */
export const domandeHub = [
  { q: "Devo cambiare il programma delle fatture?", a: "No. Resta il tuo. Noi mettiamo in ordine il lavoro, non la contabilità." },
  { q: "I miei non sono pratici di computer.", a: "Tre tasti: Inizio, Fatto, Problema. Chi sa usare WhatsApp sa usare questo." },
  { q: "Va bene per la mia attività?", a: "Aziende, laboratori, negozi, e-commerce, studi, attività di servizi. Lo adattiamo a come lavori tu." },
  { q: "E se dopo la prova non mi convince?", a: "Ti fermi. Non devi altro e ricevi i tuoi dati in Excel." },
  { q: "C'è un vincolo?", a: "Dopo la prova, tre mesi. Poi mese per mese: disdici per iscritto 7 giorni prima, anche via email." },
  { q: "Si paga per ogni persona che lo usa?", a: "No. Il prezzo è fisso, fino al numero di utenti del tuo pacchetto." },
  { q: "Quanto ci vuole per partire?", a: "[DA COMPLETARE: tempi veri di attivazione]" },
  { q: "Dove stanno i miei dati?", a: "[DA COMPLETARE: frase verificata su server in Europa e copie di sicurezza]" },
  { q: "Con chi parlo?", a: "Con Riccardo, direttamente. Hai il suo numero." },
];

/* ── 7 · Quiz ─────────────────────────────────────────────────────────────────── */

/** Punti: prima risposta 0, seconda 1, terza 2. */
export const quizDomande: { q: string; r: [string, string, string] }[] = [
  { q: "Un cliente chiama: «A che punto è il mio lavoro?»", r: ["Lo vedo e rispondo subito.", "Chiedo a qualcuno e richiamo.", "Devo fare il giro di tutti."] },
  { q: "Dove sono scritti i lavori da fare?", r: ["In un posto solo, che vedono tutti.", "Un po' su Excel, un po' su WhatsApp, un po' su carta.", "Soprattutto nella mia testa."] },
  { q: "Se manchi tre giorni, cosa succede?", r: ["Il lavoro va avanti.", "Va avanti, ma mi chiamano dieci volte.", "Qualcosa si ferma."] },
  { q: "Quante volte al giorno ti chiedono «cosa faccio adesso?»", r: ["Quasi mai.", "Qualche volta.", "Di continuo."] },
  { q: "Manca il materiale, c'è un errore, un ritardo. Quando lo vieni a sapere?", r: ["Subito.", "A fine giornata.", "Quando chiama il cliente."] },
  { q: "L'ultima volta che è saltata una consegna o un appuntamento, perché?", r: ["Non ricordo che sia successo.", "Un imprevisto vero.", "Qualcuno non lo sapeva, o se n'è dimenticato."] },
  { q: "A fine mese sai quanti lavori avete chiuso e quanti sono fermi?", r: ["Sì, con i numeri.", "A occhio.", "No."] },
];

/** Ultima domanda, senza punti: finisce nel messaggio WhatsApp, così sappiamo quanto è grande l'attività. */
export const quizPersone = {
  q: "In quanti lavorate, te compreso?",
  r: [
    { label: "Fino a 5", numero: "fino a 5" },
    { label: "Da 6 a 10", numero: "da 6 a 10" },
    { label: "Da 11 a 25", numero: "da 11 a 25" },
    { label: "Da 26 a 50", numero: "da 26 a 50" },
    { label: "Più di 50", numero: "più di 50" },
  ],
};

export type QuizRisultato = { titolo: string; testo: string; passo: string };

export function quizRisultato(punti: number): QuizRisultato {
  if (punti <= 4)
    return {
      titolo: "Ordine vero.",
      testo: "Sei messo meglio di quasi tutti. Il lavoro si trova, e non dipende solo da te.",
      passo: "Qui il passo utile è un altro: farti vedere fuori come lavori dentro. Sito, video e spot.",
    };
  if (punti <= 9)
    return {
      titolo: "Regge. Ma regge su di te.",
      testo: "Il lavoro esce, però passa quasi tutto da te: domande, telefonate, controlli. Finché ci sei funziona.",
      passo: "Il primo passo è togliere dalla tua testa i lavori in corso e metterli dove li vedono tutti.",
    };
  return {
    titolo: "Il lavoro vive nella tua testa.",
    testo: "Lavorate tanto, ma ogni risposta costa un giro di telefonate, e i problemi arrivano tardi.",
    passo: "Non serve lavorare di più: serve un posto solo dove ogni lavoro ha un nome, una persona e uno stato.",
  };
}

export const quizLink = (titolo: string, numero: string) =>
  waLink(`Ciao, vengo dal quiz del sito: mi è uscito «${titolo}». In azienda siamo ${numero}. Vorrei sapere di più.`);
