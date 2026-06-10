"use client";

import { useState } from "react";
import Link from "next/link";
import { Offer } from "@/data/content";

export default function OffersStrip({ offers }: { offers: Offer[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 2000);
    } catch {
      // clipboard unavailable (e.g. http) — still show feedback
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 2000);
    }
  };

  return (
    <div className="no-scrollbar edge-fade-x -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
      {offers.map((offer) => (
        <article
          key={offer.code}
          className="flex w-[85%] shrink-0 snap-center flex-col rounded-2xl border border-dashed border-accent-400 bg-accent-50 p-4 sm:w-72 sm:snap-start"
        >
          <span className="self-start rounded-full bg-accent-500 px-2.5 py-0.5 text-xs font-bold text-white">
            {offer.tag}
          </span>
          <h3 className="mt-2 text-sm font-bold text-slate-900">{offer.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{offer.description}</p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <code className="rounded-lg bg-white px-3 py-1.5 font-mono text-sm font-bold tracking-wide text-accent-700">
              {offer.code}
            </code>
            <button
              type="button"
              onClick={() => copy(offer.code)}
              className="rounded-lg border border-accent-500 px-3 py-1.5 text-xs font-semibold text-accent-700 transition-colors hover:bg-accent-500 hover:text-white"
            >
              {copied === offer.code ? "Copied!" : "Copy code"}
            </button>
          </div>
        </article>
      ))}
      <Link
        href="/offers"
        className="flex w-48 shrink-0 snap-center flex-col items-center justify-center rounded-2xl border border-dashed border-brand-400 bg-brand-50 p-4 text-center text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 sm:snap-start"
      >
        View all offers →
      </Link>
    </div>
  );
}
