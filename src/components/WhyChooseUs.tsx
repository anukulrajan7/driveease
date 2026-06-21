import { ShieldCheck, BadgeIndianRupee, FileCheck, Headset, Mountain, CalendarClock } from "lucide-react";
import Reveal from "./Reveal";

const DEFAULT_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Verified local drivers",
    description:
      "Every driver is police-verified, English/Hindi/Nepali-speaking, and has years on these hill roads.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Transparent pricing",
    description:
      "Clear per-day and per-km rates with the driver included. No surprise charges at the checkpoint.",
  },
  {
    icon: FileCheck,
    title: "Permits sorted",
    description:
      "Sikkim, Nathu La and restricted-zone permits arranged for you as a registered operator.",
  },
  {
    icon: Headset,
    title: "24×7 support",
    description:
      "One WhatsApp number for your whole trip — pickups, changes, or a flat tyre at midnight.",
  },
  {
    icon: Mountain,
    title: "Hill-tested fleet",
    description:
      "Well-maintained, high-clearance vehicles serviced for Darjeeling, Sikkim and Dooars terrain.",
  },
  {
    icon: CalendarClock,
    title: "Flexible & free to cancel",
    description:
      "Book now, pay later. Free cancellation up to 24 hours before pickup — plans change, we get it.",
  },
];

export default function WhyChooseUs({
  eyebrow = "Why travellers pick us",
  title = "Why choose Siliguri Holidays",
  subtitle = "Local roots, honest pricing, and a team that picks up the phone.",
  items = DEFAULT_ITEMS,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: { icon: typeof ShieldCheck; title: string; description: string }[];
}) {
  return (
    <section className="bg-slate-50 py-14 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-600">{eyebrow}</p>
            <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">{title}</h2>
            <p className="mx-auto mt-2 max-w-2xl text-slate-600">{subtitle}</p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(i % 3) * 90}>
                <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon aria-hidden size={22} />
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
