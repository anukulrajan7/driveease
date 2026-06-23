import { tours, getTourBySlug } from "@/data/tours";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Tour package | Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  return renderOgImage({
    eyebrow: tour ? `${tour.category} · ${tour.durationDays} days` : "Tour package",
    title: tour?.title ?? "North East India tour",
    subtitle: (tour?.shortDescription ?? "").slice(0, 120),
    image: tour?.image,
  });
}
