import { site } from "@/config/site";

/** wa.me link with a prefilled message. */
export function whatsappLink(message: string) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const helloMessage = `Hello ${site.name}, I'd like to plan a safari.`;

/** Current time in the Mara (EAT, UTC+3), HH:MM. */
export function maraTime(d = new Date()) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Nairobi" }).format(d);
}
