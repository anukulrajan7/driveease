"use client";

import { useMemo, useState } from "react";
import { MapPin, Clock, Route, MessageCircle } from "lucide-react";
import { cars, formatINR } from "@/data/cars";
import { ORIGIN, CAB_ROUTES } from "@/data/geo";
import { Select } from "@/components/ui";
import { sendToWhatsApp } from "@/lib/whatsapp";
import TripMap from "@/components/TripMap";

export default function FareCalculator() {
  const [routeName, setRouteName] = useState(CAB_ROUTES[0].name);
  const [carSlug, setCarSlug] = useState(cars[0]?.slug ?? "");
  const [roundTrip, setRoundTrip] = useState(false);

  const route = CAB_ROUTES.find((r) => r.name === routeName)!;
  const car = cars.find((c) => c.slug === carSlug)!;

  const { km, fare } = useMemo(() => {
    const distance = roundTrip ? route.distanceKm * 2 : route.distanceKm;
    return { km: distance, fare: distance * car.perKm };
  }, [route, car, roundTrip]);

  const book = () =>
    sendToWhatsApp(
      `🚗 *Fare enquiry* — Siliguri Holidays\n` +
        `Route: ${ORIGIN.name} → ${route.name}${roundTrip ? " (round trip)" : ""}\n` +
        `Car: ${car.name}\n` +
        `Distance: ~${km} km\n` +
        `Estimated fare: ${formatINR(fare)} + driver/permits as applicable\n` +
        `Please confirm availability.`
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* Controls + result */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">Distance &amp; fare calculator</h3>
        <p className="mt-1 text-sm text-slate-500">Live estimate from Siliguri — driver included.</p>

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
            <span className="mb-1 block text-sm font-medium text-slate-700">Car</span>
            <Select value={carSlug} onChange={(e) => setCarSlug(e.target.value)}>
              {cars.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} · {formatINR(c.perKm)}/km
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

        <div className="mt-3 rounded-xl bg-brand-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Estimated fare</p>
          <p className="mt-0.5 text-2xl font-bold text-slate-900">{formatINR(fare)}</p>
          <p className="text-xs text-slate-500">Indicative — fuel & permits confirmed on quote.</p>
        </div>

        <button
          type="button"
          onClick={book}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5b]"
        >
          <MessageCircle aria-hidden size={17} />
          Get this fare on WhatsApp
        </button>
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <TripMap origin={ORIGIN} points={CAB_ROUTES} selected={routeName} className="h-[320px] w-full lg:h-full" />
        <p className="flex items-center gap-1.5 bg-white px-4 py-2 text-xs text-slate-500">
          <MapPin aria-hidden size={13} className="text-accent-500" /> Siliguri → {routeName}. Map data ©
          OpenStreetMap contributors.
        </p>
      </div>
    </div>
  );
}
