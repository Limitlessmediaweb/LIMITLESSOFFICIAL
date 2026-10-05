import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { azienda } from "@/data/azienda";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy | LIMITLESS",
  description:
    "Informativa privacy e cookie di LIMITLESS: quali dati trattiamo quando ci contatti, perché, per quanto tempo e quali sono i tuoi diritti. Solo cookie tecnici.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const mail = <a href={`mailto:${azienda.email}`}>{azienda.email}</a>;
  const pec = <a href={`mailto:${azienda.pec}`}>{azienda.pec}</a>;
  return (
    <LegalPage title="Privacy" updated="5 ottobre 2026">
      <h2>1. Titolare del trattamento</h2>
      <p>
        Il titolare del trattamento è <strong>{azienda.ragioneSociale}</strong>, P.IVA {azienda.piva}, con sede a {azienda.sede.comune} (
        {azienda.sede.provincia}), Italia. Per qualsiasi richiesta sulla privacy puoi scrivere a {mail} o alla PEC {pec}, oppure chiamare il{" "}
        {azienda.telefono}.
      </p>

      <h2>2. Quali dati trattiamo</h2>
      <p>
        Questo sito non ha moduli, non chiede di registrarsi e non usa cookie di profilazione. Trattiamo solo i dati che ci mandi tu, volontariamente,
        quando ci contatti:
      </p>
      <ul>
        <li>su WhatsApp: numero di telefono, nome del profilo e contenuto dei messaggi;</li>
        <li>via email o PEC: indirizzo email, nome e contenuto del messaggio;</li>
        <li>su Instagram o TikTok: nome utente e contenuto dei messaggi.</li>
      </ul>
      <p>
        Il configuratore &ldquo;Cosa ti serve?&rdquo; prepara solo il testo di un messaggio WhatsApp sul tuo dispositivo: non salva e non invia niente
        finché non decidi tu di inviarlo.
      </p>

      <h2>3. Perché li trattiamo (finalità e base giuridica)</h2>
      <ul>
        <li>Rispondere alle tue richieste, fare la consulenza gratuita e prepararti un preventivo: misure precontrattuali richieste da te (art. 6.1.b GDPR).</li>
        <li>Svolgere il lavoro concordato, la manutenzione e la fatturazione: esecuzione del contratto e obblighi di legge (art. 6.1.b e 6.1.c GDPR).</li>
      </ul>
      <p>Non usiamo i tuoi dati per pubblicità e non li vendiamo a nessuno.</p>

      <h2>4. Statistiche di visita</h2>
      <p>
        Per capire quali pagine funzionano usiamo Plausible Analytics, un servizio che non usa cookie e non raccoglie dati personali: le visite sono
        conteggiate in forma aggregata e anonima, senza identificarti. Base giuridica: legittimo interesse (art. 6.1.f GDPR).
      </p>

      <h2 id="cookie">5. Cookie</h2>
      <p>
        Questo sito usa <strong>solo cookie e strumenti tecnici</strong>, necessari a farlo funzionare: per esempio la memoria del browser che ricorda
        se preferisci il tema chiaro o scuro, o se hai già visto l&apos;animazione iniziale. Non usiamo cookie di profilazione, pubblicitari o di
        terze parti per tracciarti. Per questo non serve il tuo consenso e non trovi nessun banner.
      </p>
      <p>
        Se apri i link esterni (WhatsApp, Instagram, TikTok o i siti dimostrativi dei progetti) passi su servizi che hanno le loro regole sui cookie.
      </p>

      <h2>6. Per quanto tempo li conserviamo</h2>
      <p>
        Le conversazioni per un preventivo che non diventa un lavoro sono cancellate entro 12 mesi. I dati legati a un
        lavoro svolto sono conservati per il tempo richiesto dagli obblighi fiscali (in genere 10 anni).
      </p>

      <h2>7. A chi li comunichiamo (terze parti)</h2>
      <ul>
        <li>
          <strong>Vercel Inc.</strong>: ospita il sito. Può trattare dati tecnici di navigazione (come l&apos;indirizzo IP) per far funzionare e
          proteggere il servizio.
        </li>
        <li>
          <strong>Meta Platforms (WhatsApp, Instagram)</strong> e <strong>TikTok</strong>: se ci scrivi su queste piattaforme, i messaggi passano dai
          loro servizi secondo le loro informative.
        </li>
        <li>
          <strong>Plausible Insights OÜ</strong>: statistiche anonime, server nell&apos;Unione Europea.
        </li>
        <li>
          <strong>Google (Gmail)</strong>: gestisce la nostra casella email.
        </li>
      </ul>
      <p>
        Alcuni di questi fornitori possono trasferire dati fuori dall&apos;Unione Europea, sulla base di decisioni di adeguatezza o clausole
        contrattuali standard.
      </p>

      <h2>8. I tuoi diritti</h2>
      <p>
        Puoi chiederci in qualsiasi momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne il trattamento, opporti o riceverli in un
        formato portabile (artt. 15-22 GDPR). Basta scrivere a {mail} o alla PEC {pec}. Hai anche il diritto di presentare reclamo al Garante per la
        protezione dei dati personali (garanteprivacy.it).
      </p>

      <h2>9. Modifiche</h2>
      <p>Se cambiamo questa informativa, aggiorniamo la data in alto. Le modifiche importanti saranno segnalate in questa pagina.</p>
    </LegalPage>
  );
}
