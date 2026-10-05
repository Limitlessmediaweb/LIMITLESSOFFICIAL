export type Prezzo = { voce: string; da: number; nota?: string };

export type Servizio = {
  id: "sito" | "spot" | "walktour";
  nome: string;
  /** Il beneficio, in una riga. */
  titolo: string;
  /** Cosa ottieni, per l'attività. */
  ottieni: string;
  include: string[];
  prezzi: Prezzo[];
  /** Video di sfondo (cartella/slug in public/media). */
  video: { kind: "spot" | "walktour" | "siti"; slug: string };
  tempi: string;
  /** Titolo della sezione FAQ del servizio. */
  faqTitolo: string;
  faq: { q: string; a: string }[];
};

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
      "Dominio e messa online inclusi [DA CONFERMARE]",
    ],
    prezzi: [
      { voce: "Sito classico", da: 700, nota: "[DA CONFERMARE]" },
      { voce: "Sito animato premium", da: 900, nota: "[DA CONFERMARE]" },
    ],
    video: { kind: "siti", slug: "nottea-desktop" },
    tempi: "Online in circa 7 giorni [DA CONFERMARE]",
    faqTitolo: "Domande sul sito",
    faq: [
      {
        q: "Il sito è mio?",
        a: "Sì. Dominio e contenuti sono tuoi. Se vuoi, lo aggiorniamo noi con la manutenzione da 29 € al mese. [DA CONFERMARE]",
      },
      {
        q: "Posso modificare i testi da solo?",
        a: "Per testi e foto ci scrivi su WhatsApp e li cambiamo noi. Se ti serve un pannello per gestirlo da solo, lo valutiamo insieme. [DA CONFERMARE]",
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
    prezzi: [
      { voce: "Spot singolo", da: 119, nota: "[DA CONFERMARE]" },
      { voce: "Lancio con 3 spot", da: 279, nota: "[DA CONFERMARE]" },
    ],
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
        a: "Sì, lo spot è tuo e puoi usarlo dove vuoi, anche nelle campagne sponsorizzate.",
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
    prezzi: [
      { voce: "Video per i social", da: 149, nota: "[DA CONFERMARE]" },
      { voce: "Tour completo", da: 590, nota: "[DA CONFERMARE]" },
    ],
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
        a: "Sì. Per più immobili prepariamo un prezzo a pacchetto. Scrivici quanti sono. [DA CONFERMARE]",
      },
    ],
  },
];

export const automazioni = "Automazioni (recensioni, risposte, prenotazioni): su richiesta.";

export const euro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
