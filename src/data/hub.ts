import type { MediaSource } from "@/lib/media";
import { waLink } from "@/data/azienda";

/**
 * LIMITLESS HUB: unica fonte per la pagina /hub e il blocco in home.
 * Prezzi dalle DECISIONI DEFINITIVE del 25/10 (_CONTROLLO/LISTINO-E-REGOLE.md);
 * utenti, tablet e contenuti dei pacchetti da limitless-hub/src/config/listino.ts.
 */

export const HUB_MESSAGGIO_DEMO = "Ciao! Vorrei prenotare una demo di 10 minuti di LIMITLESS HUB per la mia azienda.";
export const hubDemoLink = waLink(HUB_MESSAGGIO_DEMO);

export const HUB_PROVA = { giorni: 30, prezzo: 300 };

export const hubPacchetti = [
  {
    nome: "Base",
    canone: 290,
    perChi: "Per mettere in ordine ordini e reparto.",
    limiti: "8 utenti · 2 tablet",
    include: ["Ordini e commesse", "Tablet in reparto: Inizio, Fatto, Problema", "DDT in PDF", "Backup ogni giorno ed export in Excel"],
  },
  {
    nome: "Pro",
    canone: 490,
    perChi: "Per chi ha terzisti, magazzino e clienti che chiamano.",
    limiti: "25 utenti · 6 tablet",
    include: ["Tutto il Base", "Portale del cliente", "Terzisti e conto lavoro", "Magazzino con lotti e certificati", "Collaudo e qualità", "Il punto del titolare dal telefono"],
    consigliato: true,
  },
  {
    nome: "Crescita",
    canone: 790,
    perChi: "Per chi vuole anche più clienti, o ha più sedi.",
    limiti: "50 utenti · 15 tablet",
    include: ["Tutto il Pro", "Sito vetrina o rifacimento", "Scheda Google e recensioni", "Un video al mese per i social", "Report mensile"],
  },
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
