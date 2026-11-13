import { SITO_DA, SITO_MANUTENZIONE_DA, SPOT_LANCIO, SPOT_NOTA } from "./servizi";

export type Faq = { q: string; a: string };

export const faq: Faq[] = [
  {
    q: "Cos'è LIMITLESS HUB?",
    a: "È il gestionale su misura per qualsiasi attività: lavori, ordini e clienti in un posto solo, fase per fase, da telefono, tablet o PC. Si parte da 190 €/mese, con una prova di 30 giorni. La demo dura 10 minuti, su WhatsApp o in chiamata.",
  },
  {
    q: "La consulenza è davvero gratuita?",
    a: "Sì. Ci racconti la tua attività, ti mostriamo i lavori già fatti e ti diciamo quanto costa. Decidi tu se partire, senza nessun obbligo.",
  },
  {
    q: "Quanto costano spot, walk tour e sito?",
    a: `Uno spot da ${SPOT_LANCIO} € (${SPOT_NOTA}), un walk tour da 190 €, un sito da ${SITO_DA} €. Il prezzo preciso dipende da cosa ti serve: te lo diciamo nel preventivo, prima di partire.`,
  },
  {
    q: "Avete servizi mensili?",
    a: "Sì. Contenuti per i social ogni mese (Mese Brand, da 390 €/mese) e la cura della scheda Google con le recensioni (da 59 €/mese). Cosa comprendono lo decidiamo insieme.",
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
    a: "Sì, nella consulenza gratuita ti mostriamo i lavori già fatti per attività simili alla tua. Il lavoro parte con l'acconto del 50%.",
  },
  {
    q: "Come funziona il pagamento?",
    a: "Acconto del 50% alla conferma, saldo alla consegna.",
  },
  {
    q: "Quante modifiche sono incluse?",
    a: "Due revisioni sono sempre incluse. Di solito bastano e avanzano.",
  },
  {
    q: "Ci sono costi mensili?",
    a: `Solo se scegli un servizio mensile (LIMITLESS HUB, Mese Brand, Scheda Google). Per il sito, la manutenzione parte da ${SITO_MANUTENZIONE_DA} €/mese e te la diciamo prima di partire.`,
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
