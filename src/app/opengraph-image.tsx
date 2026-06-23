import { site } from "@/data/content";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = `${site.name} — ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Default share card for every route that doesn't generate its own.
export default function Image() {
  return renderOgImage({
    eyebrow: "North East India",
    title: site.tagline,
    subtitle:
      "Tour packages & trusted Siliguri car rental — permits sorted, verified drivers, transparent pricing.",
  });
}
