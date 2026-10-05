/**
 * Plausible (senza cookie). Lo script si carica solo se NEXT_PUBLIC_PLAUSIBLE_DOMAIN è impostata.
 * Mai dati personali nelle proprietà degli eventi.
 */
export type EventName =
  | "whatsapp_click"
  | "progetto_live_click"
  | "video_audio_on"
  | "configuratore_invio"
  | "filtro_lavori"
  | "social_click"
  | "consulenza_click";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Props }) => void) & { q?: unknown[] };
  }
}

export function track(event: EventName, props?: Props) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* l'analytics non deve mai rompere la pagina */
  }
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, props ?? "");
}
