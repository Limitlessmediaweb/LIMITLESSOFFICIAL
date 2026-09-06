import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { BUSINESS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sul trattamento dei dati personali di LIMITLESS ai sensi dell'art. 13 GDPR.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "6 settembre 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legale" title="Privacy Policy" />
      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-3xl space-y-10 text-sm leading-relaxed text-foreground/90">
          <div>
            <h2 className="font-display text-xl">1. Titolare del trattamento</h2>
            <p className="mt-3">
              {BUSINESS.legalName} — P.IVA {BUSINESS.piva} ({BUSINESS.regime}) — {BUSINESS.city},{" "}
              {BUSINESS.areaServed}.
              <br />
              Email: <a href={`mailto:${BUSINESS.email}`} className="text-lime underline-offset-4 hover:underline">{BUSINESS.email}</a> ·
              Telefono: <a href={`tel:${BUSINESS.phoneHref}`} className="text-lime underline-offset-4 hover:underline">{BUSINESS.phone}</a> ·
              PEC: {BUSINESS.pec}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">2. Dati raccolti</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Dati di contatto forniti volontariamente tramite il modulo contatti (nome, email,
                messaggio, eventualmente il pacchetto di interesse).
              </li>
              <li>
                Dati di navigazione tecnici, raccolti automaticamente dal server per il
                funzionamento del sito (indirizzo IP, tipo di browser, pagine visitate). Non sono
                installati cookie di statistica o profilazione — vedi la{" "}
                <Link href="/cookie" className="text-lime underline-offset-4 hover:underline">
                  Cookie Policy
                </Link>{" "}
                per l&apos;elenco completo.
              </li>
              <li>
                Se avvii una conversazione tramite il link WhatsApp presente sul sito, i dati dello
                scambio sono trattati anche da WhatsApp/Meta secondo la loro informativa.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl">3. Finalità del trattamento</h2>
            <p className="mt-3">
              I dati raccolti tramite il modulo contatti sono utilizzati esclusivamente per
              rispondere alla tua richiesta di consulenza o preventivo e per la gestione
              dell&apos;eventuale rapporto contrattuale. Non utilizziamo i tuoi dati per finalità
              di marketing senza un consenso separato e specifico.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">4. Base giuridica</h2>
            <p className="mt-3">
              Il trattamento si basa sul consenso dell&apos;interessato (art. 6.1.a GDPR) per il
              contatto volontario tramite il modulo, e sull&apos;esecuzione di misure
              precontrattuali (art. 6.1.b GDPR) per le richieste di preventivo.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">5. Conservazione dei dati</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Dati di contatto/lead che non si trasformano in un rapporto cliente: conservati
                per un massimo di 24 mesi dall&apos;ultimo contatto, poi cancellati.
              </li>
              <li>
                Dati di clienti effettivi: conservati per la durata del rapporto contrattuale e,
                successivamente, per il periodo richiesto dagli obblighi fiscali e contabili
                (10 anni per la documentazione contabile/fatture).
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl">6. Destinatari dei dati e trasferimenti extra-UE</h2>
            <p className="mt-3">I dati possono essere trattati dai seguenti servizi terzi, nella misura strettamente necessaria al funzionamento del sito e alla comunicazione con i clienti:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Vercel Inc.</strong> (hosting del sito) — con sede negli Stati Uniti; il
                trasferimento è basato sulle Clausole Contrattuali Standard (SCC) approvate dalla
                Commissione Europea.{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-lime underline-offset-4 hover:underline"
                >
                  Privacy policy di Vercel
                </a>
                .
              </li>
              <li>
                <strong>Google LLC</strong> (Google Fonts, caricati staticamente in fase di build:
                nessuna richiesta al server di Google viene effettuata dal browser dell&apos;utente
                durante la navigazione).{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-lime underline-offset-4 hover:underline"
                >
                  Privacy policy di Google
                </a>
                .
              </li>
              <li>
                <strong>Google (Gmail)</strong> — la casella {BUSINESS.email} è gestita su
                infrastruttura Google Workspace/Gmail per la ricezione delle richieste inviate dal
                modulo contatti (che si apre come bozza email dal tuo client di posta).
              </li>
              <li>
                <strong>Meta/WhatsApp</strong> — solo se scegli di contattarci tramite il link
                WhatsApp presente sul sito.{" "}
                <a
                  href="https://www.whatsapp.com/legal/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-lime underline-offset-4 hover:underline"
                >
                  Privacy policy di WhatsApp
                </a>
                .
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl">7. Diritti dell&apos;interessato</h2>
            <p className="mt-3">
              Puoi esercitare in qualsiasi momento i diritti di accesso, rettifica, cancellazione,
              limitazione, portabilità e opposizione al trattamento (artt. 15-22 GDPR), oltre al
              diritto di proporre reclamo al Garante per la protezione dei dati personali.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">8. Come esercitare i tuoi diritti</h2>
            <p className="mt-3">
              Scrivi a{" "}
              <a href={`mailto:${BUSINESS.email}`} className="text-lime underline-offset-4 hover:underline">
                {BUSINESS.email}
              </a>
              . Risponderemo nei tempi previsti dalla normativa vigente.
            </p>
          </div>

          <p className="border-t border-border pt-6 text-xs text-muted-foreground">
            Ultimo aggiornamento: {LAST_UPDATED}.
          </p>
        </div>
      </section>
    </>
  );
}
