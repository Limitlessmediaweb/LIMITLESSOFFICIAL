import type { Metadata } from "next";
import { VerticalTemplate } from "@/components/VerticalTemplate";
import { VERTICALS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Siti web e video tour per hotel",
  description:
    "Video walk tour delle camere, booking diretto e gallery immersiva: siti web per hotel pensati per ridurre la dipendenza dalle OTA. Consulenza gratuita.",
  alternates: { canonical: "/hotel" },
};

const vertical = VERTICALS.find((v) => v.slug === "hotel")!;

export default function HotelPage() {
  return <VerticalTemplate vertical={vertical} />;
}
