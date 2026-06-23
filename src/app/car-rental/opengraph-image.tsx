import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Siliguri car rental — cabs, airport transfers & hill-station taxis";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Siliguri car rental",
    title: "Cabs & road trips",
    subtitle:
      "Bagdogra & NJP transfers, Darjeeling/Gangtok/Sikkim cabs, Tempo Travellers — verified drivers, doorstep pickup.",
  });
}
