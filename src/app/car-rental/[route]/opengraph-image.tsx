import { getTaxiRouteBySlug, TAXI_ROUTES } from "@/data/routes";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/ogImage";

export const alt = "Siliguri car rental — route fares & cab booking";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return TAXI_ROUTES.map((r) => ({ route: r.slug }));
}

export default async function Image({ params }: { params: Promise<{ route: string }> }) {
  const { route: slug } = await params;
  const route = getTaxiRouteBySlug(slug);
  return renderOgImage({
    eyebrow: "Siliguri car rental",
    title: `Siliguri → ${route?.place ?? "the hills"}`,
    subtitle: route
      ? `${route.distanceKm} km · ${route.hours} · verified driver, doorstep pickup, transparent fares.`
      : "Cabs & road trips with verified local drivers.",
  });
}
