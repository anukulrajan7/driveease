"use client";

import { useState } from "react";
import Link from "next/link";
import { Offer } from "@/data/content";

export default function OfferCard({ offer }: { offer: Offer }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(offer.code);
    } catch {
      // clipboard unavailable — still show feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="flex flex-col rounded-2xl border border-dashed border-accent-400 bg-accent-50 p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="self-start rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white">
          {offer.tag}
        </span>
      </div>
      <h2 className="mt-3 text-lg font-bold text-slate-900">{offer.title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{offer.description}</p>

      <div className="mt-4 flex items-center gap-3">
        <code className="flex-1 rounded-xl border-2 border-dashed border-accent-400 bg-white px-4 py-3 text-center font-mono text-xl font-bold tracking-widest text-accent-700">
          {offer.code}
        </code>
        <button
          type="button"
          onClick={copy}
          className="rounded-xl border border-accent-500 px-4 py-3 text-sm font-semibold text-accent-700 transition-colors hover:bg-accent-500 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">Apply at checkout. One code per booking.</p>

      <Link
        href="/tours"
        className="mt-4 inline-block self-start rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Browse tours
      </Link>
    </article>
  );
}
