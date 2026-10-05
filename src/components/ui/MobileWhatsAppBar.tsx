"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * Barra fissa in basso su mobile con il pulsante WhatsApp.
 * Si nasconde mentre scorri verso il basso e ricompare quando risali (ScrollTrigger, niente listener di scroll).
 */
export function MobileWhatsAppBar() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = ref.current!;
    let hidden = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const shouldHide = self.direction === 1 && self.scroll() > 240;
        if (shouldHide !== hidden) {
          hidden = shouldHide;
          gsap.to(el, { yPercent: hidden ? 110 : 0, duration: 0.35, ease: "power3.out" });
        }
      },
    });
    return () => st.kill();
  });

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-[75] border-t border-line bg-bg/85 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden"
    >
      <WhatsAppButton posizione="barra_mobile" className="w-full" />
    </div>
  );
}
