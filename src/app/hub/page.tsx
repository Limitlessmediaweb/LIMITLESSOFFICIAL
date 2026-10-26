import type { Metadata } from "next";
import Image from "next/image";
import { Briefcase, Check, Factory, Hammer, MessageCircle, ShoppingBag, Wrench } from "lucide-react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SmartVideo } from "@/components/media/SmartVideo";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { DemoHubButton } from "@/components/ui/DemoHubButton";
import { JsonLd } from "@/components/ui/JsonLd";
import { HUB_DA, HUB_DEMO_COME, HUB_PRIMO_MESE, hubEsempi, hubPacchetti, hubSpot, hubSuMisura, hubSuMisuraLink } from "@/data/hub";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "LIMITLESS HUB | Il gestionale su misura per la tua attività",
  description:
    "Lavori, ordini e clienti in un posto solo, fase per fase, da tablet, telefono o PC. Gestionale su misura per aziende, negozi, studi e laboratori. Da 190 €/mese.",
  path: "/hub",
});

const euro = (n: number) => `${n.toLocaleString("it-IT")} €`;

const passi = [
  {
    n: "01",
    titolo: "Da tablet, telefono o PC",
    testo: "Chi lavora apre il suo lavoro e tocca uno dei tre pulsanti: Inizio, Fatto, Problema. Niente password da ricordare, niente prezzi a vista.",
    img: { src: "/media/hub/pulsanti.webp", w: 1280, h: 600, alt: "Esempio di schermata di LIMITLESS HUB con un lavoro aperto e tre pulsanti grandi: Inizio, Fatto, Problema" },
  },
  {
    n: "02",
    titolo: "Ogni lavoro, fase per fase",
    testo: "Le fasi sono le tue: preparazione, lavorazione, fornitore esterno, controllo, consegna, o quelle che usi già. Dall'ufficio o dal telefono vedi i ritardi prima che chiami il cliente.",
    img: { src: "/media/hub/titolare.webp", w: 1280, h: 800, alt: "Schermata Il punto del titolare: lavori in ritardo, problemi aperti, consegne della settimana e lavori a rischio" },
  },
  {
    n: "03",
    titolo: "Il portale del cliente",
    testo: "Il tuo cliente apre un link e vede da solo a che punto è il suo lavoro, la data di consegna e i documenti. Vede solo i suoi: niente prezzi, niente fornitori, niente altri clienti.",
    img: { src: "/media/hub/portale.webp", w: 1280, h: 800, alt: "Portale del cliente: elenco dei lavori con la fase attuale e la data di consegna prevista" },
  },
];

const iconeEsempi = [Factory, ShoppingBag, Briefcase, Wrench, Hammer];

export default function HubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "LIMITLESS HUB",
    url: `${SITE_URL}/hub`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "IT",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: HUB_DA,
      priceCurrency: "EUR",
      offerCount: hubPacchetti.length + 1,
    },
  };

  return (
    <>
      {/* Apertura: il problema e lo spot */}
      <section className="wrap grid gap-12 pb-20 pt-32 md:pt-40 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-20">
        <div className="min-w-0">
          <p className="mono text-fg-muted">LIMITLESS HUB · il gestionale su misura</p>
          <SplitReveal as="h1" immediate className="mt-4 max-w-[13ch] text-display">
            A che punto è il lavoro? Adesso lo sai.
          </SplitReveal>
          <p className="mt-8 max-w-[50ch] text-lead text-fg-muted">
            Lavori, ordini e clienti sparsi tra fogli, chat e memoria. Poi il cliente chiama: &laquo;A che punto è il mio lavoro?&raquo;. E per rispondere bisogna chiedere in giro, cercare il messaggio, ritrovare il foglio.
          </p>
          <p className="mt-4 max-w-[50ch] text-lead">LIMITLESS HUB mette ogni lavoro su uno schermo, fase per fase. La risposta arriva in tre secondi, non in tre telefonate.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <DemoHubButton posizione="hub_hero" className="w-full sm:w-auto" />
            <a href="#pacchetti" className="btn btn-ghost w-full sm:w-auto">
              Vedi i pacchetti
            </a>
          </div>
          <p className="mt-4 text-sm text-fg-muted">{HUB_DEMO_COME}</p>
        </div>
        <div className="mx-auto w-full max-w-[330px]">
          <PhoneFrame screenAspect="9 / 16">
            <SmartVideo
              src={hubSpot}
              label="Spot di LIMITLESS HUB «Il foglio»"
              description="Spot di 32 secondi: il cliente chiama per sapere a che punto è il suo ordine e parte il giro tra reparto, fornitore esterno e spedizione. Con LIMITLESS HUB la scheda dell'ordine mostra subito che è in collaudo e parte giovedì."
              className="h-full w-full"
              showAudio
              priority
            />
          </PhoneFrame>
          <p className="mono mt-4 text-center text-fg-muted">Lo spot «Il foglio» · 32 s · tocca l&apos;altoparlante per l&apos;audio</p>
        </div>
      </section>

      {/* Come funziona in 3 punti, con le schermate vere della demo */}
      <section aria-labelledby="come-title" className="border-t border-line">
        <div className="wrap py-20 md:py-28">
          <h2 id="come-title" className="max-w-[16ch] text-title">
            Come funziona, in tre punti
          </h2>
          <p className="mt-5 max-w-[56ch] text-lead text-fg-muted">Schermate della demo, con dati di esempio. Nel tuo HUB le fasi, i nomi e il logo sono i tuoi.</p>
          <ol className="mt-16 grid gap-20">
            {passi.map((p, i) => (
              <li key={p.n} className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-center lg:gap-16">
                <Reveal className={cn("min-w-0", i % 2 === 1 && "lg:order-2")}>
                  <p className="mono text-accent-text">{p.n}</p>
                  <h3 className="mt-3 text-[clamp(1.6rem,1rem+2vw,2.6rem)] font-extrabold leading-[1.05]">{p.titolo}</h3>
                  <p className="mt-4 max-w-[46ch] text-lead text-fg-muted">{p.testo}</p>
                  {p.n === "03" && <p className="mt-4 text-sm font-semibold">Incluso dal pacchetto Pro.</p>}
                </Reveal>
                <Reveal className="min-w-0">
                  {p.n === "03" ? (
                    <div className="grid grid-cols-[1fr_auto] items-end gap-4 sm:gap-6">
                      <Screenshot {...p.img} />
                      <div className="w-[34vw] max-w-[180px]">
                        <PhoneFrame screenAspect="600 / 1100">
                          {/* spazio in alto per l'isola dinamica della cornice, nel grigio del portale */}
                          <div className="h-full bg-[#eef1f4] pt-[10%]">
                            <Image src="/media/hub/portale-telefono.webp" alt="Il portale del cliente sul telefono: un ordine con le sue fasi e la consegna prevista" width={600} height={996} className="h-auto w-full" sizes="180px" />
                          </div>
                        </PhoneFrame>
                      </div>
                    </div>
                  ) : (
                    <Screenshot {...p.img} />
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Su misura: ci adattiamo all'attività */}
      <section aria-labelledby="misura-title" className="border-t border-line">
        <div className="wrap py-20 md:py-28">
          <h2 id="misura-title" className="max-w-[18ch] text-title">
            Ci adattiamo alla tua attività, non il contrario.
          </h2>
          <p className="mt-5 max-w-[56ch] text-lead text-fg-muted">
            Ogni HUB lo costruiamo sulla tua attività: le funzioni che ti servono, le tue fasi, i tuoi nomi, il tuo logo. Se qualcosa non va, lo sistemiamo il prima possibile.
          </p>
          <p className="mono mt-12 text-fg-muted">Qualche esempio, non un limite</p>
          <ul className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {hubEsempi.map(({ titolo, testo }, i) => {
              const Icon = iconeEsempi[i];
              return (
                <li key={titolo} className="flex flex-col gap-4 bg-bg p-6">
                  <Icon size={24} aria-hidden className="text-accent-text" />
                  <h3 className="text-xl font-bold">{titolo}</h3>
                  <p className="text-fg-muted">{testo}</p>
                </li>
              );
            })}
          </ul>
          <p className="mt-8 max-w-[60ch] border-l-2 border-accent pl-4 text-fg-muted">
            <strong className="text-fg">Non sostituisce il programma delle fatture.</strong> Le fatture le continui a fare come oggi: l&apos;HUB mette in ordine il lavoro.
          </p>
        </div>
      </section>

      {/* Pacchetti e primo mese */}
      <section id="pacchetti" aria-labelledby="pacchetti-title" className="scroll-mt-20 border-t border-line">
        <div className="wrap py-20 md:py-28">
          <h2 id="pacchetti-title" className="text-title">
            Tre pacchetti, più il su misura
          </h2>
          <p className="mt-6">
            <span className="text-fg-muted">da </span>
            <span className="font-display text-5xl font-extrabold">{euro(HUB_DA)}</span>
            <span className="ml-1 text-fg-muted">/mese</span>
          </p>
          <p className="mt-4 max-w-[56ch] text-lead text-fg-muted">Un canone fisso al mese, senza costi per utente. La configurazione la facciamo noi, partendo da come lavori oggi, anche dai tuoi file Excel.</p>

          <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
            {hubPacchetti.map((p) => {
              const consigliato = "consigliato" in p && p.consigliato;
              return (
                <article key={p.nome} aria-labelledby={`pk-${p.nome}`} className={cn("flex flex-col bg-bg p-6 md:p-8", consigliato && "bg-bg-raised")}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 id={`pk-${p.nome}`} className="text-2xl font-extrabold">
                      {p.nome}
                    </h3>
                    {consigliato && <span className="bg-accent px-2 py-1 text-xs font-bold uppercase tracking-wide text-accent-ink">Il più scelto</span>}
                  </div>
                  <p className="mono mt-6 text-fg-muted">{p.limiti}</p>
                  <p className="mt-4 text-fg-muted">{p.perChi}</p>
                  <ul className="mt-6 grid gap-3 border-t border-line pt-6">
                    {p.include.map((x) => (
                      <li key={x} className="flex gap-3">
                        <Check size={18} aria-hidden className="mt-0.5 shrink-0 text-accent-text" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
            <article aria-labelledby="pk-su-misura" className="flex flex-col bg-bg p-6 md:p-8">
              <h3 id="pk-su-misura" className="text-2xl font-extrabold">
                {hubSuMisura.nome}
              </h3>
              <p className="mono mt-6 text-fg-muted">{hubSuMisura.prezzo}</p>
              <p className="mt-4 text-fg-muted">{hubSuMisura.perChi}</p>
              <ul className="mt-6 grid gap-3 border-t border-line pt-6">
                {hubSuMisura.include.map((x) => (
                  <li key={x} className="flex gap-3">
                    <Check size={18} aria-hidden className="mt-0.5 shrink-0 text-accent-text" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-1 items-end">
                <a href={hubSuMisuraLink} target="_blank" rel="noopener" className="btn btn-ghost w-full">
                  <MessageCircle size={18} strokeWidth={2} aria-hidden />
                  <span>Parliamone</span>
                  <span className="sr-only"> (si apre WhatsApp)</span>
                </a>
              </div>
            </article>
          </div>
          <p className="mt-6 text-sm text-fg-muted">Tablet su richiesta: se servono, li concordiamo insieme prima del preventivo.</p>

          <div className="mt-10 grid gap-6 border border-accent p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="mono text-accent-text">Per iniziare</p>
              <p className="mt-3 text-2xl font-extrabold md:text-3xl">{HUB_PRIMO_MESE.titolo}.</p>
              <p className="mt-3 max-w-[60ch] text-fg-muted">{HUB_PRIMO_MESE.testo}</p>
            </div>
            <DemoHubButton posizione="hub_primo_mese" className="w-full md:w-auto" />
          </div>
        </div>
      </section>

      {/* Chiusura */}
      <section aria-labelledby="hub-cta-title" className="border-t border-line">
        <div className="wrap py-24 md:py-36">
          <SplitReveal as="h2" id="hub-cta-title" className="max-w-[16ch] text-display">
            A che punto sono i tuoi lavori, adesso?
          </SplitReveal>
          <p className="mt-6 max-w-[50ch] text-lead text-fg-muted">Scrivici su WhatsApp: in 10 minuti, in chat o in chiamata, ti facciamo vedere l&apos;HUB con i problemi della tua attività.</p>
          <div className="mt-10">
            <DemoHubButton posizione="hub_finale" className="w-full sm:w-auto" />
          </div>
        </div>
      </section>
      <JsonLd data={jsonLd} />
    </>
  );
}

function Screenshot({ src, w, h, alt }: { src: string; w: number; h: number; alt: string }) {
  return (
    <figure className="min-w-0 overflow-hidden border border-line bg-bg-sunken">
      <Image src={src} alt={alt} width={w} height={h} className="h-auto w-full" sizes="(min-width: 1024px) 55vw, 100vw" />
    </figure>
  );
}
