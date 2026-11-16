import type { Metadata } from "next";
import Image from "next/image";
import { BellRing, CalendarClock, Check, PhoneOff, Smartphone } from "lucide-react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SmartVideo } from "@/components/media/SmartVideo";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { FaqList } from "@/components/sections/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  impiantiDemo,
  impiantiDomande,
  impiantiPassi,
  impiantiRisultati,
  impiantiScadenzario,
  impiantiSuMisura,
  waImpianti,
} from "@/data/impianti";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Planning interventi termoidraulici e caldaisti – Pavia, Lodi, Piacenza",
  description:
    "Interventi tra WhatsApp, Excel e telefonate? Un planning unico per ufficio e tecnici, dal telefono. Per termoidraulici e caldaisti. Prova di 30 giorni.",
  path: "/impianti",
});

const iconeRisultati = [PhoneOff, Smartphone, BellRing];

export default function ImpiantiPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: impiantiDomande.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Planning interventi per termoidraulici e caldaisti",
    serviceType: "Software di pianificazione degli interventi",
    url: `${SITE_URL}/impianti`,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: ["Pavia", "Lodi", "Piacenza", "Italia"],
    audience: { "@type": "BusinessAudience", name: "Termoidraulici e caldaisti" },
  };

  return (
    <>
      {/* Apertura: il problema, la soluzione, il video */}
      <section className="wrap grid gap-10 pb-16 pt-28 md:pt-40 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-20">
        <div className="min-w-0">
          <p className="mono text-fg-muted">Per termoidraulici e caldaisti</p>
          <SplitReveal as="h1" immediate className="mt-4 max-w-[15ch] text-display">
            Interventi tra WhatsApp, Excel e telefonate?
          </SplitReveal>
          <p className="mt-6 max-w-[40ch] text-[clamp(1.35rem,1rem+1.4vw,2rem)] font-extrabold leading-tight">Un planning unico per ufficio e tecnici.</p>
          <p className="mt-5 max-w-[50ch] text-lead text-fg-muted">
            L&apos;ufficio inserisce l&apos;intervento, il tecnico lo vede sul telefono e in ufficio sapete sempre a che punto è la giornata. Senza rincorrere nessuno.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppButton href={waImpianti} sezione="impianti" posizione="impianti_hero" className="w-full sm:w-auto" />
            <a href="#come" className="btn btn-ghost w-full sm:w-auto">
              Come funziona
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[330px]">
          <PhoneFrame screenAspect="9 / 16">
            <SmartVideo
              src={impiantiDemo}
              label="Demo del planning interventi"
              description="Demo di 39 secondi con dati di prova: il planning del giorno in ufficio, l'ufficio sposta un intervento e sul telefono del tecnico arriva il nuovo orario con il tasto Letto; il tecnico segnala un ritardo di 30 minuti, poi chiude l'intervento e in ufficio arriva l'avviso; infine il monitor dell'ufficio con la giornata della squadra in diretta."
              className="h-full w-full"
              priority
            />
          </PhoneFrame>
          <p className="mono mt-4 text-center text-fg-muted">Demo · 39 s · dati di prova</p>
        </div>
      </section>

      {/* Come funziona in 3 passi */}
      <section id="come" aria-labelledby="come-title" className="scroll-mt-20 border-t border-line">
        <div className="wrap py-16 md:py-28">
          <h2 id="come-title" className="max-w-[16ch] text-title">
            Come funziona, in tre passi
          </h2>
          <p className="mt-4 max-w-[56ch] text-lead text-fg-muted">Schermate del planning con dati di prova: nomi, clienti e indirizzi sono inventati.</p>
          <ol className="mt-12 grid gap-16 md:mt-16 md:gap-20">
            {impiantiPassi.map((p, i) => (
              <li key={p.n} className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:items-center lg:gap-16">
                <Reveal className={i % 2 === 1 ? "min-w-0 lg:order-2" : "min-w-0"}>
                  <p className="mono text-accent-text">{p.n}</p>
                  <h3 className="mt-3 text-[clamp(1.6rem,1rem+2vw,2.6rem)] font-extrabold leading-[1.05]">{p.titolo}</h3>
                  <p className="mt-4 max-w-[46ch] text-lead text-fg-muted">{p.testo}</p>
                </Reveal>
                <Reveal className="min-w-0">
                  {p.n === "01" && (
                    <Screenshot
                      src="/media/impianti/ufficio-giorno.webp"
                      w={1600}
                      h={1000}
                      alt="Il planning del giorno in ufficio: una colonna per ogni tecnico con orari, clienti, caldaie e indirizzi (dati di prova)"
                    />
                  )}
                  {p.n === "02" && (
                    <div className="mx-auto grid max-w-[460px] grid-cols-2 gap-4 sm:gap-6">
                      <PhoneShot src="/media/impianti/telefono-letto.webp" alt="Sul telefono del tecnico: orario cambiato dalle 14:00 alle 14:30, con il tasto Letto (dati di prova)" />
                      <PhoneShot src="/media/impianti/telefono-ritardo.webp" alt="Sul telefono del tecnico: Imprevisto, Ritardo con la scelta 15, 30, 45 o 60 minuti (dati di prova)" />
                    </div>
                  )}
                  {p.n === "03" && (
                    <Screenshot
                      src="/media/impianti/monitor.webp"
                      w={1600}
                      h={900}
                      alt="Il monitor dell'ufficio: la giornata di cinque tecnici in diretta e l'avviso grande «Luca B. ha chiuso» (dati di prova)"
                    />
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Risultati concreti */}
      <section aria-labelledby="risultati-title" className="border-t border-line">
        <div className="wrap py-16 md:py-28">
          <h2 id="risultati-title" className="max-w-[16ch] text-title">
            Cosa cambia nella giornata
          </h2>
          <ul className="mt-10 grid gap-px border border-line bg-line md:mt-14 md:grid-cols-3">
            {impiantiRisultati.map(({ titolo, testo }, i) => {
              const Icon = iconeRisultati[i];
              return (
                <li key={titolo} className="flex flex-col gap-4 bg-bg p-6 md:p-8">
                  <Icon size={26} aria-hidden className="text-accent-text" />
                  <h3 className="text-2xl font-extrabold">{titolo}</h3>
                  <p className="text-fg-muted">{testo}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex gap-4 border border-accent p-6 md:p-8">
            <CalendarClock size={26} aria-hidden className="mt-1 shrink-0 text-accent-text" />
            <div>
              <h3 className="text-2xl font-extrabold">{impiantiScadenzario.titolo}</h3>
              <p className="mt-3 max-w-[60ch] text-fg-muted">{impiantiScadenzario.testo}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Su misura */}
      <section aria-labelledby="misura-title" className="border-t border-line">
        <div className="wrap grid gap-10 py-16 md:py-28 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <h2 id="misura-title" className="max-w-[16ch] text-title">
              Fatto su misura per la vostra azienda
            </h2>
            <p className="mt-5 max-w-[50ch] text-lead text-fg-muted">
              Non dovete cambiare il vostro modo di lavorare: è il planning che si adatta a voi. Partiamo dal vostro foglio, dai vostri tecnici e dalle vostre abitudini.
            </p>
          </div>
          <ul className="grid content-start gap-4 border-t border-line pt-6 lg:mt-2">
            {impiantiSuMisura.map((x) => (
              <li key={x} className="flex gap-3 text-lg">
                <Check size={20} aria-hidden className="mt-1 shrink-0 text-accent-text" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Domande */}
      <div id="domande" className="scroll-mt-20 border-t border-line">
        <FaqList items={impiantiDomande} title="Domande frequenti" />
      </div>

      {/* Prova e contatto */}
      <section aria-labelledby="prova-title" className="border-t border-line">
        <div className="wrap py-20 md:py-36">
          <p className="mono text-accent-text">Prova di 30 giorni</p>
          <SplitReveal as="h2" id="prova-title" className="mt-4 max-w-[16ch] text-display">
            Provatelo un mese con la vostra squadra.
          </SplitReveal>
          <p className="mt-6 max-w-[50ch] text-lead text-fg-muted">
            Lo prepariamo sulla vostra azienda e lo usate per 30 giorni con i vostri tecnici. Poi decidete voi. Scriveteci su WhatsApp e vi spieghiamo tutto.
          </p>
          <div className="mt-10">
            <WhatsAppButton href={waImpianti} sezione="impianti" posizione="impianti_prova" className="w-full sm:w-auto" />
          </div>
          <p className="mt-4 text-sm text-fg-muted">WhatsApp 350 070 4573</p>
        </div>
      </section>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
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

function PhoneShot({ src, alt }: { src: string; alt: string }) {
  return (
    <PhoneFrame screenAspect="390 / 844">
      <Image src={src} alt={alt} width={600} height={1298} className="h-auto w-full" sizes="(min-width: 640px) 220px, 45vw" />
    </PhoneFrame>
  );
}
