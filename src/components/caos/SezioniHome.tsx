import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { PhoneFrame } from "@/components/media/PhoneFrame";
import { Reveal } from "@/components/motion/Reveal";
import { DemoHubButton } from "@/components/ui/DemoHubButton";
import { azienda } from "@/data/azienda";
import { passi, perTe, QUIZ_WHATSAPP, riconosci } from "@/data/home";
import { HUB_DISDETTA_GIORNI, HUB_MINIMO_MESI, HUB_PROVA_PREZZO, hubPacchetti, hubSuMisura, hubSuMisuraLink } from "@/data/hub";
import { cn } from "@/lib/cn";
import { Messy } from "./Cose";
import { Quiz } from "./Quiz";

/** 2 · Lo riconosci? Tre frasi, con due fogli rimasti dall'hero: il disordine ti segue. */
export function Riconosci() {
  return (
    <section id="riconosci" aria-labelledby="riconosci-title" className="relative overflow-hidden">
      <div className="wrap relative py-24 md:py-40">
        <p className="mono text-accent-text">Lo riconosci?</p>
        <h2 id="riconosci-title" className="mt-4 max-w-[14ch] text-display">
          Il lavoro c&apos;è. Il problema è trovarlo.
        </h2>
        <Reveal as="ul" className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10" stagger={0.1}>
          {riconosci.map((r) => (
            <li key={r.t} className="border-t border-line-strong pt-5">
              <h3 className="font-sans text-xl font-bold tracking-normal md:text-2xl">{r.t}</h3>
              <p className="mt-2 text-lead text-fg-muted">{r.d}</p>
            </li>
          ))}
        </Reveal>
        <p className="mt-12 max-w-[44ch] text-lead">Non è colpa di nessuno. È che il lavoro vive tra WhatsApp, Excel e la tua testa.</p>
        <div aria-hidden className="pointer-events-none absolute -right-6 top-10 rotate-[9deg] opacity-90 md:right-[8%] md:top-16">
          <Messy c={{ k: "postit", m: "Richiamare Rossi!!", t: "", st: "" }} />
        </div>
        <div aria-hidden className="pointer-events-none absolute -bottom-10 right-[12%] hidden -rotate-6 md:block">
          <Messy c={{ k: "paper", s: "Foglio sul bancone", m: "Consegna venerdì (forse)", t: "", st: "" }} />
        </div>
      </div>
    </section>
  );
}

/** 5 · Per te che decidi: il punto del titolare. */
export function PerTe() {
  return (
    <section id="per-te" aria-labelledby="perte-title" className="wrap scroll-mt-16 py-24 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
        <div className="min-w-0">
          <p className="mono text-accent-text">Per te che decidi</p>
          <h2 id="perte-title" className="mt-4 max-w-[13ch] text-title">
            A che punto è il lavoro? Adesso lo sai.
          </h2>
          <p className="mt-6 max-w-[48ch] text-lead text-fg-muted">
            Apri il telefono e vedi tutto: cosa è in corso, cosa è fermo, chi ce l&apos;ha in mano. Quando il cliente chiama, rispondi in dieci secondi. Senza
            richiamare.
          </p>
          <Reveal as="ul" className="mt-8 grid gap-4" stagger={0.08}>
            {perTe.map((x) => (
              <li key={x.t} className="border-l-2 border-accent pl-4">
                <strong className="font-bold">{x.t}</strong> <span className="text-fg-muted">{x.d}</span>
              </li>
            ))}
          </Reveal>
          <p className="mt-8 max-w-[48ch] text-fg-muted">Il programma delle fatture resta il tuo. Noi mettiamo in ordine il lavoro.</p>
        </div>
        <Reveal className="relative min-w-0 pb-10">
          <figure className="overflow-hidden border border-line-strong bg-bg-sunken">
            <Image
              src="/media/hub/titolare.webp"
              alt="LIMITLESS HUB, il punto del titolare: lavori in ritardo, problemi aperti, consegne della settimana e lavori a rischio"
              width={1280}
              height={800}
              className="h-auto w-full"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </figure>
          <div className="absolute -bottom-2 right-3 w-[30%] max-w-[160px] sm:right-6">
            <PhoneFrame screenAspect="600 / 1100">
              <div className="h-full bg-[#eef1f4] pt-[10%]">
                <Image
                  src="/media/hub/portale-telefono.webp"
                  alt="Il portale del cliente sul telefono: un ordine con le sue fasi e la consegna prevista"
                  width={600}
                  height={996}
                  className="h-auto w-full"
                  sizes="160px"
                />
              </div>
            </PhoneFrame>
          </div>
        </Reveal>
      </div>
      <p className="mt-16 max-w-[20ch] font-display text-[clamp(2.2rem,1rem+4.4vw,5.5rem)] font-extrabold leading-[0.95]">
        Ci adattiamo alla tua attività, <span className="text-accent-text">non il contrario.</span>
      </p>
    </section>
  );
}

/** 7 · Come si parte: tre passi. Niente effetti: dopo tanto movimento, la calma. */
export function ComeSiParte() {
  return (
    <section id="come-si-parte" aria-labelledby="parte-title" className="scroll-mt-16 border-t border-line bg-bg-raised">
      <div className="wrap py-24 md:py-32">
        <p className="mono text-accent-text">Come si parte</p>
        <h2 id="parte-title" className="mt-4 text-title">
          Si parte in tre passi.
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {passi.map((p, i) => (
            <li key={p.t} className="border-t border-line-strong pt-5">
              <p className="font-display text-5xl font-extrabold text-accent-text" aria-hidden>
                {i + 1}
              </p>
              <h3 className="mt-3 font-sans text-xl font-bold tracking-normal">{p.t}</h3>
              <p className="mt-2 text-fg-muted">{p.d}</p>
            </li>
          ))}
        </ol>
        <DemoHubButton posizione="come_si_parte" className="mt-12 w-full sm:w-auto" />
      </div>
    </section>
  );
}

/** 8 · Prezzi: quattro riquadri fermi, cifre grandi. */
export function Prezzi() {
  return (
    <section id="prezzi" aria-labelledby="prezzi-title" className="wrap scroll-mt-16 py-24 md:py-36">
      <p className="mono text-accent-text">Prezzi</p>
      <h2 id="prezzi-title" className="mt-4 max-w-[16ch] text-title">
        Prezzo fisso. Niente costi per utente.
      </h2>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {hubPacchetti.map((p) => {
          const top = "consigliato" in p && p.consigliato;
          return (
            <li key={p.nome} className={cn("flex flex-col border p-5 md:p-6", top ? "border-accent" : "border-line-strong")}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-3xl">{p.nome}</h3>
                {top && <span className="pill ok">Il più scelto</span>}
              </div>
              <p className="mt-4">
                <span className="font-display text-6xl font-extrabold leading-none">{p.prezzo} €</span>
                <span className="text-fg-muted"> /mese</span>
              </p>
              <p className="mono mt-3 text-fg-muted">{p.limiti}</p>
              <p className="mt-3 text-fg-muted">{p.perChi}</p>
              <ul className="mt-4 grid gap-1.5 text-sm text-fg-muted">
                {p.include.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 bg-accent" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-col gap-4 border border-line-strong p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <h3 className="text-3xl">{hubSuMisura.nome}</h3>
          <p className="mt-2 text-fg-muted">
            {hubSuMisura.perChi} {hubSuMisura.prezzo}.
          </p>
        </div>
        <a href={hubSuMisuraLink} target="_blank" rel="noopener" className="btn btn-ghost">
          <MessageCircle size={18} aria-hidden />
          <span>Parliamone</span>
          <span className="sr-only"> (si apre WhatsApp)</span>
        </a>
      </div>
      <div className="mt-8 grid max-w-[70ch] gap-3 text-fg-muted">
        <p>
          <strong className="text-fg">Prova di 30 giorni a {HUB_PROVA_PREZZO} €, scalati se continui.</strong> Dopo la prova, minimo {HUB_MINIMO_MESI} mesi. Poi mese
          per mese, con disdetta scritta {HUB_DISDETTA_GIORNI} giorni prima.
        </p>
        <p>Fattura con partita IVA in regime forfettario: ai prezzi non si aggiunge l&apos;IVA. I tablet non sono inclusi: se servono, ne parliamo prima del preventivo.</p>
      </div>
    </section>
  );
}

/** 10 · Quiz e contatto finale: i fogli dell'hero tornano un'ultima volta, impilati dritti. */
export function QuizFinale() {
  return (
    <section id="quiz" aria-labelledby="quiz-title" className="scroll-mt-16 border-t border-line bg-bg-raised">
      <div className="wrap grid gap-10 py-24 md:py-32 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div className="min-w-0">
          <p className="mono text-accent-text">Due minuti</p>
          <h2 id="quiz-title" className="mt-4 max-w-[11ch] text-display">
            Quanto caos c&apos;è da te?
          </h2>
          <p className="mt-6 max-w-[42ch] text-lead text-fg-muted">
            Otto domande, due minuti. Alla fine sai dove perdi tempo e da dove partire. Il risultato lo vedi subito, senza lasciare l&apos;email.
          </p>
          <a href={QUIZ_WHATSAPP} target="_blank" rel="noopener" className="link-line mt-8 inline-flex min-h-11 items-center gap-2 font-semibold">
            <MessageCircle size={18} aria-hidden />
            Preferisci parlare? WhatsApp {azienda.telefono.replace("+39 ", "")}
            <span className="sr-only"> (si apre WhatsApp)</span>
          </a>
          <div aria-hidden className="mt-10 hidden w-[150px] lg:block">
            <div className="h-3 border border-black/10 bg-[var(--postit)]" />
            <div className="h-3 border border-black/10 bg-[var(--paper)]" />
            <div className="h-3 border border-black/10 bg-[var(--paper)]" />
            <p className="mono mt-2 text-fg-muted">Tutto in una pila sola</p>
          </div>
        </div>
        <Quiz />
      </div>
    </section>
  );
}
