import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "North East India travel guide | Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Travel journal",
    title: "North East India travel guide",
    subtitle: "Itineraries, festival guides, safari tips and slow-travel stories from the East.",
  });
}
