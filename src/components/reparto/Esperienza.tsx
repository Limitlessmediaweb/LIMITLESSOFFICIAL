"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Phone, X } from "lucide-react";
import { AVVISO_TERZISTA, CHIUSURA, COMMESSE_STORIA, FOOTER_REPARTO, POSTAZIONI, SCENE, pulisciAzienda, titoloReparto, waReparto, type PostazioneId } from "@/data/reparto";
import { azienda } from "@/data/azienda";
import { tilt, tiltAuto, tiltEnable, tiltNeedsTap } from "@/components/caos/fisica";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { Chip, Provalo, useSim } from "./Provalo";
import { STAZIONI } from "./sim";
import { TecaPoster } from "./TecaPoster";
import type { InfoFrame, Scena, StatoPostazione, Tier } from "./scena3d";

const CONFINI = [0.15, 0.35, 0.55, 0.77];
const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const num = (n: number) => n.toFixed(1).replace(".", ",");
const nomePostazione = (id: PostazioneId) => POSTAZIONI.find((p) => p.id === id)!.nome;

/** Situazione fissa per la versione statica (senza 3D). */
const STATICHE: StatoPostazione[] = POSTAZIONI.map((p, i) => {
  const c = COMMESSE_STORIA[i];
  const pct = [55, 20, 82, 70, 99][i];
  const real = (pct / 100) * c.prev * c.ritmo;
  return { id: p.id, code: c.code, cliente: c.cliente, pezzo: c.pezzo, pct, prev: c.prev, real, over: real > c.prev * 1.04, libera: false };
});

const noop = () => () => {};
function leggiAzienda() {
  try {
    return pulisciAzienda(new URLSearchParams(window.location.search).get("azienda"));
  } catch {
    return "";
  }
}

const leggiRiduci = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Gioco = { fase: "attesa" } | { fase: "squilla"; target: StatoPostazione; start: number; sbagliata: PostazioneId | null } | { fase: "risolto"; target: StatoPostazione; secondi: string };

export function Esperienza() {
  const nome = useSyncExternalStore(noop, leggiAzienda, () => "");
  const root = useRef<HTMLDivElement>(null);
  const stageA = useRef<HTMLElement>(null);
  const stageB = useRef<HTMLElement>(null);
  const hostA = useRef<HTMLDivElement>(null);
  const hostB = useRef<HTMLDivElement>(null);
  const labs = useRef<Record<string, HTMLElement | null>>({});
  const cache = useRef<Record<string, string>>({});
  const scena = useRef<Scena | null>(null);
  const info = useRef<InfoFrame | null>(null);
  const sceneIdx = useRef(1);
  const cron = useRef<HTMLSpanElement>(null);

  // versione statica: con «riduci movimento» oppure se il 3D non parte
  const riduci = useSyncExternalStore(noop, leggiRiduci, () => false);
  const [guasto, setGuasto] = useState(false);
  const statico = riduci || guasto;
  const [focus, setFocus] = useState<PostazioneId | null>(null);
  const [dati, setDati] = useState<StatoPostazione | null>(null);
  const [gioco, setGioco] = useState<Gioco>({ fase: "attesa" });
  const focusRef = useRef<PostazioneId | null>(null);
  const giocoRef = useRef<Gioco>(gioco);
  useEffect(() => {
    focusRef.current = focus;
    scena.current?.setFocus(focus);
    root.current?.toggleAttribute("data-focus", !!focus);
  }, [focus]);
  useEffect(() => {
    giocoRef.current = gioco;
    scena.current?.setFermo(gioco.fase !== "attesa");
  }, [gioco]);
  useEffect(() => {
    scena.current?.setNome(nome);
  }, [nome]);

  /* ---------- la scena 3D ---------- */
  useEffect(() => {
    const el = root.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let vivo = true;
    let s: Scena | null = null;
    const triggers: ScrollTrigger[] = [];
    let io: IntersectionObserver | null = null;
    let ultimoDati = 0;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const tier: Tier = (nav.deviceMemory && nav.deviceMemory <= 3) || nav.connection?.saveData ? "basso" : coarse || window.innerWidth < 1024 ? "medio" : "alto";
    el.dataset.tier = tier;

    const onFrame = (i: InfoFrame) => {
      info.current = i;
      for (const id in i.labels) {
        const n = labs.current[id];
        if (!n) continue;
        const L = i.labels[id];
        n.style.transform = `translate3d(${L.x.toFixed(1)}px,${L.y.toFixed(1)}px,0) translate(-50%,-100%)`;
        n.style.opacity = L.vis.toFixed(3);
        n.style.visibility = L.vis > 0.01 ? "visible" : "hidden";
        n.style.pointerEvents = L.vis > 0.6 ? "auto" : "none";
      }
      for (const p of i.postazioni) {
        const k = `${p.code}|${p.pct}|${p.over}|${p.libera}`;
        if (cache.current[p.id] === k) continue;
        cache.current[p.id] = k;
        const n = labs.current[p.id];
        if (!n) continue;
        n.dataset.stato = p.libera ? "libera" : p.over ? "warn" : "ok";
        (n.querySelector("[data-code]") as HTMLElement).textContent = p.libera ? "Libera" : p.code;
        (n.querySelector("[data-pct]") as HTMLElement).textContent = p.libera ? "" : p.id === "pronto" ? "pronta" : p.over ? `+${Math.round((p.real / p.prev - 1) * 100)}% ore` : `${p.pct}%`;
        (n.querySelector("[data-cli]") as HTMLElement).textContent = p.cliente;
      }
      el.toggleAttribute("data-giorno-dopo", i.giornoDopo);
      el.toggleAttribute("data-ritardo", i.ritardo);
      const f = focusRef.current;
      if (f) {
        const now = performance.now();
        if (now - ultimoDati > 180) {
          ultimoDati = now;
          const p = i.postazioni.find((x) => x.id === f);
          if (p) setDati({ ...p });
        }
      }
      if (tilt.on) s?.setPointer(tilt.x, tilt.y);
    };

    const avvia = async () => {
      try {
        const mod = await import("./scena3d");
        if (!vivo) return;
        await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1200))]);
        if (!vivo) return;
        const cs = getComputedStyle(document.documentElement);
        s = mod.creaScena({
          tier,
          nome: leggiAzienda(),
          fontDisplay: cs.getPropertyValue("--font-archivo").trim() || "sans-serif",
          fontSans: cs.getPropertyValue("--font-inter-tight").trim() || "sans-serif",
          onFrame,
          onPronto: () => el.setAttribute("data-pronto", ""),
        });
      } catch {
        if (vivo) setGuasto(true);
        return;
      }
      scena.current = s;
      s.mount(hostA.current!);

      const aggiornaScena = (p: number) => {
        let n = 1;
        for (const c of CONFINI) if (p >= c) n++;
        if (n !== sceneIdx.current) {
          sceneIdx.current = n;
          el.dataset.scene = String(n);
          if (n !== 3 && focusRef.current) setFocus(null);
          if (n !== 5 && giocoRef.current.fase !== "attesa") setGioco({ fase: "attesa" });
        }
      };
      triggers.push(
        ScrollTrigger.create({
          trigger: stageA.current!,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (st) => {
            s!.setA(st.progress);
            aggiornaScena(st.progress);
          },
        }),
        ScrollTrigger.create({
          trigger: stageB.current!,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (st) => {
            const q = st.progress;
            s!.setB(q);
            const b = stageB.current!;
            b.style.setProperty("--rv-tela", (1 - smooth(0.66, 0.82, q)).toFixed(3));
            b.style.setProperty("--rv-plan", smooth(0.62, 0.8, q).toFixed(3));
            b.style.setProperty("--rv-cta", smooth(0.84, 0.96, q).toFixed(3));
            b.toggleAttribute("data-cta", q > 0.86);
          },
        }),
        ScrollTrigger.create({
          trigger: stageB.current!,
          start: "top 85%",
          onEnter: () => {
            s!.mount(hostB.current!);
            s!.setStage("b");
          },
          onLeaveBack: () => {
            s!.mount(hostA.current!);
            s!.setStage("a");
          },
        }),
      );
      const visibili = new Set<Element>();
      io = new IntersectionObserver(
        (es) => {
          es.forEach((e) => (e.isIntersecting ? visibili.add(e.target) : visibili.delete(e.target)));
          s!.setRunning(visibili.size > 0 && !document.hidden);
        },
        { rootMargin: "80px" },
      );
      io.observe(stageA.current!);
      io.observe(stageB.current!);
      ScrollTrigger.refresh();
    };
    // il 3D parte dopo il primo disegno della pagina: il poster è già a schermo
    const idle = window.setTimeout(avvia, 60);

    const onVis = () => s?.setRunning(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || tilt.on) return;
      s?.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    tiltAuto();

    return () => {
      vivo = false;
      clearTimeout(idle);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      triggers.forEach((t) => t.kill());
      io?.disconnect();
      s?.dispose();
      scena.current = null;
    };
  }, []);

  /* ---------- tocchi: macchine, etichette, gioco ---------- */
  const tocca = useCallback((id: PostazioneId) => {
    const g = giocoRef.current;
    if (g.fase === "squilla") {
      if (id === g.target.id) {
        setGioco({ fase: "risolto", target: g.target, secondi: num((performance.now() - g.start) / 1000) });
      } else {
        setGioco({ ...g, sbagliata: id });
        window.setTimeout(() => setGioco((x) => (x.fase === "squilla" && x.sbagliata === id ? { ...x, sbagliata: null } : x)), 900);
      }
      return;
    }
    if (g.fase === "risolto") return;
    if (sceneIdx.current !== 3) return;
    const p = info.current?.postazioni.find((x) => x.id === id) ?? null;
    setDati(p ? { ...p } : null);
    setFocus((f) => (f === id ? null : id));
  }, []);

  const onCanvasClick = (e: React.MouseEvent) => {
    if (tiltNeedsTap()) void tiltEnable();
    const id = scena.current?.pick(e.clientX, e.clientY);
    if (id) tocca(id);
    else if (focusRef.current) setFocus(null);
  };

  const rispondi = () => {
    const lista = (statico ? STATICHE : (info.current?.postazioni ?? STATICHE)).filter((p) => !p.libera && p.id !== "pronto");
    const target = lista[Math.floor(Math.random() * lista.length)] ?? STATICHE[2];
    setGioco({ fase: "squilla", target: { ...target }, start: performance.now(), sbagliata: null });
  };
  useEffect(() => {
    if (gioco.fase !== "squilla") return;
    const id = setInterval(() => {
      if (cron.current) cron.current.textContent = `${num((performance.now() - gioco.start) / 1000)} s`;
    }, 100);
    return () => clearInterval(id);
  }, [gioco]);

  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFocus(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus]);

  const pannello = statico ? STATICHE[2] : dati;
  const sbagliata = gioco.fase === "squilla" ? gioco.sbagliata : null;

  return (
    <div ref={root} className="rv" data-scene="1" data-statico={statico ? "" : undefined} data-gioco={gioco.fase} suppressHydrationWarning>
      {/* ───── Prima parte: la teca, dal caos all'ordine ───── */}
      <section ref={stageA} className="rv-a" aria-label="Il reparto di vetro">
        <div className="rv-pin">
          <div ref={hostA} className="rv-host" onClick={onCanvasClick}>
            <TecaPoster nome={nome} className="rv-poster" />
          </div>

          {/* etichette sopra le macchine */}
          <div className="rv-labels" aria-hidden={statico}>
            {POSTAZIONI.map((p) => (
              <button
                key={p.id}
                type="button"
                className={cn("rv-lab", sbagliata === p.id && "is-no", gioco.fase === "risolto" && gioco.target.id === p.id && "is-si")}
                ref={(n) => {
                  labs.current[p.id] = n;
                }}
                onClick={() => tocca(p.id)}
                aria-label={`${p.nome}: apri la commessa in lavoro`}
              >
                <span className="rv-lab-fase">{p.breve}</span>
                <span className="rv-lab-riga">
                  <span className="rv-lab-code" data-code>
                    {STATICHE.find((s) => s.id === p.id)!.code}
                  </span>
                  <span className="rv-lab-pct" data-pct />
                </span>
                <span className="rv-lab-cli" data-cli />
              </button>
            ))}
            <div
              className="rv-lab rv-lab-est"
              ref={(n) => {
                labs.current.est = n;
              }}
            >
              <span className="rv-lab-fase">Zincatura · esterno</span>
              <span className="rv-lab-riga">
                <span className="rv-lab-code">C-2409</span>
              </span>
              <span className="rv-lab-data">
                <span className="rv-prima">Rientro promesso: giovedì</span>
                <span className="rv-dopo">Venerdì: non è rientrata</span>
              </span>
            </div>
            <div
              className="rv-lab rv-lab-allarme"
              ref={(n) => {
                labs.current.camion = n;
              }}
            >
              <span className="rv-lab-code">in ritardo</span>
            </div>
          </div>

          <div className="rv-copy">
            {/* 01 · primo schermo */}
            <div className="rv-cap" data-n="1">
              <div className="rv-cap-testo">
                <p className="mono text-accent-text">Hub Reparto · per aziende conto terzi</p>
                <h1 className="rv-h1" suppressHydrationWarning data-rv-titolo>
                  {titoloReparto(nome)}
                </h1>
                <p className="rv-lead">Commesse, ore e terzisti sotto controllo. Senza fogli, senza giri in reparto.</p>
                <p className="rv-scorri mono" aria-hidden>
                  <i />
                  Scorri: metti in ordine il reparto
                </p>
              </div>
            </div>

            {/* 02 · dal caos all'ordine */}
            <div className="rv-cap" data-n="2">
              <div className="rv-cap-testo">
                <p className="mono text-accent-text">02 · {SCENE[1].etichetta}</p>
                <h2 className="rv-h2">{SCENE[1].titolo}</h2>
                <p className="rv-p">{SCENE[1].testo}</p>
              </div>
              <TecaPoster ordine nome={nome} className="rv-statica-img" />
            </div>

            {/* 03 · le commesse si muovono */}
            <div className="rv-cap" data-n="3">
              <div className="rv-cap-testo">
                <p className="mono text-accent-text">03 · {SCENE[2].etichetta}</p>
                <h2 className="rv-h2">{SCENE[2].titolo}</h2>
                <p className="rv-p">{SCENE[2].testo}</p>
                <p className="rv-invito mono">
                  <i />
                  Tocca una macchina
                </p>
              </div>
              <div className="rv-widget rv-pannello" data-aperto={statico || focus ? "" : undefined} role="region" aria-label="Commessa in lavoro" aria-live="polite">
                {pannello && (
                  <>
                    <div className="rv-pan-h">
                      <div>
                        <p className="mono text-fg-muted">{nomePostazione(pannello.id)} · in lavoro adesso</p>
                        <p className="rv-pan-code">{pannello.libera ? "Libera" : pannello.code}</p>
                        {!pannello.libera && (
                          <p className="rv-pan-sub">
                            {pannello.pezzo} · {pannello.cliente}
                          </p>
                        )}
                      </div>
                      {!statico && (
                        <button type="button" className="rv-iconbtn" onClick={() => setFocus(null)} aria-label="Chiudi la commessa">
                          <X size={16} aria-hidden />
                        </button>
                      )}
                    </div>
                    {pannello.libera ? (
                      <p className="rv-pan-nota">La prossima commessa arriva da sola quando la fase prima è chiusa.</p>
                    ) : pannello.id === "pronto" ? (
                      <p className="rv-pan-nota">Pronta per il ritiro. Il cliente è già stato avvisato.</p>
                    ) : (
                      <>
                        <div className="rv-ore">
                          <b className={pannello.over ? "is-over" : undefined}>{num(pannello.real)} h</b>
                          <span>reali su {num(pannello.prev)} h preventivate</span>
                        </div>
                        <div className={cn("rv-barra", pannello.over && "is-over")}>
                          <i style={{ width: `${Math.min(100, (pannello.real / (pannello.prev * 1.5)) * 100)}%` }} />
                          <em style={{ left: `${(1 / 1.5) * 100}%` }} />
                        </div>
                        <p className={cn("rv-pan-nota", pannello.over && "is-over")}>{pannello.over ? "Sta sforando. Lo vedi adesso, con il pezzo ancora in macchina." : "Nei tempi del preventivo."}</p>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 04 · il terzista */}
            <div className="rv-cap" data-n="4">
              <div className="rv-cap-testo">
                <p className="mono text-accent-text">04 · {SCENE[3].etichetta}</p>
                <h2 className="rv-h2">{SCENE[3].titolo}</h2>
                <p className="rv-p">{SCENE[3].testo}</p>
              </div>
              <div className="rv-widget rv-avviso" role="status">
                <p className="mono">Avviso · venerdì 08:00</p>
                <p className="rv-avviso-t">{AVVISO_TERZISTA.titolo}</p>
                <p className="rv-avviso-s">{AVVISO_TERZISTA.testo}</p>
              </div>
            </div>

            {/* 05 · il telefono squilla */}
            <div className="rv-cap" data-n="5">
              <div className="rv-cap-testo">
                <p className="mono text-accent-text">05 · {SCENE[4].etichetta}</p>
                <h2 className="rv-h2">{SCENE[4].titolo}</h2>
                <p className="rv-p">{SCENE[4].testo}</p>
              </div>
              <div className="rv-widget rv-gioco" aria-live="polite">
                {gioco.fase === "attesa" && (
                  <div className="rv-squillo">
                    <span className="rv-tel" aria-hidden>
                      <Phone size={18} />
                    </span>
                    <div>
                      <p className="rv-gioco-t">Il telefono squilla.</p>
                      <p className="rv-gioco-s">Un cliente vuole sapere a che punto è.</p>
                    </div>
                    <button type="button" className="btn btn-accent rv-rispondi" onClick={rispondi}>
                      Rispondi
                    </button>
                  </div>
                )}
                {gioco.fase === "squilla" && (
                  <div className="rv-domanda">
                    <div>
                      <p className="rv-gioco-t">«Sono di {gioco.target.cliente}. A che punto è il mio ordine?»</p>
                      <p className="rv-gioco-s">{sbagliata ? "Non è questa. Guarda il nome del cliente." : "Tocca la sua commessa nel reparto."}</p>
                    </div>
                    <span className="rv-cron" ref={cron}>
                      0,0 s
                    </span>
                  </div>
                )}
                {gioco.fase === "risolto" && (
                  <div className="rv-risolto">
                    <div className="rv-esito">
                      <p className="mono">Con l&apos;Hub</p>
                      <p className="rv-esito-n">Risposto in {gioco.secondi} secondi</p>
                      <p className="rv-gioco-s">
                        «{gioco.target.code} è in {nomePostazione(gioco.target.id).toLowerCase()}, al {gioco.target.pct}%.»
                      </p>
                    </div>
                    <div className="rv-esito is-oggi">
                      <p className="mono">Oggi</p>
                      <p className="rv-esito-n">Attesa, giro in reparto, richiamata.</p>
                    </div>
                    <button type="button" className="rv-riprova link-line" onClick={rispondi}>
                      Un&apos;altra chiamata
                    </button>
                  </div>
                )}
                {/* senza 3D le commesse si toccano da questa lista */}
                {gioco.fase === "squilla" && (
                  <div className="rv-gioco-lista">
                    {STATICHE.filter((p) => p.id !== "pronto").map((p) => (
                      <button key={p.id} type="button" className={cn("rv-lab is-fissa", sbagliata === p.id && "is-no")} onClick={() => tocca(p.id)}>
                        <span className="rv-lab-fase">{nomePostazione(p.id)}</span>
                        <span className="rv-lab-riga">
                          <span className="rv-lab-code">{p.code}</span>
                          <span className="rv-lab-pct">{p.pct}%</span>
                        </span>
                        <span className="rv-lab-cli">{p.cliente}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <ol className="rv-passi mono" aria-hidden>
            {SCENE.map((s) => (
              <li key={s.n} data-n={Number(s.n)}>
                {s.n}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── Provalo tu ───── */}
      <Provalo nome={nome} />

      {/* ───── Chiusura: la teca si apre e diventa il planning ───── */}
      <section ref={stageB} className="rv-b" aria-labelledby="rv-cta-title">
        <div className="rv-pin">
          <div ref={hostB} className="rv-host" />
          <Planning attivo={stageB} />
          <div className="rv-cta">
            <p className="mono text-accent-text">Il tuo reparto, sul tuo schermo</p>
            <h2 id="rv-cta-title" className="rv-cta-h">
              {CHIUSURA.titolo}
            </h2>
            <p className="rv-cta-p">{CHIUSURA.testo}</p>
            <div className="rv-cta-azione">
              <WhatsAppButton href={waReparto(nome)} sezione="Hub Reparto" posizione="reparto_chiusura" className="w-full sm:w-auto" />
              <span className="mono text-fg-muted">{azienda.telefono}</span>
            </div>
          </div>
        </div>
      </section>

      <p className="rv-footer">{FOOTER_REPARTO}</p>
    </div>
  );
}

/** Il planning vero: le stesse commesse della simulazione, fase per fase. */
function Planning({ attivo }: { attivo: React.RefObject<HTMLElement | null> }) {
  const sim = useSim();
  useEffect(() => {
    const el = attivo.current;
    if (!sim || !el) return;
    const io = new IntersectionObserver(([e]) => sim.hold("planning", e.isIntersecting));
    io.observe(el);
    return () => {
      io.disconnect();
      sim.hold("planning", false);
    };
  }, [sim, attivo]);
  return (
    <div className="rv-planning" aria-hidden>
      <div className="rv-planning-in">
        {STAZIONI.map((st) => {
          const list = sim ? sim.inStation(st.id) : [];
          return (
            <div key={st.id} className={cn("rv-st", st.ext && "is-ext", st.end && "is-end")}>
              <div className="rv-st-h">
                <div className="rv-st-n">{st.name}</div>
                <div className="rv-st-s">{st.sub}</div>
              </div>
              <div className="rv-st-b">
                {sim && list.slice(0, 4).map((c) => <Chip key={c.code} sim={sim} c={c} />)}
                {sim && list.length === 0 && <div className="rv-empty">{st.end ? "Ancora niente" : "Libera"}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
