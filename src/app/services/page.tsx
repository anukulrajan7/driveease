import type { Metadata } from "next";
import { Clock, MapPin, ShieldCheck } from "lucide-react";
import ServicesGrid from "@/components/ServicesGrid";
import ServiceLeadForm from "@/components/ServiceLeadForm";

export const metadata: Metadata = {
  title: "Our Services — Car Rental, Transfers, Hotels & Holidays",
  description:
    "Everything for travel in and around Siliguri: car rental & cabs, corporate & wedding fleet, hotel booking with taxi, airport & station transfers, and full holiday planning. Doorstep pickup, 24×7 support.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 md:pb-24">
      <p className="text-xs font-bold uppercase tracking-widest text-accent-600">All in one place</p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Our services</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Start with a car, then let us handle the rest — corporate &amp; wedding fleets, hotels,
        airport and station transfers, and full holiday planning. One team, from your doorstep to
        your destination.
      </p>

      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
        <li className="inline-flex items-center gap-1.5"><Clock aria-hidden size={16} className="text-brand-600" /> 24×7 support</li>
        <li className="inline-flex items-center gap-1.5"><MapPin aria-hidden size={16} className="text-brand-600" /> Doorstep pickup</li>
        <li className="inline-flex items-center gap-1.5"><ShieldCheck aria-hidden size={16} className="text-brand-600" /> No payment now</li>
      </ul>

      <div className="mt-10">
        <ServicesGrid />
      </div>

      {/* Quick enquiry for any service */}
      <section className="mt-14 grid gap-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:grid-cols-[1fr_440px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Tell us what you need</p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">One enquiry, any service</h2>
          <p className="mt-2 max-w-md text-slate-600">
            Not sure which to pick? Fill this in and we&apos;ll take it from there — cars, hotels,
            transfers or a full holiday. Your details reach our team instantly, and we confirm on
            WhatsApp or a call.
          </p>
        </div>
        <ServiceLeadForm />
      </section>
    </div>
  );
}
