import { SERVICES, getServiceBySlug } from "@/data/services";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Service | Siliguri Holidays";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return SERVICES.filter((s) => !s.externalHref).map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  return renderOgImage({
    eyebrow: "Our services",
    title: service?.title ?? "Travel service",
    subtitle: (service?.short ?? "").slice(0, 120),
    image: service?.image,
  });
}
