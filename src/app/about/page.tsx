import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "We are local hosts across the Seven Sisters. Learn how Siliguri Holidays plans North East India tours with permits handled, small groups, and transparent pricing.",
};

const values = [
  {
    title: "Local first",
    description:
      "Every itinerary is built with hosts who grew up in these states — from Mawlynnong village guides to Tawang monastery caretakers. Their knowledge cannot be replicated from a desk.",
  },
  {
    title: "Transparent pricing",
    description:
      "The price you see is the price you pay. No hidden fees, no 'mandatory' upgrades at the border. Inclusions and exclusions are listed line by line on every tour page.",
  },
  {
    title: "Leave no trace",
    description:
      "Small groups of 12 or fewer, low-impact campsites, and a strict no-single-use-plastic rule on all trips. North East India's ecosystems are irreplaceable.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-16 sm:px-6 md:pb-24">
      {/* Editorial header */}
      <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Our story</p>
      <h1 className="mt-2 max-w-2xl text-3xl font-serif font-bold text-slate-900 sm:text-4xl">
        Travel planned by people who live here
      </h1>

      {/* Story */}
      <div className="mt-8 space-y-5 text-slate-700 leading-relaxed">
        <p>
          Siliguri Holidays started as a small WhatsApp group of friends who kept getting asked the same
          question: <em>&ldquo;How do I actually visit Meghalaya without wasting a week figuring out
          permits?&rdquo;</em> The seven states of North East India — the Seven Sisters — are unlike
          anywhere else in the country. They share more biodiversity with Southeast Asia than with
          the subcontinent, they have their own festivals, their own languages, and some of the
          world&apos;s most extraordinary landscapes. They also have rules: Inner Line Permits,
          restricted-area clearances, border-zone regulations that change by district. Getting it
          wrong means turned back at a checkpoint.
        </p>
        <p>
          We built Siliguri Holidays so that the complexity stays on our side. We are based in
          Siliguri — the gateway to the entire North East, Darjeeling, Sikkim and Bhutan — where
          Bagdogra airport and the New Jalpaiguri railhead bring almost every traveller in. Our
          hosts live in Shillong, Kohima, Itanagar, Imphal, Gangtok, and a dozen smaller towns in
          between. They know which road washes out in October, which homestay family cooks the best
          smoked pork, and exactly which district office to call on a Friday afternoon when a permit
          needs expediting. We handle all of that before you book your flight.
        </p>
        <p>
          Alongside our tours we run a dedicated <strong>Siliguri car rental fleet</strong> — sedans,
          SUVs, Innova Crystas and Tempo Travellers with verified, hill-tested drivers. Whether you
          need a quick Bagdogra airport pickup, a Darjeeling–Gangtok–Kalimpong loop, or a vehicle for
          the whole family, the same team that plans your trip puts you in the right car.
        </p>
        <p>
          We keep groups small — twelve people maximum on most trips — because that is the size that
          a local host can genuinely guide, and because the trails and communities we visit deserve
          guests, not crowds. Every itinerary is reviewed annually with our on-ground partners.
          Prices are published with a full breakdown. Nothing is hidden until checkout.
        </p>
      </div>

      {/* Stats band */}
      <section className="mt-14 rounded-2xl bg-brand-800">
        <div className="grid grid-cols-2 gap-8 px-6 py-10 text-center md:grid-cols-4">
          {site.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-brand-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section className="mt-14">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Recognition</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Awards & trust signals</h2>
        <ul className="mt-6 space-y-3">
          {site.awards.map((award) => (
            <li key={award} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-500 text-lg" aria-hidden>
                ★
              </span>
              <span className="text-slate-700">{award}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Values grid */}
      <section className="mt-14">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-600">What we stand for</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Our values</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mt-14 rounded-2xl bg-slate-50 border border-slate-200 px-8 py-10 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Ready to explore the Seven Sisters?</h2>
        <p className="mt-2 text-slate-600">
          Browse our full catalogue — every tour has permits, local hosts, and pricing sorted.
        </p>
        <Link
          href="/tours"
          className="mt-6 inline-block rounded-xl bg-accent-500 px-8 py-3 font-semibold text-white hover:bg-accent-600 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:outline-none"
        >
          Browse all tours
        </Link>
      </section>
    </div>
  );
}
