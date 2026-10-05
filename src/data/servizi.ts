/**
 * Servizi e prezzi. Tutti i prezzi sono "a partire da": il prezzo finale si decide
 * dopo la consulenza gratuita. Nessun prezzo fisso, nessun pacchetto a prezzo preciso.
 */
export type Servizio = {
  id: "sito" | "spot" | "walktour";
  nome: string;
  /** Il beneficio, in una riga. */
  titolo: string;
  /** Cosa ottieni, per l'attività. */
  ottieni: string;
  include: string[];
  /** Prezzo "a partire da", in euro. */
  da: number;
  /** Video di sfondo (cartella/slug in public/media). */
  video: { kind: "spot" | "walktour" | "siti"; slug: string };
  tempi: string;
  /** Titolo della sezione FAQ del servizio. */
  faqTitolo: string;
  faq: { q: string; a: string }[];
};

/** Manutenzione del sito, in euro al mese. */
export const MANUTENZIONE_MESE = 9;

export const NOTA_PREZZO = "Il prezzo finale dipende dal progetto: te lo diciamo dopo la consulenza gratuita, senza sorprese.";

export const MANUTENZIONE_TESTO = `Ogni sito include la manutenzione mensile a ${MANUTENZIONE_MESE} €/mese: hosting, sicurezza, aggiornamenti e piccole modifiche. Al resto pensiamo noi. [DA CONFERMARE: cosa è incluso]`;

export const servizi: Servizio[] = [
  {
    id: "sito",
    nome: "Sito web",
    titolo: "Un sito che fa scegliere te.",
    ottieni:
      "Chi ti cerca dal telefono capisce subito cosa offri e ti scrive o prenota. Niente pagine che sembrano tutte uguali.",
    include: [
      "Design su misura, pensato prima per il telefono",
      "Animazioni fluide che guidano verso il contatto",
      "Pulsanti WhatsApp, chiamata e prenotazione",
      "Testi scritti per farti trovare su Google",
      `Manutenzione a ${MANUTENZIONE_MESE} €/mese: hosting, sicurezza, aggiornamenti [DA CONFERMARE]`,
    ],
    da: 500,
    video: { kind: "siti", slug: "nottea-desktop" },
    tempi: "Online in circa 7 giorni [DA CONFERMARE]",
    faqTitolo: "Domande sul sito",
    faq: [
      {
        q: "Ci sono costi mensili?",
        a: `Sì, solo la manutenzione: ${MANUTENZIONE_MESE} €/mese. Comprende hosting, sicurezza, aggiornamenti e piccole modifiche, così il sito resta sempre online e veloce senza che tu debba pensarci.`,
      },
      {
        q: "Posso cambiare testi e foto?",
        a: "Sì. Ci scrivi su WhatsApp e li cambiamo noi: le piccole modifiche sono comprese nella manutenzione. [DA CONFERMARE]",
      },
    ],
  },
  {
    id: "spot",
    nome: "Spot video promo",
    titolo: "Uno spot che ferma lo scroll.",
    ottieni:
      "Un video verticale pronto per Instagram, TikTok e WhatsApp, che mostra il tuo prodotto o il tuo locale come un grande brand.",
    include: [
      "Formato 9:16 per Reels, TikTok e Stories",
      "Idea, montaggio, testi e musica",
      "Versione con e senza audio",
      "Consegna in alta qualità, pronta da pubblicare",
    ],
    da: 99,
    video: { kind: "spot", slug: "saetta" },
    tempi: "Pronto in 3-5 giorni [DA CONFERMARE]",
    faqTitolo: "Domande sugli spot",
    faq: [
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
      "Si parte dalle foto che hai già, senza sopralluogo [DA CONFERMARE]",
      "Movimenti di camera fluidi stanza per stanza",
      "Versione verticale per i social e orizzontale per il sito",
      "Testi con metrature e punti di forza",
    ],
    da: 99,
    video: { kind: "walktour", slug: "attico" },
    tempi: "Pronto in 5-7 giorni [DA CONFERMARE]",
    faqTitolo: "Domande sui walk tour",
    faq: [
      {
        q: "Servono foto professionali?",
        a: "No. Bastano le foto dell'annuncio o quelle che hai già sul telefono.",
      },
      {
        q: "Va bene per un'agenzia immobiliare con tanti immobili?",
        a: "Sì. Ne parliamo nella consulenza gratuita e ti facciamo un prezzo su misura per il numero di immobili.",
      },
    ],
  },
];

export const automazioni = "Automazioni (recensioni, risposte, prenotazioni): su richiesta.";

export const euro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
