import type { Metadata } from "next";
import Link from "next/link";
import { Car, MapPin, Clock, Phone, ArrowRight, Check } from "lucide-react";
import { POPULAR_ROUTES } from "@/data/cars";
import { site } from "@/data/content";
import CarRentalForm from "@/components/CarRentalForm";
import FareCalculator from "@/components/FareCalculator";
import WhyChooseUs from "@/components/WhyChooseUs";
import Reveal from "@/components/Reveal";
import HeroVideo from "@/components/HeroVideo";
import { NE_HERO_POSTER, NE_HERO_CLIPS } from "@/data/media";

export const metadata: Metadata = {
  title: "Car Rental in Siliguri",
  description:
    "Siliguri car rental with verified drivers — Bagdogra airport transfers, Darjeeling, Gangtok & Sikkim cabs, sedans, SUVs, Innova Crysta and Tempo Travellers. Transparent pricing, permits sorted, 24×7 support.",
};

const HERO_TRUST = ["Verified drivers", "Bagdogra airport pickup", "Permits sorted", "No payment now"];

export default function CarRentalPage() {
  const phoneHref = `tel:${site.contact.phone.replace(/\s/g, "")}`;

  return (
    <>
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
            <p className="mt-1 text-slate-600">Fixed, transparent fares on the routes we drive every day.</p>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_ROUTES.map((route, i) => (
            <Reveal key={route.to} delay={(i % 3) * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                    <MapPin aria-hidden size={18} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">Siliguri →</p>
                    <h3 className="font-semibold text-slate-900">{route.to}</h3>
                  </div>
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
                  <span className="ml-auto text-xs text-slate-500">{route.note}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Distance & fare calculator + map */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-20">
        <Reveal>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Plan & price it</p>
            <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">See it on the map, know the fare</h2>
            <p className="mt-1 text-slate-600">
              Pick a destination and a car for a live distance and fare estimate, plotted from Siliguri.
            </p>
          </div>
          <div className="mt-8">
            <FareCalculator />
          </div>
        </Reveal>
      </section>

      {/* Fleet + booking */}
      <section id="book" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:px-6 md:py-20">
        <CarRentalForm />
      </section>

      {/* Why choose us */}
      <WhyChooseUs
        eyebrow="Why book your cab with us"
        title="More than a taxi number"
        subtitle="The same team that plans North East tours runs the fleet — local, accountable, reachable."
      />

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
