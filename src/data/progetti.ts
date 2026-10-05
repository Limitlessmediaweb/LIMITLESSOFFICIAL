/**
 * Tutti i lavori mostrati nel sito.
 *
 * Per aggiungere un lavoro:
 *  1. metti il video in materiali/spot/<slug>.mp4 (o materiali/walktour/<slug>.mp4)
 *  2. aggiungi qui una voce con lo stesso slug
 *  3. lancia `npm run media` (e `npm run media:siti` se ha un sito live)
 * Se il video non c'è ancora, il sito lo salta senza errori.
 *
 * I testi tra [DA COMPLETARE] / [DA CONFERMARE] vengono evidenziati in sviluppo
 * ed elencati da `npm run check:placeholders`.
 */

export type TipoLavoro = "sito-spot" | "spot" | "walktour";

export type Progetto = {
  slug: string;
  nome: string;
  tipo: TipoLavoro;
  settore: string;
  /** Una riga: l'idea. */
  frase: string;
  /** Solo Sito + Spot: l'idea in 3 righe, per la pagina progetto. */
  idea?: [string, string, string];
  /** Solo Sito + Spot: URL del sito live. */
  sitoUrl?: string;
  /** Brand o attività inventati da LIMITLESS. */
  concept: boolean;
};

export const progetti: Progetto[] = [
  // ── Sito + Spot (in ordine di apparizione) ──────────────────────────────
  {
    slug: "nottea",
    nome: "NÒTTEA",
    tipo: "sito-spot",
    settore: "Profumi di lusso",
    frase: "Un profumo che nasce di notte: sito e spot da brand di lusso.",
    idea: [
      "Un profumo deve farsi sentire prima ancora di aprire la boccetta.",
      "Il sito racconta le note una alla volta, come una notte che si accende.",
      "Lo spot porta la stessa atmosfera su Instagram e TikTok.",
    ],
    sitoUrl: "https://nottea.vercel.app/",
    concept: true,
  },
  {
    slug: "ordito",
    nome: "ORDITO",
    tipo: "sito-spot",
    settore: "Abbigliamento tecnico-urbano",
    frase: "“Ogni capo inizia da un filo”: la giacca si scompone allo scroll e mostra come è fatta.",
    idea: [
      "Un capo tecnico si vende spiegando com'è fatto.",
      "Scorrendo, la giacca si apre strato per strato.",
      "Chi guarda capisce la qualità senza leggere una scheda tecnica.",
    ],
    sitoUrl: "https://ordito-flame.vercel.app/",
    concept: true,
  },
  {
    slug: "osteria-del-borgo",
    nome: "Osteria del Borgo",
    tipo: "sito-spot",
    settore: "Ristorazione",
    frase: "Un'osteria di paese con un sito che fa venire fame. [DA CONFERMARE]",
    idea: [
      "Chi cerca dove mangiare decide in pochi secondi, dal telefono.",
      "Menù con i prezzi, foto dei piatti e prenotazione a portata di pollice.",
      "Lo spot mostra il risultato: più tavoli prenotati. [DA CONFERMARE]",
    ],
    sitoUrl: "https://osteria-del-borgo-virid.vercel.app/",
    concept: true,
  },
  {
    slug: "volta",
    nome: "VOLTA",
    tipo: "sito-spot",
    settore: "Elettricista e domotica",
    frase: "Anche un elettricista può avere un sito che si ricorda. [DA CONFERMARE]",
    idea: [
      "Gli artigiani hanno spesso siti tutti uguali, o nessun sito.",
      "VOLTA accende la casa stanza per stanza e spiega ogni servizio.",
      "Il cliente capisce cosa fai e ti chiama. [DA CONFERMARE]",
    ],
    sitoUrl: "https://volta-puce.vercel.app/",
    concept: true,
  },
  {
    slug: "flusso",
    nome: "FLUSSO",
    tipo: "sito-spot",
    settore: "Idraulico",
    frase: "Un idraulico con un sito da brand: chiaro, veloce, fatto per farsi chiamare. [DA CONFERMARE]",
    idea: [
      "Quando si rompe un tubo, nessuno ha tempo di leggere.",
      "FLUSSO segue il percorso dell'acqua e porta dritto al pulsante per chiamare.",
      "Chiaro su telefono, curato su desktop. [DA CONFERMARE]",
    ],
    sitoUrl: "https://flusso-six.vercel.app/",
    concept: true,
  },

  // ── Spot e video promo ──────────────────────────────────────────────────
  { slug: "meridia", nome: "Meridia", tipo: "spot", settore: "Orologi", frase: "[DA COMPLETARE]", concept: true },
  { slug: "saetta", nome: "Saetta", tipo: "spot", settore: "Cerchi racing", frase: "[DA COMPLETARE]", concept: true },
  {
    slug: "villa-lume",
    nome: "Villa Lume",
    tipo: "spot",
    settore: "Immobiliare",
    frase: "Da planimetria a casa, dal giorno alla notte.",
    concept: true,
  },
  { slug: "versante", nome: "Versante", tipo: "spot", settore: "Vino", frase: "[DA COMPLETARE]", concept: true },
  { slug: "casco", nome: "Casco", tipo: "spot", settore: "Moto [DA CONFERMARE: nome]", frase: "[DA COMPLETARE]", concept: true },
  {
    slug: "limitless-da-zero",
    nome: "Limitless da zero",
    tipo: "spot",
    settore: "Siti web",
    frase: "[DA COMPLETARE]",
    concept: true,
  },

  // ── Video walk tour ─────────────────────────────────────────────────────
  { slug: "attico", nome: "Attico", tipo: "walktour", settore: "Appartamento", frase: "[DA COMPLETARE]", concept: true },
  { slug: "villa-chiara", nome: "Villa Chiara", tipo: "walktour", settore: "Villa", frase: "[DA COMPLETARE]", concept: true },
  { slug: "camera-hotel", nome: "Camera hotel", tipo: "walktour", settore: "Hotel", frase: "[DA COMPLETARE]", concept: true },
  {
    slug: "location-eventi",
    nome: "Location eventi",
    tipo: "walktour",
    settore: "Location per eventi",
    frase: "[DA COMPLETARE]",
    concept: true,
  },
];

export const sitoSpot = progetti.filter((p) => p.tipo === "sito-spot");
export const getProgetto = (slug: string) => progetti.find((p) => p.slug === slug);
