import { waLink } from "@/data/azienda";

/**
 * Testi e dati della home «Dal caos all'ordine» (Fase 2, novembre 2026).
 * Direzione approvata da Riccardo il 12/11: hero A (caos fisico) + lente a metà pagina,
 * titolo «Dal caos all'ordine.». Sul sito non si nominano mai strumenti o tecnologie usate per i video.
 */

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

/* ── Lavori 01–07 ─────────────────────────────────────────────────────────────── */

export type LavoroHome = {
  slug: string;
  nome: string;
  /** Tipo di lavoro, in parole semplici. */
  tipo: string;
  riga: string;
  /** Brand o attività inventati da LIMITLESS: sulla scheda compare sempre «Concept». */
  concept: boolean;
};

/**
 * Scelti da Riccardo il 12/11: i 7 consigliati, con un walk tour (Attico) al posto di Tecnolambro.
 * Per cambiarli basta modificare questo elenco: i file stanno in public/media/home/<slug>.mp4 (muto),
 * <slug>.jpg, <slug>-s.mp4 e <slug>-s.jpg (miniature dell'hero).
 * Tutti i video sono senza audio. I concept sono sempre segnati.
 */
export const lavoriHome: LavoroHome[] = [
  { slug: "hub-il-foglio", nome: "HUB · «Il foglio»", tipo: "Gestionale · il nostro prodotto", riga: "Dal foglio sul bancone alla schermata. In trenta secondi.", concept: false },
  { slug: "cascina-belvedere", nome: "Cascina Belvedere", tipo: "Walk tour · cascina", riga: "Un giro dentro casa, prima di andarci.", concept: true },
  { slug: "scarico-titanio", nome: "Scarico titanio", tipo: "Spot · moto", riga: "Uno scarico, ripreso come merita.", concept: true },
  { slug: "ombralta", nome: "Tenuta Ombralta", tipo: "Spot · vino", riga: "Il regalo di Natale di una cantina.", concept: true },
  { slug: "attico", nome: "Attico in centro", tipo: "Walk tour · appartamento", riga: "Dalla mappa al salotto, stanza per stanza.", concept: true },
  { slug: "nottea", nome: "NÒTTEA", tipo: "Sito + spot · profumi", riga: "Un profumo che nasce di notte.", concept: true },
  { slug: "ordito", nome: "ORDITO", tipo: "Sito + spot · abbigliamento", riga: "La giacca si scompone e mostra come è fatta.", concept: true },
];

/* ── Sezione 2 · Lo riconosci? ────────────────────────────────────────────────── */

export const riconosci = [
  { t: "«È pronto il mio ordine?»", d: "E tu non lo sai. Devi chiedere a tre persone." },
  { t: "Il foglio giusto è sul bancone.", d: "O in furgone. O era quello di ieri." },
  { t: "Lo sai solo tu.", d: "Quindi se manchi un giorno, qualcosa si ferma." },
];

/* ── Sezione 3 · Prima e dopo: le tre coppie sotto e dentro la lente ──────────── */

export const coppie = [
  { prima: "«Chi lo sta facendo, quello?»", dopo: "Ordine Bianchi · Marco · In corso" },
  { prima: "Consegna venerdì (forse)", dopo: "Consegna Verdi · venerdì · Confermata" },
  { prima: "3 chiamate perse", dopo: "Cliente Ferri · richiamato · Fatto" },
];

/* ── Sezione 4 · Tre tasti ────────────────────────────────────────────────────── */

export const tasti = [
  { nome: "Inizio", frase: "«Ho cominciato.»", d: "Tu lo vedi subito, senza telefonare.", stato: "In corso", tono: "neutro" },
  { nome: "Fatto", frase: "«Finito.»", d: "Il lavoro passa a chi viene dopo, da solo.", stato: "Fatto", tono: "ok" },
  { nome: "Problema", frase: "«Qui c'è un intoppo.»", d: "Lo sai adesso, non a fine giornata.", stato: "Problema · manca il materiale", tono: "ko" },
] as const;

/* ── Sezione 5 · Per te che decidi ────────────────────────────────────────────── */

export const perTe = [
  { t: "Tutti i lavori in una schermata.", d: "Cosa è in corso, cosa è fermo, cosa è in ritardo." },
  { t: "Chi fa cosa,", d: "oggi e questa settimana." },
  { t: "I problemi in cima,", d: "prima che diventino ritardi." },
];

/* ── Sezione 7 · Come si parte ────────────────────────────────────────────────── */

export const passi = [
  { t: "Dieci minuti di demo.", d: "Su WhatsApp o in chiamata. Lo vedi funzionare con esempi della tua attività." },
  {
    t: "Trenta giorni di prova, a 300 €.",
    d: "Lo usate davvero, con i vostri lavori. Se continui, i 300 € li scaliamo dai canoni. Se smetti, non devi altro e ti diamo i tuoi dati in Excel.",
  },
  {
    t: "Lo adattiamo a te.",
    d: "Nomi, fasi, funzioni, logo: come lavorate voi. Quando serve una modifica la chiedi a una persona, non a un call center.",
  },
];

/* ── Sezione 9 · Domande ──────────────────────────────────────────────────────── */

/** Le risposte ancora [DA COMPLETARE] non vengono mostrate finché Riccardo non dà il dato vero. */
export const domandeHome = [
  { q: "Devo cambiare il programma delle fatture?", a: "No. Resta il tuo. Noi mettiamo in ordine il lavoro, non la contabilità." },
  { q: "I miei non sono pratici di computer.", a: "Tre tasti: Inizio, Fatto, Problema. Chi sa usare WhatsApp sa usare questo." },
  { q: "Va bene per la mia attività?", a: "Aziende, laboratori, negozi, e-commerce, studi, attività di servizi. Lo adattiamo a come lavori tu." },
  { q: "E se dopo la prova non mi convince?", a: "Ti fermi. Non devi altro e ricevi i tuoi dati in Excel." },
  { q: "C'è un vincolo?", a: "Dopo la prova, tre mesi. Poi mese per mese: disdici per iscritto 7 giorni prima, anche via email." },
  { q: "Si paga per ogni persona che lo usa?", a: "No. Il prezzo è fisso, fino al numero di utenti del tuo pacchetto." },
  { q: "Quanto ci vuole per partire?", a: "[DA COMPLETARE: tempi veri di attivazione]" },
  { q: "Dove stanno i miei dati?", a: "[DA COMPLETARE: frase verificata su server in Europa e copie di sicurezza]" },
  { q: "Fate anche solo un sito o un video?", a: "Sì. Scrivici cosa ti serve e ti diciamo prezzo e tempi." },
  { q: "Con chi parlo?", a: "Con Riccardo, direttamente. Hai il suo numero." },
];

/* ── Sezione 10 · Quiz ────────────────────────────────────────────────────────── */

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

/** Ultima domanda, senza punti: serve a proporre il pacchetto. */
export const quizPersone = {
  q: "In quanti lavorate, te compreso?",
  r: [
    { label: "Fino a 5", pacchetto: "Start", numero: "fino a 5" },
    { label: "Da 6 a 10", pacchetto: "Base", numero: "da 6 a 10" },
    { label: "Da 11 a 25", pacchetto: "Pro", numero: "da 11 a 25" },
    { label: "Da 26 a 50", pacchetto: "Crescita", numero: "da 26 a 50" },
    { label: "Più di 50", pacchetto: "Su misura", numero: "più di 50" },
  ],
};

export type QuizRisultato = { titolo: string; testo: string; demo: boolean; prova: boolean };

export function quizRisultato(punti: number): QuizRisultato {
  if (punti <= 4)
    return {
      titolo: "Ordine vero.",
      testo: "Sei messo meglio di quasi tutti. Il lavoro si trova, e non dipende solo da te. Qui il passo utile è un altro: farti vedere fuori come lavori dentro.",
      demo: false,
      prova: false,
    };
  if (punti <= 9)
    return {
      titolo: "Regge. Ma regge su di te.",
      testo:
        "Il lavoro esce, però passa quasi tutto da te: domande, telefonate, controlli. Finché ci sei funziona. Il primo passo è togliere dalla tua testa i lavori in corso e metterli dove li vedono tutti.",
      demo: true,
      prova: false,
    };
  return {
    titolo: "Il lavoro vive nella tua testa.",
    testo:
      "Lavorate tanto, ma ogni risposta costa un giro di telefonate, e i problemi arrivano tardi. Non serve lavorare di più: serve un posto solo dove ogni lavoro ha un nome, una persona e uno stato. Si comincia da lì.",
    demo: true,
    prova: true,
  };
}

export const quizDemoLink = (titolo: string, numero: string) =>
  waLink(`Ciao, ho fatto il quiz sul sito: risultato «${titolo}». In azienda siamo ${numero}. Vorrei vedere la demo di 10 minuti.`);

export const QUIZ_WHATSAPP = waLink("Ciao LIMITLESS! Ho visto il sito e vorrei parlare della mia attività.");
