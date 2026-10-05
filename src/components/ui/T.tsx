import { clean, hasPlaceholder, isDev } from "@/lib/placeholder";

/**
 * Mostra un testo che può contenere segnaposto.
 * Sviluppo: testo evidenziato in giallo con il marcatore visibile.
 * Produzione: solo la bozza (o niente, se il testo è solo un segnaposto).
 */
export function T({ children, fallback }: { children: string; fallback?: string }) {
  if (!hasPlaceholder(children)) return <>{children}</>;
  if (isDev) return <mark className="todo">{children}</mark>;
  const text = clean(children);
  return <>{text || fallback || null}</>;
}
