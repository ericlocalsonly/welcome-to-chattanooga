"use client";
import Link from "next/link";
import { useWeather } from "./useWeather";
import { WxGlyph } from "./WxGlyph";
import { greatDayFor } from "@/lib/weather";
import { formatDate } from "@/lib/utils";

/** Compact homepage widget. */
export function WeatherWidget() {
  const { data, stale, loading } = useWeather();
  if (loading && !data) return <div className="card h-[132px] animate-pulse p-5" aria-label="Loading weather" />;
  if (!data) {
    return (
      <div className="card p-5 text-sm text-charcoal-600">
        <p className="font-semibold text-forest">Weather is taking a break</p>
        <p className="mt-1">We couldn't reach the National Weather Service. <Link className="underline" href="/weather">Try the forecast page</Link>.</p>
      </div>
    );
  }
  const s = greatDayFor(data);
  return (
    <Link href="/weather" className="card group block p-5 transition hover:shadow-lg">
      <div className="flex items-center gap-4">
        <WxGlyph icon={data.current.icon} className="h-12 w-12 text-river" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">Chattanooga now</p>
          <p className="font-serif text-4xl text-forest">{data.current.tempF ?? "—"}°<span className="text-xl">F</span></p>
        </div>
        <div className="ml-auto text-right text-sm text-charcoal-600">
          <p>{data.current.text}</p>
          {data.days[0] && <p>H {data.days[0].highF ?? "—"}° · L {data.days[0].lowF ?? "—"}°</p>}
        </div>
      </div>
      <p className="mt-3 border-t border-charcoal/10 pt-3 text-sm text-charcoal-600"><span className="font-semibold text-terracotta-700">Great day for… </span>{s.text}</p>
      {stale && <p className="mt-1 text-xs text-charcoal-400">Showing last forecast from {formatDate(data.fetchedAt, { dateStyle: "medium", timeStyle: "short" })}.</p>}
    </Link>
  );
}
