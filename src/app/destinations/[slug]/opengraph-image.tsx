import { destinations, getDestinationBySlug } from "@/data/content";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Destination guide | Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);
  return renderOgImage({
    eyebrow: "Destination guide",
    title: destination?.name ?? "North East India",
    subtitle: (destination?.tagline ?? destination?.intro ?? "").slice(0, 120),
  });
}
