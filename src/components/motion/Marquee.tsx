import { cn } from "@/lib/cn";

/**
 * Nastro di testo infinito in puro CSS (transform), si ferma al passaggio del mouse
 * e con reduced motion. Il contenuto è duplicato e nascosto agli screen reader.
 */
export function Marquee({
  items,
  reverse = false,
  speed = 40,
  className,
  itemClassName,
  separator = "✦",
}: {
  items: string[];
  reverse?: boolean;
  /** secondi per un giro completo */
  speed?: number;
  className?: string;
  itemClassName?: string;
  separator?: string;
}) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={`${it}-${i}`} className={cn("flex items-center whitespace-nowrap", itemClassName)}>
          <span>{it}</span>
          <span aria-hidden className="px-[0.5em] text-accent-text opacity-80">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("group flex overflow-hidden", className)}>
      <div
        className="flex w-max group-hover:[animation-play-state:paused] motion-reduce:!animate-none"
        style={{
          animation: `marquee-x ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
