import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { azienda } from "@/data/azienda";
import { coppie, lati, passi, prodotti } from "@/data/home";
import { HUB_DA } from "@/data/hub";
import { cn } from "@/lib/cn";
import { LavoriGriglia } from "./LavoriNastro";
import { LenteBox } from "./Lente";
import { Quiz } from "./Quiz";
import { TreTasti } from "./TreTasti";

const euro = (n: number) => `${n.toLocaleString("it-IT")} €`;

/** 2 · Due lati dello stesso lavoro: dentro (ordine) e fuori (farsi vedere). */
export function DueLati() {
  return (
    <section id="due-lati" aria-labelledby="lati-title" className="wrap scroll-mt-16 py-20 md:py-28">
      <p className="mono text-accent-text">Cosa facciamo</p>
      <h2 id="lati-title" className="mt-4 max-w-[14ch] text-title">
        Due lati dello stesso lavoro.
      </h2>
      <Reveal y={0} className="mt-10 grid gap-px border border-line-strong bg-line-strong md:grid-cols-2">
        {lati.map((l) => (
          <div key={l.id} className={cn("flex flex-col gap-4 p-6 md:p-10", l.id === "dentro" ? "bg-bg-raised" : "bg-bg")}>
            <p className="mono text-fg-muted">{l.etichetta}</p>
            <h3 className="text-[clamp(2rem,1rem+3vw,3.6rem)] leading-[0.95]">{l.titolo}</h3>
            <p className="max-w-[40ch] text-lead text-fg-muted">{l.frase}</p>
            <a href="#prodotti" className="link-line mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-2 font-semibold">
              {l.prodotti.join(" · ")}
              <ArrowRight size={16} aria-hidden />
            </a>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/** 3 · Prodotti: quattro schede uguali, prezzo sempre «da». */
export function Prodotti() {
  return (
    <section id="prodotti" aria-labelledby="prodotti-title" className="scroll-mt-16 border-t border-line bg-bg-raised">
      <div className="wrap py-20 md:py-28">
        <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <p className="mono text-accent-text">Prodotti</p>
            <h2 id="prodotti-title" className="mt-4 max-w-[14ch] text-title">
              Quattro modi di lavorare con noi.
            </h2>
          </div>
          <p className="max-w-[48ch] text-lead text-fg-muted">
            Niente pacchetti standard: ogni proposta parte da come lavori tu. <strong className="font-semibold text-fg">Ci adattiamo a te, non il contrario.</strong>
          </p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {prodotti.map((p) => (
            <li key={p.id} className="flex flex-col border border-line-strong bg-bg p-5 md:p-6">
              <p className="mono text-fg-muted">{p.lato}</p>
              <h3 className="mt-3 text-3xl leading-none">{p.nome}</h3>
              <p className="mt-4 font-semibold">{p.perChi}</p>
              <p className="mt-1 text-fg-muted">{p.risolve}</p>
              <p className="mt-6 flex-1">
                {p.da != null ? (
                  <>
                    <span className="text-fg-muted">da </span>
                    <span className="font-display text-4xl font-extrabold leading-none">{euro(p.da)}</span>
                    {p.unita && <span className="text-fg-muted"> {p.unita}</span>}
                  </>
                ) : (
                  <span className="font-display text-4xl font-extrabold leading-none">A preventivo</span>
                )}
              </p>
              <div className="mt-5 flex flex-col gap-1 border-t border-line pt-3">
                {p.href && (
                  <Link href={p.href} className="link-line inline-flex min-h-11 items-center gap-2 self-start font-semibold">
                    {p.linkLabel}
                    <ArrowRight size={16} aria-hidden />
                  </Link>
                )}
                <WhatsAppButton sezione={p.sezione} posizione={`prodotto_${p.id}`} variant="link" label={p.href ? "Chiedi su WhatsApp" : p.linkLabel} className="self-start" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 4 · L'HUB in breve: la lente prima/dopo e i tre tasti, in un blocco solo. Il resto è su /hub. */
export function HubBreve() {
  return (
    <section id="hub" aria-labelledby="hub-title" className="wrap scroll-mt-16 py-20 md:py-28">
      <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          <p className="mono text-accent-text">Dentro · Gestionale HUB</p>
          <h2 id="hub-title" className="mt-4 max-w-[13ch] text-title">
            Stessa giornata. Vista in ordine.
          </h2>
        </div>
        <p className="max-w-[48ch] text-lead text-fg-muted">
          Passa la lente: sotto c&apos;è oggi, dentro c&apos;è come diventa. Ogni cosa con un nome, una persona e uno stato.
        </p>
      </div>

      <LenteBox className="mt-8" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-12">
        <TreTasti />
        <div className="min-w-0">
          <h3 className="text-3xl leading-none md:text-4xl">Tre tasti e basta.</h3>
          <p className="mt-3 max-w-[46ch] text-fg-muted">
            Chi lavora tocca Inizio, Fatto o Problema, dal telefono, dal tablet o dal PC. Tu vedi a che punto è ogni lavoro, senza telefonare.
          </p>
          <ul className="mt-5 grid gap-3">
            {coppie.map((c) => (
              <li key={c.dopo} className="border-l-2 border-accent pl-4">
                <p className="text-sm text-fg-muted line-through decoration-rec/70">{c.prima}</p>
                <p className="font-semibold">{c.dopo}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/hub" className="btn btn-ghost">
              <span>Scopri l&apos;HUB</span>
              <ArrowRight size={17} aria-hidden />
            </Link>
            <p className="text-fg-muted">da {euro(HUB_DA)}/mese</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 5 · Lavori: quattro, con la nota sui concept subito sotto il titolo. */
export function Lavori() {
  return (
    <section id="lavori" aria-labelledby="lavori-title" className="scroll-mt-16 border-t border-line bg-bg-raised">
      <div className="wrap py-20 md:py-28">
        <p className="mono text-accent-text">Fuori · Lavori</p>
        <h2 id="lavori-title" className="mt-4 max-w-[16ch] text-title">
          Farsi vedere, fatto bene.
        </h2>
        <p className="mt-4 max-w-[60ch] text-fg-muted">
          I lavori segnati <span className="tag-concept mx-0.5 align-middle">Concept</span> sono progetti nostri per attività inventate: mostrano cosa sappiamo fare.
        </p>
        <div className="mt-8">
          <LavoriGriglia />
        </div>
        <Link href="/lavori" className="btn btn-ghost mt-8 w-full sm:w-auto">
          <span>Tutti i lavori</span>
          <ArrowRight size={17} aria-hidden />
        </Link>
      </div>
    </section>
  );
}

/** 6 · Come si parte, in tre passi. */
export function ComeSiParte() {
  return (
    <section id="come-si-parte" aria-labelledby="parte-title" className="wrap scroll-mt-16 py-20 md:py-28">
      <p className="mono text-accent-text">Come si parte</p>
      <h2 id="parte-title" className="mt-4 text-title">
        Si parte in tre passi.
      </h2>
      <Reveal as="ol" y={0} className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
        {passi.map((p, i) => (
          <li key={p.t} className="border-t border-line-strong pt-5">
            <p className="font-display text-5xl font-extrabold text-accent-text" aria-hidden>
              {i + 1}
            </p>
            <h3 className="mt-3 font-sans text-xl font-bold tracking-normal">{p.t}</h3>
            <p className="mt-2 text-fg-muted">{p.d}</p>
          </li>
        ))}
      </Reveal>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <WhatsAppButton sezione="Come si parte" posizione="come_si_parte" className="w-full sm:w-auto" />
        <p className="font-semibold">Consulenza e preventivo gratuiti.</p>
      </div>
    </section>
  );
}

/** 7 · Quiz: lo strumento per farsi scrivere. */
export function QuizSezione() {
  return (
    <section id="quiz" aria-labelledby="quiz-title" className="scroll-mt-16 border-t border-line bg-bg-raised">
      <div className="wrap grid gap-8 py-20 md:py-28 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div className="min-w-0">
          <p className="mono text-accent-text">Due minuti</p>
          <h2 id="quiz-title" className="mt-4 max-w-[11ch] text-title">
            Quanto caos c&apos;è da te?
          </h2>
          <p className="mt-5 max-w-[42ch] text-lead text-fg-muted">
            Otto domande. Alla fine sai dove perdi tempo e da dove partire. Il risultato lo vedi subito, senza lasciare l&apos;email.
          </p>
        </div>
        <Quiz />
      </div>
    </section>
  );
}

/** 8 · Contatti: WhatsApp ed email. */
export function Contatti() {
  return (
    <section id="contatti" aria-labelledby="contatti-title" className="wrap scroll-mt-16 py-24 md:py-36">
      <p className="mono text-accent-text">Contatti</p>
      <h2 id="contatti-title" className="mt-4 text-[clamp(2.2rem,1rem+5.6vw,6.5rem)] leading-[0.92]">
        <span className="block">Lavorare meglio.</span> <span className="block text-accent-text">Farsi vedere meglio.</span>
      </h2>
      <p className="mt-6 max-w-[46ch] text-lead text-fg-muted">Scrivici cosa fai e cosa non gira. Ti rispondiamo noi, e ti diciamo da dove partiremmo.</p>
      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <WhatsAppButton sezione="Contatti" posizione="contatti_home" label={`WhatsApp ${azienda.telefono.replace("+39 ", "")}`} className="w-full sm:w-auto" />
        <a href={`mailto:${azienda.email}`} className="link-line inline-flex min-h-11 items-center break-all font-semibold">
          <span className="sr-only">Email: </span>
          {azienda.email}
        </a>
      </div>
    </section>
  );
}
