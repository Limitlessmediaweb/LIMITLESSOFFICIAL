"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Phone, Play, Plus, Search } from "lucide-react";
import { CONFRONTI } from "@/data/reparto";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/hooks";
import { fmtH, getSim, hhmm, STAZIONI, TABLET, type Commessa, type SimReparto, type StazioneId } from "./sim";

/** Hook: la simulazione condivisa, viva solo nel browser. */
export function useSim(): SimReparto | null {
  const hydrated = useHydrated();
  const sim = hydrated ? getSim() : null;
  useSyncExternalStore(sim ? sim.subscribe : noopSub, sim ? sim.getVersion : zero, zero);
  return sim;
}
const noopSub = () => () => {};
const zero = () => 0;

/** Testo con **grassetto** per i codici delle commesse. */
function Ricco({ t }: { t: string }) {
  return (
    <>
      {t.split(/\*\*(.+?)\*\*/g).map((p, i) => (i % 2 ? <b key={i}>{p}</b> : <span key={i}>{p}</span>))}
    </>
  );
}

function tagDi(sim: SimReparto, c: Commessa) {
  const s = sim.stateOf(c);
  const working = sim.isWorking(c);
  if (s === "done") return { t: "pronta", cls: "ok" };
  if (s === "bad") return { t: "in ritardo", cls: "bad" };
  if (s === "warn") {
    const f = sim.curFase(c)!;
    return { t: `+${Math.round((f.real / f.prev - 1) * 100)}% ore`, cls: "warn" };
  }
  if (!working) return { t: "in coda", cls: "" };
  return { t: `${Math.round(c.prog * 100)}%`, cls: "" };
}

/** Una scheda commessa nella colonna della sua fase. */
export function Chip({ sim, c, query, onOpen, compatta }: { sim: SimReparto; c: Commessa; query?: string; onOpen?: (code: string) => void; compatta?: boolean }) {
  const s = sim.stateOf(c);
  const working = sim.isWorking(c);
  const tag = tagDi(sim, c);
  const q = query?.toLowerCase();
  const hit = q ? c.code.toLowerCase().includes(q) || c.cliente.toLowerCase().includes(q) : null;
  const nuova = sim.tick - c.arrivedAt < 4;
  const cls = cn("rv-chip", s === "done" ? "is-done" : s === "bad" ? "is-bad" : s === "warn" ? "is-warn" : working ? "is-work" : "is-queue", hit === true && "is-hit", hit === false && "is-dim", nuova && "is-new");
  const inner = (
    <>
      <span className="rv-chip-top">
        <span className="rv-chip-code">{c.code}</span>
        <span className={cn("rv-chip-tag", tag.cls && `is-${tag.cls}`)}>{tag.t}</span>
      </span>
      {!compatta && <span className="rv-chip-cli">{c.cliente}</span>}
      {s !== "done" && working && (
        <span className="rv-prog">
          <i style={{ width: `${Math.round(c.prog * 100)}%` }} />
        </span>
      )}
    </>
  );
  if (!onOpen) return <div className={cls}>{inner}</div>;
  return (
    <button type="button" className={cls} onClick={() => onOpen(c.code)} aria-label={`Commessa ${c.code}, ${c.cliente}`}>
      {inner}
    </button>
  );
}

function Cronometro({ start }: { start: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const id = setInterval(() => {
      if (ref.current) ref.current.textContent = `${((performance.now() - start) / 1000).toFixed(1).replace(".", ",")} s`;
    }, 100);
    return () => clearInterval(id);
  }, [start]);
  return <span ref={ref}>0,0 s</span>;
}

export function Provalo({ nome }: { nome: string }) {
  const sim = useSim();
  const ref = useRef<HTMLElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<StazioneId>("sald");
  const [open, setOpen] = useState<string | null>(null);

  // la simulazione gira solo quando la sezione è a schermo
  useEffect(() => {
    if (!sim || !ref.current) return;
    const io = new IntersectionObserver(([e]) => sim.hold("provalo", e.isIntersecting), { rootMargin: "100px" });
    io.observe(ref.current);
    return () => {
      io.disconnect();
      sim.hold("provalo", false);
    };
  }, [sim]);

  const apri = (code: string) => {
    setOpen(code);
    sim?.opened(code);
    const d = dlg.current;
    if (d && !d.open) d.showModal();
  };

  const k = sim?.kpi();
  const aperta = sim && open ? sim.commesse.find((c) => c.code === open) : null;
  const tabletCur = sim ? sim.inStation(tab).filter((c) => sim.isWorking(c))[0] : undefined;
  const tabletSt = STAZIONI.find((s) => s.id === tab)!;
  const call = sim?.call;

  return (
    <section ref={ref} id="provalo" aria-labelledby="provalo-title" className="rv-prova scroll-mt-20">
      <div className="wrap py-16 md:py-28">
        <header className="rv-prova-head">
          <div className="min-w-0">
            <p className="mono text-accent-text">Provalo tu · dati di esempio</p>
            <h2 id="provalo-title" className="mt-4 max-w-[18ch] text-title">
              {nome ? `${nome}: un giorno di reparto.` : "Un giorno di reparto. Toccalo."}
            </h2>
            <p className="mt-4 max-w-[52ch] text-lead text-fg-muted">Le commesse avanzano da sole. Chiudi una fase dal tablet, fai arrivare un ordine, rispondi al telefono: guarda cosa succede senza che nessuno debba avvisare nessuno.</p>
          </div>
          <div className="rv-clock">
            <span className="rv-live">
              <i />
              {sim?.paused ? "FERMO" : "LIVE"}
            </span>
            <span className="rv-time">{sim ? hhmm(sim.simMin) : "08:12"}</span>
            <span className="text-sm text-fg-muted">1 s = 10 min</span>
            <button type="button" className="rv-iconbtn" onClick={() => sim?.setPaused(!sim.paused)} aria-label={sim?.paused ? "Riavvia la simulazione" : "Ferma la simulazione"}>
              {sim?.paused ? <Play size={15} aria-hidden /> : <Pause size={15} aria-hidden />}
            </button>
          </div>
        </header>

        <div className="rv-kpis" aria-label="Situazione del reparto">
          <div className="rv-kpi">
            <span className="rv-kpi-n">{k?.active ?? 8}</span>
            <span className="rv-kpi-l">commesse in lavoro</span>
          </div>
          <div className={cn("rv-kpi", k && k.late > 0 && "is-bad")}>
            <span className="rv-kpi-n">{k?.late ?? 2}</span>
            <span className="rv-kpi-l">da guardare adesso</span>
          </div>
          <div className={cn("rv-kpi", k && (k.pct > 108 ? "is-warn" : "is-good"))}>
            <span className="rv-kpi-n">{k?.pct ?? 100}%</span>
            <span className="rv-kpi-l">ore reali sul preventivo</span>
            <span className="rv-kpi-bar" style={{ width: `${Math.min(100, (k?.pct ?? 100) / 1.3)}%` }} />
          </div>
          <div className="rv-kpi">
            <span className="rv-kpi-n">{k?.ext ?? 12}</span>
            <span className="rv-kpi-l">pezzi fuori da noi</span>
          </div>
          <div className="rv-kpi is-good">
            <span className="rv-kpi-n">{k?.done ?? 1}</span>
            <span className="rv-kpi-l">pronte o ritirate oggi</span>
          </div>
        </div>

        <div className="rv-main">
          <div className="rv-card" aria-label="Reparto">
            <div className="rv-card-h">
              <h3>Il reparto</h3>
              <span>Tocca una commessa per vedere tutto</span>
            </div>
            <div className="rv-actions">
              <button type="button" className="rv-btn is-primary" onClick={() => sim?.newOrder(true)}>
                <Plus size={16} aria-hidden />
                Arriva un ordine
              </button>
              <button type="button" className="rv-btn is-ring" onClick={() => sim?.startCall()}>
                <Phone size={15} aria-hidden />
                Squilla il telefono
              </button>
              <label className="rv-search">
                <Search size={15} aria-hidden />
                <span className="sr-only">Cerca cliente o commessa</span>
                <input
                  type="search"
                  placeholder="Cerca cliente o commessa"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" || !sim || !query) return;
                    const q = query.toLowerCase();
                    const c = sim.commesse.find((x) => x.code.toLowerCase().includes(q) || x.cliente.toLowerCase().includes(q));
                    if (c) {
                      e.preventDefault();
                      apri(c.code);
                    }
                  }}
                />
              </label>
            </div>
            {call && (
              <div className={cn("rv-call", call.solved && "is-solved")} role="status" aria-live="polite">
                <div className="rv-call-q">
                  <b>{call.solved ? `Risposto a ${call.cliente} in ${call.secondi} secondi` : `Chiama ${call.cliente}`}</b>
                  <span>{call.solved ? "Oggi: attesa, giro in reparto, richiamata. Con l'Hub: mentre è ancora al telefono." : "«Buongiorno, a che punto è il nostro ordine?» Trovalo: tocca la sua commessa o cerca il nome."}</span>
                </div>
                <div className="rv-call-sw">{call.solved ? `${call.secondi} s` : <Cronometro start={call.start} />}</div>
                <button type="button" className="rv-call-x" onClick={() => sim?.closeCall()}>
                  Chiudi
                </button>
              </div>
            )}
            <div className="rv-floor">
              {STAZIONI.map((st) => {
                const list = sim ? sim.inStation(st.id) : [];
                return (
                  <div key={st.id} className={cn("rv-st", st.ext && "is-ext", st.end && "is-end")}>
                    <div className="rv-st-h">
                      <div className="rv-st-n">{st.name}</div>
                      <div className="rv-st-s">{st.sub}</div>
                    </div>
                    <div className="rv-st-b">
                      {sim && list.length === 0 && <div className="rv-empty">{st.end ? "Ancora niente" : "Libera"}</div>}
                      {sim && list.map((c) => <Chip key={c.code} sim={sim} c={c} query={query} onOpen={apri} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="rv-side">
            <div className="rv-card" aria-label="Tablet dell'operatore">
              <div className="rv-card-h">
                <h3>Tablet in reparto</h3>
                <span>Prova tu</span>
              </div>
              <div className="rv-tablet">
                <div className="rv-tabs" role="tablist">
                  {TABLET.map((id) => (
                    <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
                      {STAZIONI.find((s) => s.id === id)!.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
                <div className="rv-screen">
                  {tabletCur && sim ? (
                    <TabletCommessa sim={sim} c={tabletCur} nomeSt={tabletSt.name} />
                  ) : (
                    <>
                      <div className="rv-who">
                        {tabletSt.name} · {tabletSt.sub}
                      </div>
                      <div className="rv-big">Libera</div>
                      <div className="rv-sub">La prossima commessa arriva da sola quando la fase prima è chiusa.</div>
                      <div className="rv-tbtns">
                        <button type="button" className="rv-tbtn is-go" disabled>
                          Fine fase
                        </button>
                        <button type="button" className="rv-tbtn is-prob" disabled>
                          Segnala problema
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="rv-card" aria-label="Automazioni">
              <div className="rv-card-h">
                <h3>Automazioni</h3>
                <span>{sim?.evCount ?? 0} oggi</span>
              </div>
              <div className="rv-feed" aria-live="polite" data-lenis-prevent>
                {sim?.eventi.map((e) => (
                  <div key={e.id} className={cn("rv-ev", e.cls && `is-${e.cls}`)}>
                    <span className="rv-ev-t">{e.t}</span>
                    <div>
                      <div className="rv-ev-w">
                        <Ricco t={e.what} />
                      </div>
                      <div className="rv-ev-a">
                        <span>
                          <Ricco t={e.auto} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="rv-compare" aria-label="Prima e dopo">
          {CONFRONTI.map((c) => (
            <div key={c.titolo} className="rv-cmp">
              <h3>{c.titolo}</h3>
              <div className="rv-cmp-row">
                <span>Oggi</span>
                <p>{c.oggi}</p>
              </div>
              <div className="rv-cmp-row is-after">
                <span>Hub</span>
                <p>{c.hub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <dialog ref={dlg} className="rv-dlg" aria-labelledby="rv-d-code" data-lenis-prevent onClose={() => setOpen(null)} onClick={(e) => e.target === dlg.current && dlg.current?.close()}>
        <div className="rv-d-h">
          <div>
            <div className="rv-big" id="rv-d-code">
              {open ?? "C-0000"}
            </div>
            <div className="rv-sub">{aperta ? `${aperta.qty} × ${aperta.pezzo.toLowerCase()} · ${aperta.cliente}` : ""}</div>
          </div>
          <button type="button" className="rv-btn" onClick={() => dlg.current?.close()}>
            Chiudi
          </button>
        </div>
        <div className="rv-d-b">{sim && open && (aperta ? <Dettaglio sim={sim} c={aperta} /> : <div className="rv-next">Commessa ritirata e chiusa. Fattura pronta da emettere.</div>)}</div>
      </dialog>
    </section>
  );
}

function TabletCommessa({ sim, c, nomeSt }: { sim: SimReparto; c: Commessa; nomeSt: string }) {
  const f = sim.curFase(c)!;
  const over = f.real > f.prev * 1.12;
  return (
    <>
      <div className="rv-who">{nomeSt} · in lavoro adesso</div>
      <div className="rv-big">{c.code}</div>
      <div className="rv-sub">
        {c.qty} × {c.pezzo.toLowerCase()} · {c.cliente}
      </div>
      <div className="rv-hours">
        <b className={over ? "is-over" : undefined}>{fmtH(f.real)}</b>
        <span>su {fmtH(f.prev)} preventivate</span>
      </div>
      <span className={cn("rv-prog", over && "is-over")}>
        <i style={{ width: `${Math.round(c.prog * 100)}%` }} />
      </span>
      <div className="rv-tbtns">
        <button type="button" className="rv-tbtn is-go" onClick={() => sim.advance(c, true)}>
          Fine fase
        </button>
        <button type="button" className="rv-tbtn is-prob" disabled={!!c.flags.prob} onClick={() => sim.segnalaProblema(c)}>
          Segnala problema
        </button>
      </div>
    </>
  );
}

function Dettaglio({ sim, c }: { sim: SimReparto; c: Commessa }) {
  const s = sim.stateOf(c);
  const where = sim.stationOf(c);
  const stName = STAZIONI.find((x) => x.id === where)!.name;
  const max = useMemo(() => Math.max(1, ...c.fasi.map((f) => Math.max(f.prev, f.real))), [c, sim.version]); // eslint-disable-line react-hooks/exhaustive-deps
  const num = (n: number) => n.toFixed(1).replace(".", ",");
  return (
    <>
      <div className="rv-facts">
        <div className="rv-fact">
          <div>Adesso è in</div>
          <b>{stName}</b>
        </div>
        <div className="rv-fact">
          <div>Consegna promessa</div>
          <b>{c.consegna}</b>
        </div>
        <div className="rv-fact">
          <div>Stato</div>
          <b>
            <span className={cn("rv-pill", s === "bad" ? "is-bad" : s === "warn" ? "is-warn" : "is-ok")}>{s === "done" ? "pronta" : s === "bad" ? "terzista in ritardo" : s === "warn" ? "ore oltre il preventivo" : "nei tempi"}</span>
          </b>
        </div>
      </div>
      <div className="rv-steps">
        {c.fasi.map((f, i) => {
          const st = STAZIONI.find((x) => x.id === f.id)!;
          const ext = f.id === "est";
          const val = ext ? (i < c.idx ? "rientrata" : i === c.idx ? (c.extLate ? "in ritardo" : "fuori") : "—") : `${i > c.idx ? "—" : num(f.real)} / ${num(f.prev)} h`;
          return (
            <div key={f.id} className={cn("rv-step", i === c.idx && "is-cur", i > c.idx && "is-fut")}>
              <span className="rv-step-n">{st.name}</span>
              <div className="rv-hb">
                {ext ? (
                  <div className={cn("rv-hb-r", c.extLate && i === c.idx ? "is-bad" : "is-ext")} style={{ width: `${i < c.idx ? 100 : i === c.idx ? Math.round(c.prog * 100) : 0}%` }} />
                ) : (
                  <>
                    <div className="rv-hb-p" style={{ width: `${(f.prev / max) * 100}%` }} />
                    <div className={cn("rv-hb-r", f.real > f.prev * 1.12 && "is-over")} style={{ width: `${(f.real / max) * 100}%` }} />
                  </>
                )}
              </div>
              <span className="rv-step-v">{val}</span>
            </div>
          );
        })}
      </div>
      <div className="rv-legend">
        <span>
          <i className="is-prev" />
          ore preventivate
        </span>
        <span>
          <i className="is-real" />
          ore reali
        </span>
        <span>
          <i className="is-over" />
          oltre il preventivo
        </span>
      </div>
      <div className="rv-next">
        <b>Cosa rispondere al cliente:</b> {sim.cosaRispondere(c)}
      </div>
    </>
  );
}
