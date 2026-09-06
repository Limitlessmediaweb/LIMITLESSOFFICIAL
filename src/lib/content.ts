// Central content store — real business data and copy for LIMITLESS.
// Keeping copy here (rather than scattered in components) makes it easy to
// keep the single sitewide CTA and the legal/contact data consistent.

export const BUSINESS = {
  legalName: "LIMITLESS di Riccardo Pasquini",
  brand: "LIMITLESS",
  piva: "03051470189",
  regime: "Regime forfettario",
  city: "Miradolo Terme (PV)",
  areaServed: "disponibile online in tutta Italia",
  email: "limitlessmediaweb@gmail.com",
  phone: "+39 339 795 8873",
  phoneHref: "+393397958873",
  // Not yet available — flagged clearly so it's easy to find and replace.
  pec: "[PEC-DA-INSERIRE]",
} as const;

// Single conversion CTA, reused everywhere (per brief: one CTA, same text,
// same style, always pointing to the contact form).
export const PRIMARY_CTA = "Scopri cosa possiamo fare per la tua attività";
export const SECONDARY_CTA = "Guarda i lavori";

export const NAV_LINKS = [
  { href: "/ristoranti", label: "Ristoranti" },
  { href: "/hotel", label: "Hotel" },
  { href: "/immobiliare", label: "Immobiliare" },
  { href: "/lavori", label: "Lavori" },
  { href: "/pacchetti", label: "Pacchetti" },
  { href: "/chi-siamo", label: "Chi siamo" },
];

export const FOOTER_LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookie", label: "Cookie Policy" },
  { href: "/termini", label: "Termini di Servizio" },
];

export type Service = {
  icon: "globe" | "video" | "megaphone" | "share2";
  title: string;
  desc: string;
};

export const SERVICES: Service[] = [
  {
    icon: "globe",
    title: "Siti web",
    desc: "Siti e landing page su misura, veloci e ottimizzati per mobile, pensati per trasformare i visitatori in clienti.",
  },
  {
    icon: "video",
    title: "Video tour",
    desc: "Walk tour immersivi dei tuoi spazi: fai entrare i clienti nel tuo locale o immobile prima ancora della visita.",
  },
  {
    icon: "megaphone",
    title: "Video ads",
    desc: "Spot brevi e d'impatto per promuovere prodotti e servizi, pronti per campagne e social.",
  },
  {
    icon: "share2",
    title: "Contenuti multicanale",
    desc: "Ogni contenuto viene riformattato per sito, social e ads: una presenza completa ovunque.",
  },
];

export type ProcessStep = { n: string; t: string; d: string };

export const PROCESS_STEPS: ProcessStep[] = [
  {
    n: "01",
    t: "Brief",
    d: "Capiamo la tua attività, il tuo pubblico, i tuoi obiettivi.",
  },
  {
    n: "02",
    t: "Progettazione",
    d: "Disegniamo struttura e stile di sito e contenuti.",
  },
  {
    n: "03",
    t: "Realizzazione",
    d: "Costruiamo tutto con un workflow pensato per garantire il meglio tra design e qualità.",
  },
  {
    n: "04",
    t: "Consegna",
    d: "Il tuo sito e i tuoi contenuti, pronti e testati per il web.",
  },
];

export type Pack = {
  slug: string;
  name: string;
  perChi: string;
  percheConviene: string;
  items: string[];
  featured?: boolean;
};

export const PACKS: Pack[] = [
  {
    slug: "start",
    name: "LIMITLESS START",
    perChi:
      "Attività che non ha ancora una presenza online seria, o ha un sito vecchio che non porta clienti.",
    percheConviene:
      "Hai subito uno strumento che lavora per te: un sito veloce, trovabile su Google e ottimizzato da mobile, più contenuti video che fanno vedere davvero cosa offri, non solo raccontarlo.",
    items: [
      "Sito web o landing page su misura",
      "2 video promo o tour",
      "Ottimizzazione mobile e velocità",
      "Modulo contatti e collegamento WhatsApp",
    ],
  },
  {
    slug: "pro",
    name: "LIMITLESS PRO",
    perChi:
      "Attività già online che vuole una presenza completa, capace di reggere il passo con la crescita del business.",
    percheConviene:
      "Non hai solo un sito, ma un sistema di contenuti coerente: lo stesso materiale video lavora sul sito e sui social, moltiplicando i punti di contatto con i clienti senza moltiplicare lo sforzo.",
    items: [
      "Sito web completo su misura",
      "4 video promo o tour",
      "Contenuti riformattati anche per i social",
    ],
    featured: true,
  },
  {
    slug: "all-in",
    name: "LIMITLESS ALL-IN",
    perChi:
      "Attività strutturate (ristoranti, hotel, immobiliari) che vogliono gestire tutto — sito, prenotazioni, contenuti — con un unico interlocutore.",
    percheConviene:
      "Riduci l'attrito tra un cliente interessato e una prenotazione confermata: sito multi-sezione, prenotazione integrata e video che raccontano ogni aspetto della tua attività.",
    items: [
      "Sito web completo e multi-sezione con prenotazione",
      "6 video promo o tour",
      "Contenuti riformattati anche per i social",
    ],
  },
  {
    slug: "video-media",
    name: "LIMITLESS VIDEO & MEDIA",
    perChi:
      "Chi ha già un sito funzionante ma non ha ancora contenuti video all'altezza, o ha bisogno di produzione continuativa.",
    percheConviene:
      "Il video è oggi il contenuto che converte di più: ottieni materiale professionale, curato in montaggio, colore e sonoro, pronto per essere usato ovunque serva.",
    items: [
      "Video singoli o serie di contenuti",
      "Montaggio, color e sound design",
      "Collaborazioni continuative con agenzie",
    ],
  },
  {
    slug: "social",
    name: "LIMITLESS SOCIAL",
    perChi: "Attività che vive soprattutto sui social e ha bisogno di contenuti pensati per quel formato.",
    percheConviene:
      "Contenuti tagliati, montati e ritmati per come si guardano davvero i social, non adattamenti last-minute di altri video.",
    items: ["Contenuti video studiati appositamente per una presenza social ottimale"],
  },
  {
    slug: "custom",
    name: "LIMITLESS CUSTOM",
    perChi: "Chi ha esigenze specifiche che non rientrano perfettamente negli altri pacchetti.",
    percheConviene:
      "Paghi solo quello che ti serve davvero, costruito insieme a noi partendo dal tuo obiettivo, non da un listino fisso.",
    items: ["Componiamo il tuo pacchetto su misura: scegli tu cosa includere e ci accordiamo."],
  },
];

export type CaseStudy = {
  slug: string;
  title: string;
  sector: string;
  location: string;
  isConcept: boolean;
  image: string;
  imageAlt: string;
  prima: string;
  intervento: string;
  dopo: string;
  services: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "bellezza",
    title: "Bellezza",
    sector: "Centro estetico",
    location: "Pavia",
    isConcept: true,
    image: "/media/portfolio/mockup-bellezza.jpg",
    imageAlt:
      "Sito web per centro estetico Bellezza a Pavia, mostrato su desktop e smartphone",
    prima:
      "Un centro estetico come Bellezza, tipicamente, si affida a un profilo social e a un sito vetrina generico: poche foto, nessuna prenotazione online, difficile da trovare su Google per chi cerca trattamenti nella zona.",
    intervento:
      "Abbiamo progettato un sito su misura con presentazione dei trattamenti, galleria fotografica professionale e un percorso chiaro verso il contatto diretto, ottimizzato per la ricerca mobile.",
    dopo:
      "Il risultato è una presenza online che comunica la qualità del centro prima ancora che la cliente varchi la porta — coerente, veloce, facile da consultare da smartphone.",
    services: ["Sito web", "Contenuti fotografici"],
  },
  {
    slug: "da-mario",
    title: "Da Mario",
    sector: "Ristorante",
    location: "Italia",
    isConcept: true,
    image: "/media/portfolio/mockup-damario.jpg",
    imageAlt:
      "Sito web per ristorante Da Mario con prenotazione tavolo, mostrato su laptop e smartphone",
    prima:
      "Un ristorante come Da Mario, senza una presenza digitale curata, si affida spesso solo al passaparola e alle chiamate telefoniche per le prenotazioni, perdendo clienti che decidono dove mangiare guardando prima il sito o i social.",
    intervento:
      "Abbiamo costruito un sito con menù digitale sempre aggiornato e prenotazione tavolo integrata, pensato per essere consultato mentre si decide dove andare a cena.",
    dopo:
      "Un sito che lavora anche quando il ristorante è pieno di lavoro: mostra il menù, racconta l'atmosfera e raccoglie prenotazioni senza passare dal telefono.",
    services: ["Sito web", "Prenotazione integrata"],
  },
  {
    slug: "da-riccardo",
    title: "Da Riccardo",
    sector: "Ristorante",
    location: "Roma",
    isConcept: true,
    image: "/media/portfolio/mockup-dariccardo.jpg",
    imageAlt:
      "Sito web per ristorante Da Riccardo a Roma con il menù, mostrato su desktop e smartphone",
    prima:
      "Un ristorante a Roma come Da Riccardo compete in una delle piazze più affollate d'Italia: senza un sito che si distingua, il rischio è restare invisibile tra decine di alternative a pochi metri di distanza.",
    intervento:
      "Abbiamo realizzato un sito con identità visiva curata, menù ben presentato e struttura pensata per convertire la visita al sito in una prenotazione o in una telefonata.",
    dopo:
      "Un'identità digitale che tiene il passo con la qualità della cucina, pensata per farsi notare in un mercato molto competitivo.",
    services: ["Sito web", "Identità visiva"],
  },
];

export const SOCIAL_PROOF = {
  areaServed: "Disponibile online in tutta Italia, base a Miradolo Terme (PV)",
  responseTime: "Rispondiamo in tempi brevi",
  freeConsult: "Consulenza e preventivo sempre gratuiti",
};

export type Vertical = {
  slug: "ristoranti" | "hotel" | "immobiliare";
  label: string;
  heroTitle: string;
  heroSub: string;
  problem: string;
  solution: { title: string; desc: string }[];
  caseStudySlugs: string[];
};

export const VERTICALS: Vertical[] = [
  {
    slug: "ristoranti",
    label: "Ristoranti",
    heroTitle: "Il cliente decide dove mangiare prima ancora di arrivare",
    heroSub:
      "Menu digitale, prenotazione tavolo integrata e video walk tour della sala: tutto quello che serve per farti scegliere prima ancora della visita.",
    problem:
      "Chi cerca un posto dove mangiare guarda prima le foto e i video online. Un sito lento, senza immagini curate e senza prenotazione integrata, perde clienti prima ancora che entrino.",
    solution: [
      {
        title: "Menu digitale sempre aggiornato",
        desc: "Niente più PDF illeggibili da smartphone: un menù chiaro, veloce da consultare.",
      },
      {
        title: "Prenotazione tavolo integrata",
        desc: "Il cliente prenota direttamente dal sito, senza dover telefonare.",
      },
      {
        title: "Video walk tour della sala",
        desc: "Fai vedere l'atmosfera del locale prima ancora che il cliente arrivi.",
      },
      {
        title: "Foto professionali dei piatti",
        desc: "Le immagini giuste vendono il piatto prima ancora che venga assaggiato.",
      },
    ],
    caseStudySlugs: ["da-mario", "da-riccardo"],
  },
  {
    slug: "hotel",
    label: "Hotel",
    heroTitle: "Fai scegliere la tua struttura prima delle OTA",
    heroSub:
      "Video walk tour delle camere, booking diretto e gallery immersiva: riduci la dipendenza dai portali e porta le prenotazioni sul tuo sito.",
    problem:
      "Le OTA (Booking, Airbnb) prendono commissioni su ogni prenotazione e mostrano la tua struttura insieme a decine di concorrenti. Un sito diretto forte è l'unico modo per recuperare margine e relazione con l'ospite.",
    solution: [
      {
        title: "Video walk tour delle camere",
        desc: "Ogni tipologia di camera raccontata in video, non solo in foto statiche.",
      },
      {
        title: "Booking diretto",
        desc: "Un percorso di prenotazione chiaro che riduce la dipendenza dalle OTA.",
      },
      {
        title: "Gallery immersiva",
        desc: "Spazi comuni, camere e servizi mostrati con qualità da vera struttura premium.",
      },
      {
        title: "Sito multilingua",
        desc: "Pronto ad accogliere anche gli ospiti internazionali, quando serve.",
      },
    ],
    caseStudySlugs: ["bellezza"],
  },
  {
    slug: "immobiliare",
    label: "Immobiliare",
    heroTitle: "L'immobile visitato online, prima della visita fisica",
    heroSub:
      "Walk tour di più immobili, cataloghi digitali per l'agenzia e pacchetti pensati per collaborazioni continuative.",
    problem:
      "Un annuncio con poche foto statiche fa perdere tempo ad agenti e clienti: chi visita di persona un immobile che online sembrava diverso è una visita sprecata per tutti.",
    solution: [
      {
        title: "Walk tour di più immobili",
        desc: "Ogni immobile raccontato con un video tour che riduce le visite a vuoto.",
      },
      {
        title: "Cataloghi digitali per l'agenzia",
        desc: "Materiale professionale da condividere con i clienti, coerente su ogni immobile.",
      },
      {
        title: "L'immobile “visitato” online",
        desc: "Il cliente arriva alla visita fisica già convinto, con aspettative reali.",
      },
      {
        title: "Pacchetti multi-immobile",
        desc: "Collaborazioni continuative pensate per agenzie con più immobili da presentare.",
      },
    ],
    caseStudySlugs: ["da-riccardo", "bellezza"],
  },
];
