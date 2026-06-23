import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Frequently asked questions | Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "FAQs",
    title: "Questions, answered",
    subtitle: "Bookings, permits, fares and on-trip support for North East India travel.",
  });
}
