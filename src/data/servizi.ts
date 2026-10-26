/**
 * Servizi e prezzi: listino 2026 del 25/10. È l'unica fonte dei prezzi del sito
 * (pagine, FAQ, termini, JSON-LD): nessun prezzo o servizio fuori da qui.
 */

/** Una riga del listino. */
export type Voce = {
  nome: string;
  /** Cosa comprende, in una riga. */
  dettaglio?: string;
  /** Prezzo in euro (il minimo, se c'è una forbice). */
  prezzo: number;
  /** Prezzo massimo, per le forbici (es. 59-99 €). */
  fino?: number;
  /** Prezzo di listino barrato, quando c'è un prezzo di lancio. */
  listino?: number;
  /** Nota sotto il prezzo (es. "fino al 30/11"). */
  nota?: string;
  /** Prezzo al mese. */
  mese?: boolean;
};

export type Servizio = {
  id: "spot" | "walktour" | "sito";
  nome: string;
  /** Il beneficio, in una riga. */
  titolo: string;
  /** Cosa ottieni, per l'attività. */
  ottieni: string;
  include: string[];
  /** Le righe del listino del servizio. */
  voci: Voce[];
  /** Video di sfondo (cartella/slug in public/media). */
  video: { kind: "spot" | "walktour" | "siti"; slug: string };
  tempi: string;
  /** Titolo della sezione FAQ del servizio. */
  faqTitolo: string;
  faq: { q: string; a: string }[];
};

/** Servizi mensili (contenuti, scheda Google, HUB): niente video, solo listino. */
export type Mensile = {
  id: "mese-brand" | "scheda-google" | "hub";
  nome: string;
  titolo: string;
  ottieni: string;
  voci: Voce[];
  /** Righe in evidenza sotto il listino (prezzo fondatore, prova). */
  extra?: string[];
};

/** Spot: prezzo di lancio fino al 30/11, poi listino. */
export const SPOT_LISTINO = 119;
export const SPOT_LANCIO = 99;
export const SPOT_LANCIO_FINE = "30/11";

/** Regole uguali per tutti i lavori. */
export const REGOLE = [
  "Acconto del 50% alla conferma, saldo alla consegna",
  "2 revisioni incluse",
  "Nessuna anteprima gratuita",
  "Fattura con partita IVA in regime forfettario",
];

export const NOTA_PREZZO = "Prezzi di listino. Acconto del 50% per partire, 2 revisioni incluse, nessuna anteprima gratuita.";

export const servizi: Servizio[] = [
  {
    id: "spot",
    nome: "Spot video promo",
    titolo: "Uno spot che ferma lo scroll.",
    ottieni:
      "Un video verticale di 20-30 secondi pronto per Instagram, TikTok e WhatsApp. Fino a metà dicembre anche in versione natalizia, per cantine, birrifici, moto e artigiani.",
    include: [
      "Formato 9:16, 20-30 secondi, per Reels, TikTok e Stories",
      "Idea, montaggio, testi e musica",
      "Versione natalizia per vino, birra, moto e artigiani",
      "Consegna in alta qualità, pronta da pubblicare",
    ],
    voci: [
      {
        nome: "Spot 20-30 secondi",
        dettaglio: "Verticale 9:16, anche in versione natalizia",
        prezzo: SPOT_LANCIO,
        listino: SPOT_LISTINO,
        nota: `fino al ${SPOT_LANCIO_FINE}, poi ${SPOT_LISTINO} €`,
      },
    ],
    video: { kind: "spot", slug: "saetta" },
    tempi: "Pronto in 72 ore dalle riprese o dall'invio delle foto",
    faqTitolo: "Domande sugli spot",
    faq: [
      {
        q: "Quanto costa uno spot?",
        a: `${SPOT_LANCIO} € fino al ${SPOT_LANCIO_FINE}, poi ${SPOT_LISTINO} € di listino. Lo spot dura 20-30 secondi e comprende 2 revisioni.`,
      },
      {
        q: "Fate anche lo spot di Natale?",
        a: "Sì, fino a metà dicembre: è pensato per chi produce e vende, come cantine, birrifici, officine moto e artigiani.",
      },
      {
        q: "Serve girare un video?",
        a: "No. Partiamo dalle foto del prodotto o del locale che hai già. Al resto pensiamo noi.",
      },
      {
        q: "Posso usarlo anche per le pubblicità a pagamento?",
        a: "Sì, puoi usarlo dove vuoi, anche nelle campagne sponsorizzate.",
      },
    ],
  },
  {
    id: "walktour",
    nome: "Video walk tour",
    titolo: "Una visita completa, dal telefono.",
    ottieni:
      "Un tour video della tua location, del tuo B&B o dell'immobile in vendita. Chi guarda si immagina già lì, e ti contatta.",
    include: [
      "Si parte dalle foto che hai già, senza sopralluogo",
      "Movimenti di camera fluidi stanza per stanza",
      "Versione verticale per i social e orizzontale per il sito",
      "Testi con metrature e punti di forza",
    ],
    voci: [
      { nome: "Appartamento", prezzo: 190 },
      { nome: "Struttura", dettaglio: "Fino a 5 ambienti", prezzo: 300 },
      { nome: "Tour completo", prezzo: 590 },
    ],
    video: { kind: "walktour", slug: "attico" },
    tempi: "Pronto in 72 ore dall'invio delle foto",
    faqTitolo: "Domande sui walk tour",
    faq: [
      {
        q: "Servono foto professionali?",
        a: "No. Bastano le foto dell'annuncio o quelle che hai già sul telefono.",
      },
      {
        q: "Va bene per un'agenzia immobiliare con tanti immobili?",
        a: "Sì. Ogni immobile segue il listino: 190 € un appartamento, 300 € una struttura fino a 5 ambienti, 590 € il tour completo.",
      },
    ],
  },
  {
    id: "sito",
    nome: "Sito web",
    titolo: "Un sito che fa scegliere te.",
    ottieni:
      "Chi ti cerca dal telefono capisce subito cosa offri e ti scrive o prenota. Niente pagine che sembrano tutte uguali.",
    include: [
      "Pensato prima per il telefono",
      "Pulsanti WhatsApp, chiamata e mappa",
      "Testi scritti per farti trovare su Google",
      "Premium: su misura, con animazioni e più pagine",
    ],
    voci: [
      { nome: "Sito Easy", dettaglio: "Pensato per il telefono, con WhatsApp, chiamata, mappa e testi per Google", prezzo: 750 },
      { nome: "Sito Premium", dettaglio: "Su misura, con animazioni, più pagine e grafica curata in ogni dettaglio", prezzo: 990 },
    ],
    video: { kind: "siti", slug: "nottea-desktop" },
    tempi: "Sito Easy in 7-10 giorni, Premium in 2-3 settimane",
    faqTitolo: "Domande sul sito",
    faq: [
      {
        q: "Che differenza c'è tra Easy e Premium?",
        a: "Easy (750 €) è il sito pensato per il telefono, con WhatsApp, chiamata, mappa e testi per Google. Premium (990 €) è su misura, con animazioni, più pagine e una grafica curata in ogni dettaglio.",
      },
      {
        q: "Ci sono costi mensili?",
        a: "La manutenzione del sito si concorda nel preventivo, in base a quello che ti serve. Te lo diciamo prima di partire, senza sorprese.",
      },
    ],
  },
];

export const mensili: Mensile[] = [
  {
    id: "mese-brand",
    nome: "Mese Brand",
    titolo: "Contenuti ogni mese, senza pensarci.",
    ottieni: "Spot e contenuti per i social ogni mese, con un calendario dei post già pronto.",
    voci: [
      { nome: "Mese Brand", dettaglio: "1 spot + 8 contenuti + calendario dei post", prezzo: 390, mese: true },
      { nome: "Mese Brand Completo", dettaglio: "2 spot + 12 contenuti + pubblicazione + report", prezzo: 590, mese: true },
    ],
    extra: ["Prezzo fondatore per i primi 3 clienti mensili: −30% per 3 mesi, in cambio del caso studio."],
  },
  {
    id: "scheda-google",
    nome: "Scheda Google + recensioni",
    titolo: "Fatti trovare, e scegliere, su Google.",
    ottieni: "Scheda Google curata e aggiornata, con la richiesta e la gestione delle recensioni.",
    voci: [{ nome: "Scheda Google + recensioni", dettaglio: "Scheda curata e aggiornata, richiesta e gestione delle recensioni", prezzo: 59, fino: 99, mese: true }],
  },
  {
    id: "hub",
    nome: "LIMITLESS HUB",
    titolo: "Il gestionale per piccole aziende manifatturiere.",
    ottieni: "Un'app per PC, tablet e telefono, costruita sul modo di lavorare della tua azienda.",
    voci: [
      { nome: "Base", dettaglio: "Fino a 8 utenti e 2 tablet", prezzo: 290, mese: true },
      { nome: "Pro", dettaglio: "Fino a 25 utenti e 6 tablet, portale cliente incluso", prezzo: 490, mese: true },
      { nome: "Crescita", dettaglio: "Fino a 50 utenti e 15 tablet, con marketing", prezzo: 790, mese: true },
    ],
    extra: ["Per iniziare: prova di 30 giorni a 300 €, fino a 5 funzioni. I 300 € vengono scalati dal canone."],
  },
];

export const euro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/** "190 €", "59-99 €". */
export const prezzoVoce = (v: Voce) => (v.fino ? `${v.prezzo}-${euro(v.fino)}` : euro(v.prezzo));

/** Il prezzo più basso di un elenco di voci. */
export const prezzoMinimo = (voci: Voce[]) => Math.min(...voci.map((v) => v.prezzo));
