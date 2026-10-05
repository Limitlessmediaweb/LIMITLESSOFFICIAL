import { cn } from "@/lib/cn";

/** Finestra del browser con barra dell'indirizzo: contiene la registrazione dello scroll del sito. */
export function BrowserFrame({
  url,
  children,
  className,
  aspect = "16 / 10",
}: {
  url: string;
  children: React.ReactNode;
  className?: string;
  aspect?: string;
}) {
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div
      className={cn(
        "overflow-hidden border border-white/10 bg-frame shadow-[0_30px_80px_-24px_rgb(0_0_0/0.7)]",
        className,
      )}
    >
      <div className="flex h-9 items-center gap-3 border-b border-white/10 px-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
        </div>
        <div className="mx-auto max-w-[70%] truncate px-3 font-mono text-[0.7rem] text-white/60">{host}</div>
        <div className="w-10" aria-hidden />
      </div>
      <div className="relative" style={{ aspectRatio: aspect }}>
        {children}
      </div>
    </div>
  );
}
