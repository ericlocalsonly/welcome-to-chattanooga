export type WxIcon = "sun" | "moon" | "partly" | "cloud" | "rain" | "storm" | "snow" | "fog" | "wind";

export interface WeatherDay {
  name: string;
  date: string;
  highF: number | null;
  lowF: number | null;
  shortForecast: string;
  detailed: string;
  icon: WxIcon;
  pop: number | null;
  wind: string;
}
export interface WeatherAlert {
  id: string;
  event: string;
  headline: string;
  severity: string;
  ends: string | null;
  description: string;
}
export interface WeatherData {
  updated: string;
  fetchedAt: string;
  current: { tempF: number | null; text: string; icon: WxIcon; wind: string; observedAt: string | null; source: "observation" | "forecast" };
  days: WeatherDay[];
  alerts: WeatherAlert[];
}

export function iconFor(text: string, isDay = true): WxIcon {
  const t = text.toLowerCase();
  if (/thunder|t-storm|storm/.test(t)) return "storm";
  if (/snow|sleet|ice|flurr|freezing/.test(t)) return "snow";
  if (/rain|shower|drizzle/.test(t)) return "rain";
  if (/fog|haze|smoke|mist/.test(t)) return "fog";
  if (/wind|breez|gust/.test(t)) return "wind";
  if (/partly|mostly sunny|mostly clear|few clouds|scattered clouds/.test(t)) return "partly";
  if (/cloud|overcast/.test(t)) return "cloud";
  if (/sun|clear|fair/.test(t)) return isDay ? "sun" : "moon";
  return "partly";
}

export const fToC = (f: number) => Math.round(((f - 32) * 5) / 9);

export interface Suggestion { text: string; href: string; cta: string }

/** Informational only — never promises that an attraction is open. */
export function greatDayFor(d: WeatherData): Suggestion {
  const today = d.days[0];
  const t = d.current.tempF ?? today?.highF ?? 65;
  const text = `${d.current.text} ${today?.shortForecast ?? ""}`.toLowerCase();
  const pop = today?.pop ?? 0;
  if (d.alerts.some((a) => /extreme|severe/i.test(a.severity)))
    return { text: "A weather alert is in effect. Check the details below before heading out, and keep plans flexible.", href: "#alerts", cta: "See alerts" };
  if (/snow|ice|sleet|freezing/.test(text))
    return { text: "Wintry out there — a good day for museums, cozy cafés, and indoor fun.", href: "/kids?filter=rainy", cta: "Indoor ideas" };
  if (/thunder|storm|rain|shower/.test(text) || pop >= 50)
    return { text: "Rainy-day pick: check out the Tennessee Aquarium or Creative Discovery Museum.", href: "/kids?filter=rainy", cta: "Rainy-day ideas" };
  if (t >= 90) return { text: "A hot one. Get outside early or late, and find shade and breezes along the river.", href: "/outdoors/riverwalk", cta: "Riverwalk guide" };
  if (t < 45) return { text: "Brisk! Bundle up for a walk across the Walnut Street Bridge, then warm up on Frazier Avenue.", href: "/walnut-street-bridge", cta: "Walk the bridge" };
  if (/sunny|clear/.test(text)) return { text: "Perfect day to explore the Riverwalk.", href: "/outdoors/riverwalk", cta: "Riverwalk guide" };
  return { text: "Great weather for exploring the Northshore.", href: "/neighborhoods/northshore", cta: "Explore Northshore" };
}
