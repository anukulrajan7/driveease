import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "North East India tour packages | Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Tour packages",
    title: "North East India tours",
    subtitle:
      "Sikkim, Darjeeling, Dooars, Meghalaya, Kaziranga & Bhutan — stays, transfers and permits sorted.",
  });
}
