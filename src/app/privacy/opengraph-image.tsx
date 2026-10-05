import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Informativa privacy di LIMITLESS";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: "Informativa privacy", kicker: "Privacy", image: null, imageWide: false });
}
