"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Phone, Headset, Ticket, Menu, X, ArrowRight, FileCheck } from "lucide-react";
import Logo from "./Logo";
import { site } from "@/data/content";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/blog", label: "Blog" },
  { href: "/offers", label: "Offers" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility top bar */}
      <div className="hidden bg-slate-900 text-slate-300 sm:block">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4 text-xs sm:px-6">
          <div className="flex items-center gap-5">
            <a
              href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Phone aria-hidden size={13} className="text-brand-400" />
              {site.contact.phone}
            </a>
            <span className="inline-flex items-center gap-1.5">
              <Headset aria-hidden size={13} className="text-brand-400" />
              {site.contact.hours}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/travel-info" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <FileCheck aria-hidden size={13} className="text-brand-400" />
              Permit checker
            </Link>
            <Link href="/offers" className="inline-flex items-center gap-1.5 font-semibold text-accent-400 transition-colors hover:text-accent-300">
              <Ticket aria-hidden size={13} />
              Monsoon sale — up to 25% off
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-slate-200/80 bg-white/90 shadow-[0_1px_12px_rgba(15,23,42,0.06)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="DriveEase home" className="rounded-lg focus-visible:ring-2 focus-visible:ring-brand-600">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/tours"
              className="group ml-3 inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent-500/30 transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/30"
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
              <li>
                <Link
                  href="/travel-info"
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  Travel info & permits
                </Link>
              </li>
              <li>
                <Link
                  href="/tours"
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-accent-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-accent-500/30"
                  onClick={() => setOpen(false)}
                >
                  Book a Tour
                  <ArrowRight aria-hidden size={15} />
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
