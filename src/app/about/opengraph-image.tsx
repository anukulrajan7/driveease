import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "About Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "About us",
    title: "Your local team in the East",
    subtitle: "North East India tours & Siliguri car rental — verified drivers, permits sorted.",
  });
}
