import type { Metadata } from "next";
import { AtSign, Mail, Phone } from "lucide-react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Configuratore } from "@/components/sections/Configuratore";
import { T } from "@/components/ui/T";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { contatti } from "@/data/contatti";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contatti | LIMITLESS",
  description:
    "Scrivici su WhatsApp al +39 339 795 8873, via email o su Instagram. Ti rispondiamo in giornata con un esempio pensato per la tua attività.",
  path: "/contatti",
});

export default function ContattiPage() {
  const tel = contatti.telefono.replace(/\s/g, "");
  const altri = [
    { icon: Phone, label: "Telefono", value: contatti.telefono, href: `tel:${tel}` },
    { icon: Mail, label: "Email", value: contatti.email, href: `mailto:${contatti.email}` },
    { icon: AtSign, label: "Instagram", value: `@${contatti.instagram}`, href: contatti.instagramUrl, external: true },
  ];

  return (
    <>
      <section className="wrap pb-20 pt-32 md:pt-40">
        <SplitReveal as="h1" immediate className="max-w-[12ch] text-display-xl">
          Parliamone.
        </SplitReveal>
        <p className="mt-6 max-w-[48ch] text-lead text-fg-muted">
          Il modo più veloce è WhatsApp. Raccontaci la tua attività in due righe: ti rispondiamo con un esempio pensato per te.
        </p>
        <div className="mt-10">
          <WhatsAppButton posizione="contatti_hero" className="w-full sm:w-auto" />
        </div>

        <div className="mt-20 grid gap-px border border-line bg-line md:grid-cols-3">
          {altri.map(({ icon: Icon, label, value, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener" } : {})}
              className="group flex flex-col gap-6 bg-bg p-6 transition-colors hover:bg-bg-raised md:p-8"
            >
              <Icon size={22} aria-hidden className="text-accent-text" />
              <span>
                <span className="mono block text-fg-muted">{label}</span>
                <span className="mt-2 block break-all text-xl font-semibold group-hover:underline">{value}</span>
              </span>
            </a>
          ))}
        </div>

        <dl className="mt-12 grid gap-8 md:grid-cols-3">
          <div>
            <dt className="mono text-fg-muted">Zona servita</dt>
            <dd className="mt-2 text-lg">
              <T>{contatti.zona}</T>
            </dd>
          </div>
          <div>
            <dt className="mono text-fg-muted">Orari di risposta</dt>
            <dd className="mt-2 text-lg">
              <T fallback="Ti rispondiamo in giornata">{contatti.orari}</T>
            </dd>
          </div>
          <div>
            <dt className="mono text-fg-muted">PEC</dt>
            <dd className="mt-2 break-all text-lg">{contatti.pec}</dd>
          </div>
        </dl>
      </section>
      <Configuratore />
    </>
  );
}
