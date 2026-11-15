import type { CityEvent, Neighborhood, Place, Trail } from "./types";
import { CATEGORIES } from "./categories";
import { normalize } from "./utils";

export interface SearchResult {
  type: "neighborhood" | "place" | "trail" | "event";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  score: number;
}

function score(q: string[], title: string, body: string) {
  const t = normalize(title);
  const b = normalize(body);
  let s = 0;
  for (const term of q) {
    if (t === term) s += 12;
    else if (t.startsWith(term)) s += 8;
    else if (t.includes(term)) s += 6;
    else if (b.includes(term)) s += 2;
    else return 0; // every term must match somewhere
  }
  return s;
}

/** Plain relevance search. No listing (including the sponsor) receives a boost. */
export function searchAll(
  query: string,
  data: { places: Place[]; neighborhoods: Neighborhood[]; trails: Trail[]; events: CityEvent[] },
): SearchResult[] {
  const q = normalize(query).split(/\s+/).filter(Boolean);
  if (!q.length) return [];
  const out: SearchResult[] = [];
  for (const n of data.neighborhoods) {
    const s = score(q, n.name, `${n.vibe} ${n.description} ${n.tagline}`);
    if (s) out.push({ type: "neighborhood", id: n.slug, title: n.name, subtitle: n.vibe, href: `/neighborhoods/${n.slug}`, score: s + 1 });
  }
  for (const p of data.places) {
    const cats = p.categories.map((c) => CATEGORIES[c].label).join(" ");
    const s = score(q, p.name, `${cats} ${p.description} ${p.address} ${p.neighborhoods.join(" ")}`);
    if (s) out.push({ type: "place", id: p.id, title: p.name, subtitle: `${cats} · ${p.address}`, href: `/places/${p.id}`, score: s });
  }
  for (const t of data.trails) {
    const s = score(q, t.name, `${t.activities.join(" ")} trail ${t.description} ${t.trailhead.name}`);
    if (s) out.push({ type: "trail", id: t.id, title: t.name, subtitle: `Trail · ${t.difficulty}`, href: `/outdoors#${t.id}`, score: s });
  }
  for (const e of data.events) {
    const s = score(q, e.name, `${e.venue} ${e.description} ${e.category}`);
    if (s) out.push({ type: "event", id: e.id, title: e.name, subtitle: `Event · ${e.venue}`, href: `/events#${e.id}`, score: s });
  }
  return out.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}
