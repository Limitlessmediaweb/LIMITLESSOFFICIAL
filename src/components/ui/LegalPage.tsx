/** Impaginazione condivisa per privacy e termini. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="wrap pb-24 pt-32 md:pt-40">
      <h1 className="text-display">{title}</h1>
      <p className="mono mt-4 text-fg-muted">Ultimo aggiornamento: {updated}</p>
      <p role="note" className="mt-8 max-w-[70ch] border border-accent px-4 py-3 text-fg">
        <strong>Bozza da far revisionare prima del lancio.</strong> Questo testo è una bozza di lavoro e va verificato da un professionista.
      </p>
      <div className="legal mt-12 max-w-[70ch] text-fg-muted">{children}</div>
    </article>
  );
}
