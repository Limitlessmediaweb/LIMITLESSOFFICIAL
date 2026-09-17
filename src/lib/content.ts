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
  pec: "info@pec.limitlessmedia.it",
} as const;

// Single conversion CTA, reused everywhere (per brief: one CTA, same text,
// same style, always pointing to the contact form).
export const PRIMARY_CTA = "Scopri cosa possiamo fare per la tua attività";
export const SECONDARY_CTA = "Guarda i lavori";

export const NAV_LINKS = [
  { href: "/ristoranti", label: "Ristoranti" },
  { href: "/hotel", label: "Hotel" },
  { href: "/immobiliare", label: "Immobiliare" },
  { href: "/automazioni", label: "Automazioni" },
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

export type Automation = {
  slug: string;
  name: string;
  perChi: string;
  percheConviene: string;
  items: string[];
  demoImage: string;
  demoImageAlt: string;
};

export const AUTOMATIONS: Automation[] = [
  {
    slug: "recensioni",
    name: "Recensioni Automatiche",
    perChi: "Attività che fanno un buon lavoro ma non ricevono abbastanza recensioni Google.",
    percheConviene:
      "Ogni cliente soddisfatto riceve in automatico un invito a lasciare una recensione, senza che tu debba ricordartelo: più recensioni, più fiducia, più clienti nuovi.",
    items: [
      "Messaggio automatico personalizzato dopo il servizio",
      "Invio via email o WhatsApp",
      "Link diretto alla recensione Google",
    ],
    demoImage: "/media/automations/recensioni-whatsapp.png",
    demoImageAlt:
      "Esempio dimostrativo: messaggio WhatsApp automatico che chiede una recensione a 5 stelle dopo la visita",
  },
  {
    slug: "chat-ai",
    name: "Chat AI nel sito",
    perChi: "Attività il cui sito riceve visite fuori orario, quando nessuno può rispondere.",
    percheConviene:
      "Un assistente virtuale risponde subito alle domande base — orari, prezzi, disponibilità — 24 ore su 24, raccogliendo i contatti di chi è davvero interessato.",
    items: [
      "Widget di chat integrato nel sito",
      "Risposte personalizzate sulla tua attività",
      "Raccolta contatti automatica",
    ],
    demoImage: "/media/portfolio/mockup-nexora.png",
    demoImageAlt:
      "Esempio dimostrativo: widget di chat AI aperto sul sito, con un messaggio di benvenuto automatico",
  },
  {
    slug: "chiamate-perse",
    name: "Risposta Automatica a Chiamate Perse",
    perChi: "Attività che ricevono molte chiamate durante il lavoro e non riescono sempre a rispondere.",
    percheConviene:
      "Chi chiama e non trova risposta riceve subito un messaggio invece di restare nel silenzio: meno clienti persi verso la concorrenza.",
    items: [
      "SMS o WhatsApp automatico su chiamata persa",
      "Gestione base della richiesta",
      "Possibilità di prenotare direttamente",
    ],
    demoImage: "/media/automations/chiamata-persa.png",
    demoImageAlt:
      "Esempio dimostrativo: notifica di chiamata persa seguita da un messaggio automatico di risposta",
  },
  {
    slug: "follow-up",
    name: "Follow-up Automatico Preventivi/Lead",
    perChi: "Attività che mandano preventivi o informazioni e spesso non ricevono risposta.",
    percheConviene:
      "Un richiamo automatico e gentile dopo qualche giorno aumenta le probabilità che il cliente risponda, invece di sparire nel silenzio.",
    items: [
      "Sequenza di follow-up automatici",
      "Messaggi personalizzati sul contesto del preventivo",
      "Nessun lead dimenticato",
    ],
    demoImage: "/media/automations/follow-up-preventivo.png",
    demoImageAlt:
      "Esempio dimostrativo: email automatica di promemoria su un preventivo ancora disponibile",
  },
];

export type Pack = {
  slug: string;
  name: string;
  perChi: string;
  percheConviene: string;
  items: string[];
  /** How many AUTOMATIONS modules are included (undefined/0 = none, 4 = all). */
  automationSlots?: number;
  note?: string;
  featured?: boolean;
};

export const PACKS: Pack[] = [
  {
    slug: "presenza-base",
    name: "LIMITLESS PRESENZA BASE",
    perChi:
      "Attività che non ha ancora una presenza online seria, o che si affida solo a un profilo Google Business lasciato indietro.",
    percheConviene:
      "Parti con le basi giuste e un primo aiuto che lavora per te ogni giorno: un sito veloce e trovabile su Google, più un'automazione che recupera clienti che altrimenti perderesti. È il primo passo di un percorso che continuiamo a costruire insieme nel tempo.",
    items: [
      "Sito web o landing page su misura",
      "Ottimizzazione della scheda Google Business Profile",
      "1 automazione AI a scelta",
      "Modulo contatti e collegamento WhatsApp",
    ],
    automationSlots: 1,
  },
  {
    slug: "crescita",
    name: "LIMITLESS CRESCITA",
    perChi:
      "Attività già online che vuole affiancare al sito contenuti video e strumenti che lavorano anche quando tu non puoi.",
    percheConviene:
      "Non aggiungi solo contenuti, aggiungi tempo: mentre sito e video portano visibilità, le automazioni si occupano di recensioni, chiamate perse o lead da ricontattare. Ti seguiamo passo passo mentre l'attività cresce, non solo al lancio.",
    items: [
      "Sito web completo su misura",
      "Video promo o tour (a scelta)",
      "2 automazioni AI a scelta",
      "Contenuti riformattati anche per i social",
    ],
    automationSlots: 2,
    featured: true,
  },
  {
    slug: "identita-completa",
    name: "LIMITLESS IDENTITÀ COMPLETA",
    perChi:
      "Attività strutturate che vogliono una presenza digitale completa — sito, video e automazioni — senza doverci più pensare.",
    percheConviene:
      "Hai un partner unico che si occupa di tutto: dal primo contatto alla recensione finale, ogni fase del rapporto con il cliente è coperta, con assistenza prioritaria quando ne hai bisogno.",
    items: [
      "Sito web premium multi-sezione",
      "Video walk tour",
      "Video ads",
      "Tutte le automazioni AI incluse",
      "Assistenza prioritaria",
    ],
    automationSlots: 4,
  },
  {
    slug: "social",
    name: "LIMITLESS CONTENUTI SOCIAL",
    perChi: "Attività che vive soprattutto sui social e ha bisogno di contenuti pensati per quel formato.",
    percheConviene:
      "Contenuti tagliati, montati e ritmati per come si guardano davvero i social, non adattamenti last-minute di altri video.",
    items: ["Contenuti video studiati appositamente per una presenza social ottimale"],
    note: "Formula ancora in definizione — i dettagli si affinano insieme a te in consulenza.",
  },
  {
    slug: "custom",
    name: "LIMITLESS PERSONALIZZATO",
    perChi: "Chi ha esigenze specifiche che non rientrano perfettamente negli altri pacchetti.",
    percheConviene:
      "Paghi solo quello che ti serve davvero, costruito insieme a noi partendo dal tuo obiettivo — un rapporto che continua a evolversi con la tua attività, non un pacchetto chiuso.",
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
  {
    slug: "lago-resort",
    title: "Lago Resort",
    sector: "Hotel",
    location: "Lago di Como",
    isConcept: true,
    image: "/media/portfolio/mockup-lago-resort.png",
    imageAlt:
      "Sito web per un resort sul lago con prenotazione camere, mostrato su laptop con vista lago e montagne",
    prima:
      "Una struttura come Lago Resort, senza un sito diretto forte, dipende quasi interamente dai portali di prenotazione: margini ridotti dalle commissioni e nessuna relazione diretta con l'ospite prima dell'arrivo.",
    intervento:
      "Abbiamo progettato un sito con booking diretto, presentazione delle camere e dei servizi (spa, ristorante gourmet, concierge) e un video walk tour della suite per far vivere l'atmosfera prima ancora della prenotazione.",
    dopo:
      "Un sito che vende l'esperienza, non solo la camera: prenotazioni dirette, meno dipendenza dalle OTA, prima impressione all'altezza del soggiorno.",
    services: ["Sito web", "Video walk tour", "Booking diretto"],
  },
  {
    slug: "nexora",
    title: "Nexora",
    sector: "Azienda tech / AI",
    location: "Italia",
    isConcept: true,
    image: "/media/portfolio/mockup-nexora.png",
    imageAlt:
      "Sito web per l'azienda tech Nexora con widget di chat AI integrato, mostrato su laptop",
    prima:
      "Un'azienda tech come Nexora, senza un modo per rispondere subito ai visitatori del sito, perde lead che arrivano fuori orario o che vogliono una risposta immediata prima di lasciare una richiesta demo.",
    intervento:
      "Abbiamo realizzato un sito dal design curato con una chat AI integrata, pensata per rispondere alle domande base sui prodotti e raccogliere i contatti di chi è davvero interessato — la stessa automazione descritta nella sezione Automazioni AI.",
    dopo:
      "Un sito che qualifica i lead 24 ore su 24, anche quando il team commerciale non è disponibile.",
    services: ["Sito web", "Chat AI integrata"],
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
  /** Optional standalone walk-tour video shown on the vertical page. */
  walkTour?: { src: string; poster: string; label: string; isConcept: boolean };
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
      {
        title: "Recensioni automatiche",
        desc: "Dopo ogni cena, un invito automatico a lasciare una recensione Google — vedi le Automazioni AI.",
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
      {
        title: "Chat AI nel sito",
        desc: "Risponde su disponibilità e prezzi fuori orario reception — vedi le Automazioni AI.",
      },
    ],
    caseStudySlugs: ["lago-resort"],
    walkTour: {
      src: "/media/video/hotel-suite-tour.mp4",
      poster: "/media/video/hotel-suite-tour-poster.jpg",
      label: "Suite con vista lago — Lago Resort (progetto concept)",
      isConcept: true,
    },
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
      {
        title: "Follow-up automatico dei lead",
        desc: "Chi chiede informazioni su un immobile viene ricontattato in automatico se non risponde — vedi le Automazioni AI.",
      },
    ],
    caseStudySlugs: [],
    walkTour: {
      src: "/media/video/villa-lounge-tour.mp4",
      poster: "/media/video/villa-lounge-tour-poster.jpg",
      label: "Soggiorno vista mare — progetto concept",
      isConcept: true,
    },
  },
];
