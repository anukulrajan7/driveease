"use client";

import { useMemo, useState } from "react";
import { MapPin, Clock, Route, MessageCircle, Info } from "lucide-react";
import { cars } from "@/data/cars";
import { ORIGIN, CAB_ROUTES } from "@/data/geo";
import { Select } from "@/components/ui";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { storeLead } from "@/lib/leads";
import TripMap from "@/components/TripMap";

/**
 * Plan-and-enquire tool: pick a destination + vehicle, see the real road
 * distance and drive time on the map, then request a live quote. No fixed
 * fares are shown — rates vary with availability and season, confirmed on
 * the quote.
 */
export default function FareCalculator() {
  const [routeName, setRouteName] = useState(CAB_ROUTES[0].name);
  const [carSlug, setCarSlug] = useState(cars[0]?.slug ?? "");
  const [roundTrip, setRoundTrip] = useState(false);

  const route = CAB_ROUTES.find((r) => r.name === routeName)!;
  const car = cars.find((c) => c.slug === carSlug)!;

  const km = useMemo(
    () => (roundTrip ? route.distanceKm * 2 : route.distanceKm),
    [route, roundTrip]
  );

  const requestQuote = () => {
    const message =
      `🚗 *Cab quote request* — Siliguri Holidays\n` +
      `Route: ${ORIGIN.name} → ${route.name}${roundTrip ? " (round trip)" : ""}\n` +
      `Vehicle: ${car.name} (${car.seats} seats)\n` +
      `Approx. distance: ~${km} km\n` +
      `Please share your best available rate.`;
    storeLead({
      enquiryType: "Cab quote",
      vehicle: car.name,
      route: `${ORIGIN.name} → ${route.name}${roundTrip ? " (round trip)" : ""}`,
      distance_km: String(km),
      message,
    });
    sendToWhatsApp(message);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Controls + result */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">Plan your route</h3>
        <p className="mt-1 text-sm text-slate-500">See the distance &amp; drive time, then get a live quote.</p>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Destination</span>
            <Select value={routeName} onChange={(e) => setRouteName(e.target.value)}>
              {CAB_ROUTES.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name} · {r.distanceKm} km
                </option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Vehicle</span>
            <Select value={carSlug} onChange={(e) => setCarSlug(e.target.value)}>
              {cars.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} · {c.seats} seats
                </option>
              ))}
            </Select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-600"
            />
            Round trip
          </label>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
          <div className="inline-flex items-center gap-1.5 text-slate-600">
            <Route aria-hidden size={15} className="text-brand-500" /> {km} km
          </div>
          <div className="inline-flex items-center gap-1.5 text-slate-600">
            <Clock aria-hidden size={15} className="text-brand-500" /> {route.hours}
            {roundTrip ? " each way" : ""}
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-900">
          <Info aria-hidden size={16} className="mt-0.5 shrink-0 text-brand-600" />
          <p>
            <span className="font-semibold">Rates vary</span> with season, vehicle availability and
            route conditions. We&apos;ll send your best price — no payment now.
          </p>
        </div>

        <button
          type="button"
          onClick={requestQuote}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5b]"
        >
          <MessageCircle aria-hidden size={17} />
          Get your live quote on WhatsApp
        </button>
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <TripMap
          origin={ORIGIN}
          points={CAB_ROUTES}
          selected={routeName}
          onSelect={setRouteName}
          lineLabel={`${route.distanceKm} km · ${route.hours} by road`}
          className="h-[320px] w-full lg:h-full"
        />
        <p className="flex items-center gap-1.5 bg-white px-4 py-2 text-xs text-slate-500">
          <MapPin aria-hidden size={13} className="text-accent-500" />
          <span>
            <span className="font-medium text-slate-700">Tap any pin</span> to plan that route · Siliguri →{" "}
            {routeName}. Map data © OpenStreetMap contributors.
          </span>
        </p>
      </div>
    </div>
  );
}
