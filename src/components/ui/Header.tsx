"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { WhatsAppButton } from "./WhatsAppButton";
import { cn } from "@/lib/cn";
import { NAV } from "@/data/nav";


export function Header() {
  const path = usePathname();
  // il menu resta aperto solo sulla pagina in cui è stato aperto: cambiando rotta si chiude
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === path;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenAt((typeof v === "function" ? v(open) : v) ? path : null);
  const ref = useRef<HTMLElement>(null);

  // sfondo pieno appena si inizia a scorrere
  useGSAP(() => {
    const st = ScrollTrigger.create({ start: 48, end: "max", toggleClass: { targets: ref.current!, className: "is-scrolled" } });
    return () => st.kill();
  });

  // con il menu aperto il resto della pagina è inerte: il focus resta nel menu
  useEffect(() => {
    const others = [document.getElementById("contenuto"), document.querySelector("footer"), document.querySelector('aside[aria-label="Contatto rapido"]')];
    others.forEach((el) => el && ((el as HTMLElement).inert = open));
    return () => others.forEach((el) => el && ((el as HTMLElement).inert = false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header ref={ref} className="site-header fixed inset-x-0 top-0 z-[70]">
      <div className="wrap relative z-[2] flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href="/" className="-m-2 p-2 text-fg" aria-label="LIMITLESS, vai alla home">
          <Logo />
        </Link>

        <nav aria-label="Principale" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={path.startsWith(n.href) ? "page" : undefined}
              className={cn(
                "px-3 py-2 text-[0.95rem] font-medium text-fg-muted transition-colors hover:text-fg aria-[current=page]:text-fg",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="grid size-11 place-items-center border border-line bg-bg/60 backdrop-blur hover:border-line-strong" />
          <WhatsAppButton posizione="header" className="hidden min-h-11 px-4 text-[0.95rem] lg:inline-flex" />
          <button
            type="button"
            className="grid size-11 place-items-center border border-line bg-bg/60 backdrop-blur lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="fixed inset-0 top-0 z-[1] bg-bg px-4 pt-24 lg:hidden"
      >
        <nav aria-label="Menu mobile" className="flex flex-col">
          <Link href="/" className="border-b border-line py-4 font-display text-5xl font-extrabold">
            Home
          </Link>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={path.startsWith(n.href) ? "page" : undefined}
              className="border-b border-line py-4 font-display text-5xl font-extrabold aria-[current=page]:text-accent-text"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <WhatsAppButton posizione="menu_mobile" className="mt-8 w-full" />
      </div>
    </header>
  );
}
