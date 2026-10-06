// UI inventata di ÈTERE One, disegnata su canvas e usata come emissiveMap del vetro frontale.
// Modalità: off · boot (p 0..1) · ui (orologio + sfondo astratto animato) · camera (immagine della scena) · word (una parola grande)
import * as THREE from "three";

const CW = 900, CH = 1963;
const BEZEL = 24, RAD = 100;

export function createScreen() {
  const canvas = document.createElement("canvas");
  canvas.width = CW; canvas.height = CH;
  const g = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  let lastKey = "";

  function clipDisplay() {
    g.beginPath();
    g.roundRect(BEZEL, BEZEL, CW - 2 * BEZEL, CH - 2 * BEZEL, RAD);
    g.clip();
  }

  // sfondo astratto: nastri di luce morbidi (rame, viola, petrolio) che scorrono lenti
  function aurora(t, dim = 1) {
    g.fillStyle = "#05060b";
    g.fillRect(0, 0, CW, CH);
    const blobs = [
      { c: [214, 120, 72], x: 0.25, y: 0.72, r: 0.75, sx: 0.13, sy: 0.07, f: 0.21 },
      { c: [96, 64, 214], x: 0.8, y: 0.35, r: 0.7, sx: 0.1, sy: 0.11, f: 0.17 },
      { c: [36, 150, 150], x: 0.5, y: 0.95, r: 0.6, sx: 0.16, sy: 0.05, f: 0.13 },
      { c: [160, 60, 120], x: 0.15, y: 0.2, r: 0.5, sx: 0.08, sy: 0.12, f: 0.11 },
    ];
    g.globalCompositeOperation = "lighter";
    for (const b of blobs) {
      const x = (b.x + Math.sin(t * b.f * 6.283 + b.x * 9) * b.sx) * CW;
      const y = (b.y + Math.cos(t * b.f * 5.1 + b.y * 7) * b.sy) * CH;
      const r = b.r * CW * (1 + 0.08 * Math.sin(t * 0.9 + b.x * 4));
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      const a = 0.85 * dim;
      gr.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${a})`);
      gr.addColorStop(0.5, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${a * 0.35})`);
      gr.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
      g.fillStyle = gr;
      g.fillRect(0, 0, CW, CH);
    }
    // onde sottili
    g.lineWidth = 2;
    for (let k = 0; k < 9; k++) {
      g.strokeStyle = `rgba(255,220,190,${0.05 * dim})`;
      g.beginPath();
      for (let x = 0; x <= CW; x += 12) {
        const y = CH * 0.62 + k * 26 + Math.sin(x * 0.006 + t * 0.8 + k * 0.5) * 60 + Math.sin(x * 0.013 - t * 0.5) * 20;
        x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
    }
    g.globalCompositeOperation = "source-over";
  }

  function statusBar(alpha) {
    g.fillStyle = `rgba(242,238,230,${0.8 * alpha})`;
    g.font = "500 30px Body";
    g.textAlign = "left";
    g.fillText("21:47", 90, 92);
    g.textAlign = "right";
    // icone astratte: tre barre + pillola batteria (nessun numero)
    for (let i = 0; i < 3; i++) g.fillRect(CW - 200 + i * 14, 82 - i * 8, 8, 10 + i * 8);
    g.strokeStyle = `rgba(242,238,230,${0.8 * alpha})`;
    g.lineWidth = 2.5;
    g.beginPath(); g.roundRect(CW - 140, 66, 52, 26, 8); g.stroke();
    g.fillRect(CW - 136, 70, 36, 18);
  }

  function ui(t, alpha = 1) {
    aurora(t, alpha);
    g.save();
    g.globalAlpha = alpha;
    statusBar(1);
    // orologio grande
    g.fillStyle = "#f4efe6";
    g.textAlign = "center";
    g.font = "800 300px Display";
    g.fillText("21", CW / 2, 600);
    g.fillText("47", CW / 2, 880);
    g.font = "italic 64px Serif";
    g.fillStyle = "rgba(244,239,230,0.85)";
    g.fillText("martedì 6 ottobre", CW / 2, 990);
    // widget minimale
    g.fillStyle = "rgba(255,255,255,0.07)";
    g.beginPath(); g.roundRect(90, 1460, CW - 180, 170, 46); g.fill();
    g.fillStyle = "rgba(244,239,230,0.75)";
    g.font = "500 34px Body";
    g.textAlign = "left";
    g.fillText("Luna crescente", 140, 1535);
    g.fillStyle = "rgba(244,239,230,0.45)";
    g.font = "500 28px Body";
    g.fillText("Cielo sereno stanotte", 140, 1585);
    g.fillStyle = "#d7845a";
    g.beginPath(); g.arc(CW - 160, 1545, 34, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(5,6,11,0.9)";
    g.beginPath(); g.arc(CW - 146, 1535, 30, 0, Math.PI * 2); g.fill();
    // barra home
    g.fillStyle = "rgba(244,239,230,0.6)";
    g.beginPath(); g.roundRect(CW / 2 - 110, CH - 70, 220, 9, 5); g.fill();
    g.restore();
  }

  function boot(t, p) {
    g.fillStyle = "#000";
    g.fillRect(0, 0, CW, CH);
    // 0..0.45 il marchio si accende, 0.45..1 dissolve nella UI
    const a = Math.min(1, p / 0.25) * (p < 0.55 ? 1 : Math.max(0, 1 - (p - 0.55) / 0.25));
    if (p > 0.45) ui(t, Math.min(1, (p - 0.45) / 0.45));
    if (a > 0) {
      const gr = g.createRadialGradient(CW / 2, CH / 2, 0, CW / 2, CH / 2, 420);
      gr.addColorStop(0, `rgba(215,132,90,${0.45 * a})`);
      gr.addColorStop(1, "rgba(215,132,90,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, CW, CH);
      g.fillStyle = `rgba(246,238,226,${a})`;
      g.font = "800 92px Display";
      g.textAlign = "center";
      g.letterSpacing = "26px";
      g.fillText("ÈTERE", CW / 2 + 13, CH / 2 + 30);
      g.letterSpacing = "0px";
    }
  }

  function camera(img, t) {
    g.fillStyle = "#000";
    g.fillRect(0, 0, CW, CH);
    if (img) {
      // riempie il display (cover)
      const ar = img.width / img.height, dr = CW / CH;
      let sw = img.width, sh = img.height, sx = 0, sy = 0;
      if (ar > dr) { sw = img.height * dr; sx = (img.width - sw) / 2; } else { sh = img.width / dr; sy = (img.height - sh) / 2; }
      g.drawImage(img, sx, sy, sw, sh, 0, 0, CW, CH);
    }
    // interfaccia fotocamera essenziale
    g.fillStyle = "rgba(0,0,0,0.35)";
    g.fillRect(0, CH - 330, CW, 330);
    g.strokeStyle = "rgba(255,255,255,0.95)";
    g.lineWidth = 7;
    g.beginPath(); g.arc(CW / 2, CH - 175, 70, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.95)";
    g.beginPath(); g.arc(CW / 2, CH - 175, 56, 0, Math.PI * 2); g.fill();
    g.font = "500 30px Body";
    g.textAlign = "center";
    g.fillStyle = "#d7845a";
    g.fillText("NOTTE", CW / 2, CH - 290);
    g.fillStyle = "rgba(255,255,255,0.6)";
    g.fillText("FOTO        VIDEO", CW / 2 + 10, CH - 40);
    // griglia sottile
    g.strokeStyle = "rgba(255,255,255,0.12)";
    g.lineWidth = 2;
    for (const f of [1 / 3, 2 / 3]) {
      g.beginPath(); g.moveTo(CW * f, 140); g.lineTo(CW * f, CH - 340); g.stroke();
      g.beginPath(); g.moveTo(0, 140 + (CH - 480) * f); g.lineTo(CW, 140 + (CH - 480) * f); g.stroke();
    }
  }

  function update(state = {}, t = 0, img = null) {
    const mode = state.mode || "off";
    const key = mode === "off" ? "off" : `${mode}:${t.toFixed(4)}:${state.p ?? ""}:${img ? img.src : ""}`;
    if (key === lastKey) return;
    lastKey = key;
    g.save();
    g.clearRect(0, 0, CW, CH);
    g.fillStyle = "#000";
    g.fillRect(0, 0, CW, CH);
    if (mode !== "off") {
      clipDisplay();
      if (mode === "ui") ui(t);
      else if (mode === "boot") boot(t, state.p ?? 0);
      else if (mode === "camera") camera(img, t);
    }
    g.restore();
    tex.needsUpdate = true;
  }

  return { texture: tex, update };
}
