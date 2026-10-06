// Motore di render: accumulo di N campioni per fotogramma (antialias + profondità di campo
// fisica con apertura della lente + motion blur con otturatore a 180°). HDR lineare -> AgX -> sRGB.
import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { buildPhone, DIM } from "./phone.js";
import { createScreen } from "./screen.js";
import { SHOTS } from "./shots.js";

const V = (a) => new THREE.Vector3(...a);
let renderer, scene, camera, phone, mirror, screen, pmrem, studioEnv, sampleRT, accumRT, accumScene, finalScene, quadCam;
let key, rim, strip, fill, dust, dustBase, floorMirror, floorShadow, W, H;
const envCache = new Map();
const imgCache = new Map();

function halton(i, b) { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; }

async function loadFonts() {
  const faces = [
    new FontFace("Display", "url(/fonts/ArchivoCondensed-ExtraBold.ttf)", { weight: "800" }),
    new FontFace("Body", "url(/fonts/Archivo-Medium.ttf)", { weight: "500" }),
    new FontFace("Serif", "url(/3d/assets/InstrumentSerif-Italic.ttf)", { style: "italic" }),
  ];
  for (const f of faces) { await f.load(); document.fonts.add(f); }
}

function loadImage(url) {
  if (imgCache.has(url)) return imgCache.get(url);
  const p = new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  imgCache.set(url, p);
  if (imgCache.size > 40) imgCache.delete(imgCache.keys().next().value);
  return p;
}

async function envFromImage(url) {
  if (envCache.has(url)) return envCache.get(url);
  const img = await loadImage(url);
  const t = new THREE.Texture(img);
  t.mapping = THREE.EquirectangularReflectionMapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  const rt = pmrem.fromEquirectangular(t);
  t.dispose();
  envCache.set(url, rt.texture);
  if (envCache.size > 3) { const k = envCache.keys().next().value; envCache.get(k).dispose(); envCache.delete(k); }
  return rt.texture;
}

function dustTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.4, "rgba(255,255,255,0.35)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export async function setup({ width, height }) {
  W = width; H = height;
  await loadFonts();
  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);
  RectAreaLightUniformsLib.init();
  pmrem = new THREE.PMREMGenerator(renderer);

  const hdr = await new RGBELoader().loadAsync("/3d/assets/studio.hdr");
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  studioEnv = pmrem.fromEquirectangular(hdr).texture;
  hdr.dispose();

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(30, W / H, 0.5, 400);

  screen = createScreen();
  phone = buildPhone({ screenTexture: screen.texture });
  scene.add(phone.group);
  mirror = phone.group.clone();
  mirror.matrixAutoUpdate = false;
  mirror.visible = false;
  scene.add(mirror);

  key = new THREE.SpotLight(0xffffff, 0, 0, Math.PI / 7, 0.25, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.bias = -0.0002;
  key.shadow.radius = 4;
  scene.add(key, key.target);
  fill = new THREE.DirectionalLight(0xffffff, 0);
  scene.add(fill, fill.target);
  rim = new THREE.RectAreaLight(0xffffff, 0, 4, 30);
  strip = new THREE.RectAreaLight(0xffffff, 0, 0.6, 40);
  scene.add(rim, strip);

  // pavimento a specchio (packshot) e catturaombre (compositing)
  const fadeC = document.createElement("canvas"); fadeC.width = fadeC.height = 256;
  const fg = fadeC.getContext("2d");
  const fgr = fg.createRadialGradient(128, 128, 0, 128, 128, 128);
  fgr.addColorStop(0, "#ffffff"); fgr.addColorStop(0.55, "#bbbbbb"); fgr.addColorStop(1, "#000000");
  fg.fillStyle = fgr; fg.fillRect(0, 0, 256, 256);
  floorMirror = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.8 }),
  );
  floorMirror.rotation.x = -Math.PI / 2;
  floorMirror.visible = false;
  scene.add(floorMirror);
  floorShadow = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.55 }));
  floorShadow.rotation.x = -Math.PI / 2;
  floorShadow.receiveShadow = true;
  floorShadow.visible = false;
  scene.add(floorShadow);

  // polvere nell'aria
  const N = 1400;
  dustBase = new Float32Array(N * 4);
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    dustBase[i * 4] = (Math.random() - 0.5) * 40;
    dustBase[i * 4 + 1] = (Math.random() - 0.5) * 50;
    dustBase[i * 4 + 2] = (Math.random() - 0.5) * 40;
    dustBase[i * 4 + 3] = Math.random() * 100;
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  dust = new THREE.Points(dg, new THREE.PointsMaterial({
    size: 0.07, map: dustTexture(), color: new THREE.Color("#ffe2c4"), transparent: true, opacity: 0,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  }));
  dust.frustumCulled = false;
  scene.add(dust);

  // accumulo
  const rtOpts = { type: THREE.HalfFloatType, format: THREE.RGBAFormat, samples: 0 };
  sampleRT = new THREE.WebGLRenderTarget(W, H, rtOpts);
  accumRT = new THREE.WebGLRenderTarget(W, H, rtOpts);
  quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = (mat) => { const s = new THREE.Scene(); s.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat)); return s; };
  accumScene = quad(new THREE.ShaderMaterial({
    uniforms: { tex: { value: sampleRT.texture }, w: { value: 1 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }",
    fragmentShader: "uniform sampler2D tex; uniform float w; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tex, vUv) * w; }",
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor, depthTest: false, depthWrite: false, toneMapped: false,
  }));
  finalScene = quad(new THREE.ShaderMaterial({
    uniforms: { tex: { value: accumRT.texture } },
    vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }",
    fragmentShader: `uniform sampler2D tex; varying vec2 vUv;
      void main(){
        vec4 c = texture2D(tex, vUv);
        float a = clamp(c.a, 0.0, 1.0);
        vec3 col = c.rgb / max(c.a, 1e-4);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        gl_FragColor = vec4(gl_FragColor.rgb * a, a);
      }`,
    blending: THREE.NoBlending, depthTest: false, depthWrite: false, toneMapped: true,
  }));
  return true;
}

let lastEnvKey = "";
async function applyState(st, t, bgUrl, isFirstSample) {
  // fotocamera
  camera.position.copy(V(st.cam.pos));
  camera.up.set(0, 1, 0);
  const target = V(st.cam.target);
  camera.lookAt(target);
  if (st.cam.roll) camera.rotateZ(st.cam.roll);
  const portrait = W / H < 1;
  const landscapeFactor = st.cam.fovL ?? 0.95;
  camera.fov = portrait ? st.cam.fov * (W / H > 0.7 ? 0.86 : 1) : st.cam.fov * landscapeFactor;
  camera.aspect = W / H;
  camera.updateProjectionMatrix();

  // telefono
  const p = phone.group;
  p.position.copy(V(st.phone.pos));
  p.rotation.set(...st.phone.rot, "YXZ");
  p.updateMatrixWorld(true);

  // specchio a terra
  const floorY = st.floorY ?? -DIM.H / 2 - 0.02;
  mirror.visible = st.floor === "mirror";
  floorMirror.visible = st.floor === "mirror";
  floorShadow.visible = st.floor === "shadow";
  floorMirror.position.y = floorShadow.position.y = floorY;
  if (mirror.visible) {
    const refl = new THREE.Matrix4().makeTranslation(0, floorY, 0)
      .multiply(new THREE.Matrix4().makeScale(1, -1, 1))
      .multiply(new THREE.Matrix4().makeTranslation(0, -floorY, 0));
    mirror.matrix.copy(refl).multiply(p.matrix);
    mirror.matrixWorldNeedsUpdate = true;
    floorMirror.material.opacity = st.mirrorOpacity ?? 0.8;
  }

  // luci
  const L = (light, s, isArea) => {
    if (!s) { light.intensity = 0; return; }
    light.color.set(s.color || "#ffffff");
    light.intensity = s.intensity;
    light.position.copy(V(s.pos));
    if (isArea) {
      light.width = s.w ?? light.width; light.height = s.h ?? light.height;
      light.lookAt(V(s.target || [0, 0, 0]));
    } else if (light.target) {
      light.target.position.copy(V(s.target || [0, 0, 0]));
      light.target.updateMatrixWorld();
    }
    if (s.angle && light.isSpotLight) { light.angle = s.angle; light.penumbra = s.penumbra ?? 0.25; }
  };
  L(key, st.key, false);
  L(fill, st.fill, false);
  L(rim, st.rim, true);
  L(strip, st.strip, true);

  // ambiente
  if (isFirstSample) {
    const ek = st.env?.fromBg && bgUrl ? bgUrl : "studio";
    if (ek !== lastEnvKey) {
      scene.environment = ek === "studio" ? studioEnv : await envFromImage(bgUrl);
      lastEnvKey = ek;
    }
  }
  scene.environmentIntensity = st.env?.intensity ?? 0.4;
  scene.environmentRotation.set(0, st.env?.rotY ?? 0, 0);
  scene.background = st.bg ? new THREE.Color(st.bg) : null;
  renderer.toneMappingExposure = st.exposure ?? 1;
  phone.mats.front.emissiveIntensity = st.screenGain ?? 1.35;

  // polvere
  dust.material.opacity = st.dust ?? 0;
  dust.visible = (st.dust ?? 0) > 0;
  if (dust.visible) {
    const a = dust.geometry.attributes.position;
    for (let i = 0; i < a.count; i++) {
      const s = dustBase[i * 4 + 3];
      a.setXYZ(i,
        dustBase[i * 4] + Math.sin(t * 0.21 + s) * 0.8 + t * 0.12,
        dustBase[i * 4 + 1] + Math.sin(t * 0.13 + s * 1.7) * 0.6 + t * 0.05,
        dustBase[i * 4 + 2] + Math.cos(t * 0.17 + s * 0.7) * 0.8);
    }
    a.needsUpdate = true;
  }
}

// Renderizza un fotogramma: shot = nome, t = secondi dentro lo shot
export async function renderFrame({ shot, t, dur, samples = 16, shutter = 0.5, fps = 30, bg = null, format = "png", opts = {} }) {
  const def = SHOTS[shot];
  if (!def) throw new Error("shot sconosciuto " + shot);
  const ctx = { dur, aspect: W / H, opts };
  const stMid = def(t, ctx);
  const img = bg ? await loadImage(bg) : null;
  screen.update(stMid.screen, stMid.screen?.time ?? t, stMid.screen?.mode === "camera" ? img : null);

  renderer.setRenderTarget(accumRT);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  const N = stMid.samples ?? samples;
  for (let i = 0; i < N; i++) {
    const ts = t + ((i + 0.5) / N - 0.5) * (shutter / fps) * (stMid.blur ?? 1);
    const st = def(ts, ctx);
    await applyState(st, ts, bg, i === 0);
    // apertura della lente: campionamento su disco (Halton) e rimira sul punto a fuoco
    const ap = st.cam.aperture ?? 0;
    if (ap > 0) {
      const r = Math.sqrt(halton(i + 1, 2)) * ap, th = halton(i + 1, 3) * Math.PI * 2;
      const focusPt = st.cam.focus ? V(st.cam.focus) : V(st.cam.target);
      const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      camera.position.addScaledVector(right, Math.cos(th) * r).addScaledVector(up, Math.sin(th) * r);
      camera.lookAt(focusPt);
      if (st.cam.roll) camera.rotateZ(st.cam.roll);
    }
    // jitter sub-pixel
    camera.setViewOffset(W, H, halton(i + 1, 5) - 0.5, halton(i + 1, 7) - 0.5, W, H);
    camera.updateMatrixWorld();
    renderer.setRenderTarget(sampleRT);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, camera);
    camera.clearViewOffset();
    accumScene.children[0].material.uniforms.w.value = 1 / N;
    renderer.setRenderTarget(accumRT);
    renderer.autoClear = false;
    renderer.render(accumScene, quadCam);
    renderer.autoClear = true;
  }
  renderer.setRenderTarget(null);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  renderer.render(finalScene, quadCam);
  return renderer.domElement.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.95);
}

window.ENGINE = { setup, renderFrame };
window.ENGINE_READY = true;
