import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "North East India destinations | Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Destinations",
    title: "North East India destinations",
    subtitle: "Sikkim, Darjeeling, Dooars, Meghalaya, Kaziranga & Bhutan — guides and trips.",
  });
}
