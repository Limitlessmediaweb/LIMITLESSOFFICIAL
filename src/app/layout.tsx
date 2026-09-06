import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { StickyNav } from "@/components/layout/StickyNav";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { BUSINESS } from "@/lib/content";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://limitlessmedia.it";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LIMITLESS — siti web, video walk tour e video ads per attività locali",
    template: "%s — LIMITLESS",
  },
  description:
    "LIMITLESS crea presenza online premium per attività locali e agenzie immobiliari: siti web, video walk tour e video ads. Consulenza e preventivo gratuiti.",
  authors: [{ name: "LIMITLESS" }],
  openGraph: {
    type: "website",
    siteName: "LIMITLESS",
    locale: "it_IT",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BUSINESS.legalName,
  alternateName: BUSINESS.brand,
  email: BUSINESS.email,
  telephone: BUSINESS.phoneHref,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Miradolo Terme",
    addressRegion: "PV",
    addressCountry: "IT",
  },
  areaServed: "IT",
  url: SITE_URL,
  vatID: BUSINESS.piva,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${spaceGrotesk.variable} ${manrope.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-black"
        >
          Salta al contenuto
        </a>
        <SmoothScroll>
          <StickyNav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
        <CookieConsent />
      </body>
    </html>
  );
}
