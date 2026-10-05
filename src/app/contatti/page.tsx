import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Configuratore } from "@/components/sections/Configuratore";
import { T } from "@/components/ui/T";
import { BadgeConsulenza, ConsulenzaButton } from "@/components/ui/ConsulenzaButton";
import { SocialIcon, SocialLink } from "@/components/ui/Social";
import { azienda, telHref } from "@/data/azienda";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contatti | LIMITLESS",
  description:
    "Prenota la consulenza gratuita su WhatsApp al +39 339 795 8873, oppure scrivici via email, Instagram o TikTok. Disponibili online in tutta Italia.",
  path: "/contatti",
});

const card = "group flex flex-col gap-6 bg-bg p-6 transition-colors hover:bg-bg-raised md:p-8";
const valore = "mt-2 block break-all text-xl font-semibold group-hover:underline";

export default function ContattiPage() {
  return (
    <>
      <section className="wrap pb-20 pt-32 md:pt-40">
        <SplitReveal as="h1" immediate className="max-w-[12ch] text-display-xl">
          Parliamone.
        </SplitReveal>
        <p className="mt-6 max-w-[48ch] text-lead text-fg-muted">
          Il modo più veloce è WhatsApp. Raccontaci la tua attività in due righe: in 15 minuti capiamo cosa ti serve e ti diamo un prezzo chiaro.
        </p>
        <BadgeConsulenza className="mt-8" />
        <div className="mt-6">
          <ConsulenzaButton posizione="contatti_hero" className="w-full sm:w-auto" />
        </div>

        <div className="mt-20 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <a href={telHref} className={card}>
            <Phone size={22} aria-hidden className="text-accent-text" />
            <span>
              <span className="mono block text-fg-muted">Telefono e WhatsApp</span>
              <span className={valore}>{azienda.telefono}</span>
            </span>
          </a>
          <a href={`mailto:${azienda.email}`} className={card}>
            <Mail size={22} aria-hidden className="text-accent-text" />
            <span>
              <span className="mono block text-fg-muted">Email</span>
              <span className={valore}>{azienda.email}</span>
            </span>
          </a>
          {(["instagram", "tiktok"] as const).map((r) => (
            <SocialLink key={r} rete={r} posizione="contatti" className={card}>
              <span className="text-accent-text">
                <SocialIcon rete={r} size={22} />
              </span>
              <span>
                <span className="mono block text-fg-muted">{r === "instagram" ? "Instagram" : "TikTok"}</span>
                <span className={valore}>@{azienda[r].handle}</span>
              </span>
            </SocialLink>
          ))}
        </div>

        <dl className="mt-12 grid gap-8 md:grid-cols-3">
          <div>
            <dt className="mono text-fg-muted">Dove lavoriamo</dt>
            <dd className="mt-2 text-lg">{azienda.disponibilita}</dd>
          </div>
          <div>
            <dt className="mono text-fg-muted">Orari di risposta</dt>
            <dd className="mt-2 text-lg">
              <T fallback="Ti rispondiamo in giornata">{azienda.orari}</T>
            </dd>
          </div>
          <div>
            <dt className="mono text-fg-muted">PEC</dt>
            <dd className="mt-2 text-lg">
              <a href={`mailto:${azienda.pec}`} className="link-line break-all">
                {azienda.pec}
              </a>
            </dd>
          </div>
        </dl>
      </section>
      <Configuratore />
    </>
  );
}
