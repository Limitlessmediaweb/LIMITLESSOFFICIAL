import type { SpotCard } from "@/components/sections/SpotCarousel";
import type { Tour } from "@/components/sections/WalkTour";
import { clean } from "@/lib/placeholder";
import { mediaProgetto, posterProgetto, progettiConMedia } from "@/lib/media";
import { progetti } from "@/data/progetti";

/** Card per il carosello degli spot (solo i progetti di tipo "spot" con video). */
export function spotCards(): SpotCard[] {
  return progettiConMedia("spot").flatMap((p) => {
    const m = mediaProgetto(p).spot;
    if (!m) return [];
    return [
      {
        slug: p.slug,
        nome: p.nome,
        settore: p.settore,
        frase: p.frase,
        concept: p.concept,
        item: { id: p.slug, title: p.nome, subtitle: clean(p.settore), media: m, vertical: true },
      },
    ];
  });
}

export function tours(): Tour[] {
  return progettiConMedia("walktour").flatMap((p) => {
    const m = mediaProgetto(p).spot;
    if (!m) return [];
    return [{ slug: p.slug, nome: p.nome, settore: p.settore, frase: p.frase, media: m, vertical: m.vertical }];
  });
}

/** Fotogrammi per l'intro: un mix di spot, siti e walk tour. */
export function introFrames(): string[] {
  const order = ["nottea", "ordito", "attico", "saetta", "volta", "villa-lume"];
  return order.flatMap((slug) => {
    const p = progetti.find((x) => x.slug === slug);
    if (!p) return [];
    const m = mediaProgetto(p);
    const src = m.spot?.posterAvif ?? m.sitoMobile?.posterAvif ?? m.spot?.poster ?? m.sitoMobile?.poster ?? posterProgetto(p);
    return src ? [src] : [];
  });
}

