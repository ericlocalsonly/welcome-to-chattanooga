export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://thelocalguidechattanooga.com").replace(/\/$/, "");
export const TZ = "America/New_York";

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function googleDirections(address: string, name?: string) {
  const q = encodeURIComponent(name ? `${name}, ${address}` : address);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}
export function appleDirections(address: string, name?: string) {
  const q = encodeURIComponent(name ? `${name}, ${address}` : address);
  return `https://maps.apple.com/?daddr=${q}`;
}
export function telHref(phone: string) {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}
export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) {
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...opts }).format(new Date(iso));
}
export function normalize(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ");
}
