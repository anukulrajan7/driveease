import type { Metadata } from "next";
import Link from "next/link";
import { Car, MapPin, Clock, Phone, ArrowRight, Check } from "lucide-react";
import { cars } from "@/data/cars";
import { TAXI_ROUTES } from "@/data/routes";
import { site } from "@/data/content";
import CarCard from "@/components/CarCard";
import CarRentalForm from "@/components/CarRentalForm";
import FareCalculator from "@/components/FareCalculator";
import ServicesGrid from "@/components/ServicesGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reveal from "@/components/Reveal";
import HeroVideo from "@/components/HeroVideo";
import JsonLd from "@/components/JsonLd";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { NE_HERO_POSTER, NE_HERO_CLIPS } from "@/data/media";

const CAR_RENTAL_FAQS = [
  {
    question: "How do I book a car rental in Siliguri?",
    answer:
      "Tell us your pickup point, destination and dates via the booking form, WhatsApp or a call. We confirm your driver and an all-inclusive fare — no payment is needed to book.",
  },
  {
    question: "Do your fares include the driver, fuel and tolls?",
    answer:
      "Yes. We quote transparent, all-inclusive fares covering the driver, fuel and tolls. Hill permits (e.g. for restricted parts of Sikkim) are arranged and itemised separately.",
  },
  {
    question: "Can you pick me up from Bagdogra Airport or NJP station?",
    answer:
      "Absolutely — we run meet-and-greet pickups from Bagdogra Airport (IXB) and New Jalpaiguri (NJP) station, with onward transfers to any hill station.",
  },
  {
    question: "What vehicles do you have?",
    answer:
      "Hatchbacks and sedans for couples, SUVs for families and hill roads, and 12-seater Tempo Travellers for groups — all AC and well-maintained.",
  },
];

export const metadata: Metadata = {
  title: "Siliguri Car Rental — Cabs, Airport Transfers & Hill-Station Taxis",
  description:
    "Siliguri car rental with verified drivers — Darjeeling, Gangtok & Sikkim cabs, Bagdogra airport & NJP station transfers, corporate & wedding fleet, hotel and holiday bookings. Doorstep pickup, 24×7 support, no payment now.",
  keywords: [
    "Siliguri car rental",
    "Siliguri taxi service",
    "Bagdogra airport taxi",
    "NJP to Darjeeling taxi",
    "Siliguri to Gangtok cab",
    "Siliguri to Darjeeling cab",
    "Tempo Traveller hire Siliguri",
    "Siliguri cab booking",
  ],
  alternates: { canonical: "/car-rental" },
  openGraph: {
    type: "website",
    title: "Siliguri Car Rental — Cabs, Airport Transfers & Hill-Station Taxis",
    description:
      "Verified drivers, doorstep pickup, transparent per-km fares. Bagdogra & NJP transfers, Darjeeling/Gangtok/Sikkim cabs, Tempo Travellers.",
    url: "/car-rental",
  },
};

const HERO_TRUST = ["Verified drivers", "Doorstep pickup", "Permits sorted", "24×7 support"];

export default function CarRentalPage() {
  const phoneHref = `tel:${site.contact.phone.replace(/\s/g, "")}`;

  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(CAR_RENTAL_FAQS),
          breadcrumbJsonLd([{ name: "Car Rental", path: "/car-rental" }]),
        ]}
      />
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-slate-900">
        <HeroVideo poster={NE_HERO_POSTER} clips={NE_HERO_CLIPS} showCaption={false} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-slate-900/50" />
        <div aria-hidden className="hero-aurora pointer-events-none absolute inset-0 -z-10" />
        <div className="hero-stagger mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-brand-300">
            <Car aria-hidden size={16} /> Siliguri car rental
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
            Cabs & road trips from Siliguri, with drivers who know the hills.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-200">
            Bagdogra airport transfers, day trips to Darjeeling and Mirik, or a full Sikkim road
            trip — sedans to 12-seater Tempo Travellers, all with verified local drivers.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#book"
              className="group inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-600/30 transition-all hover:-translate-y-0.5 hover:bg-accent-600"
            >
              Book a car
              <ArrowRight aria-hidden size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
            >
              <Phone aria-hidden size={17} />
              {site.contact.phone}
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-200">
            {HERO_TRUST.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check aria-hidden size={15} className="text-brand-300" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Popular routes */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <Reveal>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600">From our doorstep</p>
            <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">Popular routes from Siliguri</h2>
            <p className="mt-1 text-slate-600">Tap a route for fares, drive time and instant booking.</p>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TAXI_ROUTES.map((route, i) => (
            <Reveal key={route.slug} delay={(i % 3) * 80}>
              <Link
                href={`/car-rental/${route.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                    <MapPin aria-hidden size={18} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">Siliguri →</p>
                    <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">{route.place}</h3>
                  </div>
                  <ArrowRight
                    aria-hidden
                    size={16}
                    className="ml-auto mt-1 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-600"
                  />
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Car aria-hidden size={14} className="text-brand-500" />
                    {route.distanceKm} km
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock aria-hidden size={14} className="text-brand-500" />
                    {route.hours}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Distance & fare calculator + map */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <Reveal>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Plan it on the map</p>
            <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">See it on the map, get a quote</h2>
            <p className="mt-1 text-slate-600">
              Pick a destination and a vehicle for the distance and drive time from Siliguri — then
              request a live quote.
            </p>
          </div>
          <div className="mt-8">
            <FareCalculator />
          </div>
        </Reveal>
      </section>

      {/* Our fleet */}
      <section id="fleet" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 md:py-20">
        <Reveal>
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-accent-600">
              <Car aria-hidden size={15} /> Our fleet
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
              Hatchbacks to 12-seater Tempo Travellers
            </h2>
            <p className="mt-1 text-slate-600">
              Every vehicle is well-maintained, AC, and comes with a verified local driver who knows
              the hill roads. Pick what fits your group — pricing is transparent and per-kilometre.
            </p>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car, i) => (
            <Reveal key={car.slug} delay={(i % 3) * 90}>
              <CarCard car={car} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <Link
            href="#book"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Book any of these
            <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </section>

      {/* Fleet + booking */}
      <section id="book" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 md:py-20">
        <CarRentalForm />
      </section>

      {/* More services — car booking first, then everything else */}
      <section id="services" className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-accent-600">All in one place</p>
              <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">More than cabs — our services</h2>
              <p className="mt-1 text-slate-600">
                Start with a car, then let us handle the rest — corporate &amp; wedding fleets, hotels,
                airport and station transfers, and full holiday planning. One team, doorstep to destination.
              </p>
            </div>
          </Reveal>
          <Reveal className="mt-8">
            <ServicesGrid />
          </Reveal>
          <Reveal className="mt-6">
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
              See all services &amp; enquire →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Why choose us */}
      <WhyChooseUs
        eyebrow="Why book your cab with us"
        title="More than a taxi number"
        subtitle="The same team that plans North East tours runs the fleet — local, accountable, reachable."
      />

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Good to know</p>
            <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">Car rental FAQs</h2>
          </div>
        </Reveal>
        <Reveal className="mt-6">
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
            {CAR_RENTAL_FAQS.map((faq) => (
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
        </Reveal>
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
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
            Need a car for tomorrow morning?
          </h2>
          <p className="max-w-xl text-slate-200">
            Tell us where and when. We&apos;ll confirm your driver and a clear fare within the hour
            during working hours.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="#book"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent-600/30 transition-all hover:-translate-y-0.5 hover:bg-accent-600"
            >
              Book a car
              <ArrowRight aria-hidden size={17} />
            </Link>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
            >
              <Phone aria-hidden size={17} />
              Call us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
