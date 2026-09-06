import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Positioning } from "@/components/home/Positioning";
import { CaseStudiesPreview } from "@/components/home/CaseStudiesPreview";
import { ServicesSection } from "@/components/home/ServicesSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { VerticalsSection } from "@/components/home/VerticalsSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CtaSection } from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "Siti web, video walk tour e video ads per attività locali",
  description:
    "LIMITLESS crea presenza online premium per attività locali e agenzie immobiliari: siti web, video walk tour e video ads. Consulenza e preventivo gratuiti.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Positioning />
      <CaseStudiesPreview />
      <ServicesSection />
      <SocialProofSection />
      <VerticalsSection />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
