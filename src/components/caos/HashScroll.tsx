"use client";

import { useEffect } from "react";

/**
 * Arrivando sulla home da un'altra pagina con un'ancora (es. /#prodotti dal menu di /hub),
 * porta alla sezione giusta dopo che la pagina ha preso le sue altezze (l'hero è alto più di uno schermo).
 */
export function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const go = () => document.getElementById(id)?.scrollIntoView({ block: "start" });
    const raf = requestAnimationFrame(go);
    // seconda passata: font e immagini possono spostare la sezione di qualche pixel
    const t = window.setTimeout(go, 400);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, []);
  return null;
}
