import { NextResponse } from "next/server";
import { iconFor, type WeatherData, type WeatherDay } from "@/lib/weather";

// Downtown Chattanooga
const LAT = 35.0456;
const LON = -85.3097;
const STATION = "KCHA"; // Chattanooga Metropolitan Airport (Lovell Field)
const UA = `WelcomeToChattanooga/1.0 (${process.env.NWS_CONTACT_EMAIL || "contact@example.com"})`;

export const dynamic = "force-dynamic"; // upstream NWS calls are cached for 15 minutes via fetch()

async function nws(url: string) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/geo+json" }, next: { revalidate: 900 } });
  if (!r.ok) throw new Error(`NWS ${r.status} for ${url}`);
  return r.json();
}

const cToF = (c: number | null | undefined) => (c == null ? null : Math.round((c * 9) / 5 + 32));
const kmhToMph = (k: number | null | undefined) => (k == null ? null : Math.round(k * 0.621371));
const compass = (deg: number | null | undefined) => (deg == null ? "" : ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(deg / 45) % 8]);

export async function GET() {
  try {
    const points = await nws(`https://api.weather.gov/points/${LAT},${LON}`);
    const forecastUrl: string = points.properties.forecast;
    const [forecast, obs, alerts] = await Promise.all([
      nws(forecastUrl),
      nws(`https://api.weather.gov/stations/${STATION}/observations/latest`).catch(() => null),
      nws(`https://api.weather.gov/alerts/active?point=${LAT},${LON}`).catch(() => ({ features: [] })),
    ]);

    const periods: any[] = forecast.properties.periods ?? [];
    const days: WeatherDay[] = [];
    for (let i = 0; i < periods.length && days.length < 7; i++) {
      const p = periods[i];
      if (p.isDaytime) {
        const night = periods[i + 1] && !periods[i + 1].isDaytime ? periods[i + 1] : null;
        days.push({
          name: p.name,
          date: p.startTime,
          highF: p.temperatureUnit === "F" ? p.temperature : cToF(p.temperature),
          lowF: night ? (night.temperatureUnit === "F" ? night.temperature : cToF(night.temperature)) : null,
          shortForecast: p.shortForecast,
          detailed: p.detailedForecast,
          icon: iconFor(p.shortForecast, true),
          pop: Math.max(p.probabilityOfPrecipitation?.value ?? 0, night?.probabilityOfPrecipitation?.value ?? 0),
          wind: `${p.windDirection} ${p.windSpeed}`,
        });
        if (night) i++;
      } else if (i === 0) {
        days.push({
          name: p.name,
          date: p.startTime,
          highF: null,
          lowF: p.temperature,
          shortForecast: p.shortForecast,
          detailed: p.detailedForecast,
          icon: iconFor(p.shortForecast, false),
          pop: p.probabilityOfPrecipitation?.value ?? 0,
          wind: `${p.windDirection} ${p.windSpeed}`,
        });
      }
    }

    const o = obs?.properties;
    const obsTemp = cToF(o?.temperature?.value);
    const first = periods[0];
    const data: WeatherData = {
      updated: forecast.properties.updateTime ?? forecast.properties.updated ?? new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      current:
        obsTemp != null
          ? {
              tempF: obsTemp,
              text: o.textDescription || first?.shortForecast || "",
              icon: iconFor(o.textDescription || first?.shortForecast || "", first?.isDaytime ?? true),
              wind: o.windSpeed?.value != null ? `${compass(o.windDirection?.value)} ${kmhToMph(o.windSpeed.value)} mph`.trim() : "",
              observedAt: o.timestamp ?? null,
              source: "observation",
            }
          : {
              tempF: first?.temperature ?? null,
              text: first?.shortForecast ?? "",
              icon: iconFor(first?.shortForecast ?? "", first?.isDaytime ?? true),
              wind: first ? `${first.windDirection} ${first.windSpeed}` : "",
              observedAt: null,
              source: "forecast",
            },
      days,
      alerts: (alerts.features ?? []).map((f: any) => ({
        id: f.id,
        event: f.properties.event,
        headline: f.properties.headline,
        severity: f.properties.severity,
        ends: f.properties.ends ?? f.properties.expires ?? null,
        description: f.properties.description,
      })),
    };
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
  } catch (err) {
    console.error("[weather]", err);
    return NextResponse.json({ error: "The National Weather Service is temporarily unavailable." }, { status: 503 });
  }
}
