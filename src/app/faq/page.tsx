import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about booking, cancellation, permits, and what to expect on a Siliguri Holidays North East India trip.",
};

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  heading: string;
  items: FaqItem[];
}

const sections: FaqSection[] = [
  {
    heading: "Booking & payments",
    items: [
      {
        question: "How do I book a tour?",
        answer:
          "Find a tour you like, click 'Book now', fill in your travel dates and group size, and complete the checkout. You will receive a booking confirmation by email within a few minutes. If you need help choosing, call or email us first — we are happy to match you to the right trip.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major UPI apps (GPay, PhonePe, Paytm), credit and debit cards (Visa, Mastercard, RuPay), net banking, and no-cost EMI on select cards (3, 6, and 12-month tenures). All payments are processed over a secure, encrypted connection.",
      },
      {
        question: "Is a deposit required, or do I pay the full amount upfront?",
        answer:
          "For most tours you pay the full amount at the time of booking. For premium expeditions (7+ days), we offer a 30% deposit to confirm, with the balance due 14 days before departure. The tour page will show which option applies.",
      },
      {
        question: "Can I book for a group and pay separately?",
        answer:
          "Yes. Use the group booking option on the checkout page and enter each traveller's details. Each person can pay their own share via a separate payment link that we send to their email address.",
      },
    ],
  },
  {
    heading: "Cancellation & refunds",
    items: [
      {
        question: "What is your cancellation policy?",
        answer:
          "Cancellations made 7 or more days before the departure date receive a full refund. Cancellations within 72 hours of departure receive a 50% refund. Cancellations within 24 hours of departure are non-refundable. These timings are based on the departure date and time in Indian Standard Time.",
      },
      {
        question: "How do I cancel a booking?",
        answer:
          "Log in to your account, go to 'My bookings', and select 'Cancel booking'. You can also email us at our support address or call us. Refunds are processed to the original payment method within 5–7 business days after cancellation is confirmed.",
      },
      {
        question: "What happens if Siliguri Holidays cancels my tour?",
        answer:
          "In the rare event that we need to cancel — due to severe weather, road closures, or force majeure — you will receive a full refund or the option to rebook on an alternative date at no extra cost. We will notify you as early as possible.",
      },
      {
        question: "Can I reschedule instead of cancelling?",
        answer:
          "Yes. Rescheduling is free if requested 7 or more days before departure. Within 7 days, a rescheduling fee of ₹500 per person applies. Rescheduled trips must depart within 12 months of the original booking date.",
      },
    ],
  },
  {
    heading: "Permits & documents",
    items: [
      {
        question: "Which states require an Inner Line Permit (ILP)?",
        answer:
          "Arunachal Pradesh, Nagaland, Manipur, and Mizoram require an Inner Line Permit for Indian nationals. Foreign nationals need a Protected Area Permit (PAP) for Arunachal Pradesh and certain zones of Sikkim. ILP rules change periodically — we keep our permit knowledge current.",
      },
      {
        question: "Does Siliguri Holidays handle permit applications?",
        answer:
          "Yes, for all tours that require permits, we handle the ILP or PAP application on your behalf as part of your booking. You just need to provide a valid government-issued photo ID (Aadhaar, passport, or voter card) and a passport-sized photograph when prompted during checkout.",
      },
      {
        question: "What documents should I carry on the trip?",
        answer:
          "Carry the original of the ID you submitted at booking, plus one printed copy. We will send you the permit documents digitally before departure — print one copy of each. Your trip captain will hold the group permit set, but personal ID must be on you at all checkpoints.",
      },
      {
        question: "Can foreign nationals join your tours?",
        answer:
          "Yes. Most Siliguri Holidays tours are open to international travellers. We will check the applicable permit requirements for your nationality when you book and guide you through any additional paperwork. Please book at least 21 days in advance if you require a Protected Area Permit.",
      },
    ],
  },
  {
    heading: "On the trip",
    items: [
      {
        question: "How large are the groups?",
        answer:
          "Most tours have a maximum of 12 travellers. A few popular day-tours allow up to 16. We keep groups small so the host can give genuine attention to everyone and so our impact on the places we visit stays light.",
      },
      {
        question: "Who leads the trip?",
        answer:
          "Every tour has a dedicated trip captain — a local expert who is responsible for logistics, safety, and making sure you actually understand what you are looking at. The captain is your single point of contact from the start point to the end point.",
      },
      {
        question: "Is altitude sickness a concern on high-altitude tours?",
        answer:
          "Some tours (Tawang, North Sikkim, Dzukou Valley) reach altitudes above 3,000 m. We build acclimatisation days into these itineraries. Trip captains carry basic first-aid kits and altitude medication. If you have a pre-existing heart or lung condition, consult your doctor before booking a high-altitude trip.",
      },
      {
        question: "What if I have dietary restrictions?",
        answer:
          "Mention any dietary requirements in the 'Special requests' field at checkout. We accommodate vegetarian, vegan, and gluten-free needs on all tours. In very remote areas the ingredient variety narrows, but we will always ensure you have something nutritious and safe to eat.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 pb-16 sm:px-6 md:pb-24">
      <p className="text-xs font-bold uppercase tracking-widest text-accent-600">Help centre</p>
      <h1 className="mt-2 text-3xl font-serif font-bold text-slate-900 sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-3 text-slate-600">
        Can&apos;t find what you need? Call us at{" "}
        <span className="font-medium text-slate-800">+91 98765 43210</span> — we are available
        around the clock.
      </p>

      <div className="mt-12 space-y-12">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
              {section.heading}
            </h2>
            <div className="mt-4 divide-y divide-slate-100">
              {section.items.map((item) => (
                <details key={item.question} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-slate-800 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                    {item.question}
                    <span
                      className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45"
                      aria-hidden
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
