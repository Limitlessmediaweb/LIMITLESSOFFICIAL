import { MANUTENZIONE_MESE } from "./servizi";

export type Faq = { q: string; a: string };

export const faq: Faq[] = [
  {
    q: "La consulenza è davvero gratuita?",
    a: "Sì. Ci racconti la tua attività, ti mostriamo esempi adatti e ti diciamo quanto costa. Decidi tu se partire, senza nessun obbligo.",
  },
  {
    q: "Quanto costa un sito, uno spot o un walk tour?",
    a: "Un sito parte da 500 €, uno spot da 99 €, un walk tour da 99 €. Il prezzo finale dipende dal progetto: te lo diciamo dopo la consulenza gratuita, senza sorprese.",
  },
  {
    q: "In quanto tempo è pronto?",
    a: "Uno spot in 3-5 giorni, un walk tour in 5-7 giorni, un sito in circa una settimana. I tempi partono da quando abbiamo il materiale. [DA CONFERMARE]",
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
    a: "Sì. Nella consulenza gratuita ti mostriamo esempi pensati per un'attività come la tua, così vedi la direzione prima di confermare.",
  },
  {
    q: "Come funziona il pagamento?",
    a: "Acconto del 50% per iniziare, saldo alla consegna. [DA CONFERMARE]",
  },
  {
    q: "Quante modifiche sono incluse?",
    a: "Due giri di revisioni sono sempre inclusi. Di solito bastano e avanzano.",
  },
  {
    q: "Ci sono costi mensili?",
    a: `Sì, solo la manutenzione: ${MANUTENZIONE_MESE} €/mese. Comprende hosting, sicurezza, aggiornamenti e piccole modifiche, così il sito resta sempre online e veloce senza che tu debba pensarci.`,
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
