"use client";

import { useEffect, useState } from "react";
import { loadContact } from "@/lib/customer";
import { MessageCircle, Phone, Clock, MapPin, Check } from "lucide-react";
import { Input, Select, Textarea } from "@/components/ui";
import { SERVICE_TITLES } from "@/data/services";
import { site } from "@/data/content";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { storeLead } from "@/lib/leads";

/**
 * Reusable, fillable enquiry form for any service. Stores the lead on the web
 * (Web3Forms) and opens WhatsApp. `defaultService` preselects the dropdown so a
 * service page arrives with the right option chosen.
 */
export default function ServiceLeadForm({ defaultService }: { defaultService?: string }) {
  const [service, setService] = useState(defaultService ?? SERVICE_TITLES[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Pre-fill from a previous enquiry, after mount (avoids hydration mismatch).
  useEffect(() => {
    const saved = loadContact();
    /* eslint-disable react-hooks/set-state-in-effect */
    setName((v) => v || saved.name || "");
    setPhone((v) => v || saved.phone || "");
    setEmail((v) => v || saved.email || "");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const phoneHref = `tel:${site.contact.phone.replace(/\s/g, "")}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[\d+\-() ]{8,15}$/.test(phone.trim())) return setError("Please enter a valid phone number.");
    setError(null);

    const body =
      `📋 *${service} enquiry* — Siliguri Holidays\n` +
      `Name: ${name.trim()}\n` +
      `Phone: ${phone.trim()}` +
      (email.trim() ? `\nEmail: ${email.trim()}` : "") +
      (date ? `\nPreferred date: ${date}` : "") +
      (message.trim() ? `\nDetails: ${message.trim()}` : "");

    storeLead({
      enquiryType: service,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      date: date || undefined,
      message: body,
    });
    sendToWhatsApp(body);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <Check aria-hidden size={28} />
        </span>
        <h4 className="mt-4 text-lg font-bold text-slate-900">Enquiry sent!</h4>
        <p className="mt-1 text-sm text-slate-600">
          We&apos;ve received your {service.toLowerCase()} request and opened WhatsApp so you can add
          anything else. Our team will be in touch shortly.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-5 text-sm font-semibold text-brand-700 hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Service</span>
        <Select value={service} onChange={(e) => setService(e.target.value)}>
          {SERVICE_TITLES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </label>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
          <Input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} invalid={!!error && name.trim().length < 2} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Phone</span>
          <Input type="tel" autoComplete="tel" placeholder="+91 9XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} invalid={!!error && !/^[\d+\-() ]{8,15}$/.test(phone.trim())} />
        </label>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email <span className="font-normal text-slate-400">(optional)</span></span>
          <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Date <span className="font-normal text-slate-400">(optional)</span></span>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1 block text-sm font-medium text-slate-700">Details <span className="font-normal text-slate-400">(optional)</span></span>
        <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Pickup, drop, dates, number of people, hotel preference…" />
      </label>

      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}

      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
      >
        <MessageCircle aria-hidden size={17} />
        Send enquiry
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5"><Clock aria-hidden size={13} className="text-brand-600" /> 24×7 support</span>
        <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden size={13} className="text-brand-600" /> Doorstep pickup</span>
        <a href={phoneHref} className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-brand-700">
          <Phone aria-hidden size={13} className="text-brand-600" /> {site.contact.phone}
        </a>
      </div>
    </form>
  );
}
