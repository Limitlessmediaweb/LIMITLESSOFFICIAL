import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy senza nonce (le pagine restano statiche), come da guida di Next.
 * Oltre al sito stesso sono ammessi solo Plausible (statistiche, se attivo) e vercel.live (barra delle anteprime Vercel).
 * 'unsafe-inline' serve agli script in linea di Next e del tema; il resto è chiuso.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://plausible.io https://vercel.live`,
  "style-src 'self' 'unsafe-inline' https://vercel.live",
  "img-src 'self' blob: data: https://vercel.live https://vercel.com",
  "media-src 'self' blob:",
  "font-src 'self' data: https://vercel.live https://assets.vercel.com",
  `connect-src 'self' https://plausible.io https://vercel.live wss://ws-us3.pusher.com${isDev ? " ws: http:" : ""}`,
  "frame-src https://vercel.live",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // il sito non si può incorniciare in pagine di altri (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // niente camera, microfono, posizione o pagamenti; il sensore di movimento resta per i bigliettini dell'hero
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // non dichiarare la tecnologia usata
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
