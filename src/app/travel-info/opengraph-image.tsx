import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "North East India travel info & permits | Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Travel info",
    title: "Permits & travel tips",
    subtitle: "Sikkim & restricted-area permits, best seasons and what to pack for the East.",
  });
}
