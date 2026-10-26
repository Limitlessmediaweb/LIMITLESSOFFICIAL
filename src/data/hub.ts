import type { MediaSource } from "@/lib/media";
import { waLink } from "@/data/azienda";

/**
 * LIMITLESS HUB: unica fonte per la pagina /hub e il blocco in home.
 * Impostazione del 26/10 (_CONTROLLO/LISTINO-E-REGOLE.md, DECISIONI HUB 26/10):
 * gestionale su misura per qualsiasi attività, pacchetti senza prezzo singolo, solo «da 190 €/mese»,
 * pacchetto Su misura a preventivo, tablet su richiesta.
 */

export const HUB_MESSAGGIO_DEMO = "Ciao! Vorrei prenotare una demo di 10 minuti di LIMITLESS HUB per la mia attività.";
export const hubDemoLink = waLink(HUB_MESSAGGIO_DEMO);

export const HUB_MESSAGGIO_SU_MISURA = "Ciao! Vorrei parlare di un LIMITLESS HUB su misura per la mia attività.";
export const hubSuMisuraLink = waLink(HUB_MESSAGGIO_SU_MISURA);

/** Prezzo d'ingresso: l'unica cifra dei canoni che compare sul sito. */
export const HUB_DA = 190;

export const HUB_PROVA = { giorni: 30, prezzo: 300 };

export const hubPacchetti = [
  {
    nome: "Base",
    perChi: "Per mettere in ordine lavori, ordini e clienti.",
    limiti: "Fino a 8 utenti",
    include: ["Lavori e ordini, fase per fase", "Aggiornamenti da tablet, telefono o PC: Inizio, Fatto, Problema", "Documenti in PDF, come bolle e schede di lavoro", "Backup ogni giorno ed export in Excel"],
  },
  {
    nome: "Pro",
    perChi: "Per chi ha fornitori esterni, magazzino e clienti che chiamano.",
    limiti: "Fino a 25 utenti",
    include: ["Tutto il Base", "Portale del cliente", "Fornitori e lavorazioni esterne", "Magazzino, anche con lotti e certificati", "Controlli e qualità", "Il punto del titolare dal telefono"],
    consigliato: true,
  },
  {
    nome: "Crescita",
    perChi: "Per chi vuole anche più clienti, o ha più sedi.",
    limiti: "Fino a 50 utenti",
    include: ["Tutto il Pro", "Sito vetrina o rifacimento", "Scheda Google e recensioni", "Un video al mese per i social", "Report mensile"],
  },
] as const;

export const hubSuMisura = {
  nome: "Su misura",
  prezzo: "Preventivo personalizzato",
  perChi: "Quando i tre pacchetti non bastano.",
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
