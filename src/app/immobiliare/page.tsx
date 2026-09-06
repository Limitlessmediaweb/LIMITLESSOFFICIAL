import type { Metadata } from "next";
import { VerticalTemplate } from "@/components/VerticalTemplate";
import { VERTICALS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Siti web e walk tour per agenzie immobiliari",
  description:
    "Walk tour di più immobili, cataloghi digitali e pacchetti multi-immobile per agenzie: fai visitare online l'immobile prima della visita fisica. Consulenza gratuita.",
  alternates: { canonical: "/immobiliare" },
};

const vertical = VERTICALS.find((v) => v.slug === "immobiliare")!;

export default function ImmobiliarePage() {
  return <VerticalTemplate vertical={vertical} />;
}
