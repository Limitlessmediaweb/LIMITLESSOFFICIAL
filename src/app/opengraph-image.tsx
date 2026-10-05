import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "LIMITLESS: siti web animati, spot video e walk tour per attività locali";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: "Più clienti con siti e video che si fanno guardare.", kicker: "Siti web, spot, walk tour", image: "/media/showreel/showreel.jpg", imageWide: true });
}
