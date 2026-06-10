import Link from "next/link";
import { Mountain, PawPrint, Landmark, Footprints, Waves, Star, ArrowRight } from "lucide-react";
import { tours, CATEGORIES, TourCategory } from "@/data/tours";
import { destinations, posts, offers, testimonials, site, formatPostDate } from "@/data/content";
import TourCard from "@/components/TourCard";
import OffersStrip from "@/components/OffersStrip";
import HeroSearch from "@/components/HeroSearch";
import Reveal from "@/components/Reveal";
import CountUpStat from "@/components/CountUpStat";

const CATEGORY_ICONS: Record<TourCategory, typeof Mountain> = {
  Mountains: Mountain,
  Wildlife: PawPrint,
  Culture: Landmark,
  Trekking: Footprints,
  "Rivers & Lakes": Waves,
};

export default function HomePage() {
  const featured = [...tours].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const topDestinations = destinations.slice(0, 7);
  const latestPosts = [...posts]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);
  const avgRating = (tours.reduce((s, t) => s + t.rating, 0) / tours.length).toFixed(1);
  const totalReviews = tours.reduce((s, t) => s + t.reviewsCount, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1800&q=70"
          alt=""
          aria-hidden
          className="animate-ken-burns absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-slate-900/40" />
        <div className="hero-stagger mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
            {site.tagline}
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl font-serif text-4xl font-bold tracking-tight text-white sm:text-6xl sm:leading-[1.1]">
            Misty hills, living bridges, and lands the maps forgot.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-200">
            Handpicked tours across the Seven Sisters — Meghalaya to Manipur — with local hosts,
            permits sorted, and transparent pricing.
          </p>

          <HeroSearch />

          <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <Link
                  key={cat}
                  href={`/tours?category=${encodeURIComponent(cat)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/25"
                >
                  <Icon aria-hidden size={14} />
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section id="offers" className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Save more</p>
              <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">Offers & deals</h2>
              <p className="mt-1 text-slate-600">Copy a code, apply it at booking.</p>
            </div>
            <Link href="/offers" className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-6">
            <OffersStrip offers={offers} />
          </div>
        </Reveal>
      </section>

      {/* Featured tours */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-24">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Traveller favourites</p>
              <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">Popular tours</h2>
              <p className="mt-1 text-slate-600">Our highest-rated North East trips.</p>
            </div>
            <Link href="/tours" className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
              View all →
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tour, i) => (
            <Reveal key={tour.id} delay={(i % 3) * 90}>
              <TourCard tour={tour} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Destinations — bento grid */}
      {topDestinations.length > 0 && (
        <section className="bg-slate-50 py-14 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Where to next</p>
                  <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">Explore by destination</h2>
                  <p className="mt-1 text-slate-600">Guides, attractions, and tours for every state.</p>
                </div>
                <Link
                  href="/destinations"
                  className="shrink-0 text-sm font-semibold text-brand-700 hover:underline"
                >
                  All destinations →
                </Link>
              </div>
            </Reveal>
            <Reveal className="mt-8">
              <div className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[160px] sm:grid-cols-4">
                {topDestinations.map((dest, i) => (
                  <Link
                    key={dest.slug}
                    href={`/destinations/${dest.slug}`}
                    className={`group relative overflow-hidden rounded-3xl bg-slate-300 ${
                      i === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={dest.image}
                      alt={dest.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent" />
                    <span className="absolute bottom-3 left-4 right-4">
                      <span className={`block font-bold text-white ${i === 0 ? "text-2xl" : "text-sm"}`}>
                        {dest.name}
                      </span>
                      {i === 0 && (
                        <span className="mt-1 block max-w-md text-sm text-slate-200">{dest.tagline}</span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Stats band — counts up on scroll */}
      <section className="border-y border-brand-100 bg-brand-50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 text-center sm:px-6 md:grid-cols-4 md:py-16">
          {site.stats.map((stat) => (
            <CountUpStat key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </section>

      {/* Blog teasers */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-24">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent-600">From the field</p>
                <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">Travel stories & guides</h2>
                <p className="mt-1 text-slate-600">Written by the people who run these trips.</p>
              </div>
              <Link href="/blog" className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
                All stories →
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 90}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
                >
                  <div className="aspect-video overflow-hidden bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="self-start rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-accent-700">
                      {post.category}
                    </span>
                    <h3 className="mt-2 font-semibold text-slate-900 group-hover:text-brand-700">
                      {post.title}
                    </h3>
                    <p className="mt-auto pt-3 text-xs text-slate-500">
                      {post.author.name} · {formatPostDate(post.date)} · {post.readMinutes} min read
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section id="testimonials" className="bg-slate-50 py-14 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Real trips, real people</p>
              <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">What travellers say</h2>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-600">
                <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" className="fill-amber-400">
                  <path d="M12 2l2.92 6.26 6.87.82-5.08 4.7 1.35 6.78L12 17.27l-6.06 3.29 1.35-6.78-5.08-4.7 6.87-.82L12 2z" />
                </svg>
                <strong className="text-slate-900">{avgRating}</strong> average from{" "}
                {totalReviews.toLocaleString("en-IN")}+ reviews
              </p>
            </div>
          </Reveal>
          <div className="no-scrollbar edge-fade-x -mx-4 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={(i % 4) * 80} className="w-[85%] shrink-0 snap-center sm:w-auto sm:shrink">
                <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-center gap-1" aria-label="5 star review">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} aria-hidden width="14" height="14" viewBox="0 0 24 24" className="fill-amber-400">
                        <path d="M12 2l2.92 6.26 6.87.82-5.08 4.7 1.35 6.78L12 17.27l-6.06 3.29 1.35-6.78-5.08-4.7 6.87-.82L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-slate-700">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3 pt-4">
                    <span
                      aria-hidden
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-800"
                    >
                      {t.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-900">{t.name}</span>
                      <span className="block text-xs text-slate-500">{t.trip}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1800&q=70"
          alt=""
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/80 via-slate-900/60 to-slate-900/80" />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 md:py-24">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
            <Star aria-hidden size={14} className="fill-amber-400 text-amber-400" />
            Rated {avgRating} by {totalReviews.toLocaleString("en-IN")}+ travellers
          </p>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            The Seven Sisters are waiting
          </h2>
          <p className="max-w-xl text-slate-200">
            Browse all our tours, filter by what you love, and lock in your dates today.
          </p>
          <Link
            href="/tours"
            className="group mt-2 inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-600/30 transition-all hover:-translate-y-0.5 hover:bg-accent-600"
          >
            Browse All Tours
            <ArrowRight aria-hidden size={17} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
