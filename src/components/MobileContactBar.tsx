import { Phone, MessageCircle } from "lucide-react";
import { site } from "@/data/content";
import { waLink } from "@/lib/whatsapp";

/**
 * Fixed bottom bar on phones: one-tap Call + WhatsApp. Tap-to-call is the #1
 * conversion action for a cab business, so it's always one thumb away.
 * Hidden on lg+ (desktop uses the floating WhatsApp button instead).
 */
export default function MobileContactBar() {
  const tel = `tel:${site.contact.phone.replace(/\s/g, "")}`;
  const wa = waLink("Hi Siliguri Holidays! I'd like to book a cab / ask about a trip.");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex h-14 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
      <a
        href={tel}
        className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold text-brand-700"
      >
        <Phone aria-hidden size={18} /> Call now
      </a>
      <span aria-hidden className="my-2 w-px bg-slate-200" />
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 bg-[#25D366] py-3 text-sm font-semibold text-white"
      >
        <MessageCircle aria-hidden size={18} /> WhatsApp
      </a>
    </div>
  );
}
