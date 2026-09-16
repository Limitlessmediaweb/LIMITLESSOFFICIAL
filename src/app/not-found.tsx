import Link from "next/link";
import { PRIMARY_CTA } from "@/lib/content";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 pt-32 pb-24 text-center md:px-8">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-3xl leading-[1.08] tracking-[-0.03em] sm:text-5xl">
        Questa pagina non esiste
      </h1>
      <p className="mt-5 max-w-md text-muted-foreground">
        Il link potrebbe essere sbagliato o la pagina è stata spostata.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-lime">
          Torna alla home
        </Link>
        <Link href="/contatti" className="btn-ghost">
          {PRIMARY_CTA}
        </Link>
      </div>
    </section>
  );
}
