import Link from "next/link";
import { Phone, Mail, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { site } from "@/data/content";
import Logo from "./Logo";

const EXPLORE_LINKS = [
  { href: "/tours", label: "All Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/blog", label: "Travel Blog" },
  { href: "/offers", label: "Offers & Deals" },
  { href: "/tours?category=Wildlife", label: "Wildlife Safaris" },
  { href: "/tours?category=Mountains", label: "Mountain Trips" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQs" },
  { href: "/travel-info", label: "Travel info & permits" },
];

const TOP_DESTINATIONS = [
  { href: "/destinations/meghalaya", label: "Meghalaya" },
  { href: "/destinations/sikkim", label: "Sikkim" },
  { href: "/destinations/tawang", label: "Tawang" },
  { href: "/destinations/kaziranga", label: "Kaziranga" },
  { href: "/destinations/nagaland", label: "Nagaland" },
  { href: "/destinations/majuli", label: "Majuli" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zm-4 12.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zM17.5 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: "M22 12s0-3.4-.4-5a2.8 2.8 0 0 0-2-2C17.9 4.5 12 4.5 12 4.5s-5.9 0-7.6.5a2.8 2.8 0 0 0-2 2C2 8.6 2 12 2 12s0 3.4.4 5a2.8 2.8 0 0 0 2 2c1.7.5 7.6.5 7.6.5s5.9 0 7.6-.5a2.8 2.8 0 0 0 2-2c.4-1.6.4-5 .4-5zM10 15.5v-7l6 3.5-6 3.5z",
  },
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: "M4 4l7.2 9.6L4.4 20h2.6l5.4-5.1L16.8 20H20l-7.5-10L19.4 4h-2.6l-4.9 4.7L8.2 4H4z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "M14 8h3V5h-3a4 4 0 0 0-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9a1 1 0 0 1 1-1z",
  },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
            >
              <ChevronRight
                aria-hidden
                size={14}
                className="-ml-1 text-brand-500 transition-transform duration-200 group-hover:translate-x-0.5"
              />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      {/* Accent hairline */}
      <div aria-hidden className="h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-accent-500" />

      {/* Brand row */}
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="flex flex-col gap-6 border-b border-slate-800 pb-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Logo light />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">{site.description}</p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
              {site.awards.map((award) => (
                <li key={award} className="flex items-center gap-1.5">
                  <span aria-hidden className="text-accent-400">★</span> {award}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <div className="flex gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 text-slate-400 transition-all hover:-translate-y-0.5 hover:border-brand-500 hover:text-white"
                >
                  <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 text-sm text-slate-400 md:items-end">
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-white">
                <Phone aria-hidden size={14} className="text-brand-400" />
                {site.contact.phone}
              </a>
              <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail aria-hidden size={14} className="text-brand-400" />
                {site.contact.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <Clock aria-hidden size={14} className="text-brand-400" />
                {site.contact.hours}
              </span>
            </div>
          </div>
        </div>

        {/* Link columns + newsletter */}
        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Explore" links={EXPLORE_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Top destinations" links={TOP_DESTINATIONS} />

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Get travel deals
            </h3>
            <p className="mt-4 text-sm text-slate-400">
              Trip ideas, festival dates, and member-only offers. One email a month.
            </p>
            <form className="mt-4">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex overflow-hidden rounded-xl border border-slate-700 bg-slate-800 focus-within:border-brand-500">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="you@email.com"
                  className="h-11 w-full bg-transparent px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  className="shrink-0 bg-accent-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  Join
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">No spam, unsubscribe anytime.</p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:px-6 md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Demo project — bookings are not real.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <ShieldCheck aria-hidden size={14} className="text-emerald-500" />
            <span className="text-slate-400">Secure payments</span>
            <span aria-hidden className="text-slate-700">·</span>
            <span>Visa</span>
            <span aria-hidden className="text-slate-700">·</span>
            <span>Mastercard</span>
            <span aria-hidden className="text-slate-700">·</span>
            <span>UPI</span>
            <span aria-hidden className="text-slate-700">·</span>
            <span>RuPay</span>
            <span aria-hidden className="text-slate-700">·</span>
            <span>No-cost EMI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
