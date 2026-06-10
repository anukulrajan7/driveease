import type { Metadata } from "next";
import ToursExplorer from "@/components/ToursExplorer";

export const metadata: Metadata = {
  title: "All Tours",
  description: "Browse all tour packages — filter by category, price, and duration.",
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
      <h1 className="mt-1 text-3xl font-serif font-bold">Explore our tours</h1>
      <p className="mt-1 text-slate-600">
        Filter by what you love — every package includes stays, transfers, and a local host.
      </p>
      <div className="mt-6">
        <ToursExplorer key={`${category ?? "all"}-${q ?? ""}`} initialCategory={category} initialQuery={q} />
      </div>
    </div>
  );
}
