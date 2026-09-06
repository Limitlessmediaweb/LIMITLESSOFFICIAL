import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Informativa sui cookie e sulle tecnologie simili utilizzate da LIMITLESS.",
  alternates: { canonical: "/cookie" },
};

const LAST_UPDATED = "6 settembre 2026";

const ROWS = [
  {
    name: "limitless-cookie-notice-ack",
    type: "localStorage (non è un cookie HTTP)",
    purpose: "Ricorda che hai letto l'informativa sui cookie, per non mostrarla di nuovo per ~6 mesi.",
    duration: "180 giorni",
    party: "Prima parte",
    category: "Tecnico",
  },
];

export default function CookiePage() {
  return (
    <>
      <PageHero eyebrow="Legale" title="Cookie Policy" />
      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <div className="mx-auto max-w-3xl space-y-10 text-sm leading-relaxed text-foreground/90">
          <div>
            <h2 className="font-display text-xl">Risultato dell&apos;audit</h2>
            <p className="mt-3">
              Ad oggi questo sito <strong>non installa alcun cookie di profilazione, marketing o
              statistica/analytics</strong>. Non sono presenti Google Analytics, pixel di Meta/Google
              Ads, né embed di terze parti (video, mappe) che impostano cookie. I font utilizzati
              (Space Grotesk, Manrope) sono inclusi staticamente nel sito in fase di build: il tuo
              browser non contatta i server di Google Fonts durante la navigazione.
            </p>
            <p className="mt-3">
              Per questo motivo, in coerenza con le Linee guida cookie del Garante Privacy (10
              giugno 2021), il sito non richiede un banner con scelte multiple
              (accetta/rifiuta/personalizza): viene mostrata una semplice informativa. Se in futuro
              venissero aggiunti strumenti di analisi o marketing, questa pagina e il banner
              verranno aggiornati con un sistema di consenso granulare e blocco preventivo dei
              cookie non tecnici fino alla scelta dell&apos;utente.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">Cosa viene effettivamente utilizzato</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[560px] border-collapse text-left text-xs">
                <thead className="bg-card">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Nome</th>
                    <th className="px-4 py-3 font-semibold">Tipo</th>
                    <th className="px-4 py-3 font-semibold">Finalità</th>
                    <th className="px-4 py-3 font-semibold">Durata</th>
                    <th className="px-4 py-3 font-semibold">Parte</th>
                    <th className="px-4 py-3 font-semibold">Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.name} className="border-t border-border">
                      <td className="px-4 py-3 font-mono">{r.name}</td>
                      <td className="px-4 py-3">{r.type}</td>
                      <td className="px-4 py-3">{r.purpose}</td>
                      <td className="px-4 py-3">{r.duration}</td>
                      <td className="px-4 py-3">{r.party}</td>
                      <td className="px-4 py-3">{r.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl">WhatsApp</h2>
            <p className="mt-3">
              Il link di contatto WhatsApp presente sul sito non imposta cookie da parte nostra,
              ma avviando una conversazione i tuoi dati vengono trattati da WhatsApp/Meta secondo
              la loro informativa privacy.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl">Come gestire le preferenze</h2>
            <p className="mt-3">
              Puoi rivedere questa informativa in qualsiasi momento tramite il link &quot;Gestisci
              preferenze cookie&quot; nel footer del sito.
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
