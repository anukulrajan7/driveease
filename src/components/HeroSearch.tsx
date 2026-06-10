"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/data/tours";
import { Select } from "@/components/ui";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    router.push(`/tours${params.size ? `?${params}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-2 rounded-2xl bg-white/95 p-2.5 shadow-2xl shadow-slate-900/30 backdrop-blur sm:flex-row sm:items-center sm:rounded-full"
    >
      <label htmlFor="hero-q" className="sr-only">
        Where do you want to go?
      </label>
      <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:rounded-full">
        <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-slate-400">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="hero-q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “Meghalaya”, “safari”, “Tawang”…"
          className="h-11 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      <label htmlFor="hero-cat" className="sr-only">
        Trip type
      </label>
      <Select
        id="hero-cat"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        wrapperClassName="sm:w-44"
        className="rounded-xl border-0 bg-slate-100 font-medium text-slate-700 focus:ring-2 sm:rounded-full"
      >
        <option value="">All trip types</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Select>
      <button
        type="submit"
        className="rounded-xl bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent-500/40 transition-all hover:bg-accent-600 sm:rounded-full"
      >
        Search
      </button>
    </form>
  );
}
