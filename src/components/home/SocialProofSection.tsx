import { MapPin, Clock, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/gsap/Reveal";
import { SOCIAL_PROOF } from "@/lib/content";

const FACTS = [
  { icon: MapPin, text: SOCIAL_PROOF.areaServed },
  { icon: Clock, text: SOCIAL_PROOF.responseTime },
  { icon: BadgeCheck, text: SOCIAL_PROOF.freeConsult },
];

export function SocialProofSection() {
  return (
    <section className="px-5 py-20 md:px-8 md:py-24">
      <Reveal className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3" stagger={0.08}>
        {FACTS.map((f) => (
          <div
            key={f.text}
            className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-7 text-center"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-lime/15 text-lime">
              <f.icon className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-sm text-foreground/90">{f.text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
