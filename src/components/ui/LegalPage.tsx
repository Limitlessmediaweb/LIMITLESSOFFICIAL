/** Impaginazione condivisa per privacy e termini. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="wrap pb-24 pt-32 md:pt-40">
      <h1 className="text-display">{title}</h1>
      <p className="mono mt-4 text-fg-muted">Ultimo aggiornamento: {updated}</p>
      <div className="legal mt-10 max-w-[70ch] text-fg-muted">{children}</div>
    </article>
  );
}
