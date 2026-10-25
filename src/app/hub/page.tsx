import type { Metadata } from "next";
import Image from "next/image";
import { Check, Factory, Hammer, Zap } from "lucide-react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SmartVideo } from "@/components/media/SmartVideo";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { DemoHubButton } from "@/components/ui/DemoHubButton";
import { JsonLd } from "@/components/ui/JsonLd";
import { HUB_PROVA, hubPacchetti, hubSpot } from "@/data/hub";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata: Metadata = pageMetadata({
  title: "LIMITLESS HUB | Gli ordini dell'officina, fase per fase",
  description:
    "Tablet in reparto, ordini fase per fase e portale del cliente per officine conto terzi, carpenterie e impiantisti. Da 290 €/mese, prova 30 giorni a 300 €.",
  path: "/hub",
});

const euro = (n: number) => `${n.toLocaleString("it-IT")} €`;

const passi = [
  {
    n: "01",
    titolo: "Il tablet in reparto",
    testo: "I ragazzi segnano inizio e fine di ogni lavoro con tre pulsanti: I lavori, Materiale, Problema. Niente password da ricordare, niente prezzi a vista.",
    img: { src: "/media/hub/reparto.webp", w: 1280, h: 600, alt: "Schermata del tablet di reparto con tre pulsanti grandi: I lavori, Materiale, Problema" },
  },
  {
    n: "02",
    titolo: "Ogni ordine, fase per fase",
    testo: "Taglio, lavorazione, terzista, collaudo, spedizione: ogni ordine avanza da solo mentre il reparto lavora. Dall'ufficio o dal telefono vedi ritardi e pezzi fuori casa prima che chiami il cliente.",
    img: { src: "/media/hub/titolare.webp", w: 1280, h: 800, alt: "Schermata Il punto del titolare: lavori in ritardo, problemi aperti, consegne della settimana e commesse a rischio" },
  },
  {
    n: "03",
    titolo: "Il portale del cliente",
    testo: "Il tuo cliente apre un link e vede da solo a che punto è il suo ordine, la data di consegna e i DDT. Vede solo i suoi ordini: niente prezzi, niente terzisti, niente altri clienti.",
    img: { src: "/media/hub/portale.webp", w: 1280, h: 800, alt: "Portale del cliente: elenco degli ordini con la fase attuale e la data di consegna prevista" },
  },
];

const perChi = [
  { icon: Factory, titolo: "Officine conto terzi", testo: "Tornerie, fresature, lavorazioni meccaniche: tanti ordini piccoli, tante fasi, pezzi che vanno e vengono dai terzisti." },
  { icon: Hammer, titolo: "Carpenterie", testo: "Taglio laser, piegatura, saldatura, verniciatura: commesse che passano da un reparto all'altro e consegne da rispettare." },
  { icon: Zap, titolo: "Impiantisti", testo: "Impianti elettrici, idraulici e termici: lavori e materiale per ogni cantiere, e il cliente che chiede quando finite." },
];

export default function HubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "LIMITLESS HUB",
    url: `${SITE_URL}/hub`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "IT",
    offers: hubPacchetti.map((p) => ({
      "@type": "Offer",
      name: `LIMITLESS HUB ${p.nome}`,
      priceSpecification: { "@type": "UnitPriceSpecification", price: p.canone, priceCurrency: "EUR", unitText: "mese" },
    })),
  };

  return (
    <>
      {/* Apertura: il problema e lo spot */}
      <section className="wrap grid gap-12 pb-20 pt-32 md:pt-40 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-20">
        <div className="min-w-0">
          <p className="mono text-fg-muted">LIMITLESS HUB · per chi lavora conto terzi</p>
          <SplitReveal as="h1" immediate className="mt-4 max-w-[11ch] text-display">
            Dov&apos;è l&apos;ordine? Adesso lo sai.
          </SplitReveal>
          <p className="mt-8 max-w-[50ch] text-lead text-fg-muted">
            Il cliente chiama: &laquo;A che punto è il mio ordine?&raquo;. In ufficio nessuno lo sa. Si va in reparto, si chiama il terzista, si cerca il foglio sotto la pila.
          </p>
          <p className="mt-4 max-w-[50ch] text-lead">LIMITLESS HUB mette ogni ordine su uno schermo, fase per fase. La risposta arriva in tre secondi, non in tre telefonate.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <DemoHubButton posizione="hub_hero" className="w-full sm:w-auto" />
            <a href="#pacchetti" className="btn btn-ghost w-full sm:w-auto">
              Vedi i pacchetti
            </a>
          </div>
          <p className="mt-4 text-sm text-fg-muted">La demo la facciamo da voi, in officina, sul tablet. 10 minuti.</p>
        </div>
        <div className="mx-auto w-full max-w-[330px]">
          <PhoneFrame screenAspect="9 / 16">
            <SmartVideo
              src={hubSpot}
              label="Spot di LIMITLESS HUB «Il foglio»"
              description="Spot di 32 secondi: il cliente chiama per sapere a che punto è il suo ordine, in officina parte il giro tra reparto, terzista e spedizione. Con LIMITLESS HUB la scheda dell'ordine mostra subito che è in collaudo e parte giovedì."
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
          <p className="mt-5 max-w-[56ch] text-lead text-fg-muted">Schermate vere della demo, con dati di esempio. La configuriamo noi con i nomi dei vostri reparti e i vostri Excel.</p>
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
                            <Image src="/media/hub/portale-telefono.webp" alt="Il portale del cliente sul telefono: l'ordine dal terzista per zincatura, con le fasi e la consegna prevista" width={600} height={996} className="h-auto w-full" sizes="180px" />
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

      {/* Per chi è */}
      <section aria-labelledby="perchi-title" className="border-t border-line">
        <div className="wrap py-20 md:py-28">
          <h2 id="perchi-title" className="text-title">
            Per chi è
          </h2>
          <p className="mt-5 max-w-[56ch] text-lead text-fg-muted">Piccole aziende che lavorano su ordine, con un reparto e un ufficio, e clienti che vogliono sapere quando arriva il lavoro.</p>
          <ul className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
            {perChi.map(({ icon: Icon, titolo, testo }) => (
              <li key={titolo} className="flex flex-col gap-4 bg-bg p-6 md:p-8">
                <Icon size={24} aria-hidden className="text-accent-text" />
                <h3 className="text-xl font-bold">{titolo}</h3>
                <p className="text-fg-muted">{testo}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pacchetti e prova */}
      <section id="pacchetti" aria-labelledby="pacchetti-title" className="scroll-mt-20 border-t border-line">
        <div className="wrap py-20 md:py-28">
          <h2 id="pacchetti-title" className="text-title">
            Tre pacchetti, prezzo fisso
          </h2>
          <p className="mt-5 max-w-[56ch] text-lead text-fg-muted">Un canone al mese, senza costi per utente. La configurazione la facciamo noi, partendo dai vostri file Excel.</p>

          <div className="mt-12 grid gap-px border border-line bg-line lg:grid-cols-3">
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
                  <p className="mt-6">
                    <span className="font-display text-5xl font-extrabold">{euro(p.canone)}</span>
                    <span className="ml-1 text-fg-muted">/mese</span>
                  </p>
                  <p className="mono mt-3 text-fg-muted">{p.limiti}</p>
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
          </div>

          <div className="mt-10 grid gap-6 border border-accent p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="mono text-accent-text">Prova di {HUB_PROVA.giorni} giorni</p>
              <p className="mt-3 text-2xl font-extrabold md:text-3xl">{euro(HUB_PROVA.prezzo)} per provarlo un mese in officina.</p>
              <p className="mt-3 max-w-[60ch] text-fg-muted">
                Accendiamo fino a 5 funzioni sui vostri reparti veri. Se continuate, i {euro(HUB_PROVA.prezzo)} vengono scalati dal canone. Se non vi serve, ci si ferma lì.
              </p>
            </div>
            <DemoHubButton posizione="hub_prova" className="w-full md:w-auto" />
          </div>
        </div>
      </section>

      {/* Chiusura */}
      <section aria-labelledby="hub-cta-title" className="border-t border-line">
        <div className="wrap py-24 md:py-36">
          <SplitReveal as="h2" id="hub-cta-title" className="max-w-[14ch] text-display">
            Dove sono i tuoi ordini, adesso?
          </SplitReveal>
          <p className="mt-6 max-w-[50ch] text-lead text-fg-muted">Scrivici su WhatsApp: veniamo noi e in 10 minuti ti facciamo vedere l&apos;hub sul tablet, con i problemi della tua officina.</p>
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
