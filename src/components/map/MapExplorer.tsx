"use client";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { LocateFixed, Route, Search, MapPin } from "lucide-react";
import type { CategoryKey, Place, WalkingRoute } from "@/lib/types";
import { CATEGORIES, CATEGORY_KEYS } from "@/lib/categories";
import { cn, normalize } from "@/lib/utils";
import { PlaceDetails } from "../PlaceDetails";
import { MapLegend } from "./MapLegend";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center rounded-3xl bg-cream-200 text-sm text-charcoal-400">Loading map…</div>,
});

function miles(a: [number, number], b: [number, number]) {
  const R = 3958.8, toR = (d: number) => (d * Math.PI) / 180;
  const dLat = toR(b[0] - a[0]), dLng = toR(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a[0])) * Math.cos(toR(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function MapExplorer({
  places, center, zoom, boundary, boundaryLabel, route, title,
}: {
  places: Place[];
  center: [number, number];
  zoom: number;
  boundary?: [number, number][];
  boundaryLabel?: string;
  route?: WalkingRoute;
  title: string;
}) {
  const [cats, setCats] = useState<Set<CategoryKey>>(new Set());
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [me, setMe] = useState<[number, number] | null>(null);
  const [locMsg, setLocMsg] = useState<string>("");
  const detailsRef = useRef<HTMLDivElement>(null);

  const present = useMemo(() => CATEGORY_KEYS.filter((k) => places.some((p) => p.categories.includes(k))), [places]);
  const filtered = useMemo(() => {
    const terms = normalize(q).split(/\s+/).filter(Boolean);
    let list = places.filter((p) => (cats.size === 0 || p.categories.some((c) => cats.has(c))) && terms.every((t) => normalize(`${p.name} ${p.description} ${p.address}`).includes(t)));
    if (me) list = [...list].sort((a, b) => miles(me, [a.lat, a.lng]) - miles(me, [b.lat, b.lng]));
    return list;
  }, [places, cats, q, me]);
  const selected = places.find((p) => p.id === selectedId) ?? null;

  function toggleCat(k: CategoryKey) {
    setCats((s) => {
      const n = new Set(s);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });
  }
  function select(id: string) {
    setSelectedId(id);
    requestAnimationFrame(() => detailsRef.current?.focus({ preventScroll: true }));
    if (window.matchMedia("(max-width: 1023px)").matches) detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function locate() {
    if (!("geolocation" in navigator)) return setLocMsg("Location isn't available in this browser.");
    setLocMsg("Finding your location…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMe([pos.coords.latitude, pos.coords.longitude]);
        setLocMsg("Showing places nearest to you first. Your location stays on this device.");
      },
      () => setLocMsg("We couldn't get your location. You can keep browsing without it."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  return (
    <section aria-label={`${title} map and listings`} className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-sm">
          <span className="sr-only">Search listings</span>
          <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <input className="input pl-10" type="search" placeholder={`Search ${title}…`} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={locate} className="btn-ghost"><LocateFixed aria-hidden className="h-4 w-4" /> Use my location</button>
          {route && (
            <button type="button" onClick={() => setShowRoute((v) => !v)} aria-pressed={showRoute} className={showRoute ? "btn-accent" : "btn-ghost"}>
              <Route aria-hidden className="h-4 w-4" /> {showRoute ? "Hide" : "Show"} walking route
            </button>
          )}
        </div>
      </div>
      <fieldset>
        <legend className="sr-only">Filter by category</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={cats.size === 0 ? "chip-on" : "chip-off"} aria-pressed={cats.size === 0} onClick={() => setCats(new Set())}>All</button>
          {present.map((k) => (
            <button key={k} type="button" aria-pressed={cats.has(k)} onClick={() => toggleCat(k)} className={cats.has(k) ? "chip-on" : "chip-off"}>
              <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORIES[k].color }} />
              {CATEGORIES[k].label}
            </button>
          ))}
        </div>
      </fieldset>
      <p className="text-sm text-charcoal-400" aria-live="polite">{locMsg || `${filtered.length} of ${places.length} places shown.`}</p>

      {showRoute && route && (
        <div className="rounded-2xl bg-terracotta-50 p-4 text-sm text-charcoal">
          <p className="font-semibold text-terracotta-700">{route.name}</p>
          <p className="mt-1">{route.description}</p>
          <ol className="mt-2 list-inside list-decimal text-charcoal-600">
            {route.stops.map((s) => {
              const pl = places.find((p) => p.id === s);
              return <li key={s}>{pl ? <button type="button" className="underline" onClick={() => select(pl.id)}>{pl.name}</button> : s}</li>;
            })}
          </ol>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="relative h-[58vh] min-h-[340px] lg:h-[600px]">
          <LeafletMap
            ariaLabel={`Interactive map of ${title}. Use the list below the map for an accessible alternative.`}
            center={center}
            zoom={zoom}
            boundary={boundary}
            boundaryLabel={boundaryLabel}
            places={filtered}
            selectedId={selectedId}
            onSelect={select}
            route={showRoute ? route?.path : null}
            routeLabel={route?.name}
            userLocation={me}
          />
        </div>
        <div ref={detailsRef} tabIndex={-1} className="outline-none lg:max-h-[600px] lg:overflow-y-auto" aria-live="polite">
          {selected ? (
            <PlaceDetails place={selected} onClose={() => setSelectedId(null)} />
          ) : (
            <div className="card p-6">
              <MapPin aria-hidden className="h-6 w-6 text-terracotta" />
              <p className="mt-3 font-serif text-xl text-forest">Tap a pin to see details</p>
              <p className="mt-2 text-sm text-charcoal-600">Or pick any place from the list below. Save favorites to build your own plan — no account needed.</p>
              <div className="mt-5"><MapLegend keys={present} /></div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xl font-semibold">All places{q || cats.size ? " matching your filters" : ""}</h3>
        {filtered.length === 0 ? (
          <p className="card p-6 text-charcoal-600">No places match those filters yet. Try clearing a filter or searching for something else.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => select(p.id)}
                  className={cn("card flex h-full w-full flex-col items-start p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg", p.id === selectedId && "ring-2 ring-terracotta")}
                >
                  <span className="flex items-center gap-2 text-xs font-medium text-charcoal-400">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORIES[p.categories[0]].color }} />
                    {p.categories.map((c) => CATEGORIES[c].label).join(" · ")}
                  </span>
                  <span className="mt-1 font-serif text-lg text-forest">{p.name}</span>
                  <span className="mt-1 line-clamp-2 text-sm text-charcoal-600">{p.description}</span>
                  <span className="mt-2 text-xs text-charcoal-400">{p.address}{me ? ` · ${miles(me, [p.lat, p.lng]).toFixed(1)} mi away` : ""}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
