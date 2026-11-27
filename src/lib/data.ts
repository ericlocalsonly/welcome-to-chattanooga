import "server-only";
import placesJson from "@data/places.json";
import neighborhoodsJson from "@data/neighborhoods.json";
import trailsJson from "@data/trails.json";
import eventsJson from "@data/events.json";
import { supabasePublic } from "./supabase/server";
import type { CityEvent, Neighborhood, Place, Trail } from "./types";

/**
 * Data access layer.
 * - When Supabase is configured, content comes from the database (editable in /admin).
 * - Otherwise it falls back to the bundled, verified seed files in /data.
 * Either way, inactive listings are never returned to the public site.
 */

type Row = Record<string, any>;

export function rowToPlace(r: Row): Place {
  return {
    id: r.id,
    name: r.name,
    categories: r.categories ?? [],
    neighborhoods: r.neighborhoods ?? [],
    description: r.description ?? "",
    address: r.address ?? "",
    lat: Number(r.lat),
    lng: Number(r.lng),
    coordsApproximate: r.coords_approximate ?? false,
    website: r.website || undefined,
    phone: r.phone || undefined,
    hours: r.hours || undefined,
    setting: r.setting || r.family?.setting || undefined,
    price: r.price || undefined,
    image: r.image || undefined,
    featured: r.featured ?? false,
    sponsor: r.sponsor ?? false,
    family: r.family || undefined,
    verification: {
      status: r.verification_status ?? "needs_review",
      lastVerified: r.last_verified ?? "",
      sources: r.sources ?? [],
      notes: r.verification_notes || undefined,
    },
    active: r.active ?? true,
  };
}

export function rowToEvent(r: Row): CityEvent {
  return {
    id: r.id,
    name: r.name,
    startsAt: r.starts_at,
    endsAt: r.ends_at || undefined,
    venue: r.venue,
    address: r.address,
    lat: r.lat ?? undefined,
    lng: r.lng ?? undefined,
    description: r.description,
    category: r.category,
    url: r.url,
    sourceUrl: r.source_url,
    isFree: r.is_free,
    status: r.status,
  };
}

async function fromDb<T>(table: string, map: (r: Row) => T, query?: (q: any) => any): Promise<T[] | null> {
  const sb = supabasePublic();
  if (!sb) return null;
  let q = sb.from(table).select("*");
  if (query) q = query(q);
  const { data, error } = await q;
  if (error) {
    console.error(`[data] ${table}:`, error.message);
    return null; // fall back to seed data rather than showing an empty guide
  }
  return (data as Row[]).map(map);
}

export async function getPlaces(): Promise<Place[]> {
  const db = await fromDb("places", rowToPlace, (q) => q.eq("active", true));
  const list = db ?? (placesJson as unknown as Place[]);
  return list.filter((p) => p.active !== false).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPlace(id: string) {
  return (await getPlaces()).find((p) => p.id === id) ?? null;
}

export async function getNeighborhoods(): Promise<Neighborhood[]> {
  const db = await fromDb("neighborhoods", (r) => ({ ...(r.data as Neighborhood), slug: r.slug }));
  return (db ?? (neighborhoodsJson as unknown as Neighborhood[])).sort((a, b) => a.order - b.order);
}

export async function getNeighborhood(slug: string) {
  return (await getNeighborhoods()).find((n) => n.slug === slug) ?? null;
}

export async function getTrails(): Promise<Trail[]> {
  const db = await fromDb("trails", (r) => ({ ...(r.data as Trail), id: r.id, active: r.active }));
  return (db ?? (trailsJson as unknown as Trail[])).filter((t) => t.active !== false);
}

/** Upcoming, published events only. Past events are hidden automatically. */
export async function getUpcomingEvents(now = new Date()): Promise<CityEvent[]> {
  const db = await fromDb("events", rowToEvent, (q) => q.eq("status", "published"));
  const list = db ?? (eventsJson as unknown as CityEvent[]);
  return list
    .filter((e) => e.status === "published")
    .filter((e) => new Date(e.endsAt ?? e.startsAt).getTime() >= now.getTime())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
