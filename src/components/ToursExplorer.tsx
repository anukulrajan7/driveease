"use client";

import { useMemo, useState } from "react";
import { tours, CATEGORIES, TourCategory } from "@/data/tours";
import TourCard from "./TourCard";
import { Select, inputClass } from "@/components/ui";

type SortKey = "popular" | "duration" | "rating";

const DURATION_BUCKETS = [
  { label: "Any duration", min: 0, max: Infinity },
  { label: "Up to 3 days", min: 0, max: 3 },
  { label: "4 – 6 days", min: 4, max: 6 },
  { label: "7+ days", min: 7, max: Infinity },
];

export default function ToursExplorer({
  initialCategory,
  initialQuery,
}: {
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [category, setCategory] = useState<TourCategory | "All">(
    CATEGORIES.includes(initialCategory as TourCategory) ? (initialCategory as TourCategory) : "All"
  );
  const [durationIdx, setDurationIdx] = useState(0);
  const [sort, setSort] = useState<SortKey>("popular");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const duration = DURATION_BUCKETS[durationIdx];

    const filtered = tours.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (t.durationDays < duration.min || t.durationDays > duration.max) return false;
      if (q && ![t.title, t.destination, t.country].some((s) => s.toLowerCase().includes(q))) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sort) {
        case "duration":
          return a.durationDays - b.durationDays;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.rating * b.reviewsCount - a.rating * a.reviewsCount;
      }
    });
  }, [query, category, durationIdx, sort]);

  const resetFilters = () => {
    setQuery("");
    setCategory("All");
    setDurationIdx(0);
    setSort("popular");
  };

  return (
    <div>
      {/* Search + filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="tour-search" className="sr-only">
          Search tours
        </label>
        <input
          id="tour-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by tour, destination, or country…"
          className={inputClass()}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {(["All", ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-16 shrink-0 sm:w-auto">Duration</span>
            <Select value={durationIdx} onChange={(e) => setDurationIdx(Number(e.target.value))} wrapperClassName="flex-1 sm:flex-initial sm:min-w-40">
              {DURATION_BUCKETS.map((b, i) => (
                <option key={b.label} value={i}>{b.label}</option>
              ))}
            </Select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-16 shrink-0 sm:w-auto">Sort by</span>
            <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} wrapperClassName="flex-1 sm:flex-initial sm:min-w-40">
              <option value="popular">Most popular</option>
              <option value="rating">Highest rated</option>
              <option value="duration">Shortest first</option>
            </Select>
          </label>
          <button
            type="button"
            onClick={resetFilters}
            className="justify-self-start text-sm font-medium text-brand-700 hover:underline sm:ml-auto"
          >
            Reset filters
          </button>
        </div>
      </div>

      {/* Results */}
      <p className="mt-6 text-sm text-slate-600" role="status">
        {results.length} {results.length === 1 ? "tour" : "tours"} found
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-lg font-semibold text-slate-900">No tours match your filters</p>
          <p className="mt-1 text-sm text-slate-600">Try a different category or duration.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
