"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { cars, getCarBySlug } from "@/data/cars";
import { Input, Select } from "@/components/ui";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { storeLead } from "@/lib/leads";
import { loadContact } from "@/lib/customer";

const TRIP_TYPES = ["Airport transfer", "Local sightseeing", "Round trip", "Multi-day road trip"] as const;

/** Compact, no-backend car booking — fires a pre-filled WhatsApp message to the business number. */
export default function QuickCarBook() {
  const [car, setCar] = useState(cars[0]?.slug ?? "");
  const [tripType, setTripType] = useState<(typeof TRIP_TYPES)[number]>("Airport transfer");
  const [pickup, setPickup] = useState("Siliguri");
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Pre-fill phone from a previous enquiry. localStorage is client-only, so we
  // read it after mount (a lazy initializer would cause a hydration mismatch).
  useEffect(() => {
    const saved = loadContact();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved.phone) setPhone((v) => v || saved.phone || "");
  }, []);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[\d+\-() ]{8,15}$/.test(phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!date) {
      setError("Please pick a date.");
      return;
    }
    setError(null);
    const carName = getCarBySlug(car)?.name ?? car;
    const message =
      `🚗 *Quick car booking* — Siliguri Holidays\n` +
      `Car: ${carName}\n` +
      `Trip: ${tripType}\n` +
      `Pickup: ${pickup.trim()}\n` +
      `Date: ${date}\n` +
      `Phone: ${phone.trim()}`;
    storeLead({
      enquiryType: "Car rental",
      phone: phone.trim(),
      vehicle: carName,
      trip_type: tripType,
      pickup: pickup.trim(),
      date,
      message,
    });
    sendToWhatsApp(message);
  };

  return (
    <form
      onSubmit={submit}
      className="w-full rounded-2xl border border-white/15 bg-white/95 p-5 shadow-2xl shadow-slate-900/30 backdrop-blur sm:p-6"
    >
      <p className="text-sm font-bold text-slate-900">Book a car in 30 seconds</p>
      <p className="mt-0.5 text-xs text-slate-500">No payment now — we confirm on WhatsApp.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Car</span>
          <Select value={car} onChange={(e) => setCar(e.target.value)}>
            {cars.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} · {c.seats} seats
              </option>
            ))}
          </Select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Trip type</span>
          <Select value={tripType} onChange={(e) => setTripType(e.target.value as typeof tripType)}>
            {TRIP_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Pickup</span>
          <Input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600">Date</span>
          <Input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-slate-600">Your phone</span>
          <Input
            type="tel"
            autoComplete="tel"
            placeholder="+91 9XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            invalid={!!error}
          />
        </label>
      </div>

      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}

      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5b]"
      >
        <MessageCircle aria-hidden size={17} />
        Book on WhatsApp
      </button>
    </form>
  );
}
