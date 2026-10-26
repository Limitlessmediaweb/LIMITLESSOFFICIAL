import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "LIMITLESS HUB, il gestionale su misura per la tua attività. E poi spot video e siti web";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: "Il gestionale su misura per la tua attività.", kicker: "LIMITLESS HUB · da 190 €/mese", image: "/media/hub/titolare.jpg", imageWide: true });
}
