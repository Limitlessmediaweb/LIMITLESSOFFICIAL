import { cn } from "@/lib/cn";

/** Angoli di inquadratura (crop marks) attorno a un elemento, come nel mirino di una camera. */
export function CropMarks({ className, size = 16, inset = -10 }: { className?: string; size?: number; inset?: number }) {
  const s = `${size}px`;
  const corner = "absolute border-line-strong";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)} style={{ inset }}>
      <span className={cn(corner, "left-0 top-0 border-l border-t")} style={{ width: s, height: s }} />
      <span className={cn(corner, "right-0 top-0 border-r border-t")} style={{ width: s, height: s }} />
      <span className={cn(corner, "bottom-0 left-0 border-b border-l")} style={{ width: s, height: s }} />
      <span className={cn(corner, "bottom-0 right-0 border-b border-r")} style={{ width: s, height: s }} />
    </div>
  );
}

/** Puntino REC che lampeggia lentamente (1 Hz). */
export function Rec({ label = "REC", className }: { label?: string; className?: string }) {
  return (
    <span className={cn("mono inline-flex items-center gap-2", className)}>
      <span className="rec-dot" aria-hidden />
      {label}
    </span>
  );
}

/** Formatta secondi in timecode 00:00:12:04 (25 fps). */
export function timecode(seconds: number, fps = 25) {
  const f = Math.floor((seconds % 1) * fps);
  const s = Math.floor(seconds);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}:${pad(f)}`;
}

/** Numerazione dei capitoli "01 / 05". */
export function chapter(i: number, total: number) {
  return `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}
