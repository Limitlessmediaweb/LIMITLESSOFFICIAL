import type { Metadata } from "next";
import { VerticalTemplate } from "@/components/VerticalTemplate";
import { VERTICALS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Siti web e video per ristoranti",
  description:
    "Menu digitale, prenotazione tavolo integrata e video walk tour della sala: siti web per ristoranti che fanno scegliere il locale prima della visita. Consulenza gratuita.",
  alternates: { canonical: "/ristoranti" },
};

const vertical = VERTICALS.find((v) => v.slug === "ristoranti")!;

export default function RistorantiPage() {
  return <VerticalTemplate vertical={vertical} />;
}
