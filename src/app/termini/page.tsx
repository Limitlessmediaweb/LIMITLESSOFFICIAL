import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { T } from "@/components/ui/T";
import { contatti } from "@/data/contatti";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Termini d'uso | LIMITLESS",
  description:
    "Termini d'uso del sito LIMITLESS: uso dei contenuti, proprietà dei progetti concept, limiti di responsabilità e contatti.",
  path: "/termini",
});

export default function TerminiPage() {
  return (
    <LegalPage title="Termini d'uso" updated="5 ottobre 2026">
      <h2>1. Chi siamo</h2>
      <p>
        Questo sito è gestito da LIMITLESS (<T fallback="titolare in arrivo">{contatti.titolare}</T>, P.IVA <T fallback="in arrivo">{contatti.piva}</T>
        ). Usando il sito accetti questi termini.
      </p>

      <h2>2. Uso del sito</h2>
      <p>
        Il sito presenta i servizi di LIMITLESS (siti web, spot video, walk tour). Puoi consultarlo liberamente per uso personale e per valutare i
        nostri servizi. Non è consentito copiare, rivendere o usare i contenuti per scopi commerciali senza il nostro permesso scritto.
      </p>

      <h2>3. Proprietà dei contenuti e dei concept</h2>
      <p>
        Testi, video, grafiche, codice e marchi del sito appartengono a LIMITLESS, salvo diversa indicazione. I lavori segnati come
        &ldquo;Concept&rdquo; (per esempio NÒTTEA, ORDITO, Osteria del Borgo, VOLTA, FLUSSO) sono brand e attività inventati da LIMITLESS a scopo
        dimostrativo: non sono clienti reali. Qualsiasi somiglianza con attività esistenti è casuale.
      </p>
      <p>
        Alcuni contenuti sono realizzati anche con strumenti di intelligenza artificiale generativa e poi rielaborati da noi.
      </p>

      <h2>4. Preventivi e prezzi</h2>
      <p>
        I prezzi indicati sul sito sono &ldquo;a partire da&rdquo; e hanno valore indicativo. Il prezzo finale, i tempi e cosa è incluso sono definiti
        nel preventivo che ti mandiamo e diventano validi solo dopo la tua conferma scritta e il pagamento dell&apos;acconto. <T>{"[DA CONFERMARE]"}</T>
      </p>

      <h2>5. Link esterni</h2>
      <p>
        Il sito contiene link a siti di terzi (per esempio i siti dimostrativi dei progetti concept, WhatsApp e Instagram). Non siamo responsabili dei
        loro contenuti né delle loro regole sulla privacy.
      </p>

      <h2>6. Responsabilità</h2>
      <p>
        Facciamo il possibile perché le informazioni del sito siano corrette e aggiornate, ma non possiamo garantire che siano sempre complete o prive
        di errori. Nei limiti consentiti dalla legge, LIMITLESS non risponde di danni derivanti dall&apos;uso del sito o dall&apos;impossibilità di
        usarlo.
      </p>

      <h2>7. Modifiche</h2>
      <p>Possiamo aggiornare questi termini in qualsiasi momento. La versione valida è quella pubblicata su questa pagina, con la data in alto.</p>

      <h2>8. Legge applicabile e contatti</h2>
      <p>
        Questi termini sono regolati dalla legge italiana. Per domande scrivi a <a href={`mailto:${contatti.email}`}>{contatti.email}</a> o alla PEC{" "}
        {contatti.pec}.
      </p>
    </LegalPage>
  );
}
