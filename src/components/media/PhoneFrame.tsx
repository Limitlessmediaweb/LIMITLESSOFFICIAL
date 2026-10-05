import { cn } from "@/lib/cn";

/**
 * Cornice da smartphone 9:16 (unico elemento con angoli arrotondati: imita un dispositivo reale).
 * Il contenuto (di solito uno SmartVideo) riempie lo schermo.
 */
export function PhoneFrame({
  children,
  className,
  screenAspect = "9 / 19.5",
}: {
  children: React.ReactNode;
  className?: string;
  screenAspect?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-[2.4rem] bg-frame p-[0.55rem] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7),inset_0_0_0_1px_rgb(255_255_255/0.08)]",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.9rem]" style={{ aspectRatio: screenAspect }}>
        {children}
        {/* isola dinamica */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-2.5 z-[3] h-[1.4rem] w-[30%] -translate-x-1/2 rounded-full bg-black"
        />
      </div>
    </div>
  );
}
