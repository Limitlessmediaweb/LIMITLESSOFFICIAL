import Link from "next/link";
import { azienda, rigaLegale, telHref } from "@/data/azienda";
import { NAV } from "@/data/nav";
import { Logo } from "./Logo";
import { SocialIcons } from "./Social";
import { ConsulenzaButton } from "./ConsulenzaButton";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line pb-28 pt-16 lg:pb-10">
      <div className="wrap grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="flex flex-col gap-6">
          <Logo className="text-3xl" />
          <p className="max-w-[34ch] text-fg-muted">
            Siti web animati, spot video e walk tour per attività locali e piccoli brand.
          </p>
          <ConsulenzaButton posizione="footer" variant="ghost" className="self-start" />
        </div>

        <div>
          <h2 className="mono mb-4 font-sans text-fg-faint">Pagine</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/" className="link-line">Home</Link>
            </li>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-line">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mono mb-4 font-sans text-fg-faint">Contatti</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <a className="link-line" href={`mailto:${azienda.email}`}>
                <span className="sr-only">Email: </span>
                <span className="break-all">{azienda.email}</span>
              </a>
            </li>
            <li>
              <a className="link-line" href={`mailto:${azienda.pec}`}>
                <span className="text-fg-muted">PEC </span>
                <span className="break-all">{azienda.pec}</span>
              </a>
            </li>
            <li>
              <a className="link-line" href={telHref}>
                <span className="text-fg-muted">Tel. e WhatsApp </span>
                {azienda.telefono}
              </a>
            </li>
          </ul>
          <SocialIcons posizione="footer" className="mt-5" />
        </div>
      </div>

      <div className="wrap mt-16 flex flex-col gap-4 border-t border-line pt-6 text-sm text-fg-muted lg:flex-row lg:items-start lg:justify-between">
        <p>
          © {year} {rigaLegale}
        </p>
        <nav aria-label="Note legali" className="flex shrink-0 gap-5">
          <Link href="/privacy" className="link-line">Privacy</Link>
          <Link href="/termini" className="link-line">Termini</Link>
          <Link href="/privacy#cookie" className="link-line">Cookie</Link>
        </nav>
      </div>
      <p className="wrap mt-3 text-sm text-fg-faint">I lavori &ldquo;Concept&rdquo; sono progetti creati da LIMITLESS a scopo dimostrativo.</p>
    </footer>
  );
}
