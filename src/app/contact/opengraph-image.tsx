import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Contact Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Get in touch",
    title: "Plan your trip with us",
    subtitle: "Call, WhatsApp or message us — 24×7 trip & cab support from Siliguri.",
  });
}
