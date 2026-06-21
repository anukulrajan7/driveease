import type { Metadata } from "next";
import { site } from "@/data/content";
import { Input, Textarea } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Siliguri Holidays team — by phone, email, or the contact form. We reply within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 md:pb-24">
      <h1 className="text-3xl font-serif font-bold text-slate-900 sm:text-4xl">Get in touch</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Whether you have a question about a specific tour, need help with permits, or just want to
        talk through options — we are here. We reply within 24 hours on every channel.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Contact method cards */}
        <div className="space-y-4">
          {/* Phone */}
          <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="shrink-0 text-brand-600" aria-hidden>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.71 3.37 2 2 0 0 1 3.69 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6.29 6.29l1.03-1.03a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Call us</h2>
              <p className="mt-1 text-slate-700">{site.contact.phone}</p>
              <p className="mt-0.5 text-sm text-slate-500">{site.contact.hours}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="shrink-0 text-brand-600" aria-hidden>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Email us</h2>
              <p className="mt-1 text-slate-700">{site.contact.email}</p>
              <p className="mt-0.5 text-sm text-slate-500">We reply within 24 hours</p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="shrink-0 text-brand-600" aria-hidden>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </span>
            <div>
              <h2 className="font-semibold text-slate-900">Support hours</h2>
              <p className="mt-1 text-slate-700">{site.contact.hours}</p>
              <p className="mt-0.5 text-sm text-slate-500">Including while you are on a trip</p>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Send us a message</h2>
          <p className="mt-1 text-sm text-slate-500">We reply within 24 hours.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700">
                Your name
              </label>
              <Input
                id="contact-name"
                type="text"
                placeholder="Priya Sharma"
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <Input
                id="contact-email"
                type="email"
                placeholder="priya@example.com"
                className="mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700">
                Message
              </label>
              <Textarea
                id="contact-message"
                rows={5}
                placeholder="Tell us about the trip you have in mind, or ask any question..."
                className="mt-1.5 resize-none"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-accent-500 py-3 font-semibold text-white hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
