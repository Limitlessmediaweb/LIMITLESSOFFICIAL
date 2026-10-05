import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Lavori di LIMITLESS: siti, spot e walk tour";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: "Guarda cosa possiamo fare per te.", kicker: "Lavori", image: "/media/spot/nottea.jpg", imageWide: false });
}
