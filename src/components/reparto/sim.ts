/**
 * Simulazione del reparto (sezione «Provalo tu» e planning della chiusura).
 * Stessa logica della demo interattiva: 1 secondo = 10 minuti, le commesse avanzano da sole,
 * il tablet chiude le fasi, ogni passaggio scrive un'automazione nel registro.
 * È uno store esterno a React: i componenti lo leggono con useSyncExternalStore.
 */

export const TICK_MS = 200;
const SIM_MIN = 2;

export type StazioneId = "taglio" | "piega" | "sald" | "est" | "coll" | "pronto";
export type Stazione = { id: StazioneId; name: string; sub: string; cap?: number; ext?: boolean; end?: boolean };

export const STAZIONI: Stazione[] = [
  { id: "taglio", name: "Taglio laser", sub: "Macchina 1", cap: 1 },
  { id: "piega", name: "Piegatura", sub: "Pressa piegatrice", cap: 1 },
  { id: "sald", name: "Saldatura", sub: "2 postazioni", cap: 2 },
  { id: "est", name: "Zincatura", sub: "Esterno · Zincheria del Po", ext: true },
  { id: "coll", name: "Collaudo", sub: "Controllo e imballo", cap: 1 },
  { id: "pronto", name: "Pronto", sub: "Da ritirare", end: true },
];
export const TABLET: StazioneId[] = ["taglio", "piega", "sald", "coll"];

const CLIENTI = ["Agrimec Srl", "Fratelli Bossi", "Idrotek Impianti", "Serramenti Lodigiani", "Movitalia", "Carpenteria Nord", "Scaffalature Riva", "Termica Padana", "Officine Marzi", "Arredo Metal"];
const PEZZI: [string, number][] = [
  ["Telaio saldato", 40],
  ["Staffe a L", 400],
  ["Carter macchina", 12],
  ["Supporti motore", 80],
  ["Basamento", 6],
  ["Ringhiera modulare", 24],
  ["Piastre forate", 250],
  ["Cassone ribaltabile", 2],
  ["Mensole rinforzate", 120],
  ["Struttura scaffale", 18],
];
const NEXT_NAME: Record<string, string> = { taglio: "la piegatura", piega: "la saldatura", sald: "la zincatura", est: "il collaudo", coll: "l'ufficio" };
const GG = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];

export type Fase = { id: StazioneId; prev: number; real: number; speed: number };
export type Commessa = {
  code: string;
  cliente: string;
  pezzo: string;
  qty: number;
  fasi: Fase[];
  idx: number;
  prog: number;
  consegna: string;
  extLate: boolean;
  flags: { over?: boolean; lateSent?: boolean; prob?: boolean };
  prontoTicks: number;
  born: number;
  /** tick dell'ultimo arrivo in una stazione: serve a evidenziare la scheda appena arrivata */
  arrivedAt: number;
};
export type Stato = "ok" | "warn" | "bad" | "done";
export type Evento = { id: number; t: string; cls: "" | "warn" | "bad"; what: string; auto: string };
export type Chiamata = { cliente: string; start: number; solved: boolean; secondi?: string };

type Opts = Partial<Pick<Commessa, "cliente" | "idx" | "prog" | "consegna" | "extLate">> & { pezzo?: [string, number]; slowAt?: StazioneId };

export const hhmm = (m: number) => {
  m = Math.floor(m) % (24 * 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h < 10 ? "0" : ""}${h}:${mm < 10 ? "0" : ""}${mm}`;
};
export const fmtH = (h: number) => `${h.toFixed(1).replace(".", ",")} h`;
const rnd = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)];

export class SimReparto {
  simMin = 8 * 60;
  seq = 2406;
  commesse: Commessa[] = [];
  doneToday = 0;
  eventi: Evento[] = [];
  evCount = 0;
  tick = 0;
  call: Chiamata | null = null;
  version = 0;

  private today = new Date();
  private listeners = new Set<() => void>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private holders = new Set<string>();
  paused = false;

  constructor() {
    this.seed();
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getVersion = () => this.version;
  private emit() {
    this.version++;
    this.listeners.forEach((l) => l());
  }

  /** La simulazione gira solo quando qualcuno la sta guardando. */
  hold(key: string, on: boolean) {
    if (on) this.holders.add(key);
    else this.holders.delete(key);
    this.sync();
  }
  setPaused(p: boolean) {
    this.paused = p;
    this.sync();
    this.emit();
  }
  private sync() {
    const run = this.holders.size > 0 && !this.paused;
    if (run && !this.timer) this.timer = setInterval(() => this.step(), TICK_MS);
    if (!run && this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  dispose() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.listeners.clear();
  }

  dateIn(days: number) {
    const d = new Date(this.today);
    d.setDate(d.getDate() + days);
    return `${GG[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  }

  /* ---------- commesse ---------- */
  private make(opts: Opts = {}): Commessa {
    const p = opts.pezzo ?? rnd(PEZZI);
    const route: StazioneId[] = ["taglio", "piega", "sald", "est", "coll"];
    const fasi = route.map<Fase>((id) => ({
      id,
      prev: id === "est" ? 0 : +(1.5 + Math.random() * 3).toFixed(1),
      real: 0,
      speed: id === "est" ? 1 : 0.85 + Math.random() * 0.35,
    }));
    if (opts.slowAt) fasi.forEach((f) => f.id === opts.slowAt && (f.speed = 0.62));
    this.seq++;
    return {
      code: `C-${this.seq}`,
      cliente: opts.cliente ?? rnd(CLIENTI),
      pezzo: p[0],
      qty: p[1],
      fasi,
      idx: opts.idx ?? 0,
      prog: opts.prog ?? 0,
      consegna: opts.consegna ?? this.dateIn(3 + Math.floor(Math.random() * 6)),
      extLate: !!opts.extLate,
      flags: {},
      prontoTicks: 0,
      born: this.tick,
      arrivedAt: this.tick,
    };
  }
  curFase(c: Commessa): Fase | undefined {
    return c.fasi[c.idx];
  }
  stationOf(c: Commessa): StazioneId {
    return c.idx >= c.fasi.length ? "pronto" : c.fasi[c.idx].id;
  }
  totPrev = (c: Commessa) => c.fasi.reduce((s, f) => s + f.prev, 0);
  totReal = (c: Commessa) => c.fasi.reduce((s, f) => s + f.real, 0);
  isOver(c: Commessa) {
    const f = this.curFase(c);
    return !!f && f.prev > 0 && f.real > f.prev * 1.12;
  }
  stateOf(c: Commessa): Stato {
    if (this.stationOf(c) === "pronto") return "done";
    if (c.extLate && this.stationOf(c) === "est") return "bad";
    if (this.isOver(c)) return "warn";
    return "ok";
  }
  inStation(id: StazioneId) {
    return this.commesse.filter((c) => this.stationOf(c) === id);
  }
  isWorking(c: Commessa) {
    const id = this.stationOf(c);
    const st = STAZIONI.find((s) => s.id === id)!;
    if (st.ext || st.end) return true;
    return this.inStation(id).indexOf(c) < (st.cap ?? 1);
  }

  /* ---------- registro automazioni ---------- */
  private ev(cls: Evento["cls"], what: string, auto: string) {
    this.evCount++;
    this.eventi.unshift({ id: this.evCount, t: hhmm(this.simMin), cls, what, auto });
    if (this.eventi.length > 40) this.eventi.length = 40;
  }

  /* ---------- avanzamento ---------- */
  advance(c: Commessa, manual: boolean) {
    const f = this.curFase(c);
    if (!f) return;
    const st = STAZIONI.find((s) => s.id === f.id)!;
    if (f.real === 0 && f.prev > 0) f.real = f.prev * 0.9; // fine fase dal tablet su un lavoro appena iniziato
    c.idx++;
    c.prog = 0;
    c.arrivedAt = this.tick;
    c.flags = {};
    const nxt = this.stationOf(c);
    if (nxt === "pronto") {
      this.ev("", `**${c.code}** collaudata, ${c.qty} pezzi pronti`, `Messaggio al cliente ${c.cliente}: «Il vostro ordine ${c.code} è pronto per il ritiro.» Bolla preparata.`);
    } else if (f.id === "sald") {
      this.ev("", `**${c.code}** saldata${manual ? " · fine fase dal tablet" : ""}`, `Ordine di uscita per Zincheria del Po creato. Rientro previsto: ${this.dateIn(2)}.`);
    } else if (f.id === "est") {
      this.ev(c.extLate ? "warn" : "", `**${c.code}** rientrata dalla zincatura`, `Il collaudo vede la commessa in coda. ${c.extLate ? "Ritardo del terzista segnato nel suo storico." : "Terzista nei tempi."}`);
      c.extLate = false;
    } else {
      this.ev("", `**${c.code}** · ${st.name.toLowerCase()} finito${manual ? " dal tablet" : ""}`, `Avvisata ${NEXT_NAME[f.id]}: «${c.code} è pronta da te, ${c.qty} pezzi.»`);
    }
    if (manual) this.emit();
  }

  segnalaProblema(c: Commessa) {
    if (c.flags.prob) return;
    c.flags.prob = true;
    const st = STAZIONI.find((s) => s.id === this.stationOf(c))!;
    this.ev("warn", `Problema su **${c.code}** in ${st.name.toLowerCase()}`, "L'operatore ha segnalato: materiale mancante. Avviso all'ufficio acquisti con la lista dei pezzi e la foto.");
    this.emit();
  }

  step() {
    this.tick++;
    this.simMin += SIM_MIN;
    const h = SIM_MIN / 60;
    for (const c of this.commesse.slice()) {
      const id = this.stationOf(c);
      if (id === "pronto") {
        c.prontoTicks++;
        if (c.prontoTicks === 55) {
          this.ev("", `**${c.code}** ritirata da ${c.cliente}`, `Fattura pronta da emettere. Ore totali ${fmtH(this.totReal(c))} su ${fmtH(this.totPrev(c))} preventivate.`);
          this.commesse.splice(this.commesse.indexOf(c), 1);
          this.doneToday++;
        }
        continue;
      }
      if (!this.isWorking(c)) continue;
      const f = this.curFase(c)!;
      if (id === "est") {
        c.prog += c.extLate ? 0.0035 : 0.012;
        if (c.extLate && !c.flags.lateSent && this.tick - c.born > 8) {
          c.flags.lateSent = true;
          this.ev("bad", `Zincheria del Po in ritardo su **${c.code}**`, `Doveva rientrare ieri. Avviso all'ufficio con il numero del terzista. Il cliente ${c.cliente} non è ancora stato toccato.`);
        }
      } else {
        f.real += h;
        c.prog = Math.min(1, (f.real * f.speed) / f.prev);
        if (this.isOver(c) && !c.flags.over) {
          c.flags.over = true;
          this.ev("warn", `**${c.code}** sta sforando in ${STAZIONI.find((s) => s.id === id)!.name.toLowerCase()}`, `${fmtH(f.real)} su ${fmtH(f.prev)} preventivate. Segnalato al titolare mentre il pezzo è ancora in macchina.`);
        }
      }
      if (c.prog >= 1) this.advance(c, false);
    }
    if (this.tick % 110 === 0 && this.commesse.length < 14) this.newOrder(false, true);
    this.emit();
  }

  newOrder(manual: boolean, silent = false) {
    const c = this.make({ consegna: this.dateIn(4 + Math.floor(Math.random() * 5)) });
    this.commesse.push(c);
    this.ev("", `Nuovo ordine da ${c.cliente}${manual ? "" : " via email"}`, `Commessa **${c.code}** creata: ${c.qty} × ${c.pezzo.toLowerCase()}, 5 fasi assegnate, consegna ${c.consegna}. Conferma d'ordine inviata.`);
    if (!silent) this.emit();
  }

  /* ---------- numeri ---------- */
  kpi() {
    const active = this.commesse.filter((c) => this.stationOf(c) !== "pronto");
    const late = this.commesse.filter((c) => {
      const s = this.stateOf(c);
      return s === "bad" || s === "warn";
    }).length;
    let pr = 0;
    let re = 0;
    active.forEach((c) =>
      c.fasi.forEach((f, i) => {
        if (i < c.idx) {
          pr += f.prev;
          re += f.real;
        } else if (i === c.idx && f.prev > 0) {
          pr += f.prev * Math.min(1, c.prog);
          re += f.real;
        }
      }),
    );
    const pct = pr > 0 ? Math.round((re / pr) * 100) : 100;
    return {
      active: active.length,
      late,
      pct,
      ext: this.inStation("est").reduce((s, c) => s + c.qty, 0),
      done: this.doneToday + this.inStation("pronto").length,
    };
  }

  cosaRispondere(c: Commessa) {
    const where = this.stationOf(c);
    const stName = STAZIONI.find((x) => x.id === where)!.name;
    if (where === "pronto") return "Il cliente è già stato avvisato. Quando ritira, la fattura è pronta.";
    if (where === "est") return c.extLate ? "Chiama Zincheria del Po: doveva rientrare ieri. Il cliente non sa ancora niente, hai margine." : "È fuori in zincatura. Quando rientra, il collaudo la vede in coda.";
    return `Dopo ${stName.toLowerCase()} passa a ${NEXT_NAME[where]}, che riceve l'avviso in automatico.`;
  }

  /* ---------- telefono ---------- */
  startCall() {
    const pool = this.commesse.filter((c) => this.stationOf(c) !== "pronto");
    if (!pool.length) return;
    this.call = { cliente: rnd(pool).cliente, start: performance.now(), solved: false };
    this.emit();
  }
  /** Da chiamare quando si apre una commessa: se è del cliente al telefono, il cronometro si ferma. */
  opened(code: string) {
    const c = this.commesse.find((x) => x.code === code);
    if (this.call && !this.call.solved && c && c.cliente === this.call.cliente) {
      this.call.solved = true;
      this.call.secondi = ((performance.now() - this.call.start) / 1000).toFixed(1).replace(".", ",");
      this.emit();
    }
  }
  closeCall() {
    this.call = null;
    this.emit();
  }

  /* ---------- situazione iniziale ---------- */
  private seed() {
    const mk = (o: Opts) => {
      const c = this.make(o);
      c.arrivedAt = -99;
      this.commesse.push(c);
      return c;
    };
    const a = mk({ cliente: "Agrimec Srl", pezzo: ["Telaio saldato", 40], idx: 2, prog: 0.35, consegna: this.dateIn(2), slowAt: "sald" });
    a.fasi[0].real = a.fasi[0].prev * 0.95;
    a.fasi[1].real = a.fasi[1].prev * 1.05;
    a.fasi[2].real = a.fasi[2].prev * 0.6;
    const b = mk({ cliente: "Fratelli Bossi", pezzo: ["Staffe a L", 400], idx: 0, prog: 0.55, consegna: this.dateIn(5) });
    b.fasi[0].real = b.fasi[0].prev * 0.5;
    const c = mk({ cliente: "Idrotek Impianti", pezzo: ["Carter macchina", 12], idx: 3, prog: 0.4, consegna: this.dateIn(1), extLate: true });
    c.fasi.slice(0, 3).forEach((f) => (f.real = f.prev * (0.9 + Math.random() * 0.15)));
    const d = mk({ cliente: "Serramenti Lodigiani", pezzo: ["Ringhiera modulare", 24], idx: 1, prog: 0.2, consegna: this.dateIn(6) });
    d.fasi[0].real = d.fasi[0].prev;
    d.fasi[1].real = d.fasi[1].prev * 0.2;
    const e = mk({ cliente: "Movitalia", pezzo: ["Supporti motore", 80], idx: 4, prog: 0.7, consegna: this.dateIn(1) });
    e.fasi.slice(0, 4).forEach((f) => (f.real = f.prev * (0.92 + Math.random() * 0.1)));
    e.fasi[4].real = e.fasi[4].prev * 0.68;
    mk({ cliente: "Carpenteria Nord", pezzo: ["Basamento", 6], idx: 0, prog: 0, consegna: this.dateIn(7) });
    const g = mk({ cliente: "Termica Padana", pezzo: ["Piastre forate", 250], idx: 2, prog: 0.1, consegna: this.dateIn(4) });
    g.fasi[0].real = g.fasi[0].prev;
    g.fasi[1].real = g.fasi[1].prev * 0.9;
    g.fasi[2].real = g.fasi[2].prev * 0.1;
    const h = mk({ cliente: "Scaffalature Riva", pezzo: ["Struttura scaffale", 18], idx: 5, prog: 0, consegna: this.dateIn(0) });
    h.fasi.forEach((x) => x.prev && (x.real = x.prev * (0.95 + Math.random() * 0.1)));
    h.prontoTicks = 20;
    mk({ cliente: "Officine Marzi", pezzo: ["Mensole rinforzate", 120], idx: 0, prog: 0, consegna: this.dateIn(8) });
    const k = mk({ cliente: "Arredo Metal", pezzo: ["Cassone ribaltabile", 2], idx: 2, prog: 0, consegna: this.dateIn(5) });
    k.fasi[0].real = k.fasi[0].prev * 0.9;
    k.fasi[1].real = k.fasi[1].prev * 1.0;
    this.simMin = 8 * 60 + 12;
    this.ev("", "Giornata aperta alle 08:00", "Piano del giorno mandato ai 4 tablet del reparto. Nessuno ha dovuto chiedere cosa fare.");
    this.ev("", `**${h.code}** pronta per il ritiro`, "Messaggio a Scaffalature Riva: «Il vostro ordine è pronto.»");
  }
}

let shared: SimReparto | null = null;
/** Un'unica simulazione per tutta la pagina (solo nel browser). */
export function getSim() {
  if (!shared) shared = new SimReparto();
  return shared;
}
