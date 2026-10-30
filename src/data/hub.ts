import type { MediaSource } from "@/lib/media";
import { waLink } from "@/data/azienda";

/**
 * LIMITLESS HUB: unica fonte per la pagina /hub e il blocco in home.
 * Impostazione del 26/10 (_CONTROLLO/LISTINO-E-REGOLE.md, DECISIONI HUB 26/10):
 * gestionale su misura per qualsiasi attività, pacchetti senza prezzo singolo, solo «da 190 €/mese»,
 * pacchetto Su misura a preventivo, tablet su richiesta, demo di 10 minuti su WhatsApp o in chiamata.
 * Dal 31/10 (listino confermato da Riccardo): Start 190, Base 290, Pro 490, Crescita 790 €/mese,
 * prova di 30 giorni a 300 € scalati dal canone, poi minimo 3 mesi, poi mese per mese con disdetta 7 giorni prima.
 * Mai «primo mese senza vincoli» né «prova gratuita».
 */

export const HUB_MESSAGGIO_DEMO = "Ciao! Vorrei prenotare una demo di 10 minuti di LIMITLESS HUB per la mia attività.";
export const hubDemoLink = waLink(HUB_MESSAGGIO_DEMO);

export const HUB_MESSAGGIO_SU_MISURA = "Ciao! Vorrei parlare di un LIMITLESS HUB su misura per la mia attività.";
export const hubSuMisuraLink = waLink(HUB_MESSAGGIO_SU_MISURA);

/** Prezzo d'ingresso: l'unica cifra dei canoni che compare sul sito. */
export const HUB_DA = 190;

/** Prova di 30 giorni a pagamento: 300 € scalati dai canoni se si continua. */
export const HUB_PROVA_PREZZO = 300;
export const HUB_MINIMO_MESI = 3;
export const HUB_DISDETTA_GIORNI = 7;
export const HUB_PROVA = {
  titolo: `Prova di 30 giorni a ${HUB_PROVA_PREZZO} €`,
  breve: `prova 30 giorni a ${HUB_PROVA_PREZZO} €, scalati dal canone`,
  testo: `Paghi ${HUB_PROVA_PREZZO} € e usi l'HUB per 30 giorni sul tuo lavoro di tutti i giorni. Se continui, i ${HUB_PROVA_PREZZO} € li scaliamo dai canoni successivi; se smetti, non devi nient'altro e ricevi i tuoi dati in Excel.`,
  regole: `Se continui dopo la prova: minimo ${HUB_MINIMO_MESI} mesi, poi mese per mese con disdetta ${HUB_DISDETTA_GIORNI} giorni prima.`,
};

/** Come si fa la demo: mai visite sul posto prima. */
export const HUB_DEMO_COME = "Demo di 10 minuti su WhatsApp o in chiamata. Se poi serve, la visita la organizziamo dopo.";

/** Stessi pacchetti e canoni di limitless-hub/src/config/listino.ts (31/10). */
export const hubPacchetti = [
  {
    nome: "Start",
    prezzo: 190,
    perChi: "Per iniziare: i lavori in ordine e chi fa cosa.",
    limiti: "Fino a 5 utenti",
    include: ["Lavori e ordini, fase per fase", "Aggiornamenti da tablet, telefono o PC: Inizio, Fatto, Problema", "Backup ogni giorno ed export in Excel"],
  },
  {
    nome: "Base",
    prezzo: 290,
    perChi: "Per mettere in ordine lavori, ordini e clienti.",
    limiti: "Fino a 10 utenti",
    include: ["Tutto lo Start", "Documenti in PDF, come bolle e schede di lavoro", "Il punto del titolare dal telefono"],
  },
  {
    nome: "Pro",
    prezzo: 490,
    perChi: "Per chi ha fornitori esterni, magazzino e clienti che chiamano.",
    limiti: "Fino a 25 utenti",
    include: ["Tutto il Base", "Portale del cliente", "Fornitori e lavorazioni esterne", "Magazzino, anche con lotti", "Controlli e qualità"],
    consigliato: true,
  },
  {
    nome: "Crescita",
    prezzo: 790,
    perChi: "Per chi vuole anche più clienti, o ha più sedi.",
    limiti: "Fino a 50 utenti",
    include: ["Tutto il Pro", "Sito vetrina o rifacimento", "Scheda Google e recensioni", "Un video al mese per i social", "Report mensile"],
  },
] as const;

export const hubSuMisura = {
  nome: "Su misura",
  prezzo: "Preventivo personalizzato",
  perChi: "Quando i quattro pacchetti non bastano.",
  include: ["Funzioni costruite apposta per la tua attività", "Fasi, nomi e logo tuoi", "Più sedi, più utenti, flussi particolari"],
};

/** Esempi di attività: servono a farsi riconoscere, non sono un limite. */
export const hubEsempi = [
  { titolo: "Aziende e laboratori", testo: "Ordini che passano da una fase all'altra, fornitori esterni, consegne da rispettare." },
  { titolo: "Negozi ed e-commerce", testo: "Ordini in negozio e online, spedizioni, clienti che chiedono dov'è il pacco." },
  { titolo: "Studi professionali", testo: "Pratiche e scadenze per ogni cliente, documenti che girano tra colleghi." },
  { titolo: "Attività di servizi", testo: "Interventi, appuntamenti e lavori da chiudere, con il cliente che chiede quando finite." },
  { titolo: "Artigiani su ordinazione", testo: "Lavori fatti su misura, materiale da ordinare, date di ritiro da ricordare." },
] as const;

/** Spot «Il foglio» (V1, 32 s, 9:16) compresso per il web. */
export const hubSpot: MediaSource = {
  mp4: "/media/hub/hub-il-foglio.mp4",
  mp4Mobile: null,
  poster: "/media/hub/hub-il-foglio.jpg",
  posterAvif: "/media/hub/hub-il-foglio.avif",
  bytes: 2491156,
  width: 720,
  height: 1280,
  vertical: true,
};
