import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { VideoShowcase } from "@/components/VideoShowcase";
import { Reveal } from "@/components/gsap/Reveal";
import { CtaSection } from "@/components/CtaSection";
import { CASE_STUDIES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lavori — case study",
  description:
    "I progetti realizzati da LIMITLESS: siti web e contenuti per attività locali, dal problema di partenza al risultato.",
  alternates: { canonical: "/lavori" },
};

export default function LavoriPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Lavori realizzati"
        subtitle="Dal problema di partenza al risultato: ogni progetto raccontato con onestà, concept dimostrativi inclusi."
      />
      <section className="px-5 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-lg tracking-[0.18em] text-muted-foreground uppercase">
            Siti web
          </h2>
          <Reveal className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {CASE_STUDIES.map((cs) => (
              <CaseStudyCard key={cs.slug} caseStudy={cs} />
            ))}
          </Reveal>

          <h2 className="font-display mt-16 text-lg tracking-[0.18em] text-muted-foreground uppercase">
            Video walk tour
          </h2>
          <Reveal className="mt-6 grid gap-6 md:grid-cols-2" stagger={0.1}>
            <VideoShowcase
              src="/media/video/villa-tour.mp4"
              poster="/media/video/villa-tour-poster.jpg"
              label="Villa — esterno e ingresso"
            />
            <VideoShowcase
              src="/media/video/interno-tour.mp4"
              poster="/media/video/interno-tour-poster.jpg"
              label="Interni — sala di rappresentanza"
            />
          </Reveal>

          <h2 className="font-display mt-16 text-lg tracking-[0.18em] text-muted-foreground uppercase">
            Video ads
          </h2>
          <Reveal className="mt-6" stagger={0.1}>
            <VideoShowcase
              src="/media/video/vino-ad.mp4"
              poster="/media/video/vino-ad-poster.jpg"
              label="Video ad prodotto — vino (formato 16:9)"
              draftNote="Bozza: la versione finale viene arricchita con scritte, animazioni ed effetti curati, per trasformarla in un vero e proprio spot pubblicitario."
              className="mx-auto max-w-3xl"
            />
          </Reveal>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
