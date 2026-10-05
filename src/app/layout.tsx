import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter_Tight } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { MobileWhatsAppBar } from "@/components/ui/MobileWhatsAppBar";
import { JsonLd } from "@/components/ui/JsonLd";
import { themeScript } from "@/components/ui/ThemeToggle";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { PageTransition } from "@/components/motion/PageTransition";
import { ALLOW_INDEXING, SITE_URL, organizationJsonLd } from "@/lib/seo";

// Display: Archivo Condensed ExtraBold, file statico ridotto al set latino (19 KB invece degli 88 del variabile)
const archivo = localFont({
  src: "../assets/fonts/ArchivoCondensed-ExtraBold-latin.woff2",
  weight: "700 800",
  style: "normal",
  variable: "--font-archivo",
  display: "swap",
  fallback: ["Arial Narrow", "sans-serif"],
});
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "LIMITLESS | Siti web e video per attività locali", template: "%s | LIMITLESS" },
  description:
    "Siti web animati, spot video e walk tour per attività locali e piccoli brand. Più clienti, pronti in pochi giorni. Scrivici su WhatsApp.",
  applicationName: "LIMITLESS",
  robots: ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark light",
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      data-theme="dark"
      suppressHydrationWarning
      className={`${archivo.variable} ${interTight.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-3 focus:font-semibold focus:text-accent-ink"
        >
          Salta al contenuto
        </a>
        <SmoothScroll />
        <ScrollProgress />
        <Header />
        <PageTransition>
          <main id="contenuto" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </PageTransition>
        <MobileWhatsAppBar />
        <CursorFollower />
        <div className="grain" aria-hidden />
        <JsonLd data={organizationJsonLd()} />
        {plausibleDomain && (
          <>
            <Script id="plausible-queue" strategy="afterInteractive">
              {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
            </Script>
            <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
          </>
        )}
      </body>
    </html>
  );
}
