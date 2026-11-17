/**
 * La teca disegnata in SVG (assonometria), senza JavaScript.
 * È quello che si vede subito, prima che parta il 3D, e resta come versione statica
 * con «riduci movimento» o quando il 3D non è disponibile.
 * `ordine`: false = il caos dei fogli, true = le schede sopra le macchine.
 */
const S = 64;
const iso = (x: number, y: number, z: number): [number, number] => [(x + z) * 0.866 * S, (z - x) * 0.5 * S - y * S];
const pts = (p: [number, number][]) => p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

type Ruolo = "corpo" | "corpo2" | "acciaio" | "base" | "lime";
const TINTE: Record<Ruolo, [string, string, string]> = {
  corpo: ["#3a3e43", "#25282c", "#1a1c1f"],
  corpo2: ["#555a61", "#383c41", "#2a2d31"],
  acciaio: ["#c5cad0", "#8e949b", "#6c7279"],
  base: ["#1b1c1e", "#101112", "#0a0b0c"],
  lime: ["#e8ff3a", "#c9de2c", "#a9bb22"],
};
type B = { x: number; z: number; y: number; w: number; d: number; h: number; r: Ruolo };
const b = (x: number, z: number, w: number, d: number, h: number, r: Ruolo = "corpo", y = 0): B => ({ x, z, y, w, d, h, r });

const SCATOLE: B[] = [
  // taglio laser
  b(-2.05, -1.2, 1.5, 0.9, 0.4),
  b(-2.13, -1.2, 1.0, 0.58, 0.02, "acciaio", 0.4),
  b(-2.4, -1.2, 0.1, 0.96, 0.09, "corpo2", 0.7),
  b(-2.4, -0.77, 0.07, 0.07, 0.3, "corpo2", 0.4),
  b(-1.1, -1.4, 0.28, 0.42, 0.78),
  // piegatrice
  b(-0.62, -1.25, 0.1, 0.56, 1.06),
  b(0.62, -1.25, 0.1, 0.56, 1.06),
  b(0, -1.17, 1.14, 0.22, 0.42, "corpo2"),
  b(0, -1.15, 1.14, 0.16, 0.36, "corpo2", 0.64),
  b(0, -1.25, 1.34, 0.5, 0.1, "corpo", 1.06),
  b(0, -0.98, 0.72, 0.34, 0.012, "acciaio", 0.46),
  // saldatura
  b(1.95, -1.71, 1.6, 0.03, 0.92),
  b(2.12, -1.2, 0.9, 0.6, 0.45, "corpo2"),
  b(2.12, -1.2, 0.5, 0.3, 0.04, "acciaio", 0.45),
  b(1.38, -1.2, 0.26, 0.26, 0.3, "corpo2"),
  b(1.38, -1.2, 0.08, 0.08, 0.5, "acciaio", 0.3),
  // collaudo
  b(1.9, 1.25, 0.95, 0.7, 0.45),
  b(1.8, 1.3, 0.22, 0.16, 0.1, "acciaio", 0.45),
  b(1.49, 1.25, 0.06, 0.06, 0.52, "corpo2", 0.45),
  b(2.31, 1.25, 0.06, 0.06, 0.52, "corpo2", 0.45),
  b(1.9, 1.25, 0.88, 0.09, 0.07, "corpo", 0.95),
  // pronto
  b(-1.9, 1.25, 1.17, 0.55, 0.04, "corpo2", 0.36),
  b(-1.9, 1.25, 1.17, 0.55, 0.04, "corpo2", 0.78),
  b(-1.9, 1.25, 1.17, 0.55, 0.04, "corpo2", 1.12),
  b(-2.46, 1.5, 0.05, 0.05, 1.12, "corpo2"),
  b(-1.34, 1.5, 0.05, 0.05, 1.12, "corpo2"),
  b(-1.7, 1.25, 0.5, 0.4, 0.2),
  b(-2.24, 1.25, 0.34, 0.36, 0.22, "corpo", 0.4),
  b(-1.82, 1.27, 0.3, 0.3, 0.16, "acciaio", 0.4),
  b(-1.54, 1.25, 0.3, 0.36, 0.24, "corpo", 0.82),
  b(-2.12, 1.25, 0.4, 0.34, 0.14, "acciaio", 0.82),
  // camioncino
  b(2.5, 0, 0.72, 0.3, 0.08, "corpo2", 0.08),
  b(2.74, 0, 0.24, 0.3, 0.25, "corpo", 0.16),
  b(2.36, 0, 0.2, 0.2, 0.2, "lime", 0.16),
];

function Scatola({ s }: { s: B }) {
  const x0 = s.x - s.w / 2;
  const x1 = s.x + s.w / 2;
  const z0 = s.z - s.d / 2;
  const z1 = s.z + s.d / 2;
  const y0 = s.y;
  const y1 = s.y + s.h;
  const [top, fz, fx] = TINTE[s.r];
  return (
    <g>
      <polygon points={pts([iso(x0, y1, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x0, y1, z1)])} fill={top} />
      <polygon points={pts([iso(x0, y1, z1), iso(x1, y1, z1), iso(x1, y0, z1), iso(x0, y0, z1)])} fill={fz} />
      <polygon points={pts([iso(x0, y1, z0), iso(x0, y1, z1), iso(x0, y0, z1), iso(x0, y0, z0)])} fill={fx} />
    </g>
  );
}

const linea = (x1: number, z1: number, x2: number, z2: number) => {
  const [a, c] = iso(x1, 0, z1);
  const [d, e] = iso(x2, 0, z2);
  return `M${a.toFixed(1)} ${c.toFixed(1)}L${d.toFixed(1)} ${e.toFixed(1)}`;
};

const NOTE: { x: number; y: number; z: number; r: number; t: string; k: "p" | "f" | "m" }[] = [
  { x: -2.1, y: 1.75, z: -0.4, r: -12, t: "C-2411 DOV'È??", k: "p" },
  { x: 0.2, y: 1.95, z: -1.0, r: 8, t: "CHIAMARE ZINCATURA", k: "p" },
  { x: 1.9, y: 1.6, z: 0.2, r: -6, t: "URGENTE AGRIMEC", k: "p" },
  { x: -0.9, y: 1.35, z: 0.9, r: 14, t: "C-2407", k: "f" },
  { x: 1.0, y: 1.25, z: 1.3, r: -18, t: "C-2409", k: "f" },
  { x: -2.3, y: 1.2, z: 1.2, r: 5, t: "A che punto siamo?", k: "m" },
  { x: 2.3, y: 1.95, z: -1.3, r: -4, t: "Mi richiami?", k: "m" },
  { x: -0.4, y: 1.6, z: -0.2, r: 20, t: "ORE BOSSI??", k: "p" },
];

const SCHEDE: { x: number; z: number; h: number; code: string; pct: string; warn?: boolean }[] = [
  { x: -2.05, z: -1.2, h: 0.82, code: "C-2408", pct: "55%" },
  { x: 0, z: -1.25, h: 1.16, code: "C-2410", pct: "20%" },
  { x: 2.0, z: -1.25, h: 1.0, code: "C-2407", pct: "+12% ore", warn: true },
  { x: 1.9, z: 1.25, h: 1.02, code: "C-2411", pct: "70%" },
  { x: -1.9, z: 1.25, h: 1.14, code: "C-2406", pct: "pronta" },
];

export function TecaPoster({ ordine = false, nome = "", className }: { ordine?: boolean; nome?: string; className?: string }) {
  const W = 6.4;
  const D = 4.4;
  const H = 2.3;
  const hx = W / 2;
  const hz = D / 2;
  const scatole = [...SCATOLE].sort((a, c) => a.z - a.x + a.y * 0.01 - (c.z - c.x + c.y * 0.01));
  const [tx, ty] = iso(0, -0.25, hz + 0.25);
  const targa = (nome || "Il tuo reparto").toUpperCase();
  return (
    <svg className={className} viewBox="-352 -338 704 596" role="img" aria-label={ordine ? "Il reparto in miniatura dentro una teca di vetro: sopra ogni macchina c'è la scheda della commessa in lavoro" : "Il reparto in miniatura dentro una teca di vetro: sopra le macchine volano fogli e bigliettini"} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="rv-om" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#000" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0.4" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rv-rif" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0.38" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.46" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.03" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.11" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rv-pl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3d41" />
          <stop offset="1" stopColor="#1d1f22" />
        </linearGradient>
      </defs>

      <ellipse cx="6" cy="78" rx="344" ry="172" fill="url(#rv-om)" />

      {/* basamento e pavimento */}
      <Scatola s={b(0, 0, W + 0.5, D + 0.5, 0.5, "base", -0.5)} />
      <polygon points={pts([iso(-hx, 0, -hz), iso(hx, 0, -hz), iso(hx, 0, hz), iso(-hx, 0, hz)])} fill="#34373b" />
      <path d={[linea(-3, -0.38, 2.6, -0.38), linea(2.6, -0.38, 2.6, 0.38), linea(2.6, 0.38, -3, 0.38), linea(2.6, 0, 3.18, 0)].join("")} stroke="#f2c230" strokeWidth="2.6" fill="none" />
      <path
        d={[
          [-2.0, -1.2, 2.15, 1.25],
          [0, -1.25, 1.7, 1.2],
          [1.9, -1.25, 1.85, 1.2],
          [1.9, 1.25, 1.5, 1.2],
          [-1.9, 1.25, 1.6, 1.2],
        ]
          .map(([x, z, w, d]) => linea(x - w / 2, z - d / 2, x + w / 2, z - d / 2) + linea(x + w / 2, z - d / 2, x + w / 2, z + d / 2) + linea(x + w / 2, z + d / 2, x - w / 2, z + d / 2) + linea(x - w / 2, z + d / 2, x - w / 2, z - d / 2))
          .join("")}
        stroke="#f2c230"
        strokeOpacity="0.75"
        strokeWidth="1.2"
        fill="none"
      />

      {/* targhetta */}
      <g transform={`matrix(0.866 -0.5 0 1 ${tx.toFixed(1)} ${ty.toFixed(1)})`}>
        <rect x="-86" y="-10" width="172" height="20" fill="url(#rv-pl)" stroke="#fff" strokeOpacity="0.16" strokeWidth="0.6" />
        <text x="0" y="4.4" textAnchor="middle" fontFamily="var(--font-archivo), 'Arial Narrow', sans-serif" fontWeight="800" fontSize="11.5" letterSpacing="0.6" fill="#0d0e0f" stroke="#fff" strokeOpacity="0.14" strokeWidth="0.3" textLength={targa.length > 22 ? 160 : undefined} lengthAdjust="spacingAndGlyphs" data-rv-targa suppressHydrationWarning>
          {targa}
        </text>
      </g>

      {/* fondo della teca */}
      <polygon points={pts([iso(-hx, H, -hz), iso(hx, H, -hz), iso(hx, 0, -hz), iso(-hx, 0, -hz)])} fill="#fff" fillOpacity="0.018" stroke="#d8f2e0" strokeOpacity="0.16" strokeWidth="0.8" />
      <polygon points={pts([iso(hx, H, -hz), iso(hx, H, hz), iso(hx, 0, hz), iso(hx, 0, -hz)])} fill="#fff" fillOpacity="0.018" stroke="#d8f2e0" strokeOpacity="0.16" strokeWidth="0.8" />

      {scatole.map((s, i) => (
        <Scatola key={i} s={s} />
      ))}

      {!ordine &&
        NOTE.map((n, i) => {
          const [x, y] = iso(n.x, n.y, n.z);
          if (n.k === "m")
            return (
              <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${n.r})`}>
                <rect x="-46" y="-11" width="92" height="22" rx="8" fill="#f2f0ea" />
                <path d="M-34 10l-4 9 14-9z" fill="#f2f0ea" />
                <text x="0" y="3.6" textAnchor="middle" fontFamily="var(--font-inter-tight), system-ui, sans-serif" fontWeight="600" fontSize="9" fill="#101010">
                  {n.t}
                </text>
              </g>
            );
          const f = n.k === "f";
          const parole = n.t.split(" ");
          return (
            <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${n.r}) skewX(${n.r * -0.6})`}>
              <rect x={f ? -15 : -19} y={f ? -21 : -19} width={f ? 30 : 38} height={f ? 42 : 38} fill={f ? "#efede6" : "#f4e36b"} />
              {f ? (
                <>
                  <text x="-11" y="-10" fontFamily="var(--font-archivo), 'Arial Narrow', sans-serif" fontWeight="800" fontSize="8" fill="#161614">
                    {n.t}
                  </text>
                  {[0, 1, 2, 3, 4].map((r) => (
                    <rect key={r} x="-11" y={-4 + r * 4.6} width={r % 3 === 2 ? 13 : 22} height="1.3" fill="#161614" fillOpacity="0.3" />
                  ))}
                </>
              ) : (
                parole.map((p, j) => (
                  <text key={j} x="0" y={(j - (parole.length - 1) / 2) * 9.5 + 4} textAnchor="middle" fontFamily="var(--font-archivo), 'Arial Narrow', sans-serif" fontWeight="800" fontSize={parole.length > 2 ? 7.5 : 8.6} fill="#1a1a17">
                    {p}
                  </text>
                ))
              )}
            </g>
          );
        })}

      {ordine &&
        SCHEDE.map((s) => {
          const [x, y] = iso(s.x, s.h + 0.5, s.z);
          const [, y0] = iso(s.x, s.h + 0.05, s.z);
          return (
            <g key={s.code}>
              <path d={`M${x.toFixed(1)} ${y.toFixed(1)}V${y0.toFixed(1)}`} stroke="#e8ff3a" strokeOpacity="0.55" strokeWidth="1" />
              <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                <rect x="-39" y="-25" width="78" height="25" fill="#0c0c0c" fillOpacity="0.92" stroke={s.warn ? "#f2b23a" : "#f2f0ea"} strokeOpacity={s.warn ? 0.9 : 0.3} strokeWidth="0.8" />
                <rect x="-39" y="-25" width="2.4" height="25" fill={s.warn ? "#f2b23a" : "#e8ff3a"} />
                <text x="-31" y="-8.5" fontFamily="ui-monospace, Consolas, monospace" fontWeight="600" fontSize="9" fill="#f2f0ea">
                  {s.code}
                </text>
                <text x="34" y="-8.5" textAnchor="end" fontFamily="ui-monospace, Consolas, monospace" fontSize="8" fill={s.warn ? "#f2b23a" : "#a39f95"}>
                  {s.pct}
                </text>
              </g>
            </g>
          );
        })}

      {/* lastre davanti, coperchio, spigoli e riflesso */}
      <polygon points={pts([iso(-hx, H, hz), iso(hx, H, hz), iso(hx, 0, hz), iso(-hx, 0, hz)])} fill="#eafff2" fillOpacity="0.035" />
      <polygon points={pts([iso(-hx, H, -hz), iso(-hx, H, hz), iso(-hx, 0, hz), iso(-hx, 0, -hz)])} fill="#eafff2" fillOpacity="0.06" />
      <polygon points={pts([iso(-hx, H, -hz), iso(hx, H, -hz), iso(hx, H, hz), iso(-hx, H, hz)])} fill="#eafff2" fillOpacity="0.05" />
      <polygon points={pts([iso(-hx, H, hz), iso(hx, H, hz), iso(hx, 0, hz), iso(-hx, 0, hz)])} fill="url(#rv-rif)" />
      <path
        d={`M${pts([iso(-hx, H, hz)])}L${pts([iso(hx, H, hz)])}L${pts([iso(hx, H, -hz)])}L${pts([iso(-hx, H, -hz)])}ZM${pts([iso(-hx, H, hz)])}L${pts([iso(-hx, 0, hz)])}M${pts([iso(hx, H, hz)])}L${pts([iso(hx, 0, hz)])}M${pts([iso(-hx, H, -hz)])}L${pts([iso(-hx, 0, -hz)])}`}
        stroke="#d8f2e0"
        strokeOpacity="0.6"
        strokeWidth="1.1"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}
