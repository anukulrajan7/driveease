import type { Metadata } from "next";
import Link from "next/link";
import ToursExplorer from "@/components/ToursExplorer";
import { destinations } from "@/data/content";

export const metadata: Metadata = {
  title: "North East India Tour Packages",
  description:
    "Browse North East India tour packages from Siliguri — Sikkim, Darjeeling, Dooars, Meghalaya, Kaziranga & Bhutan. Stays, transfers, permits and a local host included. Filter by category, price and duration.",
  keywords: [
    "North East India tour packages",
    "Sikkim tour packages",
    "Darjeeling tour packages",
    "Meghalaya tour packages",
    "Dooars tour packages",
    "Kaziranga safari packages",
    "Bhutan tour packages from India",
    "Siliguri tour packages",
  ],
  alternates: { canonical: "/tours" },
  openGraph: {
    type: "website",
    title: "North East India Tour Packages | Siliguri Holidays",
    description:
      "Sikkim, Darjeeling, Dooars, Meghalaya, Kaziranga & Bhutan packages from Siliguri — stays, transfers and permits sorted.",
    url: "/tours",
  },
};

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 md:pb-24">
      <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Find your trip</p>
      <h1 className="mt-1 text-3xl font-serif font-bold">North East India tour packages</h1>
      <p className="mt-1 text-slate-600">
        Filter by what you love — every package includes stays, transfers, and a local host.
      </p>
      <div className="mt-6">
        <ToursExplorer key={`${category ?? "all"}-${q ?? ""}`} initialCategory={category} initialQuery={q} />
      </div>

      {/* Crawlable destination links — gives search engines a static path to every
          destination hub from the tours page (ToursExplorer above is client-only). */}
      <nav aria-label="Browse tours by destination" className="mt-14 border-t border-slate-200 pt-8">
        <h2 className="font-serif text-xl font-bold text-slate-900">Browse tours by destination</h2>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {destinations.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/destinations/${d.slug}`}
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              >
                {d.name} tours
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
