// ÈTERE One – modello procedurale (unità: cm). Design originale LIMITLESS:
// telaio in titanio satinato "sabbia lunare", bordi piatti con raccordi morbidi,
// retro in vetro opaco, modulo fotocamera circolare unico con 3 lenti a triangolo
// e anello sottile in rame, un solo tasto laterale con scanalatura, nessuna isola frontale.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export const DIM = { W: 7.2, H: 15.4, D: 0.82, R: 1.05 };

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

// UV planari normalizzati sul rettangolo w x h (mirror = vista dal retro)
function planarUV(geo, w, h, mirror = false) {
  const p = geo.attributes.position, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i) / w + 0.5;
    uv[i * 2] = mirror ? 1 - u : u;
    uv[i * 2 + 1] = p.getY(i) / h + 0.5;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

function canvasTex(w, h, draw, srgb = false) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 16;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Spazzolatura: strisce sottili lungo u, rumore lungo v
function brushedTex() {
  return canvasTex(64, 1024, (g, w, h) => {
    const img = g.createImageData(w, h);
    let v = 0.5;
    for (let y = 0; y < h; y++) {
      v = v * 0.6 + Math.random() * 0.4;
      const fine = Math.random() * 0.25;
      const val = Math.floor(150 + (v - 0.5) * 120 + fine * 60);
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = val;
        img.data[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
  });
}

// Vetro satinato: micro-rumore per la rugosità
function frostTex() {
  return canvasTex(512, 512, (g, w, h) => {
    const img = g.createImageData(w, h);
    for (let i = 0; i < w * h; i++) {
      const val = 150 + Math.random() * 50;
      img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = val;
      img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  });
}

// Retro: colore sabbia + marchio ÈTERE inciso (più lucido e appena più chiaro)
function backTextures(fontReady) {
  const W = 720, H = 1540;
  const color = canvasTex(W, H, (g) => {
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#c9bfae");
    grad.addColorStop(1, "#bfb39f");
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    g.fillStyle = "#d8cfbf";
    g.font = `600 34px ${fontReady ? "Display" : "sans-serif"}`;
    g.textAlign = "center";
    g.letterSpacing = "14px";
    g.fillText("ÈTERE", W / 2 + 7, H - 190);
  }, true);
  const rough = canvasTex(W, H, (g) => {
    g.fillStyle = "#9a9a9a"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#202020";
    g.font = `600 34px ${fontReady ? "Display" : "sans-serif"}`;
    g.textAlign = "center";
    g.letterSpacing = "14px";
    g.fillText("ÈTERE", W / 2 + 7, H - 190);
  });
  color.wrapS = color.wrapT = rough.wrapS = rough.wrapT = THREE.ClampToEdgeWrapping;
  return { color, rough };
}

export function buildPhone({ screenTexture }) {
  const { W, H, D, R } = DIM;
  const g = new THREE.Group();
  g.name = "phone";

  // ---------- materiali ----------
  const brushed = brushedTex();
  brushed.repeat.set(1, 6);
  const titanium = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#c3b49c"), metalness: 1, roughness: 0.34,
    roughnessMap: brushed, anisotropy: 0.85, anisotropyRotation: 0,
    clearcoat: 0.08, clearcoatRoughness: 0.4,
  });
  const titaniumDark = titanium.clone();
  titaniumDark.color = new THREE.Color("#8d8170");
  titaniumDark.roughness = 0.45;

  const frost = frostTex();
  frost.repeat.set(3, 6);
  const back = backTextures(document.fonts.check("12px Display"));
  const backGlass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, map: back.color, metalness: 0, roughness: 0.62, roughnessMap: back.rough,
    clearcoat: 0.55, clearcoatRoughness: 0.32, clearcoatRoughnessMap: frost,
    specularIntensity: 0.6, sheen: 0.25, sheenColor: new THREE.Color("#f4e9d8"), sheenRoughness: 0.6,
  });

  const front = new THREE.MeshPhysicalMaterial({
    color: 0x020203, metalness: 0, roughness: 0.18,
    clearcoat: 1, clearcoatRoughness: 0.07,
    emissive: 0xffffff, emissiveMap: screenTexture, emissiveIntensity: 1.35,
    specularIntensity: 0.4,
  });

  const copper = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#d7845a"), metalness: 1, roughness: 0.2, anisotropy: 0.6,
    clearcoat: 0.3, clearcoatRoughness: 0.15,
  });
  const anodized = new THREE.MeshPhysicalMaterial({ color: 0x0c0c0e, metalness: 0.6, roughness: 0.38 });
  const blackGloss = new THREE.MeshPhysicalMaterial({ color: 0x010101, metalness: 0.2, roughness: 0.12, clearcoat: 1 });
  const lensCoat = new THREE.MeshPhysicalMaterial({
    color: 0x020205, metalness: 0, roughness: 0.03, ior: 1.9,
    iridescence: 1, iridescenceIOR: 1.45, iridescenceThicknessRange: [320, 720],
    specularIntensity: 1, envMapIntensity: 1.6,
  });
  const lensDeep = new THREE.MeshPhysicalMaterial({
    color: 0x01030a, metalness: 0, roughness: 0.05, ior: 1.7,
    iridescence: 1, iridescenceIOR: 1.3, iridescenceThicknessRange: [500, 900], specularIntensity: 1,
  });
  const coverGlass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.0, transmission: 1, thickness: 0.06, ior: 1.52,
    specularIntensity: 1, clearcoat: 1, clearcoatRoughness: 0, transparent: false,
  });
  const flashMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#efe6cf"), roughness: 0.55, transmission: 0.3, thickness: 0.05 });

  const mats = { titanium, titaniumDark, backGlass, front, copper, anodized, blackGloss, lensCoat, coverGlass };

  // ---------- telaio ----------
  const b = 0.11;
  const bodyGeo = new THREE.ExtrudeGeometry(roundedRectShape(W - 2 * b, H - 2 * b, R - b), {
    depth: D - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 10, curveSegments: 64,
  });
  bodyGeo.translate(0, 0, -(D - 2 * b) / 2);
  const body = new THREE.Mesh(bodyGeo, titanium);
  body.castShadow = body.receiveShadow = true;
  g.add(body);

  // ---------- vetri ----------
  const inset = 0.13, gt = 0.035;
  const glassShape = roundedRectShape(W - 2 * inset, H - 2 * inset, R - inset);
  const glassOpts = { depth: gt, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 64 };

  const frontGeo = new THREE.ExtrudeGeometry(glassShape, glassOpts);
  planarUV(frontGeo, W - 2 * inset, H - 2 * inset);
  frontGeo.translate(0, 0, D / 2 - gt + 0.008);
  const frontMesh = new THREE.Mesh(frontGeo, front);
  frontMesh.name = "screen";
  g.add(frontMesh);

  const backGeo = new THREE.ExtrudeGeometry(glassShape, glassOpts);
  planarUV(backGeo, W - 2 * inset, H - 2 * inset, true);
  backGeo.translate(0, 0, -D / 2 - 0.02);
  const backMesh = new THREE.Mesh(backGeo, backGlass);
  backMesh.receiveShadow = true;
  g.add(backMesh);

  // ---------- modulo fotocamera circolare (retro, centrato in alto) ----------
  const cam = new THREE.Group();
  const RM = 1.52;
  // plinto in titanio con raccordo: profilo in tornio (asse y -> ruotato su z)
  const plinthPts = [];
  plinthPts.push(new THREE.Vector2(RM - 0.2, 0.13));
  plinthPts.push(new THREE.Vector2(RM - 0.14, 0.13));
  for (let i = 0; i <= 8; i++) {
    const a = (i / 8) * (Math.PI / 2);
    plinthPts.push(new THREE.Vector2(RM - 0.14 + Math.sin(a) * 0.1, 0.03 + Math.cos(a) * 0.1));
  }
  plinthPts.push(new THREE.Vector2(RM - 0.04, 0.0));
  plinthPts.push(new THREE.Vector2(RM + 0.06, -0.02));
  const plinth = new THREE.Mesh(new THREE.LatheGeometry(plinthPts.reverse(), 128), titanium);
  plinth.rotation.x = Math.PI / 2;
  plinth.castShadow = true;
  cam.add(plinth);

  // parete laterale tra plinto e vetro
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(RM - 0.1, RM - 0.1, 0.08, 128, 1, true), titanium);
  wall.rotation.x = Math.PI / 2;
  wall.position.z = 0.17;
  cam.add(wall);

  // anello sottile in rame attorno al vetro
  const ring = new THREE.Mesh(new THREE.TorusGeometry(RM - 0.075, 0.032, 24, 192), copper);
  ring.position.z = 0.205;
  cam.add(ring);

  // 3 lenti a triangolo: posizioni
  const lensR = 0.43, holeR = 0.3;
  const lensPos = [0, 1, 2].map((k) => {
    const a = Math.PI / 2 + (k * 2 * Math.PI) / 3;
    return new THREE.Vector2(Math.cos(a) * 0.74, Math.sin(a) * 0.74);
  });

  // piatto nero lucido con i fori delle lenti
  const deckShape = new THREE.Shape();
  deckShape.absarc(0, 0, RM - 0.1, 0, Math.PI * 2, false);
  for (const p of lensPos) {
    const hole = new THREE.Path();
    hole.absarc(p.x, p.y, holeR, 0, Math.PI * 2, true);
    deckShape.holes.push(hole);
  }
  const deck = new THREE.Mesh(new THREE.ShapeGeometry(deckShape, 96), blackGloss);
  deck.position.z = 0.132;
  cam.add(deck);

  for (const p of lensPos) {
    const L = new THREE.Group();
    L.position.set(p.x, p.y, 0.132);
    // barilotto anodizzato con gradini concentrici
    const prof = [
      new THREE.Vector2(holeR, 0.0), new THREE.Vector2(lensR - 0.06, 0.0), new THREE.Vector2(lensR, 0.0),
      new THREE.Vector2(lensR, 0.035), new THREE.Vector2(lensR - 0.04, 0.045), new THREE.Vector2(holeR + 0.02, 0.03),
      new THREE.Vector2(holeR, 0.0),
    ];
    const barrel = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), anodized);
    barrel.rotation.x = Math.PI / 2;
    L.add(barrel);
    const steel = new THREE.Mesh(new THREE.TorusGeometry(lensR - 0.02, 0.011, 12, 96), titanium);
    steel.position.z = 0.04;
    L.add(steel);
    // pozzo interno scuro
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(holeR, holeR, 0.1, 64, 1, true), new THREE.MeshPhysicalMaterial({ color: 0x050506, roughness: 0.5, side: THREE.BackSide }));
    tube.rotation.x = Math.PI / 2;
    tube.position.z = -0.05;
    L.add(tube);
    const inner = new THREE.Mesh(new THREE.RingGeometry(0.2, holeR, 96), anodized);
    inner.position.z = -0.05;
    L.add(inner);
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(holeR, 48), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    bottom.position.z = -0.1;
    L.add(bottom);
    // elemento ottico con coating viola-verde
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.36, 64, 32, 0, Math.PI * 2, 0, 0.62), lensCoat);
    cap.rotation.x = Math.PI / 2;
    cap.position.z = -0.38;
    L.add(cap);
    // secondo elemento più profondo (riflessi a strati)
    const cap2 = new THREE.Mesh(new THREE.SphereGeometry(0.16, 48, 24, 0, Math.PI * 2, 0, 0.9), lensDeep);
    cap2.rotation.x = Math.PI / 2;
    cap2.position.z = -0.2;
    L.add(cap2);
    const iris = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.205, 64), new THREE.MeshPhysicalMaterial({ color: 0x0a0a0c, metalness: 0.8, roughness: 0.25 }));
    iris.position.z = -0.075;
    L.add(iris);
    cam.add(L);
  }
  // flash al centro
  const flash = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 48), flashMat);
  flash.rotation.x = Math.PI / 2;
  flash.position.z = 0.14;
  cam.add(flash);
  // vetro di copertura con rifrazione
  const cover = new THREE.Mesh(new THREE.CylinderGeometry(RM - 0.105, RM - 0.105, 0.025, 128), coverGlass);
  cover.rotation.x = Math.PI / 2;
  cover.position.z = 0.2;
  cam.add(cover);

  cam.rotation.y = Math.PI; // guarda verso -z (retro)
  cam.position.set(0, H / 2 - 2.55, -D / 2 - 0.012);
  cam.name = "cameraModule";
  g.add(cam);

  // ---------- tasto laterale con scanalatura (lato destro) ----------
  const btn = new THREE.Group();
  const halfA = new THREE.Mesh(new RoundedBoxGeometry(0.1, 2.1, 0.16, 4, 0.04), titanium);
  halfA.position.z = 0.09;
  const halfB = halfA.clone();
  halfB.position.z = -0.09;
  const groove = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 0.04), new THREE.MeshPhysicalMaterial({ color: 0x15130f, roughness: 0.5, metalness: 0.5 }));
  btn.add(halfA, halfB, groove);
  btn.position.set(W / 2 + 0.03, H / 2 - 4.6, 0);
  btn.traverse((o) => (o.castShadow = true));
  g.add(btn);

  // ---------- lato inferiore: porta e altoparlante ----------
  const port = new THREE.Mesh(new RoundedBoxGeometry(0.95, 0.06, 0.3, 3, 0.12), blackGloss);
  port.position.set(0, -H / 2 + 0.01, 0);
  g.add(port);
  const holeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16);
  for (let i = 0; i < 6; i++) {
    for (const side of [-1, 1]) {
      const h = new THREE.Mesh(holeGeo, blackGloss);
      h.position.set(side * (1.0 + i * 0.22), -H / 2 + 0.005, 0);
      g.add(h);
    }
  }
  // linee antenna sottili (inserti scuri nel telaio)
  const bandMat = new THREE.MeshPhysicalMaterial({ color: 0x3a352e, roughness: 0.6 });
  for (const y of [H / 2 - 1.6, -H / 2 + 1.6]) {
    for (const side of [-1, 1]) {
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.07, D - 0.28), bandMat);
      band.position.set(side * (W / 2 + 0.002), y, 0);
      g.add(band);
    }
  }

  return { group: g, mats, screenMesh: frontMesh };
}
