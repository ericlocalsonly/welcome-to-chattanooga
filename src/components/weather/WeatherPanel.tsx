"use client";
import Link from "next/link";
import { AlertTriangle, Droplets, Wind, RefreshCw } from "lucide-react";
import { useUnit, useWeather } from "./useWeather";
import { WxGlyph } from "./WxGlyph";
import { fToC, greatDayFor } from "@/lib/weather";
import { formatDate } from "@/lib/utils";

export function WeatherPanel() {
  const { data, stale, loading, error, reload } = useWeather();
  const [unit, setUnit] = useUnit();
  const t = (f: number | null) => (f == null ? "—" : unit === "F" ? `${f}°` : `${fToC(f)}°`);

  if (loading && !data) return <div className="card h-80 animate-pulse" aria-label="Loading forecast" />;
  if (!data)
    return (
      <div role="alert" className="card p-8">
        <p className="font-serif text-2xl text-forest">The forecast is taking a breather.</p>
        <p className="mt-2 text-charcoal-600">We couldn't reach the National Weather Service just now, and there's no saved forecast on this device yet.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-primary" onClick={reload}><RefreshCw aria-hidden className="h-4 w-4" />Try again</button>
          <a className="btn-ghost" href="https://forecast.weather.gov/MapClick.php?lat=35.0456&lon=-85.3097" target="_blank" rel="noopener noreferrer">Open weather.gov</a>
        </div>
      </div>
    );

  const s = greatDayFor(data);
  return (
    <div className="space-y-6">
      {(stale || error) && (
        <p role="status" className="rounded-2xl bg-terracotta-50 p-4 text-sm">
          We couldn't reach the National Weather Service. Showing the last forecast saved on this device from <strong>{formatDate(data.fetchedAt, { dateStyle: "medium", timeStyle: "short" })}</strong>.{" "}
          <button className="font-semibold underline" onClick={reload}>Try again</button>
        </p>
      )}
      {data.alerts.length > 0 && (
        <section id="alerts" aria-label="Weather alerts" className="space-y-3">
          {data.alerts.map((a) => (
            <details key={a.id} className="rounded-2xl border-2 border-terracotta bg-white p-4">
              <summary className="flex cursor-pointer items-start gap-2 font-semibold text-terracotta-700"><AlertTriangle aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />{a.event}: {a.headline}</summary>
              <p className="mt-2 whitespace-pre-line text-sm text-charcoal-600">{a.description}</p>
            </details>
          ))}
        </section>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="card p-6">
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">Right now in Chattanooga</p>
            <div role="group" aria-label="Temperature units" className="flex rounded-full bg-cream p-1 text-sm font-semibold">
              {(["F", "C"] as const).map((u) => (
                <button key={u} aria-pressed={unit === u} onClick={() => setUnit(u)} className={`h-9 w-11 rounded-full ${unit === u ? "bg-forest text-white" : "text-charcoal-600"}`}>°{u}</button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-5">
            <WxGlyph icon={data.current.icon} className="h-20 w-20 text-river" />
            <div>
              <p className="font-serif text-6xl text-forest">{t(data.current.tempF)}</p>
              <p className="text-lg text-charcoal-600">{data.current.text}</p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2"><Wind aria-hidden className="h-4 w-4 text-river" /><dt className="sr-only">Wind</dt><dd>{data.current.wind || "—"}</dd></div>
            <div className="flex items-center gap-2"><Droplets aria-hidden className="h-4 w-4 text-river" /><dt className="sr-only">Chance of rain today</dt><dd>{data.days[0]?.pop ?? 0}% chance of rain</dd></div>
          </dl>
          <p className="mt-4 text-xs text-charcoal-400">
            {data.current.source === "observation" && data.current.observedAt ? `Observed at Chattanooga Metropolitan Airport, ${formatDate(data.current.observedAt, { timeStyle: "short" })}. ` : "Current conditions from the latest forecast period. "}
            Forecast updated {formatDate(data.updated, { dateStyle: "medium", timeStyle: "short" })}.
          </p>
        </div>
        <div className="card bg-forest p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-cream/80">Great day for…</p>
          <p className="mt-3 font-serif text-3xl leading-snug text-white">{s.text}</p>
          <Link href={s.href} className="btn-light mt-6">{s.cta}</Link>
          <p className="mt-4 text-xs text-cream/75">Suggestions are based on the forecast only. Always check opening hours before you go.</p>
        </div>
      </div>
      <section aria-labelledby="sevenday">
        <h2 id="sevenday" className="mb-4 text-2xl font-semibold">7-day forecast</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {data.days.map((d) => (
            <li key={d.date} className="card flex flex-col p-4">
              <p className="font-semibold text-forest">{d.name}</p>
              <p className="text-xs text-charcoal-400">{formatDate(d.date, { month: "short", day: "numeric" })}</p>
              <WxGlyph icon={d.icon} className="my-3 h-10 w-10 text-river" />
              <p className="text-sm text-charcoal-600">{d.shortForecast}</p>
              <p className="mt-2 text-lg"><span className="font-semibold text-forest">{t(d.highF)}</span> <span className="text-charcoal-400">/ {t(d.lowF)}</span></p>
              <p className="mt-1 flex items-center gap-1 text-xs text-charcoal-600"><Droplets aria-hidden className="h-3 w-3" />{d.pop ?? 0}%</p>
              <p className="flex items-center gap-1 text-xs text-charcoal-600"><Wind aria-hidden className="h-3 w-3" />{d.wind}</p>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-xs text-charcoal-400">Source: <a className="underline" href="https://www.weather.gov/mrx/" target="_blank" rel="noopener noreferrer">National Weather Service</a> (api.weather.gov). Data refreshes about every 15 minutes.</p>
    </div>
  );
}
