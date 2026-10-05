import manifest from "@/data/media-manifest.json";
import { progetti, type Progetto } from "@/data/progetti";

export type MediaSource = {
  mp4: string;
  mp4Mobile: string | null;
  poster: string | null;
  posterAvif: string | null;
  bytes: number;
  width: number;
  height: number;
  vertical: boolean;
};

type Kind = "spot" | "walktour" | "siti" | "showreel";
const m = manifest as Record<Kind, Record<string, MediaSource>>;

export function media(kind: Kind, slug: string): MediaSource | null {
  return m[kind]?.[slug] ?? null;
}

/** Media di un progetto: lo spot (o walk tour) e le registrazioni del sito, se esistono. */
export function mediaProgetto(p: Progetto) {
  return {
    spot: p.tipo === "walktour" ? media("walktour", p.slug) : media("spot", p.slug),
    sitoMobile: media("siti", `${p.slug}-mobile`),
    sitoDesktop: media("siti", `${p.slug}-desktop`),
  };
}

/** Solo i progetti che hanno almeno un video: quelli senza file non compaiono. */
export function progettiConMedia(tipo?: Progetto["tipo"]) {
  return progetti.filter((p) => {
    if (tipo && p.tipo !== tipo) return false;
    const x = mediaProgetto(p);
    return Boolean(x.spot || x.sitoMobile || x.sitoDesktop);
  });
}

/** Poster migliore disponibile per un progetto (per intro, OG, anteprime). */
export function posterProgetto(p: Progetto) {
  const x = mediaProgetto(p);
  return x.spot?.poster ?? x.sitoDesktop?.poster ?? x.sitoMobile?.poster ?? null;
}

export const showreel = {
  desktop: media("showreel", "showreel"),
  mobile: media("showreel", "showreel-vertical"),
};
