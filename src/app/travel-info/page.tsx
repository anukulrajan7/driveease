import type { Metadata } from "next";
import Link from "next/link";
import PermitChecker from "@/components/PermitChecker";

export const metadata: Metadata = {
  title: "Travel info & permits",
  description:
    "Permit requirements, altitude advice, connectivity tips, and seasonal guidance for North East India travel with DriveEase.",
};

export default function TravelInfoPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 pb-16 sm:px-6 md:pb-24">
      <p className="text-xs font-bold uppercase tracking-widest text-accent-600">
        Before you go
      </p>
      <h1 className="mt-2 text-3xl font-serif font-bold text-slate-900 sm:text-4xl">
        Travel info &amp; permits
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        North East India has its own entry rules, altitude realities, and connectivity quirks.
        Everything you need to know — before your bags are packed.
      </p>

      <div className="mt-10">
        <PermitChecker />
      </div>

      <div className="mt-12 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Altitude &amp; acclimatisation</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sela Pass (Arunachal) sits at 13,700 ft. North Sikkim routes cross 14,000 ft.
            Both are stunning — and both demand respect.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>✓</span>
              <span>
                <span className="font-medium">Acclimatisation nights are built in.</span> Dirang
                (before Sela) and Lachen (before Gurudongmar) are overnights in every relevant
                DriveEase itinerary — not add-ons.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>✓</span>
              <span>
                <span className="font-medium">Hydrate constantly.</span> At altitude, your body
                loses water faster. Aim for 3–4 litres a day from the moment you land.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>✓</span>
              <span>
                <span className="font-medium">Avoid alcohol for the first 48 hours.</span> It
                dehydrates you and blunts your body&apos;s response to thin air.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>✓</span>
              <span>
                <span className="font-medium">Tell your trip captain early.</span> Headache,
                nausea, or unusual fatigue are signals, not signs of weakness. Your captain
                carries altitude medication and will adjust the plan if needed.
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Connectivity &amp; cash</h2>
          <p className="mt-2 text-sm text-slate-500">
            Signal and ATMs are reliable in gateway cities. Plan ahead beyond them.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>✓</span>
              <span>
                <span className="font-medium">Jio and Airtel cover the most ground.</span> BSNL
                is the fallback in some border zones. Beyond the main towns — Tawang, Ziro,
                Mokokchung, Lachung — expect patchy or no signal.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>✓</span>
              <span>
                <span className="font-medium">Download offline maps before you leave.</span> Google
                Maps and Maps.me both work offline. Save your entire route the night before
                departure while on Wi-Fi.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>✓</span>
              <span>
                <span className="font-medium">Last reliable ATMs are in gateway towns.</span>{" "}
                Withdraw enough cash in Guwahati, Shillong, Gangtok, or Itanagar. Villages and
                smaller hill stations run on cash — UPI and cards are rarely accepted.
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">When to go</h2>
          <p className="mt-2 text-sm text-slate-500">
            North East India has three very different travel seasons.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>✓</span>
              <span>
                <span className="font-medium">October to April is the sweet spot</span> for most
                routes — clear skies, open mountain passes, and comfortable temperatures across
                Arunachal, Nagaland, Manipur, and Assam.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>✓</span>
              <span>
                <span className="font-medium">Monsoon (June–September)</span> transforms Meghalaya
                — living root bridges and Nohkalikai Falls are at their most dramatic. But the same
                rains make North Sikkim roads and Sela Pass genuinely dangerous; those tours pause
                for the season.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>✓</span>
              <span>
                <span className="font-medium">Early December = Hornbill Festival.</span> Ten days
                of Naga tribes, music, and morungs in Kisama village. Book at least 8 weeks ahead —
                accommodation across Kohima fills fast.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 rounded-2xl bg-brand-700 px-8 py-10 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to plan your trip?</h2>
        <p className="mt-2 text-brand-100">
          Browse our hand-crafted North East India tours — permits, acclimatisation halts, and local
          expertise included.
        </p>
        <Link
          href="/tours"
          className="mt-6 inline-block rounded-xl bg-accent-500 px-8 py-3 text-sm font-semibold text-white hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Browse all tours
        </Link>
      </div>
    </div>
  );
}
