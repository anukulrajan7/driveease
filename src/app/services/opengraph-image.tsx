import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Travel & cab services | Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Our services",
    title: "Travel & cab services",
    subtitle: "Airport & station transfers, hotels, corporate & wedding fleet, holiday planning.",
  });
}
