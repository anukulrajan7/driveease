"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loadContact } from "@/lib/customer";
import { cars, getCarBySlug } from "@/data/cars";
import { Input, Select, Textarea } from "@/components/ui";
import CarCard from "@/components/CarCard";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { storeLead } from "@/lib/leads";

const TRIP_TYPES = [
  "Airport transfer",
  "Local sightseeing",
  "Round trip",
  "Multi-day road trip",
] as const;

/** The trips people actually ask for — tap one to pre-fill the form. */
const POPULAR_ROUTES: {
  label: string;
  pickup: string;
  drop: string;
  tripType: (typeof TRIP_TYPES)[number];
}[] = [
  { label: "Bagdogra → Gangtok", pickup: "Bagdogra Airport", drop: "Gangtok", tripType: "Round trip" },
  { label: "Siliguri → Darjeeling", pickup: "Siliguri", drop: "Darjeeling", tripType: "Round trip" },
  { label: "NJP → Pelling", pickup: "NJP Station", drop: "Pelling", tripType: "Round trip" },
  { label: "Bagdogra → Darjeeling", pickup: "Bagdogra Airport", drop: "Darjeeling", tripType: "Round trip" },
  { label: "Gangtok → Lachung", pickup: "Gangtok", drop: "Lachung", tripType: "Multi-day road trip" },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  car: string;
  tripType: (typeof TRIP_TYPES)[number];
  pickup: string;
  drop: string;
  date: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

export default function CarRentalForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    car: cars[0]?.slug ?? "",
    tripType: "Airport transfer",
    pickup: "Siliguri",
    drop: "",
    date: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill from a previous enquiry (client-only, after mount to avoid hydration mismatch).
  useEffect(() => {
    const saved = loadContact();
    if (saved.name || saved.phone || saved.email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((f) => ({
        ...f,
        name: f.name || saved.name || "",
        phone: f.phone || saved.phone || "",
        email: f.email || saved.email || "",
      }));
    }
  }, []);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const selectCar = (slug: string) => {
    set("car", slug);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyRoute = (route: (typeof POPULAR_ROUTES)[number]) => {
    setForm((f) => ({ ...f, pickup: route.pickup, drop: route.drop, tripType: route.tripType }));
    setErrors((e) => ({ ...e, pickup: undefined }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email address.";
    if (!/^[\d+\-() ]{8,15}$/.test(form.phone.trim())) next.phone = "Please enter a valid phone number.";
    if (!form.pickup.trim()) next.pickup = "Where should the driver pick you up?";
    if (!form.date) next.date = "Please choose a pickup date.";
    else if (form.date < minDate) next.date = "Pickup date must be in the future.";
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setSubmitting(true);

    const ref = `SH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const carName = getCarBySlug(form.car)?.name ?? form.car;
    const message =
      `🚗 *New car booking* — Siliguri Holidays\n` +
      `Ref: ${ref}\n` +
      `Name: ${form.name.trim()}\n` +
      `Phone: ${form.phone.trim()}\n` +
      `Email: ${form.email.trim()}\n` +
      `Car: ${carName}\n` +
      `Trip: ${form.tripType}\n` +
      `Route: ${form.pickup.trim()}${form.drop.trim() ? ` → ${form.drop.trim()}` : ""}\n` +
      `Pickup date: ${form.date}` +
      (form.message.trim() ? `\nNotes: ${form.message.trim()}` : "");
    storeLead({
      enquiryType: "Car rental",
      reference: ref,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      vehicle: carName,
      trip_type: form.tripType,
      route: `${form.pickup.trim()}${form.drop.trim() ? ` → ${form.drop.trim()}` : ""}`,
      date: form.date,
      message,
    });
    sendToWhatsApp(message);

    const params = new URLSearchParams({
      type: "car",
      ref,
      car: form.car,
      name: form.name.trim(),
      email: form.email.trim(),
      date: form.date,
      tripType: form.tripType,
      pickup: form.pickup.trim(),
      drop: form.drop.trim(),
    });
    router.push(`/confirmation?${params.toString()}`);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
      {/* Fleet picker */}
      <div>
        <h2 className="font-serif text-2xl font-bold">Choose your ride</h2>
        <p className="mt-1 text-slate-600">
          All cars come with a verified driver, fuel-on-quote, and 24×7 support. Tap “Book” to
          pre-fill your enquiry.
        </p>

        {/* One-tap popular routes — pre-fill the form with a trip people actually book. */}
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Popular routes</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {POPULAR_ROUTES.map((route) => (
              <button
                key={route.label}
                type="button"
                onClick={() => applyRoute(route)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
              >
                {route.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {cars.map((car) => (
            <CarCard key={car.slug} car={car} onBook={selectCar} selected={form.car === car.slug} />
          ))}
        </div>
      </div>

      {/* Enquiry form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="h-fit scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24"
      >
        <h2 className="text-xl font-bold">Book a car</h2>
        <p className="mt-1 text-sm text-slate-500">No payment now — we confirm within 24 hours.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="cf-name" className="mb-1 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <Input
              id="cf-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cf-phone" className="mb-1 block text-sm font-medium text-slate-700">
                Phone
              </label>
              <Input
                id="cf-phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                invalid={!!errors.phone}
              />
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="cf-email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="cf-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="cf-car" className="mb-1 block text-sm font-medium text-slate-700">
              Car
            </label>
            <Select id="cf-car" value={form.car} onChange={(e) => set("car", e.target.value)}>
              {cars.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} · {c.type} ({c.seats} seats)
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="cf-trip" className="mb-1 block text-sm font-medium text-slate-700">
              Trip type
            </label>
            <Select
              id="cf-trip"
              value={form.tripType}
              onChange={(e) => set("tripType", e.target.value as FormState["tripType"])}
            >
              {TRIP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cf-pickup" className="mb-1 block text-sm font-medium text-slate-700">
                Pickup
              </label>
              <Input
                id="cf-pickup"
                type="text"
                value={form.pickup}
                onChange={(e) => set("pickup", e.target.value)}
                invalid={!!errors.pickup}
              />
              {errors.pickup && <p className="mt-1 text-xs text-rose-600">{errors.pickup}</p>}
            </div>
            <div>
              <label htmlFor="cf-drop" className="mb-1 block text-sm font-medium text-slate-700">
                Drop <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <Input
                id="cf-drop"
                type="text"
                placeholder="e.g. Gangtok"
                value={form.drop}
                onChange={(e) => set("drop", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="cf-date" className="mb-1 block text-sm font-medium text-slate-700">
              Pickup date
            </label>
            <Input
              id="cf-date"
              type="date"
              min={minDate}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              invalid={!!errors.date}
            />
            {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="cf-message" className="mb-1 block text-sm font-medium text-slate-700">
              Notes <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <Textarea
              id="cf-message"
              rows={2}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder="Flight number, child seat, luggage…"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-xl bg-accent-500 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Request this car"}
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">
          🔒 No payment now · Free cancellation up to 24 hrs before pickup
        </p>
      </form>
    </div>
  );
}
