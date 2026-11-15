"use client";
import { useCallback, useEffect, useState } from "react";
import type { WeatherData } from "@/lib/weather";

const LAST = "wtc:weather:last";
const UNIT = "wtc:weather:unit";

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [stale, setStale] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/weather");
      if (!r.ok) throw new Error(String(r.status));
      const d = (await r.json()) as WeatherData;
      setData(d);
      setStale(false);
      setError(false);
      try { localStorage.setItem(LAST, JSON.stringify(d)); } catch {}
    } catch {
      setError(true);
      try {
        const cached = localStorage.getItem(LAST);
        if (cached) { setData(JSON.parse(cached)); setStale(true); }
      } catch {}
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  return { data, stale, loading, error, reload: load };
}

export function useUnit() {
  const [unit, setUnit] = useState<"F" | "C">("F");
  useEffect(() => {
    try { if (localStorage.getItem(UNIT) === "C") setUnit("C"); } catch {}
  }, []);
  const set = (u: "F" | "C") => { setUnit(u); try { localStorage.setItem(UNIT, u); } catch {} };
  return [unit, set] as const;
}
