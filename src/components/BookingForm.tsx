"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tour } from "@/data/tours";
import { Input, Select, Textarea } from "@/components/ui";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { storeLead } from "@/lib/leads";
import { loadContact } from "@/lib/customer";

interface FormState {
  name: string;
  email: string;
  phone: string;
  date: string;
  travelers: number;
  requests: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i <= Math.round(rating) ? "text-accent-500" : "text-slate-300"}
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function BookingForm({
  tour,
  initialDate,
  initialTravelers,
}: {
  tour: Tour;
  initialDate?: string;
  initialTravelers?: number;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    date: initialDate ?? "",
    travelers: Math.min(Math.max(initialTravelers ?? 2, 1), tour.maxGroupSize),
    requests: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill from a previous enquiry, after mount (avoids hydration mismatch).
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

  const validate = (): Errors => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email address.";
    if (!/^[\d+\-() ]{8,15}$/.test(form.phone.trim())) next.phone = "Please enter a valid phone number.";
    if (!form.date) next.date = "Please choose a departure date.";
    else if (form.date < minDate) next.date = "Departure date must be in the future.";
    if (form.travelers < 1 || form.travelers > tour.maxGroupSize)
      next.travelers = `Travellers must be between 1 and ${tour.maxGroupSize}.`;
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
    const message =
      `🧭 *New tour enquiry* — Siliguri Holidays\n` +
      `Ref: ${ref}\n` +
      `Tour: ${tour.title}\n` +
      `Name: ${form.name.trim()}\n` +
      `Phone: ${form.phone.trim()}\n` +
      `Email: ${form.email.trim()}\n` +
      `Departure: ${form.date}\n` +
      `Travellers: ${form.travelers}` +
      (form.requests.trim() ? `\nRequests: ${form.requests.trim()}` : "");
    storeLead({
      enquiryType: "Tour",
      reference: ref,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      tour: tour.title,
      date: form.date,
      travelers: String(form.travelers),
      message,
    });
    sendToWhatsApp(message);

    const params = new URLSearchParams({
      ref,
      tour: tour.slug,
      name: form.name.trim(),
      email: form.email.trim(),
      date: form.date,
      travelers: String(form.travelers),
    });
    router.push(`/confirmation?${params.toString()}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Traveller details</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="bf-name" className="mb-1 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <Input
              id="bf-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              invalid={!!errors.name}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="bf-email" className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              id="bf-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              invalid={!!errors.email}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="bf-phone" className="mb-1 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <Input
              id="bf-phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              invalid={!!errors.phone}
            />
            {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="bf-date" className="mb-1 block text-sm font-medium text-slate-700">
              Departure date
            </label>
            <Input
              id="bf-date"
              type="date"
              min={minDate}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              invalid={!!errors.date}
            />
            {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="bf-travelers" className="mb-1 block text-sm font-medium text-slate-700">
              Travellers
            </label>
            <Select
              id="bf-travelers"
              value={form.travelers}
              onChange={(e) => set("travelers", Number(e.target.value))}
              invalid={!!errors.travelers}
            >
              {Array.from({ length: tour.maxGroupSize }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "traveller" : "travellers"}
                </option>
              ))}
            </Select>
            {errors.travelers && <p className="mt-1 text-xs text-rose-600">{errors.travelers}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="bf-requests" className="mb-1 block text-sm font-medium text-slate-700">
              Special requests <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <Textarea
              id="bf-requests"
              rows={3}
              value={form.requests}
              onChange={(e) => set("requests", e.target.value)}
              placeholder="Dietary needs, accessibility, celebrations…"
            />
          </div>
        </div>

        {/* Trust cluster */}
        <div className="mt-6 flex flex-col gap-2 rounded-xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <StarRating rating={tour.rating} />
            <span className="text-sm text-slate-700">
              <strong>{tour.rating}</strong>{" "}
              <span className="text-slate-500">({tour.reviewsCount} reviews)</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            🔒 No payment now &middot; Free cancellation up to 7 days
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send Booking Request"}
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">
          We&apos;ll get back to you within 24 hours with a tailored quote. No payment is taken now.
        </p>
      </form>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-bold">Your request</h2>
        <div className="mt-3 flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tour.image}
            alt=""
            className="h-16 w-20 shrink-0 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900">{tour.title}</p>
            <p className="text-sm text-slate-500">
              {tour.destination} · {tour.durationDays} days
            </p>
          </div>
        </div>

        <dl className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-600">Travellers</dt>
            <dd className="font-medium text-slate-900">
              {form.travelers} {form.travelers === 1 ? "traveller" : "travellers"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Duration</dt>
            <dd className="font-medium text-slate-900">{tour.durationDays} days</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-600">Group size</dt>
            <dd className="font-medium text-slate-900">max {tour.maxGroupSize}</dd>
          </div>
        </dl>

        <p className="mt-5 rounded-xl bg-brand-50 px-4 py-3 text-xs leading-relaxed text-brand-800">
          Our team will confirm availability and send you a personalised quote — no upfront payment required.
        </p>
      </aside>
    </div>
  );
}
