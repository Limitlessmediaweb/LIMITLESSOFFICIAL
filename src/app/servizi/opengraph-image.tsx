import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Servizi e prezzi di LIMITLESS";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: "Siti, spot e walk tour. Prezzi chiari.", kicker: "Servizi e prezzi", image: "/media/siti/osteria-del-borgo-hero.jpg", imageWide: true });
}
