import type { Cosa } from "@/data/home";
import { cn } from "@/lib/cn";

/** La cosa com'è oggi: un foglio, un post-it, un messaggio, una chiamata persa, un Excel. Decorativa. */
export function Messy({ c, className }: { c: Cosa; className?: string }) {
  if (c.k === "xls") {
    return (
      <div className={cn("messy xls", className)}>
        <small>{c.s}</small>
        {c.rows?.map((r) => (
          <span key={r[0]}>
            <b>{r[0]}</b>
            <i>{r[1]}</i>
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className={cn("messy", c.k, className)}>
      {c.s && <small>{c.s}</small>}
      {c.m}
    </div>
  );
}

/** La stessa cosa in ordine: numero, nome, persona, stato. */
export function Tidy({ c, n, className }: { c: Cosa; n: number; className?: string }) {
  return (
    <div className={cn("tidy", className)}>
      <span className="n">{String(n).padStart(2, "0")}</span>
      <span className="t">{c.t}</span>
      {c.who && <span className="who">{c.who}</span>}
      <span className={cn("pill", c.c)}>{c.st}</span>
    </div>
  );
}
