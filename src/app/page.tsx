import type { Metadata } from "next";
import Link from "next/link";
import { Mountain, PawPrint, Landmark, Footprints, Waves, Star, ArrowRight, ShieldCheck, Users, MapPin, ChevronDown, Car } from "lucide-react";
import { tours, CATEGORIES, TourCategory } from "@/data/tours";
import { destinations, posts, testimonials, site, formatPostDate } from "@/data/content";
import TourCard from "@/components/TourCard";
import HeroSearch from "@/components/HeroSearch";
import HeroVideo from "@/components/HeroVideo";
import { NE_HERO_POSTER, NE_HERO_CLIPS, HERO_ROUTE } from "@/data/media";
import QuickCarBook from "@/components/QuickCarBook";
import Reviews from "@/components/Reviews";
import CustomCursor from "@/components/CustomCursor";
import Globe from "@/components/Globe";
import { ORIGIN, DESTINATION_COORDS, haversineKm } from "@/data/geo";
import Reveal from "@/components/Reveal";
import CountUpStat from "@/components/CountUpStat";
import FestivalCalendar from "@/components/FestivalCalendar";

// Homepage-specific title (absolute → bypasses the "%s | Siliguri Holidays"
// template) packed with the two primary intents: tours + car rental.
export const metadata: Metadata = {
  title: {
    absolute: "Siliguri Holidays — North East India Tour Packages & Siliguri Car Rental",
  },
  description:
    "Plan North East India tours from Siliguri — Sikkim, Darjeeling, Dooars, Meghalaya & Kaziranga packages — plus a trusted Siliguri car rental fleet: Bagdogra airport transfers, hill-station cabs and multi-day road trips with verified local drivers.",
  alternates: { canonical: "/" },
};

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
      {/* Cursor glow — hero only */}
      <CustomCursor scopeId="hero" />

      {/* Hero */}
      <section id="hero" className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-slate-900">
        <HeroVideo poster={NE_HERO_POSTER} clips={NE_HERO_CLIPS} />
        {/* legibility + colour wash + drifting aurora */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-900/85 via-slate-900/45 to-slate-900/55" />
        <div aria-hidden className="hero-aurora pointer-events-none absolute inset-0 -z-10" />
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />

        <div className="hero-stagger mx-auto w-full max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
            Siliguri Holidays — {site.tagline}
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl font-serif text-4xl font-bold tracking-tight text-white sm:text-6xl sm:leading-[1.1]">
            Misty hills, living bridges, and lands the maps forgot.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-200">
            From Siliguri — gateway to the East — handpicked North East tours and a trusted car
            rental fleet. Local hosts, permits sorted, transparent pricing.
          </p>

          {/* Route trail — the classic Siliguri → Darjeeling → Sikkim → … journey */}
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-xs font-medium uppercase tracking-wider text-slate-300/90">
            {HERO_ROUTE.map((place, i) => (
              <li key={place} className="inline-flex items-center gap-2">
                {i > 0 && <ArrowRight aria-hidden size={13} className="text-brand-400" />}
                <span className={i === 0 ? "text-white" : undefined}>{place}</span>
              </li>
            ))}
          </ul>

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

          <p className="mt-6 text-sm text-slate-300">
            Landing at Bagdogra?{" "}
            <Link
              href="/car-rental"
              className="font-semibold text-brand-300 underline-offset-4 hover:underline"
            >
              Rent a car or book an airport cab →
            </Link>
          </p>
        </div>

        <Link
          href="#explore"
          aria-label="Scroll to explore"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
        >
          <ChevronDown aria-hidden size={28} className="animate-scroll-bob text-white/70" />
        </Link>
      </section>

      {/* Why Siliguri Holidays */}
      <section id="explore" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-14 sm:px-6 md:pt-20">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                Icon: MapPin,
                title: "Local hosts, real access",
                desc: "Guides who grew up here — the homestays, trails, and festivals you won't find on a map.",
              },
              {
                Icon: ShieldCheck,
                title: "Permits & logistics sorted",
                desc: "Inner-line permits, transport, and stays handled end-to-end. You just show up.",
              },
              {
                Icon: Users,
                title: "Small groups only",
                desc: "Intimate departures so every trip stays personal, flexible, and low-impact.",
              },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon aria-hidden size={20} />
                </span>
                <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Car travel band */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 sm:px-10 md:py-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=70"
              alt=""
              aria-hidden
              className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-900/90 to-slate-900/55" />
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_400px]">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-300">
                  <Car aria-hidden size={15} /> Car travel
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">
                  Need wheels, not a whole tour?
                </h2>
                <p className="mt-2 max-w-xl text-slate-200">
                  Bagdogra airport transfers, Darjeeling and Sikkim day trips, or a multi-day road
                  trip — sedans to 12-seater Tempo Travellers, all with verified hill drivers and
                  transparent per-km pricing.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/car-rental"
                    className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-600/30 transition-all hover:-translate-y-0.5 hover:bg-accent-600"
                  >
                    Explore car rental
                    <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/car-rental#fleet"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
                  >
                    See full fleet
                  </Link>
                </div>
              </div>
              <QuickCarBook />
            </div>
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

      {/* Festival calendar — time your trip around the region's best */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-24">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Time it right</p>
              <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">Plan around a festival</h2>
              <p className="mt-1 max-w-xl text-slate-600">
                Hornbill, Bihu, Ziro, the Shillong cherry blossoms — the North East&apos;s calendar is
                its biggest draw. Pick a date and we&apos;ll build the trip around it.
              </p>
            </div>
            <Link href="/travel-info" className="hidden shrink-0 text-sm font-semibold text-brand-700 hover:underline sm:block">
              Full calendar & permits →
            </Link>
          </div>
        </Reveal>
        <Reveal className="mt-8">
          <FestivalCalendar />
        </Reveal>
      </section>

      {/* 3D reach globe */}
      <section className="relative overflow-hidden bg-slate-950">
        <div aria-hidden className="hero-aurora pointer-events-none absolute inset-0 opacity-60" />
        <div aria-hidden className="grain pointer-events-none absolute inset-0" />
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-400">Every trip starts in Siliguri</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
              One basecamp, the whole North East
            </h2>
            <p className="mt-3 max-w-md text-slate-300">
              From our doorstep, routes fan out across the Seven Sisters and Sikkim — tea gardens,
              snow passes, river islands and living-root-bridge country. Tap a destination to start
              planning.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {destinations.slice(0, 8).map((d) => {
                const coord = DESTINATION_COORDS[d.slug];
                return (
                  <Link
                    key={d.slug}
                    href={`/destinations/${d.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-slate-200 transition-all hover:-translate-y-0.5 hover:border-brand-400/50 hover:text-white"
                  >
                    {d.name}
                    {coord && (
                      <span className="text-xs text-brand-400">{haversineKm(ORIGIN, coord)} km</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="relative">
            <Globe className="mx-auto aspect-square w-full max-w-[460px]" />
          </div>
        </div>
      </section>

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

      {/* Reviews */}
      <Reviews testimonials={testimonials} avgRating={avgRating} totalReviews={totalReviews} />

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
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
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
