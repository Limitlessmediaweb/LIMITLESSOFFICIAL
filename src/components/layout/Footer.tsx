import Link from "next/link";
import { BUSINESS, FOOTER_LEGAL_LINKS, NAV_LINKS } from "@/lib/content";
import { CookiePreferencesButton } from "@/components/layout/CookieConsent";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary px-5 py-14 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <span className="font-display text-sm font-bold tracking-[0.28em]">LIMITLESS</span>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Siti web, video walk tour e video ads premium per attività locali e agenzie
              immobiliari.
            </p>
          </div>
          <nav aria-label="Pagine" className="flex flex-col gap-2 text-sm">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-muted-foreground underline-offset-4 hover:text-lime hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 text-sm">
            <a
              href={`mailto:${BUSINESS.email}`}
              className="text-foreground underline-offset-4 hover:text-lime hover:underline"
            >
              {BUSINESS.email}
            </a>
            <a
              href={`tel:${BUSINESS.phoneHref}`}
              className="text-foreground underline-offset-4 hover:text-lime hover:underline"
            >
              {BUSINESS.phone}
            </a>
            <span className="text-muted-foreground">
              {BUSINESS.city} — {BUSINESS.areaServed}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <span>
            {BUSINESS.legalName} · P.IVA {BUSINESS.piva}
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="underline-offset-4 hover:text-lime hover:underline">
                {l.label}
              </Link>
            ))}
            <CookiePreferencesButton />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} LIMITLESS. Tutti i diritti riservati.
        </span>
      </div>
    </footer>
  );
}
