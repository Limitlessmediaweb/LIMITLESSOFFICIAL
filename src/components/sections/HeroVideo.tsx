"use client";

import { useSyncExternalStore } from "react";
import { SmartVideo } from "@/components/media/SmartVideo";
import { INTRO_DONE } from "./Intro";

const subscribe = (cb: () => void) => {
  window.addEventListener(INTRO_DONE, cb);
  return () => window.removeEventListener(INTRO_DONE, cb);
};
const introFinita = () => Boolean(window.__introDone) || document.documentElement.classList.contains("intro-seen");

/**
 * Showreel dell'hero: parte solo quando l'intro è finita.
 * Così durante l'intro resta il poster (che è l'LCP) e non si scarica il video sotto l'overlay.
 */
export function HeroVideo(props: React.ComponentProps<typeof SmartVideo>) {
  const pronto = useSyncExternalStore(subscribe, introFinita, () => false);
  return <SmartVideo {...props} active={pronto} />;
}
