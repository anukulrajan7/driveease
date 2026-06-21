import { site } from "@/data/content";

/** The business WhatsApp number, digits only (country code + number). */
export const WHATSAPP_NUMBER = (site.contact.whatsapp ?? site.contact.phone).replace(/\D/g, "");

/** Build a wa.me deep link with a pre-filled message — bookings land in chat, no backend. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Open WhatsApp with the message in a new tab (client only). */
export function sendToWhatsApp(message: string): void {
  if (typeof window !== "undefined") {
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  }
}
