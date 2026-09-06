import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { BUSINESS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Termini di Servizio",
  description: "Termini e condizioni di fornitura dei servizi di LIMITLESS.",
  alternates: { canonical: "/termini" },
};

const LAST_UPDATED = "6 settembre 2026";

export default function TerminiPage() {
  return (
    <>
      <PageHero eyebrow="Legale" title="Termini di Servizio" />
      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-3xl space-y-10 text-sm leading-relaxed text-foreground/90">
          <div>
            <h2 className="font-display text-xl">1. Fornitore del servizio</h2>
            <p className="mt-3">
              {BUSINESS.legalName} — P.IVA {BUSINESS.piva} ({BUSINESS.regime}) — {BUSINESS.city},{" "}
              {BUSINESS.areaServed}.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">2. Descrizione dei servizi</h2>
            <p className="mt-3">
              LIMITLESS offre servizi di realizzazione di siti web, produzione di video walk tour,
              video ads e contenuti multicanale per attività locali e agenzie immobiliari. Il
              dettaglio dei pacchetti disponibili è descritto nella pagina{" "}
              <Link href="/pacchetti" className="text-lime underline-offset-4 hover:underline">
                Pacchetti
              </Link>
              , che può essere aggiornata nel tempo.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">3. Richiesta di consulenza e preventivo</h2>
            <p className="mt-3">
              La consulenza iniziale e il preventivo sono sempre gratuiti e non vincolanti. La
              richiesta tramite il modulo contatti o i recapiti diretti non costituisce impegno
              contrattuale per nessuna delle due parti.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">4. Conclusione del contratto</h2>
            <p className="mt-3">
              Il rapporto contrattuale si considera concluso solo con l&apos;accettazione scritta
              (anche via email) di un preventivo specifico da parte del cliente, che ne definisce
              scopo, tempistiche e corrispettivo.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">5. Termini di pagamento</h2>
            <p className="mt-3">
              Salvo diverso accordo scritto, i progetti prevedono un acconto alla conferma
              dell&apos;incarico e il saldo alla consegna. Le modalità specifiche sono concordate
              caso per caso nel preventivo.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">6. Proprietà intellettuale</h2>
            <p className="mt-3">
              Alla ricezione del saldo, i diritti sul sito, sui video e sui contenuti realizzati su
              misura per il cliente passano al cliente stesso, salvo diverso accordo scritto.
              LIMITLESS si riserva il diritto di mostrare il lavoro realizzato nel proprio
              portfolio (sito, social, materiale promozionale), salvo richiesta scritta di
              opt-out da parte del cliente.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">7. Limitazione di responsabilità</h2>
            <p className="mt-3">
              LIMITLESS si impegna a fornire i servizi con la massima cura professionale, ma non
              risponde di danni indiretti derivanti dall&apos;uso dei materiali forniti, né di
              disservizi imputabili a terze parti (hosting, provider di dominio, piattaforme
              social o di prenotazione di terzi).
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">8. Legge applicabile e foro competente</h2>
            <p className="mt-3">
              I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è
              competente il foro del luogo di residenza o domicilio del consumatore, ove
              applicabile per legge; negli altri casi, il foro di Pavia.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">9. Diritto di recesso</h2>
            <p className="mt-3">
              Se il cliente è un consumatore ai sensi del Codice del Consumo, ha diritto di recesso
              entro 14 giorni dalla conclusione del contratto stipulato a distanza, salvo che
              l&apos;esecuzione del servizio sia già iniziata su richiesta espressa del cliente
              stesso, con rinuncia esplicita al diritto di recesso per la parte già eseguita.
            </p>
          </div>

          <p className="border-t border-border pt-6 text-xs text-muted-foreground">
            Ultimo aggiornamento: {LAST_UPDATED}. Il presente documento non sostituisce una
            consulenza legale professionale.
          </p>
        </div>
      </section>
    </>
  );
}
