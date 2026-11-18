/**
 * «Il reparto di vetro»: la scena 3D della pagina /reparto.
 * Tutto è costruito in codice (nessun modello o immagine da scaricare): basamento, pavimento con le linee gialle,
 * cinque postazioni low-poly, teca di vetro, fogli che volano, cubetti delle commesse, camioncino e zincheria esterna.
 * La scena non sa nulla di React: riceve l'avanzamento dello scroll e restituisce a ogni fotogramma
 * la posizione a schermo delle etichette e lo stato delle commesse.
 */
import * as THREE from "three";
import { COMMESSE_STORIA, FOGLI, POSTAZIONI, type PostazioneId } from "@/data/reparto";

export type Tier = "alto" | "medio" | "basso";
export type Punto = { x: number; y: number; vis: number };
export type StatoPostazione = {
  id: PostazioneId;
  code: string;
  cliente: string;
  pezzo: string;
  pct: number;
  prev: number;
  real: number;
  over: boolean;
  libera: boolean;
};
export type InfoFrame = {
  w: number;
  h: number;
  labels: Record<string, Punto>;
  postazioni: StatoPostazione[];
  /** 0 = giorno della consegna promessa, 1 = il giorno dopo */
  giornoDopo: boolean;
  ritardo: boolean;
  camionFuori: boolean;
  /** 0..1: quanto si vedono i nomi delle postazioni nella vista dall'alto della chiusura */
  pianta: number;
};
export type Scena = {
  canvas: HTMLCanvasElement;
  mount(host: HTMLElement): void;
  setA(p: number): void;
  setB(q: number): void;
  setStage(s: "a" | "b"): void;
  /** Schermo stretto: fascia libera (0..1 dell'altezza) tra il testo e i pannelli in basso. La teca ci sta dentro. */
  setArea(top: number, bottom: number): void;
  setPointer(x: number, y: number): void;
  setFocus(id: PostazioneId | null): void;
  setFermo(on: boolean): void;
  setNome(nome: string): void;
  setRunning(on: boolean): void;
  pick(clientX: number, clientY: number): PostazioneId | null;
  dispose(): void;
};

const LIME = 0xe8ff3a;
const AMBRA = 0xf2b23a;
const ROSSO = 0xff4d3d;
const GIALLO = 0xf2c230;

const W = 6.4;
const D = 4.4;
const H = 2.3;

/** Posizione delle postazioni (x, z), altezza e fermata del cubetto sulla linea gialla. */
const POS: Record<PostazioneId, { x: number; z: number; h: number; sx: number; sz: number }> = {
  taglio: { x: -2.05, z: -1.2, h: 0.82, sx: -2.05, sz: -0.38 },
  piega: { x: 0, z: -1.25, h: 1.16, sx: 0, sz: -0.38 },
  sald: { x: 2.0, z: -1.25, h: 1.0, sx: 2.0, sz: -0.38 },
  coll: { x: 1.9, z: 1.25, h: 1.02, sx: 1.9, sz: 0.38 },
  pronto: { x: -1.9, z: 1.25, h: 1.14, sx: -1.9, sz: 0.38 },
};
const ORDINE: PostazioneId[] = ["taglio", "piega", "sald", "coll", "pronto"];
const ZINC = { x: 7.4, z: 0 };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const range = (a: number, b: number, v: number) => clamp((v - a) / (b - a));
const smooth = (a: number, b: number, v: number) => {
  const t = range(a, b, v);
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Shot = { tx: number; ty: number; tz: number; az: number; el: number; R: number; fh: number; fv: number; ox: number; oy: number };
const shot = (tx: number, ty: number, tz: number, az: number, el: number, R: number, fh: number, fv: number, ox: number, oy: number): Shot => ({ tx, ty, tz, az, el, R, fh, fv, ox, oy });
const mixShot = (a: Shot, b: Shot, t: number): Shot => ({
  tx: lerp(a.tx, b.tx, t),
  ty: lerp(a.ty, b.ty, t),
  tz: lerp(a.tz, b.tz, t),
  az: lerp(a.az, b.az, t),
  el: lerp(a.el, b.el, t),
  R: lerp(a.R, b.R, t),
  fh: lerp(a.fh, b.fh, t),
  fv: lerp(a.fv, b.fv, t),
  ox: lerp(a.ox, b.ox, t),
  oy: lerp(a.oy, b.oy, t),
});

/** Inquadrature delle cinque scene. Largo: testo a sinistra, teca a destra. Stretto: testo in alto, teca sotto. */
const SHOTS_LARGO: Shot[] = [
  shot(0, 0.72, 0, -0.62, 0.33, 4.25, 0.56, 0.8, 0.2, 0.03),
  shot(0, 0.7, 0, -0.42, 0.47, 4.15, 0.56, 0.8, 0.2, 0.03),
  shot(0, 0.45, 0, -0.2, 0.76, 4.0, 0.58, 0.84, 0.2, 0.03),
  shot(5.6, 0.25, 0, 0.16, 0.56, 3.9, 0.6, 0.84, 0.2, 0.02),
  shot(0, 0.4, 0, 0, 0.92, 3.95, 0.56, 0.84, 0.2, 0.03),
];
const SHOTS_STRETTO: Shot[] = [
  shot(0, 0.72, 0, -0.62, 0.36, 4.3, 0.98, 0.5, 0, 0.14),
  shot(0, 0.7, 0, -0.42, 0.5, 4.1, 0.98, 0.5, 0, 0.14),
  shot(0, 0.45, 0, -0.16, 0.82, 3.6, 1, 0.52, 0, 0.13),
  shot(5.95, 0.25, 0, 0.1, 0.6, 3.75, 1, 0.5, 0, 0.13),
  shot(0, 0.4, 0, 0, 0.98, 3.55, 1, 0.5, 0, 0.12),
];
/** Confini delle scene sull'avanzamento 0..1 della prima parte. */
export const CONFINI = [0.15, 0.35, 0.55, 0.77] as const;

export function creaScena(opts: { tier: Tier; nome: string; fontDisplay: string; fontSans: string; onFrame: (i: InfoFrame) => void; onPronto?: () => void }): Scena {
  const { tier } = opts;
  const ombre = tier === "alto";
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  let dpr = Math.min(window.devicePixelRatio || 1, tier === "basso" ? 1.25 : 2);
  renderer.setPixelRatio(dpr);
  // sfondo pieno, uguale a quello della pagina: con un canvas trasparente il vetro vero
  // schiarirebbe tutto quello che ha il vuoto alle spalle (il passaggio di rifrazione userebbe un fondo bianco)
  renderer.setClearColor(0x0a0a0a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  if (ombre) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  const canvas = renderer.domElement;
  canvas.className = "rv-canvas";
  canvas.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  // ambiente per i riflessi: una stanza buia con tre luci morbide (un pannello in alto, una striscia a sinistra, una di taglio dietro).
  // Così il vetro e l'acciaio riflettono poche luci nette, non una stanza bianca che li rende lattiginosi.
  const stanza = new THREE.Scene();
  stanza.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: 0x0b0b0c, side: THREE.BackSide })));
  const pannello = (w: number, h: number, forza: number, x: number, y: number, z: number, rx: number, ry: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(forza, forza, forza), side: THREE.DoubleSide }));
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, 0);
    stanza.add(m);
  };
  pannello(9, 5, 5, 1, 9, 2, Math.PI / 2, 0);
  pannello(2.2, 9, 3.2, -11, 3, 2, 0, Math.PI / 2);
  pannello(7, 1.6, 2.2, 3, 4, -12, 0, 0);
  pannello(3, 6, 1.2, 12, 2, 6, 0, -Math.PI / 2);
  const envRT = pmrem.fromScene(stanza, 0.03);
  stanza.traverse((o) => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose();
    (m.material as THREE.Material | undefined)?.dispose();
  });
  scene.environment = envRT.texture;
  scene.environmentIntensity = 1.15;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.5, 80);

  /* ---------- luci ---------- */
  const hemi = new THREE.HemisphereLight(0xe6ecf2, 0x1a1a1a, 1.05);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 3.0);
  key.position.set(4.5, 8, 5.5);
  if (ombre) {
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const c = key.shadow.camera;
    c.left = -6;
    c.right = 11;
    c.top = 5;
    c.bottom = -5;
    c.near = 1;
    c.far = 22;
    key.shadow.bias = -0.0004;
    key.shadow.radius = 5;
  }
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xcfe3ff, 0.7);
  rim.position.set(-6, 3.5, -5);
  scene.add(rim);

  /* ---------- materiali ---------- */
  const std = (color: number, rough: number, metal: number, extra: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
  const M = {
    base: std(0x0e0f10, 0.55, 0.4),
    bordo: std(0x2a2c2f, 0.35, 0.85),
    pavimento: std(0x45494f, 0.86, 0.05),
    corpo: std(0x363a40, 0.48, 0.42),
    corpo2: std(0x5b6068, 0.42, 0.5),
    acciaio: std(0xb4b9bf, 0.3, 0.9),
    acciaioScuro: std(0x60656b, 0.4, 0.85),
    giallo: std(GIALLO, 0.7, 0, { emissive: GIALLO, emissiveIntensity: 0.12 }),
    lime: std(LIME, 0.4, 0, { emissive: LIME, emissiveIntensity: 0.9 }),
    limeSpento: std(0x3b4212, 0.5, 0, { emissive: LIME, emissiveIntensity: 0.18 }),
    gomma: std(0x0b0b0c, 0.9, 0),
    vetroScuro: std(0x0d1114, 0.08, 0.6),
  };
  const mesh = (parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = ombre;
    m.receiveShadow = ombre;
    parent.add(m);
    return m;
  };
  const box = (parent: THREE.Object3D, w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) => mesh(parent, new THREE.BoxGeometry(w, h, d), mat, x, y, z);
  const cyl = (parent: THREE.Object3D, r: number, h: number, mat: THREE.Material, x = 0, y = 0, z = 0, seg = 14) => mesh(parent, new THREE.CylinderGeometry(r, r, h, seg), mat, x, y, z);

  const mondo = new THREE.Group();
  scene.add(mondo);

  /* ---------- texture disegnate ---------- */
  const tex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    draw(cv.getContext("2d")!);
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  };
  const texOmbra = tex(256, 256, (c) => {
    const g = c.createRadialGradient(128, 128, 10, 128, 128, 128);
    g.addColorStop(0, "rgba(0,0,0,0.85)");
    g.addColorStop(0.55, "rgba(0,0,0,0.42)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
  });
  const ombraPiana = (w: number, d: number, x: number, y: number, z: number, op: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: texOmbra, transparent: true, opacity: op, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, y, z);
    m.renderOrder = -1;
    mondo.add(m);
    return m;
  };

  // alone di luce a terra: stacca la teca dal nero; ai bordi torna esattamente il colore della pagina
  const texAlone = tex(256, 256, (c) => {
    const g = c.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "#26272a");
    g.addColorStop(0.45, "#17181a");
    g.addColorStop(1, "#0a0a0a");
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
  });
  const alone = new THREE.Mesh(new THREE.PlaneGeometry(34, 26), new THREE.MeshBasicMaterial({ map: texAlone, toneMapped: false, depthWrite: false }));
  alone.rotation.x = -Math.PI / 2;
  alone.position.set(1.5, -0.502, 0.5);
  alone.renderOrder = -2;
  mondo.add(alone);

  /* ---------- basamento e pavimento ---------- */
  ombraPiana(13.5, 10, 0.2, -0.5, 0.5, 0.9);
  ombraPiana(5.2, 5, ZINC.x, -0.5, 0.3, 0.8);
  box(mondo, W + 0.5, 0.5, D + 0.5, M.base, 0, -0.25, 0);
  box(mondo, W + 0.56, 0.035, D + 0.56, M.bordo, 0, -0.018, 0);
  const pav = box(mondo, W, 0.02, D, M.pavimento, 0, 0.0, 0);
  pav.castShadow = false;

  // targhetta incisa sul fronte del basamento
  const targaCv = document.createElement("canvas");
  targaCv.width = 1024;
  targaCv.height = 128;
  const targaTex = new THREE.CanvasTexture(targaCv);
  targaTex.colorSpace = THREE.SRGBColorSpace;
  targaTex.anisotropy = 8;
  const disegnaTarga = (nome: string) => {
    const c = targaCv.getContext("2d")!;
    const g = c.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, "#a9adb3");
    g.addColorStop(0.5, "#8b8f95");
    g.addColorStop(1, "#6c7076");
    c.fillStyle = g;
    c.fillRect(0, 0, 1024, 128);
    c.strokeStyle = "rgba(0,0,0,0.35)";
    c.lineWidth = 2;
    c.strokeRect(5, 5, 1014, 118);
    const testo = (nome || "Il tuo reparto").toUpperCase();
    let size = 66;
    c.textAlign = "center";
    c.textBaseline = "middle";
    do {
      c.font = `800 ${size}px ${opts.fontDisplay}, "Arial Narrow", sans-serif`;
      size -= 3;
    } while (c.measureText(testo).width > 930 && size > 26);
    // incisione: ombra scura sopra, filo di luce sotto
    c.fillStyle = "rgba(0,0,0,0.75)";
    c.fillText(testo, 512, 65);
    c.fillStyle = "rgba(255,255,255,0.45)";
    c.fillText(testo, 512, 68.5);
    c.fillStyle = "#0f1011";
    c.fillText(testo, 512, 66.5);
    for (const x of [26, 998])
      for (const y of [26, 102]) {
        c.beginPath();
        c.arc(x, y, 6, 0, Math.PI * 2);
        c.fillStyle = "#15161a";
        c.fill();
        c.strokeStyle = "rgba(255,255,255,0.22)";
        c.stroke();
      }
    targaTex.needsUpdate = true;
  };
  disegnaTarga(opts.nome);
  const targa = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.275), new THREE.MeshStandardMaterial({ map: targaTex, roughness: 0.42, metalness: 0.55, emissive: 0xffffff, emissiveMap: targaTex, emissiveIntensity: 0.22 }));
  targa.position.set(0, -0.25, (D + 0.5) / 2 + 0.004);
  mondo.add(targa);

  // linee gialle: il percorso delle commesse e le zone delle macchine
  const linea = (x1: number, z1: number, x2: number, z2: number, w = 0.045) => {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const m = new THREE.Mesh(new THREE.BoxGeometry(Math.abs(x2 - x1) > Math.abs(z2 - z1) ? len + w : w, 0.006, Math.abs(x2 - x1) > Math.abs(z2 - z1) ? w : len + w), M.giallo);
    m.position.set((x1 + x2) / 2, 0.014, (z1 + z2) / 2);
    m.receiveShadow = ombre;
    mondo.add(m);
  };
  linea(-3.0, -0.38, 2.6, -0.38);
  linea(2.6, -0.38, 2.6, 0.38);
  linea(2.6, 0.38, -3.0, 0.38);
  linea(2.6, 0, 3.18, 0);
  const zona = (x: number, z: number, w: number, d: number) => {
    linea(x - w / 2, z - d / 2, x + w / 2, z - d / 2, 0.025);
    linea(x - w / 2, z + d / 2, x + w / 2, z + d / 2, 0.025);
    linea(x - w / 2, z - d / 2, x - w / 2, z + d / 2, 0.025);
    linea(x + w / 2, z - d / 2, x + w / 2, z + d / 2, 0.025);
  };
  zona(POS.taglio.x + 0.08, POS.taglio.z, 2.15, 1.25);
  zona(POS.piega.x, POS.piega.z, 1.7, 1.2);
  zona(POS.sald.x - 0.1, POS.sald.z, 1.85, 1.2);
  zona(POS.coll.x, POS.coll.z, 1.5, 1.2);
  zona(POS.pronto.x, POS.pronto.z, 1.6, 1.2);

  /* ---------- postazioni ---------- */
  const gruppo = (id: PostazioneId) => {
    const g = new THREE.Group();
    g.position.set(POS[id].x, 0.01, POS[id].z);
    mondo.add(g);
    return g;
  };

  // taglio laser: bancale, portale mobile, quadro comandi
  const gTaglio = gruppo("taglio");
  box(gTaglio, 1.5, 0.36, 0.9, M.corpo, 0, 0.18, 0);
  box(gTaglio, 1.42, 0.04, 0.82, M.acciaioScuro, 0, 0.38, 0);
  box(gTaglio, 1.0, 0.014, 0.58, M.acciaio, -0.08, 0.408, 0);
  box(gTaglio, 1.5, 0.05, 0.05, M.corpo2, 0, 0.425, 0.43);
  box(gTaglio, 1.5, 0.05, 0.05, M.corpo2, 0, 0.425, -0.43);
  const portale = new THREE.Group();
  gTaglio.add(portale);
  box(portale, 0.07, 0.3, 0.07, M.corpo2, 0, 0.58, 0.43);
  box(portale, 0.07, 0.3, 0.07, M.corpo2, 0, 0.58, -0.43);
  box(portale, 0.1, 0.09, 0.96, M.corpo, 0, 0.76, 0);
  const testa = new THREE.Group();
  portale.add(testa);
  box(testa, 0.12, 0.2, 0.12, M.corpo2, 0.06, 0.63, 0);
  box(testa, 0.025, 0.11, 0.025, M.lime, 0.06, 0.47, 0).castShadow = false;
  box(gTaglio, 0.28, 0.78, 0.42, M.corpo, 0.95, 0.39, -0.2);
  box(gTaglio, 0.2, 0.13, 0.01, M.limeSpento, 0.95, 0.6, 0.012).castShadow = false;

  // piegatrice: spalle, banco, pestone che scende
  const gPiega = gruppo("piega");
  box(gPiega, 0.1, 1.06, 0.56, M.corpo, 0.62, 0.53, 0);
  box(gPiega, 0.1, 1.06, 0.56, M.corpo, -0.62, 0.53, 0);
  box(gPiega, 1.14, 0.42, 0.22, M.corpo2, 0, 0.21, 0.08);
  box(gPiega, 1.14, 0.04, 0.07, M.acciaio, 0, 0.44, 0.12);
  box(gPiega, 1.34, 0.1, 0.5, M.corpo, 0, 1.11, 0);
  const pestone = new THREE.Group();
  gPiega.add(pestone);
  box(pestone, 1.14, 0.36, 0.16, M.corpo2, 0, 0.86, 0.1);
  box(pestone, 1.14, 0.09, 0.03, M.acciaio, 0, 0.635, 0.12);
  box(pestone, 0.5, 0.012, 0.012, M.lime, 0, 0.95, 0.185).castShadow = false;
  box(gPiega, 0.72, 0.012, 0.34, M.acciaio, 0, 0.468, 0.27);

  // saldatura: banco, paratia, braccio
  const gSald = gruppo("sald");
  box(gSald, 0.9, 0.05, 0.6, M.acciaioScuro, 0.12, 0.42, 0.05);
  for (const [lx, lz] of [
    [-0.28, -0.2],
    [0.52, -0.2],
    [-0.28, 0.3],
    [0.52, 0.3],
  ])
    box(gSald, 0.05, 0.4, 0.05, M.corpo, lx, 0.2, lz);
  box(gSald, 0.5, 0.03, 0.03, M.acciaio, 0.12, 0.46, -0.05);
  box(gSald, 0.5, 0.03, 0.03, M.acciaio, 0.12, 0.46, 0.2);
  box(gSald, 0.03, 0.03, 0.28, M.acciaio, -0.12, 0.46, 0.075);
  box(gSald, 0.03, 0.03, 0.28, M.acciaio, 0.36, 0.46, 0.075);
  box(gSald, 1.6, 0.92, 0.03, M.corpo, -0.05, 0.46, -0.46);
  box(gSald, 0.26, 0.3, 0.26, M.corpo2, -0.62, 0.15, 0.05);
  const spalla = new THREE.Group();
  spalla.position.set(-0.62, 0.3, 0.05);
  gSald.add(spalla);
  cyl(spalla, 0.09, 0.1, M.corpo, 0, 0.05, 0);
  const braccio1 = new THREE.Group();
  braccio1.position.y = 0.1;
  spalla.add(braccio1);
  box(braccio1, 0.075, 0.5, 0.075, M.acciaioScuro, 0, 0.25, 0);
  const braccio2 = new THREE.Group();
  braccio2.position.y = 0.5;
  braccio1.add(braccio2);
  box(braccio2, 0.06, 0.44, 0.06, M.acciaioScuro, 0, 0.22, 0);
  const scintilla = mesh(braccio2, new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xf4ffc0, emissiveIntensity: 2 }), 0, 0.46, 0);
  scintilla.castShadow = false;
  braccio1.rotation.z = -0.55;
  braccio2.rotation.z = -1.5;

  // collaudo: piano di riscontro e ponte di misura
  const gColl = gruppo("coll");
  box(gColl, 0.95, 0.42, 0.7, M.corpo, 0, 0.21, 0);
  box(gColl, 0.9, 0.03, 0.65, M.acciaioScuro, 0, 0.435, 0);
  box(gColl, 0.22, 0.1, 0.16, M.acciaio, -0.1, 0.5, 0.05);
  const ponte = new THREE.Group();
  gColl.add(ponte);
  box(ponte, 0.06, 0.52, 0.06, M.corpo2, 0.41, 0.71, 0);
  box(ponte, 0.06, 0.52, 0.06, M.corpo2, -0.41, 0.71, 0);
  box(ponte, 0.88, 0.07, 0.09, M.corpo, 0, 0.99, 0);
  const sonda = new THREE.Group();
  ponte.add(sonda);
  box(sonda, 0.1, 0.13, 0.11, M.corpo2, 0, 0.93, 0.02);
  box(sonda, 0.018, 0.3, 0.018, M.acciaio, 0, 0.74, 0.02);
  mesh(sonda, new THREE.SphereGeometry(0.022, 8, 6), M.lime, 0, 0.585, 0.02).castShadow = false;

  // pronto: scaffale con le casse
  const gPronto = gruppo("pronto");
  for (const [ux, uz] of [
    [-0.56, -0.25],
    [0.56, -0.25],
    [-0.56, 0.25],
    [0.56, 0.25],
  ])
    box(gPronto, 0.05, 1.12, 0.05, M.corpo2, ux, 0.56, uz);
  box(gPronto, 1.17, 0.035, 0.55, M.acciaioScuro, 0, 0.36, 0);
  box(gPronto, 1.17, 0.035, 0.55, M.acciaioScuro, 0, 0.78, 0);
  box(gPronto, 1.17, 0.035, 0.55, M.corpo2, 0, 1.12, 0);
  box(gPronto, 0.34, 0.22, 0.36, M.corpo, -0.34, 0.49, 0);
  box(gPronto, 0.3, 0.16, 0.3, M.acciaio, 0.08, 0.46, 0.02);
  box(gPronto, 0.3, 0.24, 0.36, M.corpo, 0.36, 0.91, 0);
  box(gPronto, 0.4, 0.14, 0.34, M.acciaio, -0.22, 0.87, 0);
  box(gPronto, 0.5, 0.2, 0.4, M.corpo, 0.2, 0.11, 0);
  box(gPronto, 0.36, 0.12, 0.3, M.acciaio, -0.32, 0.07, 0.02);
  box(gPronto, 0.34, 0.012, 0.012, M.lime, 0, 1.145, 0.27).castShadow = false;

  // piccoli pezzi in giro per il reparto
  const pezzi = new THREE.Group();
  mondo.add(pezzi);
  const pallet = (x: number, z: number, r: number) => {
    const g = new THREE.Group();
    g.position.set(x, 0.01, z);
    g.rotation.y = r;
    pezzi.add(g);
    box(g, 0.44, 0.05, 0.32, M.corpo2, 0, 0.025, 0);
    for (let i = 0; i < 3; i++) box(g, 0.36 - i * 0.02, 0.022, 0.24, M.acciaio, 0, 0.065 + i * 0.026, 0).rotation.y = (i - 1) * 0.06;
  };
  pallet(-0.95, -1.62, 0.1);
  pallet(1.0, -1.72, -0.08);
  pallet(0.35, 1.55, 0.2);
  for (let i = 0; i < 5; i++) {
    const t = cyl(pezzi, 0.035, 0.34, M.acciaio, -0.35 + i * 0.075, 0.05, 1.05, 8);
    t.rotation.x = Math.PI / 2;
  }
  for (let i = 0; i < 4; i++) box(pezzi, 0.1, 0.1, 0.1, M.acciaio, 2.75, 0.06, -1.7 + i * 0.13).rotation.y = i * 0.3;

  // blob d'ombra sotto le macchine (su tutti i livelli: dà peso anche senza ombre vere)
  for (const id of ORDINE) ombraPiana(2.1, 1.7, POS[id].x, 0.012, POS[id].z, ombre ? 0.22 : 0.5);

  // punti invisibili per il tocco
  const bersagli: THREE.Mesh[] = [];
  const matInvisibile = new THREE.MeshBasicMaterial({ visible: false });
  for (const id of ORDINE) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.8, POS[id].h + 0.25, 1.25), matInvisibile);
    b.position.set(POS[id].x, (POS[id].h + 0.25) / 2, POS[id].z);
    b.userData.id = id;
    mondo.add(b);
    bersagli.push(b);
  }

  /* ---------- zincheria esterna, ponte e camioncino ---------- */
  const zinc = new THREE.Group();
  zinc.position.set(ZINC.x, 0, ZINC.z);
  mondo.add(zinc);
  box(zinc, 2.5, 0.5, 2.5, M.base, 0, -0.25, 0);
  box(zinc, 2.56, 0.035, 2.56, M.bordo, 0, -0.018, 0);
  box(zinc, 2.3, 0.02, 2.3, M.pavimento, 0, 0, 0).castShadow = false;
  box(zinc, 1.1, 0.62, 0.8, M.corpo, -0.45, 0.32, -0.62);
  box(zinc, 1.16, 0.05, 0.86, M.corpo2, -0.45, 0.65, -0.62);
  cyl(zinc, 0.42, 0.95, M.acciaio, 0.55, 0.485, -0.55, 18);
  cyl(zinc, 0.44, 0.04, M.acciaioScuro, 0.55, 0.97, -0.55, 18);
  cyl(zinc, 0.06, 1.25, M.acciaioScuro, -0.8, 0.95, -0.8, 10);
  box(zinc, 0.5, 0.3, 0.012, M.vetroScuro, -0.45, 0.3, -0.214);
  ombraPiana(2.2, 1.9, ZINC.x, 0.013, -0.55, ombre ? 0.2 : 0.45);
  const lineaZ = (x1: number, z1: number, x2: number, z2: number) => {
    const horiz = Math.abs(x2 - x1) > Math.abs(z2 - z1);
    const len = Math.hypot(x2 - x1, z2 - z1);
    const m = new THREE.Mesh(new THREE.BoxGeometry(horiz ? len : 0.025, 0.006, horiz ? 0.025 : len), M.giallo);
    m.position.set((x1 + x2) / 2, 0.014, (z1 + z2) / 2);
    zinc.add(m);
  };
  lineaZ(-0.7, 0.02, 0.5, 0.02);
  lineaZ(-0.7, 0.62, 0.5, 0.62);
  lineaZ(0.5, 0.02, 0.5, 0.62);
  // passerella tra le due basi
  const xA = W / 2 + 0.25;
  const xB = ZINC.x - 1.25;
  box(mondo, xB - xA + 0.06, 0.07, 0.95, M.base, (xA + xB) / 2, -0.035, 0.12);
  box(mondo, xB - xA + 0.06, 0.006, 0.03, M.giallo, (xA + xB) / 2, 0.004, -0.31);
  box(mondo, xB - xA + 0.06, 0.006, 0.03, M.giallo, (xA + xB) / 2, 0.004, 0.55);
  ombraPiana(xB - xA + 1.2, 2.6, (xA + xB) / 2, -0.5, 0.3, 0.6);

  const camion = new THREE.Group();
  mondo.add(camion);
  const matStato = std(LIME, 0.4, 0, { emissive: LIME, emissiveIntensity: 0.7 });
  box(camion, 0.72, 0.05, 0.3, M.corpo2, 0, 0.13, 0);
  box(camion, 0.24, 0.25, 0.3, M.corpo, 0.24, 0.28, 0);
  box(camion, 0.012, 0.11, 0.24, M.vetroScuro, 0.362, 0.32, 0).castShadow = false;
  box(camion, 0.46, 0.06, 0.015, M.corpo, -0.13, 0.185, 0.143);
  box(camion, 0.46, 0.06, 0.015, M.corpo, -0.13, 0.185, -0.143);
  box(camion, 0.015, 0.06, 0.3, M.corpo, -0.355, 0.185, 0);
  box(camion, 0.2, 0.014, 0.26, matStato, 0.24, 0.412, 0).castShadow = false;
  box(camion, 0.46, 0.014, 0.006, matStato, -0.13, 0.2, 0.152).castShadow = false;
  for (const [wx, wz] of [
    [0.22, 0.155],
    [0.22, -0.155],
    [-0.22, 0.155],
    [-0.22, -0.155],
  ]) {
    const r = cyl(camion, 0.07, 0.05, M.gomma, wx, 0.07, wz, 12);
    r.rotation.x = Math.PI / 2;
  }
  const matCarico = std(LIME, 0.35, 0, { emissive: LIME, emissiveIntensity: 0.55 });
  box(camion, 0.2, 0.2, 0.2, matCarico, -0.14, 0.255, 0);
  const luceRossa = new THREE.PointLight(ROSSO, 0, 3.2, 2);
  luceRossa.position.set(0, 0.6, 0);
  camion.add(luceRossa);

  /* ---------- teca di vetro ---------- */
  const teca = new THREE.Group();
  mondo.add(teca);
  const matVetroVero = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.025,
    metalness: 0,
    transmission: 1,
    thickness: 0.22,
    ior: 1.46,
    attenuationColor: new THREE.Color(0xd9f2e2),
    attenuationDistance: 6,
    // l'intensità vale solo con una envMap propria: quella della scena la ignorerebbe e il vetro diventerebbe lattiginoso
    envMap: envRT.texture,
    envMapIntensity: 0.5,
  });
  const matVetroFinto = new THREE.MeshPhysicalMaterial({
    color: 0xe9fff2,
    roughness: 0.02,
    metalness: 0,
    transparent: true,
    opacity: 0.085,
    envMap: envRT.texture,
    envMapIntensity: 0.5,
    depthWrite: false,
  });
  // telefoni: niente rifrazione (costa un passaggio in più). Il vetro è fatto solo dei suoi riflessi, sommati alla scena:
  // trasparente di fronte, più lucido di taglio, come una lastra vera. Niente velo grigio sulle facce.
  const matVetroLeggero = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    roughness: 0.03,
    metalness: 0,
    transparent: true,
    opacity: 1,
    envMap: envRT.texture,
    envMapIntensity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const vetroA = tier === "alto" ? matVetroVero : matVetroLeggero;
  const vetroB = tier === "alto" ? matVetroFinto : matVetroLeggero;
  const kRiflesso = tier === "alto" ? 0.085 : 0.13;
  let matVetro: THREE.MeshPhysicalMaterial = vetroA;
  const lastre: THREE.Mesh[] = [];
  const lastra = (w: number, h: number, d: number, x: number, y: number, z: number, parent: THREE.Object3D = teca) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matVetro);
    m.position.set(x, y, z);
    m.renderOrder = 5;
    parent.add(m);
    lastre.push(m);
    return m;
  };
  const sp = 0.03;
  const gx = W / 2 + 0.02;
  const gz = D / 2 + 0.02;
  lastra(W + 0.07, H, sp, 0, H / 2, gz);
  lastra(W + 0.07, H, sp, 0, H / 2, -gz);
  lastra(sp, H, D + 0.01, -gx, H / 2, 0);
  lastra(W + 0.07, sp, D + 0.07, 0, H, 0);
  // parete destra con la porta da cui esce il camioncino
  const pz = 0.6;
  const ph = 0.86;
  lastra(sp, H, D / 2 - pz + 0.005, gx, H / 2, -(pz + (D / 2 - pz) / 2));
  lastra(sp, H, D / 2 - pz + 0.005, gx, H / 2, pz + (D / 2 - pz) / 2);
  lastra(sp, H - ph, pz * 2, gx, ph + (H - ph) / 2, 0);
  const porta = lastra(sp * 0.7, ph, pz * 2 - 0.02, gx - 0.03, ph / 2, 0);
  // spigoli: il filo chiaro che fa leggere il vetro
  const matSpigolo = new THREE.MeshBasicMaterial({ color: 0xd8f2e0, transparent: true, opacity: 0.42, depthWrite: false });
  const spigolo = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matSpigolo);
    m.position.set(x, y, z);
    m.renderOrder = 6;
    teca.add(m);
  };
  const e = 0.018;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) spigolo(e, H, e, sx * (gx + 0.01), H / 2, sz * (gz + 0.01));
  for (const sz of [-1, 1]) spigolo(W + 0.09, e, e, 0, H + 0.01, sz * (gz + 0.01));
  for (const sx of [-1, 1]) spigolo(e, e, D + 0.09, sx * (gx + 0.01), H + 0.01, 0);
  // riflesso obliquo sulle lastre davanti e a sinistra
  const texRiflesso = tex(256, 256, (c) => {
    const g = c.createLinearGradient(0, 256, 256, 0);
    g.addColorStop(0.0, "rgba(255,255,255,0)");
    g.addColorStop(0.36, "rgba(255,255,255,0)");
    g.addColorStop(0.44, "rgba(255,255,255,0.55)");
    g.addColorStop(0.5, "rgba(255,255,255,0.12)");
    g.addColorStop(0.56, "rgba(255,255,255,0.38)");
    g.addColorStop(0.62, "rgba(255,255,255,0)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
  });
  texRiflesso.wrapS = texRiflesso.wrapT = THREE.RepeatWrapping;
  const matRiflesso = new THREE.MeshBasicMaterial({ map: texRiflesso, transparent: true, opacity: kRiflesso, depthWrite: false, blending: THREE.AdditiveBlending });
  const rifF = new THREE.Mesh(new THREE.PlaneGeometry(W, H), matRiflesso);
  rifF.position.set(0, H / 2, gz + 0.02);
  rifF.renderOrder = 7;
  teca.add(rifF);
  const rifL = new THREE.Mesh(new THREE.PlaneGeometry(D, H), matRiflesso);
  rifL.position.set(-gx - 0.02, H / 2, 0);
  rifL.rotation.y = -Math.PI / 2;
  rifL.renderOrder = 7;
  teca.add(rifL);

  /* ---------- fogli, bigliettini e messaggi ---------- */
  const carta = (tipo: string, testo: string) => {
    if (tipo === "postit")
      return tex(256, 256, (c) => {
        c.fillStyle = "#f4e36b";
        c.fillRect(0, 0, 256, 256);
        c.fillStyle = "rgba(0,0,0,0.06)";
        c.fillRect(0, 0, 256, 34);
        c.fillStyle = "#1a1a17";
        c.textAlign = "center";
        c.textBaseline = "middle";
        const righe = testo.split("\n");
        let size = 62;
        do {
          c.font = `800 ${size}px ${opts.fontDisplay}, "Arial Narrow", sans-serif`;
          size -= 3;
        } while (Math.max(...righe.map((r) => c.measureText(r.toUpperCase()).width)) > 216 && size > 22);
        c.translate(128, 140);
        c.rotate(-0.05);
        righe.forEach((r, i) => c.fillText(r.toUpperCase(), 0, (i - (righe.length - 1) / 2) * (size + 12)));
      });
    if (tipo === "msg")
      return tex(384, 128, (c) => {
        c.fillStyle = "#f2f0ea";
        c.beginPath();
        c.roundRect(4, 4, 376, 104, 26);
        c.fill();
        c.beginPath();
        c.moveTo(44, 100);
        c.lineTo(34, 126);
        c.lineTo(78, 104);
        c.fill();
        c.fillStyle = "#101010";
        c.textAlign = "center";
        c.textBaseline = "middle";
        let size = 34;
        do {
          c.font = `600 ${size}px ${opts.fontSans}, system-ui, sans-serif`;
          size -= 2;
        } while (c.measureText(testo).width > 340 && size > 16);
        c.fillText(testo, 192, 57);
      });
    return tex(256, 340, (c) => {
      c.fillStyle = "#efede6";
      c.fillRect(0, 0, 256, 340);
      c.fillStyle = "#161614";
      c.font = `800 46px ${opts.fontDisplay}, "Arial Narrow", sans-serif`;
      c.textBaseline = "top";
      c.fillText(testo, 22, 22);
      c.fillStyle = "rgba(20,20,18,0.28)";
      for (let i = 0; i < 9; i++) c.fillRect(22, 96 + i * 24, i % 3 === 2 ? 130 : 212, 7);
      c.strokeStyle = "#c2261c";
      c.lineWidth = 5;
      c.save();
      c.translate(160, 285);
      c.rotate(-0.16);
      c.strokeRect(-66, -22, 132, 44);
      c.fillStyle = "#c2261c";
      c.font = `800 26px ${opts.fontDisplay}, "Arial Narrow", sans-serif`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("URGENTE", 0, 2);
      c.restore();
    });
  };
  type Foglio = {
    g: THREE.Group;
    dx: THREE.Mesh;
    mat: THREE.MeshStandardMaterial;
    a0: number;
    w: number;
    rx: number;
    rz: number;
    h0: number;
    ph: number;
    rit: number;
    dest: THREE.Vector3;
    base: number;
  };
  const fogli: Foglio[] = [];
  const nFogli = tier === "alto" ? FOGLI.length : tier === "medio" ? 11 : 8;
  const mezza = (w: number, h: number, lato: -1 | 1) => {
    const geo = new THREE.PlaneGeometry(w / 2, h);
    geo.translate((lato * w) / 4, 0, 0);
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setX(i, lato < 0 ? uv.getX(i) * 0.5 : 0.5 + uv.getX(i) * 0.5);
    return geo;
  };
  // numeri sempre uguali: il primo schermo è identico a ogni visita
  let seme = 7;
  const caso = () => {
    seme = (seme * 16807) % 2147483647;
    return (seme - 1) / 2147483646;
  };
  for (let i = 0; i < nFogli; i++) {
    const f = FOGLI[i];
    const [fw, fh] = f.tipo === "postit" ? [0.5, 0.5] : f.tipo === "msg" ? [1.0, 0.33] : [0.5, 0.66];
    const mat = new THREE.MeshStandardMaterial({ map: carta(f.tipo, f.testo), side: THREE.DoubleSide, roughness: 0.92, metalness: 0, alphaTest: 0.5, emissive: 0xffffff, emissiveIntensity: 0.06 });
    const g = new THREE.Group();
    const sx = new THREE.Mesh(mezza(fw, fh, -1), mat);
    const dx = new THREE.Mesh(mezza(fw, fh, 1), mat);
    sx.castShadow = dx.castShadow = ombre;
    g.add(sx, dx);
    mondo.add(g);
    const id = ORDINE[i % 5];
    fogli.push({
      g,
      dx,
      mat,
      a0: (i / nFogli) * Math.PI * 2 + caso() * 0.6,
      w: (0.16 + caso() * 0.2) * (i % 2 ? 1 : -1),
      rx: 1.0 + caso() * 1.55,
      rz: 0.45 + caso() * 1.05,
      h0: 1.15 + caso() * 0.72,
      ph: caso() * 6.28,
      rit: (i % 5) * 0.07 + Math.floor(i / 5) * 0.13,
      dest: new THREE.Vector3(POS[id].x, POS[id].h + 0.52, POS[id].z),
      base: f.tipo === "msg" ? 1 : 1.05,
    });
  }

  /* ---------- steli delle etichette ---------- */
  const matStelo = new THREE.MeshBasicMaterial({ color: 0xaebc35 });
  const steli: THREE.Mesh[] = [];
  for (const id of ORDINE) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.36, 0.012), matStelo);
    s.position.set(POS[id].x, POS[id].h + 0.26, POS[id].z);
    mondo.add(s);
    steli.push(s);
  }

  /* ---------- commesse: i cubetti lime ---------- */
  type Job = { c: number; st: number; p: number; mv: number; da: THREE.Vector3[]; mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; scala: number; esce: boolean };
  const geoCubo = new THREE.BoxGeometry(0.19, 0.19, 0.19);
  const fermata = (i: number) => new THREE.Vector3(POS[ORDINE[i]].sx, 0.115, POS[ORDINE[i]].sz);
  const INGRESSO = new THREE.Vector3(-3.0, 0.115, -0.38);
  const USCITA = new THREE.Vector3(-3.0, 0.115, 0.38);
  const tappe = (da: number, a: number): THREE.Vector3[] => {
    if (da === -1) return [INGRESSO.clone(), fermata(0)];
    if (a === 5) return [fermata(4), USCITA.clone()];
    if (da === 2 && a === 3) return [fermata(2), new THREE.Vector3(2.6, 0.115, -0.38), new THREE.Vector3(2.6, 0.115, 0.38), fermata(3)];
    return [fermata(da), fermata(a)];
  };
  const lungoPercorso = (pts: THREE.Vector3[], t: number, out: THREE.Vector3) => {
    let tot = 0;
    const lens: number[] = [];
    for (let i = 1; i < pts.length; i++) {
      const l = pts[i].distanceTo(pts[i - 1]);
      lens.push(l);
      tot += l;
    }
    let d = t * tot;
    for (let i = 0; i < lens.length; i++) {
      if (d <= lens[i] || i === lens.length - 1) return out.lerpVectors(pts[i], pts[i + 1], clamp(d / lens[i]));
      d -= lens[i];
    }
    return out.copy(pts[pts.length - 1]);
  };
  const jobs: Job[] = [];
  let prossima = 5;
  const nuovoJob = (c: number, st: number, p: number): Job => {
    const mat = std(LIME, 0.35, 0, { emissive: LIME, emissiveIntensity: 0.6 });
    const m = new THREE.Mesh(geoCubo, mat);
    m.castShadow = ombre;
    mondo.add(m);
    const j: Job = { c, st, p, mv: -1, da: [], mesh: m, mat, scala: 1, esce: false };
    if (st >= 0) m.position.copy(fermata(st));
    jobs.push(j);
    return j;
  };
  // situazione iniziale: una commessa per postazione
  nuovoJob(0, 0, 0.55);
  nuovoJob(1, 1, 0.2);
  nuovoJob(2, 2, 0.62);
  nuovoJob(3, 3, 0.7);
  nuovoJob(4, 4, 0.45);
  const DURATA = [11, 13, 15, 10, 6]; // secondi di permanenza per postazione
  const occupata = (st: number) => jobs.some((j) => !j.esce && (j.st === st || (j.mv >= 0 && j.st === st)));
  const avanzaFlusso = (dt: number) => {
    for (const j of jobs) {
      if (j.mv >= 0) {
        j.mv += dt / 1.5;
        lungoPercorso(j.da, easeInOut(clamp(j.mv)), j.mesh.position);
        if (j.esce) j.scala = 1 - smooth(0.5, 1, j.mv);
        else if (j.da[0].x === INGRESSO.x && j.da[0].z === INGRESSO.z) j.scala = smooth(0, 0.5, j.mv);
        if (j.mv >= 1) {
          j.mv = -1;
          if (j.esce) j.st = 9;
        }
        continue;
      }
      if (j.st > 4) continue;
      j.p = Math.min(1, j.p + dt / DURATA[j.st]);
      if (j.p >= 1) {
        if (j.st === 4) {
          j.da = tappe(4, 5);
          j.mv = 0;
          j.esce = true;
        } else if (!occupata(j.st + 1)) {
          j.da = tappe(j.st, j.st + 1);
          j.st += 1;
          j.p = 0;
          j.mv = 0;
        }
      }
    }
    // chi è uscito lascia il posto; una nuova commessa entra quando il taglio è libero
    for (let i = jobs.length - 1; i >= 0; i--) {
      if (jobs[i].st === 9) {
        mondo.remove(jobs[i].mesh);
        jobs[i].mat.dispose();
        jobs.splice(i, 1);
      }
    }
    if (!occupata(0) && jobs.length < 5) {
      const j = nuovoJob(prossima % COMMESSE_STORIA.length, 0, 0);
      prossima++;
      j.da = tappe(-1, 0);
      j.mv = 0;
      j.scala = 0;
      j.mesh.position.copy(INGRESSO);
    }
  };
  const statoPostazioni = (): StatoPostazione[] =>
    ORDINE.map((id, i) => {
      const j = jobs.find((x) => x.st === i && !x.esce);
      if (!j) return { id, code: "", cliente: "", pezzo: "", pct: 0, prev: 0, real: 0, over: false, libera: true };
      const c = COMMESSE_STORIA[j.c];
      const p = j.mv >= 0 ? 0 : j.p;
      const real = p * c.prev * c.ritmo;
      return { id, code: c.code, cliente: c.cliente, pezzo: c.pezzo, pct: Math.min(99, Math.round(p * 100)), prev: c.prev, real, over: real > c.prev * 1.04, libera: false };
    });

  /* ---------- stato ---------- */
  let host: HTMLElement | null = null;
  let ro: ResizeObserver | null = null;
  let vw = 1;
  let vh = 1;
  let stretto = false;
  let areaTop = -1;
  let areaBot = -1;
  let pA = 0;
  let pB = 0;
  let stage: "a" | "b" = "a";
  let px = 0;
  let py = 0;
  let pxS = 0;
  let pyS = 0;
  let focus: PostazioneId | null = null;
  let focusK = 0;
  let focusId: PostazioneId = "sald";
  let fermo = false;
  let running = false;
  let t = 0;
  let cur: Shot | null = null;
  let primo = true;
  const labels: Record<string, Punto> = {};
  for (const id of ORDINE) labels[id] = { x: 0, y: 0, vis: 0 };
  labels.est = { x: 0, y: 0, vis: 0 };
  labels.camion = { x: 0, y: 0, vis: 0 };
  const v3 = new THREE.Vector3();
  const qA = new THREE.Quaternion();
  const eul = new THREE.Euler();
  const colLime = new THREE.Color(LIME);
  const colRosso = new THREE.Color(ROSSO);
  const colAmbra = new THREE.Color(AMBRA);

  const resize = () => {
    if (!host) return;
    const r = host.getBoundingClientRect();
    vw = Math.max(1, Math.round(r.width));
    vh = Math.max(1, Math.round(r.height));
    stretto = vw / vh < 1.05 || vw < 900;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    cur = null;
  };

  const applicaCamera = (s: Shot, dAz: number, dEl: number) => {
    const vfov = (camera.fov * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const ang = Math.min(vfov * s.fv, hfov * s.fh);
    const dist = s.R / Math.sin(ang / 2);
    const az = s.az + dAz;
    const el = clamp(s.el + dEl, 0.12, 1.5);
    camera.position.set(s.tx + dist * Math.sin(az) * Math.cos(el), s.ty + dist * Math.sin(el), s.tz + dist * Math.cos(az) * Math.cos(el));
    camera.lookAt(s.tx, s.ty, s.tz);
    camera.setViewOffset(vw, vh, -s.ox * vw, -s.oy * vh, vw, vh);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  };

  const proietta = (x: number, y: number, z: number, out: Punto) => {
    v3.set(x, y, z).project(camera);
    out.x = (v3.x * 0.5 + 0.5) * vw;
    out.y = (-v3.y * 0.5 + 0.5) * vh;
  };

  let lento = 0;
  let conta = 0;
  const frame = (dtRaw: number) => {
    const dt = Math.min(dtRaw, 0.05);
    t += dt;
    const k = 1 - Math.exp(-dt * 5);
    pxS += (px - pxS) * k;
    pyS += (py - pyS) * k;

    /* --- inquadratura --- */
    const S = stretto ? SHOTS_STRETTO : SHOTS_LARGO;
    let target: Shot;
    if (stage === "a") {
      target = S[0];
      for (let i = 0; i < CONFINI.length; i++) target = mixShot(target, S[i + 1], smooth(CONFINI[i] - 0.055, CONFINI[i] + 0.055, pA));
    } else {
      const inizio = shot(0, 0.6, 0, -0.34, 0.58, 4.4, stretto ? 1 : 0.7, stretto ? 0.6 : 0.82, 0, stretto ? 0.04 : 0.02);
      // su schermo stretto il reparto si gira di un quarto: il lato lungo va in verticale e riempie il telefono
      const giro = stretto && vw < vh ? -Math.PI / 2 : 0;
      const alto = shot(0, 0, 0, giro, 1.47, giro ? 3.0 : 3.9, 1, 1, 0, giro ? 0.045 : 0);
      const dentro = shot(0, 0, 0, giro, 1.47, giro ? 1.9 : stretto ? 1.5 : 2.2, 1, 1, 0, 0);
      target = mixShot(mixShot(inizio, alto, easeInOut(range(0.12, 0.5, pB))), dentro, easeInOut(range(0.45, 0.8, pB)));
    }
    // schermo stretto: la teca si mette al centro della fascia libera tra il testo e i pannelli, grande quanto ci sta
    if (stage === "a" && stretto && areaBot > areaTop) {
      target = { ...target, oy: (areaTop + areaBot) / 2 - 0.5, fv: (areaBot - areaTop) / 0.7 };
    }
    focusK += ((focus ? 1 : 0) - focusK) * (1 - Math.exp(-Math.min(dtRaw, 1) * 4.5));
    if (focusK > 0.002) {
      const f = POS[focusId];
      const zoom = shot(f.x, f.h * 0.5, f.z + 0.3, target.az * 0.6 - 0.25, 0.52, 2.15, stretto ? 0.9 : 0.5, stretto ? 0.36 : 0.62, stretto ? 0 : 0.2, stretto ? -0.14 : 0.02);
      target = mixShot(target, zoom, easeInOut(clamp(focusK)));
    }
    if (!cur) cur = { ...target };
    else {
      const kc = primo ? 1 : 1 - Math.exp(-Math.min(dtRaw, 1) * 6);
      cur = mixShot(cur, target, kc);
    }
    primo = false;
    const libero = (1 - focusK) * (stage === "a" ? 1 : 1 - range(0, 0.3, pB));
    applicaCamera(cur, pxS * 0.17 * libero + Math.sin(t * 0.28) * 0.018 * libero, -pyS * 0.06 * libero);
    texRiflesso.offset.x = pxS * 0.06 + cur.az * 0.12;

    /* --- macchine --- */
    const lav = fermo ? 0 : 1;
    portale.position.x += (Math.sin(t * 0.7) * 0.5 - portale.position.x) * lav * k;
    testa.position.z += (Math.sin(t * 1.9) * 0.3 - testa.position.z) * lav * k;
    pestone.position.y += (-0.13 * smooth(0.55, 0.9, Math.sin(t * 0.9) * 0.5 + 0.5) - pestone.position.y) * lav * k;
    braccio1.rotation.z = -0.55 + Math.sin(t * 0.8) * 0.07 * lav;
    spalla.rotation.y = Math.sin(t * 0.5) * 0.25 * lav;
    (scintilla.material as THREE.MeshStandardMaterial).emissiveIntensity = lav ? 1.4 + Math.sin(t * 9) * 0.5 + Math.sin(t * 23) * 0.3 : 0.4;
    ponte.position.z += (Math.sin(t * 0.45) * 0.2 - ponte.position.z) * lav * k;
    sonda.position.x += (Math.sin(t * 0.8 + 1) * 0.28 - sonda.position.x) * lav * k;

    /* --- fogli: dal caos alle schede --- */
    const ordine = stage === "a" ? smooth(CONFINI[0] - 0.01, CONFINI[1] - 0.045, pA) : 1;
    for (const f of fogli) {
      const u = clamp((ordine - f.rit * 0.9) / 0.5);
      if (u >= 1) {
        f.g.visible = false;
        continue;
      }
      f.g.visible = true;
      const ang = f.a0 + f.w * t;
      const cx = Math.cos(ang) * f.rx;
      const cy = f.h0 + Math.sin(t * 0.55 + f.ph) * 0.2;
      const cz = Math.sin(ang) * f.rz;
      const m = easeInOut(range(0, 0.55, u));
      const piega = easeInOut(range(0.42, 0.74, u));
      const chiude = easeInOut(range(0.72, 1, u));
      f.g.position.set(lerp(cx, f.dest.x, m), lerp(cy, f.dest.y, m) + Math.sin(m * Math.PI) * 0.12, lerp(cz, f.dest.z, m));
      eul.set(Math.sin(t * 0.5 + f.ph) * 0.75, ang * 0.8 + Math.sin(t * 0.3 + f.ph) * 0.6, Math.cos(t * 0.42 + f.ph) * 0.6);
      qA.setFromEuler(eul);
      f.g.quaternion.copy(qA).slerp(camera.quaternion, m);
      f.dx.rotation.y = -piega * Math.PI * 0.985;
      // il foglio piegato si rimpicciolisce fino a sparire nel punto in cui compare l'etichetta
      // (resta opaco: gli oggetti trasparenti non si vedrebbero attraverso il vetro vero)
      f.g.scale.setScalar(Math.max(0.0001, f.base * (1 - chiude)));
    }

    /* --- etichette e steli --- */
    const etich = stage === "a" ? smooth(CONFINI[1] - 0.06, CONFINI[1] - 0.02, pA) : 0;
    // mentre si guarda il terzista le etichette del reparto si fanno da parte, e tornano solo a camera rientrata
    const fuori = stage === "a" ? smooth(CONFINI[2] - 0.04, CONFINI[2] + 0.01, pA) - smooth(CONFINI[3] + 0.005, CONFINI[3] + 0.05, pA) : 0;
    const stelo = etich * (1 - focusK) * (1 - fuori);
    steli.forEach((s, i) => {
      s.visible = stelo > 0.01;
      s.scale.y = Math.max(0.001, stelo);
      s.position.y = POS[ORDINE[i]].h + 0.08 + 0.18 * stelo;
    });
    ORDINE.forEach((id, i) => {
      const L = labels[id];
      proietta(POS[id].x, POS[id].h + 0.5, POS[id].z, L);
      L.vis = clamp(etich * 1.4 - i * 0.08) * (focus && focusId !== id ? 1 - focusK : 1) * (1 - fuori);
    });

    /* --- commesse --- */
    const flusso = stage === "a" ? smooth(CONFINI[1] - 0.05, CONFINI[1], pA) : 1;
    if (flusso > 0.5 && !fermo && !focus) avanzaFlusso(dt);
    else if (focus && !fermo) {
      // con una macchina aperta il resto si ferma, ma le sue ore continuano a correre
      const jf = jobs.find((x) => x.st === ORDINE.indexOf(focusId) && x.mv < 0 && !x.esce);
      if (jf && jf.st < 4) jf.p = Math.min(1, jf.p + dt / DURATA[jf.st]);
    }
    const stati = statoPostazioni();
    for (const j of jobs) {
      j.mesh.scale.setScalar(Math.max(0.0001, flusso * j.scala));
      j.mesh.visible = flusso > 0.01;
      const s = stati[j.st];
      const over = !!s && s.over && j.mv < 0;
      j.mat.color.lerp(over ? colAmbra : colLime, k);
      j.mat.emissive.lerp(over ? colAmbra : colLime, k);
    }

    /* --- camioncino e terzista --- */
    const c2 = CONFINI[2];
    const guida = stage === "a" ? easeInOut(range(c2 + 0.015, c2 + 0.115, pA)) : 1;
    const aperta = stage === "a" ? smooth(c2 - 0.01, c2 + 0.02, pA) - smooth(c2 + 0.075, c2 + 0.105, pA) : 0;
    porta.position.y = ph / 2 + aperta * (ph - 0.04);
    camion.position.set(lerp(2.5, ZINC.x - 0.12, guida), 0.01, lerp(0, 0.32, smooth(0.25, 0.95, guida)));
    camion.rotation.y = -Math.sin(guida * Math.PI) * 0.09;
    const notte = stage === "a" ? smooth(c2 + 0.118, c2 + 0.14, pA) - smooth(c2 + 0.14, c2 + 0.162, pA) : 0;
    const tardi = stage === "a" ? smooth(c2 + 0.15, c2 + 0.168, pA) : 1;
    key.intensity = 3.0 * (1 - notte * 0.72);
    hemi.intensity = 1.05 * (1 - notte * 0.6);
    const pulso = 0.8 + Math.sin(t * 3.2) * 0.2;
    matStato.color.copy(colLime).lerp(colRosso, tardi);
    matStato.emissive.copy(colLime).lerp(colRosso, tardi);
    matStato.emissiveIntensity = lerp(0.7, 1.7 * pulso, tardi);
    matCarico.color.copy(colLime).lerp(colRosso, tardi);
    matCarico.emissive.copy(colLime).lerp(colRosso, tardi);
    luceRossa.intensity = tardi * 2.4 * pulso;
    const visEst = stage === "a" ? smooth(c2 + 0.02, c2 + 0.06, pA) * (1 - smooth(CONFINI[3] - 0.04, CONFINI[3], pA)) : 0;
    proietta(ZINC.x + 0.1, 1.75, -0.5, labels.est);
    labels.est.vis = visEst;
    proietta(camion.position.x, 0.78, camion.position.z, labels.camion);
    labels.camion.vis = visEst * tardi;

    /* --- teca che si apre (chiusura) --- */
    const apre = stage === "b" ? easeInOut(range(0.02, 0.4, pB)) : 0;
    teca.position.y = apre * 1.6;
    teca.visible = apre < 0.995;
    if (stage === "b") {
      matVetroFinto.opacity = 0.085 * (1 - apre);
      matVetroLeggero.opacity = 1 - apre;
      matSpigolo.opacity = 0.42 * (1 - apre);
      matRiflesso.opacity = kRiflesso * (1 - apre);
    }
    // dall'alto la luce batte dritta sui piani delle macchine: si abbassa l'esposizione perché non brucino
    const pianta = stage === "b" ? smooth(0.3, 0.46, pB) * (1 - smooth(0.6, 0.68, pB)) : 0;
    renderer.toneMappingExposure = 1.22 - (stage === "b" ? 0.34 * smooth(0.15, 0.5, pB) : 0);

    renderer.render(scene, camera);
    opts.onFrame({ w: vw, h: vh, labels, postazioni: stati, giornoDopo: notte > 0.5 || tardi > 0.01, ritardo: tardi > 0.6, camionFuori: guida > 0.9, pianta });

    /* --- regolatore: se il telefono fatica, si abbassa la risoluzione --- */
    conta++;
    if (dtRaw > 0.024) lento++;
    if (conta >= 90) {
      if (lento > 45 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        renderer.setSize(vw, vh, false);
      }
      conta = 0;
      lento = 0;
    }
  };

  let last = 0;
  let raf = 0;
  let annunciato = false;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = last ? (now - last) / 1000 : 0.016;
    last = now;
    frame(dt);
    if (!annunciato) {
      annunciato = true;
      opts.onPronto?.();
    }
  };

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  return {
    canvas,
    mount(h) {
      if (host === h) return;
      host = h;
      h.appendChild(canvas);
      ro?.disconnect();
      ro = new ResizeObserver(resize);
      ro.observe(h);
      resize();
    },
    setA(p) {
      pA = p;
    },
    setB(q) {
      pB = q;
    },
    setStage(s) {
      if (stage === s) return;
      stage = s;
      cur = null;
      // nella chiusura il vetro deve poter svanire: si usa quello leggero su tutti i dispositivi
      const m = s === "b" ? vetroB : vetroA;
      if (m !== matVetro) {
        matVetro = m;
        lastre.forEach((l) => (l.material = m));
      }
      if (s === "a") {
        matVetroFinto.opacity = 0.085;
        matVetroLeggero.opacity = 1;
        matSpigolo.opacity = 0.42;
        matRiflesso.opacity = kRiflesso;
      }
    },
    setArea(top, bottom) {
      areaTop = top;
      areaBot = bottom;
    },
    setPointer(x, y) {
      px = x;
      py = y;
    },
    setFocus(id) {
      focus = id;
      if (id) focusId = id;
    },
    setFermo(on) {
      fermo = on;
    },
    setNome(nome) {
      disegnaTarga(nome);
    },
    setRunning(on) {
      if (on === running) return;
      running = on;
      if (on) {
        last = 0;
        raf = requestAnimationFrame(loop);
      } else cancelAnimationFrame(raf);
    },
    pick(clientX, clientY) {
      const r = canvas.getBoundingClientRect();
      ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(bersagli, false)[0];
      return hit ? (hit.object.userData.id as PostazioneId) : null;
    },
    dispose() {
      cancelAnimationFrame(raf);
      running = false;
      ro?.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => {
          const mm = x as THREE.MeshStandardMaterial;
          mm.map?.dispose();
          x.dispose();
        });
      });
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

export { POSTAZIONI };
