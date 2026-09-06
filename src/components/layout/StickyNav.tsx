"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, PRIMARY_CTA } from "@/lib/content";
import { MagneticButton } from "@/components/gsap/MagneticButton";

export function StickyNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border bg-background/85 py-3 backdrop-blur-xl"
          : "border-transparent bg-transparent py-6"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 md:px-8">
        <Link
          href="/"
          className="font-display min-w-0 truncate text-lg font-bold tracking-[0.28em] text-foreground"
        >
          LIMITLESS
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors hover:text-foreground ${
                pathname === l.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <MagneticButton>
            <Link href="/contatti" className="btn-lime !px-5 !py-2.5 !text-sm">
              {PRIMARY_CTA}
            </Link>
          </MagneticButton>
        </nav>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Apri il menu"
          aria-expanded={open}
          className="shrink-0 rounded-full border border-border px-4 py-2 text-sm text-foreground lg:hidden"
        >
          {open ? "Chiudi" : "Menu"}
        </button>
      </div>
      {open && (
        <nav className="mx-5 mt-3 flex flex-col gap-1 rounded-2xl border border-border bg-card p-3 lg:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeMenu}
              className="rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contatti" onClick={closeMenu} className="btn-lime mt-2">
            {PRIMARY_CTA}
          </Link>
        </nav>
      )}
    </header>
  );
}
