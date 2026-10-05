import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "Contatti LIMITLESS: WhatsApp, email, Instagram";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: "Scrivici su WhatsApp.", kicker: "Contatti", image: "/media/spot/limitless-da-zero.jpg", imageWide: false });
}
