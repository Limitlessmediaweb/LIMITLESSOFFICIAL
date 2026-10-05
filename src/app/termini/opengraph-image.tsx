import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Termini d'uso del sito LIMITLESS";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: "Termini d'uso", kicker: "Termini", image: null, imageWide: false });
}
