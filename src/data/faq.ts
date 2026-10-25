import { SPOT_LANCIO, SPOT_LANCIO_FINE, SPOT_LISTINO } from "./servizi";

export type Faq = { q: string; a: string };

export const faq: Faq[] = [
  {
    q: "La consulenza è davvero gratuita?",
    a: "Sì. Ci racconti la tua attività, ti mostriamo i lavori già fatti e ti diciamo quanto costa. Decidi tu se partire, senza nessun obbligo.",
  },
  {
    q: "Quanto costano spot, walk tour e sito?",
    a: `Uno spot di 20-30 secondi costa ${SPOT_LANCIO} € fino al ${SPOT_LANCIO_FINE}, poi ${SPOT_LISTINO} €. Un walk tour 190 € (appartamento), 300 € (struttura fino a 5 ambienti) o 590 € (tour completo). Un sito 750 € (Easy) o 990 € (Premium).`,
  },
  {
    q: "Avete servizi mensili?",
    a: "Sì. Mese Brand a 390 €/mese (1 spot + 8 contenuti + calendario) e Mese Brand Completo a 590 €/mese (2 spot + 12 contenuti + pubblicazione + report). Ai primi 3 clienti mensili: −30% per 3 mesi in cambio del caso studio. Scheda Google + recensioni: 59-99 €/mese.",
  },
  {
    q: "Cos'è LIMITLESS HUB?",
    a: "È il gestionale per piccole aziende manifatturiere: Base 290 €/mese, Pro 490 €/mese (con portale cliente), Crescita 790 €/mese. Si può iniziare con una prova di 30 giorni a 300 €, che vengono scalati dal canone.",
  },
  {
    q: "In quanto tempo è pronto?",
    a: "Spot e walk tour in 72 ore dalle riprese o dall'invio delle foto. Il sito Easy in 7-10 giorni, il Premium in 2-3 settimane.",
  },
  {
    q: "Cosa vi devo mandare?",
    a: "Logo, qualche foto, i tuoi contatti e due righe su cosa fai. Se non hai tutto, ti guidiamo noi passo per passo.",
  },
  {
    q: "Servono foto professionali?",
    a: "No. Per i walk tour partiamo dalle foto dell'annuncio o da quelle che hai già. Per siti e spot lavoriamo anche con le foto del telefono.",
  },
  {
    q: "Posso vedere un esempio prima di decidere?",
    a: "Sì, nella consulenza gratuita ti mostriamo i lavori già fatti per attività simili alla tua. Non prepariamo anteprime gratuite: il lavoro parte con l'acconto.",
  },
  {
    q: "Come funziona il pagamento?",
    a: "Acconto del 50% alla conferma, saldo alla consegna. Emettiamo fattura con partita IVA in regime forfettario.",
  },
  {
    q: "Quante modifiche sono incluse?",
    a: "Due revisioni sono sempre incluse. Di solito bastano e avanzano.",
  },
  {
    q: "Ci sono costi mensili?",
    a: "Solo se scegli un servizio mensile (Mese Brand, Scheda Google, HUB). Per il sito, la manutenzione si concorda nel preventivo, prima di partire.",
  },
  {
    q: "I video vanno bene per Instagram e TikTok?",
    a: "Sì. Li consegniamo in verticale 9:16, pronti per Reels, TikTok, Stories e stato di WhatsApp.",
  },
  {
    q: "Lavorate anche fuori zona?",
    a: "Sì. Facciamo tutto online: ci scrivi, ci mandi il materiale e ricevi il lavoro finito, ovunque tu sia in Italia.",
  },
];
