"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const subscribe = (cb: () => void) => {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
};
const getTheme = () => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

/** Toggle chiaro/scuro. La scelta si salva in localStorage; senza scelta segue il sistema (default scuro). */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className={className ?? "grid size-11 place-items-center border border-line hover:border-line-strong"}
      aria-label={next === "light" ? "Passa al tema chiaro" : "Passa al tema scuro"}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#f2f0ea" : "#0a0a0a");
        try {
          localStorage.setItem("theme", next);
        } catch {}
      }}
    >
      {theme === "dark" ? <Sun size={17} aria-hidden /> : <Moon size={17} aria-hidden />}
    </button>
  );
}

/** Script inline nel <head>: imposta il tema prima del primo paint (niente lampo). */
export const themeScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.dataset.theme=t;if(sessionStorage.getItem('ls-intro'))d.classList.add('intro-seen');}catch(e){document.documentElement.dataset.theme='dark'}})();`;
