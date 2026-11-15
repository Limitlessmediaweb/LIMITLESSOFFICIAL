import { HUB_DA } from "@/data/hub";
import { SITO_DA, SPOT_LANCIO, SPOT_NOTA } from "@/data/servizi";

/**
 * Pagine SERVIZIO + SETTORE (bozze del 16/11/2026, da approvare da Riccardo).
 * Finché `pubblica` è false la pagina ha noindex e non entra nella sitemap.
 * Regole: testo diverso per ogni pagina (niente copia-incolla con la sola città cambiata),
 * un caso vero, un pulsante WhatsApp, prezzi solo «da», mai nominare strumenti.
 */
export type Settore = {
  slug: string;
  pubblica: boolean;
  /** Title ≤ 60 caratteri. */
  title: string;
  /** Description ≤ 155 caratteri. */
  description: string;
  etichetta: string;
  h1: string;
  intro: string;
  /** I problemi che il cliente riconosce. */
  problemi: string[];
  /** Cosa facciamo, in 3-4 punti. */
  cosa: { t: string; d: string }[];
  caso: { titolo: string; testo: string; concept: boolean; link?: string };
  prezzo: { da: number; unita?: string; nota?: string };
  zona: string;
  faq: { q: string; a: string }[];
  sezioneWa: string;
};

export const settori: Settore[] = [
  {
    slug: "gestionale-manutenzione-caldaie-pavia",
    pubblica: false,
    title: "Gestionale manutenzione caldaie | Pavia, Lodi, Piacenza",
    description:
      "Gestionale per installatori, termoidraulici e manutentori di caldaie: interventi, rapportini, scadenze e clienti dal telefono. Pavia, Lodi, Piacenza.",
    etichetta: "Gestionale · Installatori e manutentori",
    h1: "Il gestionale per chi installa e fa manutenzione di caldaie.",
    intro:
      "Scadenze dei controlli, rapportini scritti a mano, chiamate dei clienti che chiedono «quando passate?». Mettiamo tutto in un posto solo, che i tecnici aprono dal telefono.",
    problemi: [
      "Le manutenzioni annuali scadono e te ne accorgi quando chiama il cliente.",
      "I rapportini arrivano in ufficio giorni dopo, a volte illeggibili.",
      "Non sai al volo chi dei tecnici è dove, e cosa gli manca in furgone.",
      "Preparare le fatture vuol dire rimettere insieme fogli, foto e messaggi.",
    ],
    cosa: [
      { t: "Impianti e scadenze", d: "Ogni cliente con il suo impianto, lo storico degli interventi e la prossima manutenzione: l'elenco di chi richiamare è pronto ogni mese." },
      { t: "Rapportino dal telefono", d: "Il tecnico chiude l'intervento sul posto con foto, materiali e firma del cliente. In ufficio lo vedi subito." },
      { t: "Agenda della squadra", d: "Chi va dove, oggi e domani, con l'indirizzo già pronto per il navigatore." },
      { t: "Pronto per fatturare", d: "Gli interventi chiusi finiscono in un elenco «da fatturare», senza ricopiare niente." },
    ],
    caso: {
      titolo: "[DA COMPLETARE: caso vero di un'azienda di impianti, con il suo permesso a nominarla]",
      testo:
        "Un'azienda di impianti della zona usa l'HUB per ordini, lavori e squadra: dal foglio sul bancone alla schermata sul telefono di ognuno. [DA COMPLETARE: 2 numeri prima/dopo, es. ore risparmiate a settimana]",
      concept: false,
    },
    prezzo: { da: HUB_DA, unita: "/mese", nota: "pacchetti in base al numero di persone, senza costi per utente" },
    zona: "Lavoriamo di persona tra Pavia, Lodi, Piacenza e Milano sud: veniamo in azienda per la demo e per la partenza.",
    faq: [
      { q: "Funziona anche se i tecnici non sono pratici di computer?", a: "Sì: dal telefono vedono solo i loro interventi e chiudono il rapportino con pochi tocchi. Alla partenza lo proviamo insieme a loro." },
      { q: "Posso tenere i dati che ho già su Excel?", a: "Sì, li importiamo noi: clienti, impianti e scadenze ripartono da lì." },
      { q: "Quanto ci vuole per partire?", a: "Dipende da quante cose servono. Nella demo di 10 minuti ti diciamo tempi e prezzo precisi." },
    ],
    sezioneWa: "Gestionale per caldaie e impianti",
  },
  {
    slug: "video-cantine-oltrepo-pavese",
    pubblica: false,
    title: "Video e spot per cantine dell'Oltrepò Pavese",
    description:
      "Spot verticali per cantine dell'Oltrepò Pavese: vendemmia, bottiglia, territorio. Pensati per Instagram, TikTok e annunci, consegnati pronti da pubblicare.",
    etichetta: "Video e spot · Cantine",
    h1: "Spot per le cantine dell'Oltrepò, fatti per essere guardati fino alla fine.",
    intro:
      "Il vino si vende con quello che succede prima del bicchiere: le vigne, le mani, la cantina. Lo raccontiamo in 20-30 secondi verticali, pronti per Instagram, TikTok e gli annunci.",
    problemi: [
      "Le foto delle bottiglie sono belle, ma sul telefono scorrono via in un attimo.",
      "I video girati in vendemmia restano nel telefono e nessuno li monta.",
      "Per Natale, fiere e cantine aperte serve qualcosa di nuovo da pubblicare.",
    ],
    cosa: [
      { t: "Primi 2 secondi", d: "Si capisce subito di chi è il vino e perché fermarsi a guardare." },
      { t: "Territorio vero", d: "Vigne, cantina e persone: il vostro Oltrepò, non immagini di repertorio." },
      { t: "Pronto da pubblicare", d: "Formato verticale, sottotitoli e versione per gli annunci, con 2 revisioni comprese." },
    ],
    caso: {
      titolo: "Tenuta Ombralta · Il regalo di Natale di una cantina",
      testo:
        "Spot di Natale per una cantina: botti in penombra, grappoli e un calice di rosso, con la bottiglia come regalo nei primi secondi. [DA COMPLETARE: sostituire con una cantina vera appena c'è un lavoro consegnato]",
      concept: true,
    },
    prezzo: { da: SPOT_LANCIO, nota: SPOT_NOTA },
    zona: "Giriamo in cantina in tutto l'Oltrepò Pavese, da Casteggio a Santa Maria della Versa, e nelle zone vicine di Piacenza e Lodi.",
    faq: [
      { q: "Dovete venire in cantina?", a: "Di solito sì, per riprendere vigne, cantina e persone. Se avete già del materiale buono, possiamo partire da quello." },
      { q: "Lo spot va bene anche per gli annunci?", a: "Sì: lo consegniamo nel formato verticale per Instagram, TikTok e annunci, con la frase finale che dice cosa fare." },
      { q: "In quanto tempo è pronto?", a: "Dipende dal periodo e dalle riprese. Te lo diciamo nel preventivo, prima di partire." },
    ],
    sezioneWa: "Video per cantine",
  },
  {
    slug: "video-tour-agenzie-immobiliari",
    pubblica: false,
    title: "Video tour per agenzie immobiliari | Pavia e Milano sud",
    description:
      "Video tour verticali degli immobili per agenzie di Pavia e Milano sud: la casa stanza per stanza, pronta per portali, Instagram e WhatsApp ai clienti.",
    etichetta: "Video tour · Agenzie immobiliari",
    h1: "Video tour degli immobili: la visita arriva prima della visita.",
    intro:
      "Chi cerca casa guarda gli annunci dal telefono, la sera. Un video tour verticale mostra come si passa da una stanza all'altra, la luce e gli spazi: arrivano meno visite inutili e più clienti già convinti.",
    problemi: [
      "Tante visite a vuoto, perché le foto non fanno capire gli spazi.",
      "Gli annunci si somigliano tutti e il proprietario vuole vedere impegno.",
      "Sui social non c'è niente da pubblicare tra un'acquisizione e l'altra.",
    ],
    cosa: [
      { t: "La casa stanza per stanza", d: "Un percorso continuo, come se si entrasse dalla porta: si capisce com'è fatta davvero." },
      { t: "Per portali e social", d: "Versione verticale per Instagram, TikTok e WhatsApp, e orizzontale per i portali." },
      { t: "Da mostrare al proprietario", d: "Un video curato aiuta anche ad acquisire l'incarico: è la prova di come venderete la sua casa." },
    ],
    caso: {
      titolo: "Villa Lume · Da planimetria a casa, dal giorno alla notte",
      testo:
        "Video di un immobile che passa dalla planimetria agli ambienti, con la luce del giorno e della sera. [DA COMPLETARE: sostituire con un immobile vero di un'agenzia, con il suo permesso]",
      concept: true,
    },
    prezzo: { da: 190, nota: "per un appartamento; strutture e tour completi in base agli ambienti" },
    zona: "Giriamo a Pavia, nel Pavese e a Milano sud (Rozzano, Opera, Binasco, Lacchiarella) e, su richiesta, a Lodi e Piacenza.",
    faq: [
      { q: "Quanto dura il video?", a: "Di solito da 30 a 60 secondi per i social, più una versione lunga se serve per il portale." },
      { q: "Serve la casa vuota?", a: "No, ma in ordine. Prima delle riprese ti mandiamo una lista di cose da sistemare." },
      { q: "Fate anche più immobili al mese?", a: "Sì: per le agenzie con più incarichi prepariamo un prezzo a pacchetto nel preventivo." },
    ],
    sezioneWa: "Video tour per agenzie immobiliari",
  },
  {
    slug: "siti-web-attivita-locali-pavia",
    pubblica: false,
    title: "Siti web per attività locali a Pavia, Lodi e Piacenza",
    description:
      "Siti per ristoranti, negozi, studi e artigiani di Pavia, Lodi e Piacenza: veloci dal telefono, con WhatsApp, chiamata, mappa e testi per farsi trovare.",
    etichetta: "Siti web · Attività locali",
    h1: "Siti per attività locali: chi ti cerca ti trova, e ti chiama.",
    intro:
      "Ristoranti, negozi, studi, artigiani: il cliente ti cerca su Google dal telefono e decide in pochi secondi. Il sito deve dire subito cosa fai, dove sei e come contattarti.",
    problemi: [
      "Il sito è vecchio, lento o non si legge dal telefono.",
      "C'è solo la pagina Facebook, e su Google compari dopo i concorrenti.",
      "Le persone chiamano per chiedere cose che potrebbero leggere: orari, prezzi, menù.",
    ],
    cosa: [
      { t: "Pensato per il telefono", d: "Si apre veloce e il pulsante per WhatsApp o per chiamare è sempre a portata di pollice." },
      { t: "Testi per Google", d: "Le parole che i clienti cercano davvero nella tua zona, scritte per persone e non per robot." },
      { t: "Scheda Google collegata", d: "Sito e scheda Google dicono le stesse cose: orari, indirizzo, servizi e recensioni." },
    ],
    caso: {
      titolo: "Meccanica Quotazero · Ogni pezzo, al suo posto",
      testo:
        "Il sito di un'officina di precisione: scorrendo, un mandrino si smonta pezzo per pezzo e mostra cosa sanno fare. Sito dimostrativo, per far vedere come si racconta un lavoro tecnico.",
      concept: true,
      link: "https://quotazero-demo.vercel.app",
    },
    prezzo: { da: SITO_DA, nota: "manutenzione a parte, da 19 €/mese" },
    zona: "Siamo in provincia di Pavia e lavoriamo con attività di Pavia, Lodi, Piacenza e Milano sud; per i siti anche online in tutta Italia.",
    faq: [
      { q: "In quanto tempo è online?", a: "Dipende da quante pagine servono e da quando ci mandi testi e foto. Te lo diciamo nel preventivo." },
      { q: "Posso modificare io orari e prezzi?", a: "Sì, oppure lo facciamo noi con la manutenzione: scegli tu." },
      { q: "Mi aiutate anche con la scheda Google?", a: "Sì: la sistemiamo insieme al sito, con le stesse informazioni." },
    ],
    sezioneWa: "Siti per attività locali",
  },
];

export const getSettore = (slug: string) => settori.find((s) => s.slug === slug);
