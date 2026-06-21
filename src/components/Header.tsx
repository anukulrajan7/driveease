"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Headset,
  Menu,
  X,
  ArrowRight,
  FileCheck,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Car,
  ChevronDown,
} from "lucide-react";
import Logo from "./Logo";
import { site } from "@/data/content";
import { waLink } from "@/lib/whatsapp";
import { SERVICES } from "@/data/services";
import { SERVICE_ICONS } from "@/lib/serviceIcons";

const WA = waLink("Hi Siliguri Holidays! I'd like to plan a trip / book a cab.");

/** Flat links; "Services" is a mega menu, so the bar stays uncluttered. */
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/travel-info", label: "Plan your trip" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [open, setOpen] = useState(false); // mobile drawer
  const [mega, setMega] = useState(false); // desktop services mega
  const [mobileServices, setMobileServices] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const servicesActive = pathname.startsWith("/services") || pathname.startsWith("/car-rental");

  // Close any open menu when the route changes (intentional reset on nav).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setOpen(false);
    setMega(false);
    setMobileServices(false);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Escape closes the mega menu.
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mega]);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(false), 120);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Utility top bar */}
      <div className="hidden bg-slate-900 text-slate-300 sm:block">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4 text-xs sm:px-6">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden size={13} className="text-brand-400" />
              Siliguri, West Bengal
            </span>
            <a
              href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone aria-hidden size={13} className="text-brand-400" />
              {site.contact.phone}
            </a>
            <span className="hidden items-center gap-1.5 lg:inline-flex">
              <Headset aria-hidden size={13} className="text-brand-400" />
              {site.contact.hours}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/travel-info" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <FileCheck aria-hidden size={13} className="text-brand-400" />
              Permit checker
            </Link>
            <span className="inline-flex items-center gap-1.5 font-semibold text-accent-400">
              <ShieldCheck aria-hidden size={13} />
              24×7 · doorstep pickup
            </span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-slate-200/80 bg-white/90 shadow-[0_1px_12px_rgba(15,23,42,0.06)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Siliguri Holidays home" className="rounded-lg focus-visible:ring-2 focus-visible:ring-brand-600">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            <Link
              href="/"
              aria-current={isActive("/") ? "page" : undefined}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive("/") ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/tours"
              aria-current={isActive("/tours") ? "page" : undefined}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive("/tours") ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
              }`}
            >
              Tours
            </Link>

            {/* Services mega menu */}
            <div className="relative" onMouseEnter={openMega} onMouseLeave={scheduleClose}>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={mega}
                onClick={() => setMega((v) => !v)}
                className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  servicesActive || mega ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
                }`}
              >
                Services
                <ChevronDown aria-hidden size={14} className={`transition-transform ${mega ? "rotate-180" : ""}`} />
              </button>

              {mega && (
                <div
                  className="absolute left-1/2 top-full z-50 mt-2 w-[640px] max-w-[92vw] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10"
                  role="menu"
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    {SERVICES.map((s) => {
                      const Icon = SERVICE_ICONS[s.iconKey];
                      const href = s.externalHref ?? `/services/${s.slug}`;
                      return (
                        <Link
                          key={s.slug}
                          href={href}
                          role="menuitem"
                          className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                            <Icon aria-hidden size={18} />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                              {s.title}
                            </span>
                            <span className="mt-0.5 block text-xs leading-snug text-slate-500 line-clamp-2">
                              {s.short}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href="/services"
                    className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    See all services & enquire
                    <ArrowRight aria-hidden size={15} />
                  </Link>
                </div>
              )}
            </div>

            {NAV_LINKS.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href) ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="ml-2 grid h-10 w-10 place-items-center rounded-full border border-emerald-500/30 text-[#25D366] transition-colors hover:bg-emerald-50"
            >
              <MessageCircle aria-hidden size={18} />
            </a>
            <Link
              href="/tours"
              className="group ml-1 inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent-500/30 transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/30"
            >
              Book a Tour
              <ArrowRight aria-hidden size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </nav>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden size={22} /> : <Menu aria-hidden size={22} />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 shadow-lg md:hidden" aria-label="Mobile">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(link.href) ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {/* Services accordion */}
              <li>
                <button
                  type="button"
                  aria-expanded={mobileServices}
                  onClick={() => setMobileServices((v) => !v)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    servicesActive ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Services
                  <ChevronDown aria-hidden size={16} className={`transition-transform ${mobileServices ? "rotate-180" : ""}`} />
                </button>
                {mobileServices && (
                  <ul className="ml-3 mt-1 space-y-0.5 border-l border-slate-200 pl-3">
                    {SERVICES.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={s.externalHref ?? `/services/${s.slug}`}
                          className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-700"
                          onClick={() => setOpen(false)}
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/tours"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-accent-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-accent-500/30"
                  onClick={() => setOpen(false)}
                >
                  Book a Tour
                  <ArrowRight aria-hidden size={15} />
                </Link>
                <Link
                  href="/car-rental#book"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-brand-600/30"
                  onClick={() => setOpen(false)}
                >
                  <Car aria-hidden size={15} />
                  Book a Car
                </Link>
              </li>
              <li className="mt-2 grid grid-cols-2 gap-2 text-sm font-medium">
                <a
                  href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-3 text-slate-700"
                  onClick={() => setOpen(false)}
                >
                  <Phone aria-hidden size={15} className="text-brand-600" />
                  Call
                </a>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 px-4 py-3 text-[#1ebe5b]"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle aria-hidden size={15} />
                  WhatsApp
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
