import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, Clock, MapPin, Phone, ArrowRight, Check } from "lucide-react";
import { TAXI_ROUTES, getTaxiRouteBySlug, routeFares } from "@/data/routes";
import { site } from "@/data/content";
import CarRentalForm from "@/components/CarRentalForm";
import JsonLd from "@/components/JsonLd";
import { abs, taxiRouteJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return TAXI_ROUTES.map((r) => ({ route: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ route: string }>;
}): Promise<Metadata> {
  const { route: slug } = await params;
  const route = getTaxiRouteBySlug(slug);
  if (!route) return { title: "Route not found" };
  const canonical = `/car-rental/${route.slug}`;
  const title = `Siliguri to ${route.place} Taxi — Fare, Distance & Cab Booking`;
  const description = `Book a Siliguri to ${route.fullName} taxi — ${route.distanceKm} km, ${route.hours}. Verified drivers, doorstep pickup, transparent per-km fares and 24×7 support. Get a confirmed quote.`;
  return {
    title,
    description,
    keywords: [
      `Siliguri to ${route.place} taxi`,
      `Siliguri to ${route.place} cab`,
      `Siliguri to ${route.place} car rental`,
      `Siliguri to ${route.place} taxi fare`,
      `${route.place} taxi from Siliguri`,
    ],
    alternates: { canonical },
    openGraph: {
      type: "website",
      title,
      description,
      url: abs(canonical),
    },
  };
}

export default async function RoutePage({
  params,
}: {
  params: Promise<{ route: string }>;
}) {
  const { route: slug } = await params;
  const route = getTaxiRouteBySlug(slug);
  if (!route) notFound();

  const fares = routeFares(route.distanceKm);
  const phoneHref = `tel:${site.contact.phone.replace(/\s/g, "")}`;
  const related = TAXI_ROUTES.filter((r) => r.slug !== route.slug).slice(0, 4);

  return (
    <div className="pb-20">
      <JsonLd
        data={[
          taxiRouteJsonLd(route),
          faqJsonLd(route.faqs),
          breadcrumbJsonLd([
            { name: "Car Rental", path: "/car-rental" },
            { name: `Siliguri to ${route.place}`, path: `/car-rental/${route.slug}` },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-300">
            <Link href="/car-rental" className="hover:text-white hover:underline">
              Car Rental
            </Link>{" "}
            / <span className="text-white">Siliguri to {route.place}</span>
          </nav>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-brand-300">
            <Car aria-hidden size={16} /> Siliguri car rental
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            Siliguri to {route.place} taxi
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">{route.note}</p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-200">
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden size={15} className="text-brand-300" /> {route.distanceKm} km
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden size={15} className="text-brand-300" /> {route.hours}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check aria-hidden size={15} className="text-brand-300" /> Verified local driver
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#book"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-600/30 transition-all hover:-translate-y-0.5 hover:bg-accent-600"
            >
              Get an exact quote
              <ArrowRight aria-hidden size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
            >
              <Phone aria-hidden size={17} /> {site.contact.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Fare table */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">
          Siliguri to {route.place} cab fare
        </h2>
        <p className="mt-1 max-w-2xl text-slate-600">
          Indicative one-way estimates for {route.distanceKm} km. Hill routes are often quoted
          round-trip and airport transfers may be fixed-rate — tap{" "}
          <Link href="#book" className="font-semibold text-brand-700 hover:underline">
            Get an exact quote
          </Link>{" "}
          for a confirmed, all-inclusive price.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Seats</th>
                <th className="px-4 py-3 font-semibold">Per km</th>
                <th className="px-4 py-3 font-semibold">From (one-way)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fares.map((f) => (
                <tr key={f.name}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {f.name} <span className="text-slate-400">· {f.type}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{f.seats}</td>
                  <td className="px-4 py-3 text-slate-600">₹{f.perKm}/km</td>
                  <td className="px-4 py-3 font-semibold text-brand-700">{f.estimateLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What's included */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">What&apos;s included</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            "Verified, hill-experienced local driver",
            "Doorstep pickup anywhere in Siliguri",
            "Well-maintained AC vehicle",
            "Transparent pricing — no surprises",
            "Bagdogra Airport & NJP station pickup option",
            "24×7 on-trip support",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-slate-700">
              <Check aria-hidden size={18} className="mt-0.5 shrink-0 text-brand-600" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">
          Siliguri to {route.place} — frequently asked questions
        </h2>
        <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200">
          {route.faqs.map((faq) => (
            <details key={faq.question} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-slate-900">
                {faq.question}
                <span aria-hidden className="text-brand-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-14 sm:px-6 md:pt-20">
        <CarRentalForm />
      </section>

      {/* Related routes — internal links */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">Other popular routes from Siliguri</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/car-rental/${r.slug}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <MapPin aria-hidden size={18} />
              </span>
              <p className="mt-3 font-semibold text-slate-900 group-hover:text-brand-700">
                Siliguri to {r.place}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                {r.distanceKm} km · {r.hours}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
