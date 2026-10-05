import Link from "next/link";
import { contatti } from "@/data/contatti";
import { Logo } from "./Logo";
import { NAV } from "@/data/nav";
import { T } from "./T";
import { WhatsAppButton } from "./WhatsAppButton";

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
          <WhatsAppButton posizione="footer" variant="ghost" className="self-start" />
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
            <li>
              <Link href="/privacy" className="link-line">Privacy</Link>
            </li>
            <li>
              <Link href="/termini" className="link-line">Termini d&apos;uso</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mono mb-4 font-sans text-fg-faint">Contatti</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <a className="link-line" href={`tel:${contatti.telefono.replace(/\s/g, "")}`}>{contatti.telefono}</a>
            </li>
            <li>
              <a className="link-line break-all" href={`mailto:${contatti.email}`}>{contatti.email}</a>
            </li>
            <li>
              <a className="link-line" href={contatti.instagramUrl} target="_blank" rel="noopener">
                Instagram @{contatti.instagram}
              </a>
            </li>
            <li className="text-fg-muted">PEC {contatti.pec}</li>
          </ul>
        </div>
      </div>

      <div className="wrap mt-16 flex flex-col gap-2 border-t border-line pt-6 text-sm text-fg-faint md:flex-row md:justify-between">
        <p>
          © {year} LIMITLESS. P.IVA <T fallback="in arrivo">{contatti.piva}</T>
        </p>
        <p>I lavori &ldquo;Concept&rdquo; sono progetti creati da LIMITLESS a scopo dimostrativo.</p>
      </div>
    </footer>
  );
}
