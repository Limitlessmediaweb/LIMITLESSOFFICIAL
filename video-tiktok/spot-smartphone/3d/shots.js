// Inquadrature: ogni shot è una funzione (t, ctx) -> stato della scena.
// t = secondi dentro lo shot, ctx.dur = durata dello shot, ctx.opts = parametri dal montaggio.
// Movimento lento dentro l'inquadratura (gimbal), il ritmo lo danno i tagli.
const { sin, cos, PI, min, max } = Math;
const clamp01 = (x) => min(1, max(0, x));
const lerp = (a, b, k) => a + (b - a) * k;
const lerp3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOut = (x) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const orbit = (r, yaw, y = 0, c = [0, 0, 0]) => [c[0] + sin(yaw) * r, c[1] + y, c[2] + cos(yaw) * r];
const k = (t, ctx) => clamp01(t / (ctx.dur || 1));

const RIM = { copper: "#ff8a4c", blue: "#4f7dff" };
const CAM_Y = 15.4 / 2 - 2.55; // centro del modulo fotocamera

const darkStudio = (o = {}) => ({
  bg: "#000000", env: { intensity: 0.05, rotY: 0 }, dust: 0.0, exposure: 1, ...o,
});

export const SHOTS = {
  // ---------- verifiche (4 fotogrammi di controllo) ----------
  check_front: () => ({
    ...darkStudio({ env: { intensity: 0.22, rotY: 2.6 }, dust: 0.25 }),
    cam: { pos: [0, 0, 46], target: [0, 0, 0], fov: 30, aperture: 0.15 },
    phone: { pos: [0, 0, 0], rot: [0, -0.18, 0] },
    key: { pos: [-40, 16, 8], target: [0, 0, 0], intensity: 6, angle: 0.3, color: "#fff4e8" },
    rim: { pos: [22, 6, -16], target: [0, 0, 0], intensity: 40, color: RIM.copper, w: 3, h: 40 },
    screen: { mode: "ui" },
  }),
  check_back: () => ({
    ...darkStudio({ env: { intensity: 0.22, rotY: 2.6 }, dust: 0.25 }),
    cam: { pos: [0, 0, 46], target: [0, 0, 0], fov: 30, aperture: 0.15 },
    phone: { pos: [0, 0, 0], rot: [0, PI + 0.22, 0] },
    key: { pos: [-40, 22, 4], target: [0, 0, 0], intensity: 6, angle: 0.3, penumbra: 0.5, color: "#fff4e8" },
    rim: { pos: [22, 6, -16], target: [0, 0, 0], intensity: 40, color: RIM.blue, w: 3, h: 40 },
    screen: { mode: "off" },
  }),
  check_macro: () => ({
    ...darkStudio({ env: { intensity: 0.3, rotY: 1.2 }, dust: 0.3 }),
    cam: { pos: [-3.2, CAM_Y + 2.4, -8.2], target: [0, CAM_Y, -0.6], fov: 26, aperture: 0.1, focus: [0, CAM_Y, -0.6] },
    phone: { pos: [0, 0, 0], rot: [0, 0, 0] },
    key: { pos: [-26, 16, -6], target: [0, CAM_Y, 0], intensity: 5, angle: 0.22, penumbra: 0.5, color: "#fff1e0" },
    rim: { pos: [14, CAM_Y + 5, -8], target: [0, CAM_Y, 0], intensity: 30, color: RIM.copper, w: 2, h: 14 },
    strip: { pos: [2, CAM_Y + 10, -14], target: [0, CAM_Y, 0], intensity: 10, color: "#d9e2ff", w: 14, h: 1.2 },
    screen: { mode: "off" },
  }),
  check_34: () => ({
    ...darkStudio({ env: { intensity: 0.22, rotY: 2.6 }, dust: 0.3 }),
    cam: { pos: [26, 6, 34], target: [0, 0.5, 0], fov: 30, aperture: 0.2 },
    phone: { pos: [0, 0, 0], rot: [0.08, 0.55, -0.06] },
    key: { pos: [-40, 18, 10], target: [0, 0, 0], intensity: 6, angle: 0.3, color: "#fff4e8" },
    rim: { pos: [14, 4, -26], target: [0, 0, 0], intensity: 40, color: RIM.copper, w: 3, h: 40 },
    screen: { mode: "ui" },
  }),

  // ---------- 0-2 s: buio, una lama di luce scorre sul bordo ----------
  blade: (t, ctx) => {
    const p = k(t, ctx);
    return {
      ...darkStudio({ env: { intensity: 0.0 }, dust: 0.12 }),
      cam: { pos: orbit(44, 0.25 + p * 0.06, 1), target: [0, 0, 0], fov: 30, aperture: 0.1 },
      phone: { pos: [0, 0, 0], rot: [0, -1.12, 0] },
      strip: { pos: [lerp(-14, 22, easeInOut(p)), lerp(26, -10, easeInOut(p)), 10], target: [0, 0, 0], intensity: 60, color: "#ffffff", w: 50, h: 0.7 },
      rim: { pos: [-20, 0, -20], target: [0, 0, 0], intensity: 4 * p, color: RIM.copper, w: 2, h: 30 },
      screen: { mode: "off" },
    };
  },

  // ---------- 2-5 s: macro, la luce rivela il titanio e l'anello in rame ----------
  macro_reveal: (t, ctx) => {
    const p = k(t, ctx);
    return {
      ...darkStudio({ env: { intensity: lerp(0.01, 0.1, ease(p)), rotY: 1.2 + p * 0.4 }, dust: 0.35 }),
      cam: { pos: [lerp(-5.5, -3.8, p), CAM_Y + lerp(3.6, 2.6, p), lerp(-10.5, -8.6, p)], target: [0, CAM_Y, -0.6], fov: 26, aperture: 0.14, focus: [0.2, CAM_Y + 0.2, -0.7] },
      phone: { pos: [0, 0, 0], rot: [0, lerp(-0.05, 0.08, p), 0] },
      key: { pos: [lerp(-34, -18, ease(p)), 18, -10], target: [0, CAM_Y, 0], intensity: lerp(0, 4.5, ease(p * 1.4)), angle: 0.16, penumbra: 0.6, color: "#fff1e0" },
      rim: { pos: [9, CAM_Y + 1, -3], target: [0, CAM_Y, -0.3], intensity: lerp(1, 7, ease(p)), color: RIM.copper, w: 0.6, h: 6 },
      screen: { mode: "off" },
    };
  },

  // ---------- 5 s: drop, il telefono ruota e lo schermo si accende ----------
  drop_turn: (t, ctx) => {
    const p = k(t, ctx);
    const turn = easeOut(p * 1.6);
    return {
      ...darkStudio({ env: { intensity: 0.45, rotY: 0.6 }, dust: 0.3 }),
      cam: { pos: [0, 0.4, lerp(36, 44, easeOut(p))], target: [0, 0, 0], fov: 30, aperture: 0.12 },
      phone: { pos: [0, 0, 0], rot: [lerp(0.25, 0, turn), lerp(PI + 0.9, -0.15, turn), lerp(-0.25, 0, turn)] },
      key: { pos: [-30, 18, 26], target: [0, 0, 0], intensity: 5, angle: 0.35, color: "#fff4e8" },
      rim: { pos: [24, 6, -18], target: [0, 0, 0], intensity: 26, color: RIM.copper, w: 3, h: 40 },
      screen: { mode: "boot", p: clamp01((p - 0.28) / 0.72) },
      samples: 24, blur: 1.4,
    };
  },

  macro_lens: (t, ctx) => {
    const p = k(t, ctx);
    return {
      ...darkStudio({ env: { intensity: 0.12, rotY: 0.8 + p * 0.8 }, dust: 0.35 }),
      cam: { pos: [lerp(-2.2, -1.2, p), CAM_Y + lerp(2.4, 2.0, p), -5.4], target: [0, CAM_Y, -0.9], fov: 24, aperture: 0.09, focus: [lerp(0.6, -0.4, ease(p)), CAM_Y + lerp(-0.3, 0.6, ease(p)), -0.9] },
      phone: { pos: [0, 0, 0], rot: [0, 0, 0] },
      key: { pos: [-24, 18, -6], target: [0, CAM_Y, 0], intensity: 3.5, angle: 0.14, penumbra: 0.7, color: "#fff1e0" },
      rim: { pos: [8, CAM_Y + 1, -3], target: [0, CAM_Y, -0.3], intensity: 7, color: RIM.blue, w: 0.6, h: 6 },
      screen: { mode: "off" },
    };
  },

  macro_button: (t, ctx) => {
    const p = k(t, ctx);
    const by = 15.4 / 2 - 4.6;
    return {
      ...darkStudio({ env: { intensity: 0.15, rotY: 2.0 }, dust: 0.35 }),
      cam: { pos: [lerp(9, 8, p), by + lerp(3.5, 0.5, ease(p)), lerp(4.5, 3.2, p)], target: [3.6, by, 0], fov: 24, aperture: 0.08, focus: [3.65, by, 0] },
      phone: { pos: [0, 0, 0], rot: [0, 0, 0] },
      key: { pos: [24, by + 16, -10], target: [3.6, by, 0], intensity: 0.7, angle: 0.12, penumbra: 0.7, color: "#fff1e0" },
      rim: { pos: [8, by - 6, 10], target: [3.6, by, 0], intensity: 6, color: RIM.copper, w: 1, h: 12 },
      screen: { mode: "ui" },
    };
  },

  macro_glass: (t, ctx) => {
    const p = k(t, ctx);
    return {
      ...darkStudio({ env: { intensity: 0.06, rotY: 1.5 }, dust: 0.45 }),
      cam: { pos: [lerp(7.5, 6, p), -12.5, -6.5], target: [1.6, -6.2, -0.4], fov: 26, aperture: 0.09, focus: [0.4, -5.6, -0.45] },
      phone: { pos: [0, 0, 0], rot: [0, 0, 0] },
      key: { pos: [-30, lerp(-2, 2, p), -1.5], target: [0, -5.5, 0], intensity: 4, angle: 0.18, penumbra: 0.8, color: "#ffe9d2" },
      rim: { pos: [12, -16, -2], target: [3.6, -7, 0], intensity: 12, color: RIM.copper, w: 1, h: 10 },
      screen: { mode: "off" },
    };
  },

  macro_edge: (t, ctx) => {
    const p = k(t, ctx);
    return {
      ...darkStudio({ env: { intensity: 0.15, rotY: 0.4 + p }, dust: 0.35 }),
      cam: { pos: [lerp(10, 8.5, p), lerp(-11, -9.5, p), lerp(5, 6, p)], target: [3.2, -7.2, 0], fov: 26, aperture: 0.1, focus: [3.3, -7.3, 0.2] },
      phone: { pos: [0, 0, 0], rot: [0, 0.2, 0] },
      key: { pos: [26, -2, 14], target: [3, -7, 0], intensity: 3, angle: 0.25, color: "#fff1e0" },
      rim: { pos: [0, -18, -10], target: [3, -7, 0], intensity: 22, color: RIM.blue, w: 6, h: 2 },
      screen: { mode: "ui" },
    };
  },

  // ---------- hero shot lenta a 360° ----------
  hero360: (t, ctx) => {
    const p = k(t, ctx);
    return {
      ...darkStudio({ env: { intensity: 0.45, rotY: 0.6 }, dust: 0.3 }),
      cam: { pos: [0, 2, lerp(48, 44, p)], target: [0, 0, 0], fov: 30, aperture: 0.14 },
      phone: { pos: [0, 0, 0], rot: [0.06, -0.3 + easeInOut(p) * PI * 2, -0.04] },
      key: { pos: [-30, 18, 26], target: [0, 0, 0], intensity: 5, angle: 0.35, color: "#fff4e8" },
      rim: { pos: [24, 6, -18], target: [0, 0, 0], intensity: 30, color: RIM.copper, w: 3, h: 40 },
      strip: { pos: [-20, 4, -20], target: [0, 0, 0], intensity: 16, color: RIM.blue, w: 2, h: 40 },
      screen: { mode: "ui", time: t },
    };
  },

  // ---------- packshot: fondo nero, riflesso a terra ----------
  packshot: (t, ctx) => {
    const p = k(t, ctx);
    return {
      ...darkStudio({ env: { intensity: 0.4, rotY: 0.6 }, dust: 0.22 }),
      cam: { pos: [lerp(4, 2, p), 1, lerp(58, 52, easeOut(p))], target: [0, -2.4, 0], fov: 30, aperture: 0.1 },
      phone: { pos: [0, 0, 0], rot: [0, -0.32, 0] },
      floor: "mirror", floorY: -15.4 / 2 - 0.01, mirrorOpacity: 0.82,
      key: { pos: [-30, 18, 26], target: [0, 0, 0], intensity: 4.5, angle: 0.35, color: "#fff4e8" },
      rim: { pos: [24, 6, -18], target: [0, 0, 0], intensity: 28, color: RIM.copper, w: 3, h: 40 },
      screen: { mode: "ui", time: t },
    };
  },

  // ---------- compositing nelle clip reali (sfondo trasparente) ----------
  // ctx.opts: { rim, keyFrom: [x,y,z], screen: "camera"|"ui", yaw, side: "left"|"right", env }
  comp_float: (t, ctx) => {
    const p = k(t, ctx), o = ctx.opts || {};
    const yaw = (o.yaw ?? -0.25) + sin(p * PI) * 0.06 + p * (o.spin ?? 0.12);
    const x = o.x ?? 0;
    return {
      bg: null, env: { fromBg: true, intensity: o.env ?? 0.9, rotY: 0 }, dust: 0, exposure: o.exposure ?? 1,
      cam: { pos: [0, 0.5 - (o.y ?? 0), lerp(o.dist ?? 44, (o.dist ?? 44) - 4, p)], target: [0, -(o.y ?? 0), 0], fov: 30, aperture: 0.05 },
      phone: { pos: [x, lerp(-0.4, 0.4, p), 0], rot: [o.tilt ?? 0.06, yaw, (o.roll ?? -0.05) + sin(p * 3) * 0.01] },
      key: { pos: o.keyFrom || [-30, 18, 26], target: [0, 0, 0], intensity: o.key ?? 2.8, angle: 0.5, color: o.keyColor || "#ffffff" },
      rim: { pos: o.rimFrom || [24, 6, -18], target: [0, 0, 0], intensity: o.rimI ?? 30, color: o.rim || RIM.copper, w: 3, h: 40 },
      screen: { mode: o.screen || "camera", time: t },
    };
  },
};
