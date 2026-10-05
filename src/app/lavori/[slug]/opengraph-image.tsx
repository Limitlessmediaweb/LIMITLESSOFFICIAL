import { ogImage, OG_SIZE } from "@/lib/og";
import { getProgetto, sitoSpot } from "@/data/progetti";
import { mediaProgetto } from "@/lib/media";
import { clean } from "@/lib/placeholder";

export const alt = "Progetto concept di LIMITLESS: sito e spot";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return sitoSpot.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProgetto(slug);
  if (!p) return ogImage({ title: "LIMITLESS", kicker: "Lavori" });
  const m = mediaProgetto(p);
  const wide = Boolean(!m.spot);
  return ogImage({
    title: clean(p.nome),
    kicker: `Sito + spot, ${clean(p.settore)}`,
    image: m.spot?.poster ?? `/media/siti/${p.slug}-hero.jpg`,
    imageWide: wide,
  });
}
