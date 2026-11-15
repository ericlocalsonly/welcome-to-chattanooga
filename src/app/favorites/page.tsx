import type { Metadata } from "next";
import { FavoritesList, type FavItem } from "@/components/FavoritesList";
import { getPlaces, getTrails, getUpcomingEvents } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = { title: "My Saved Places", robots: { index: false } };

export default async function FavoritesPage() {
  const [places, trails, events] = await Promise.all([getPlaces(), getTrails(), getUpcomingEvents()]);
  const items: FavItem[] = [
    ...places.map((p) => ({ key: `place:${p.id}` as const, title: p.name, subtitle: p.address, href: `/places/${p.id}` })),
    ...trails.map((t) => ({ key: `trail:${t.id}` as const, title: t.name, subtitle: `Trail · ${t.trailhead.name}`, href: `/outdoors#${t.id}` })),
    ...events.map((e) => ({ key: `event:${e.id}` as const, title: e.name, subtitle: `Event · ${e.venue}`, href: `/events#${e.id}` })),
  ];
  return (
    <div className="container-page mt-10">
      <p className="eyebrow">Favorites</p>
      <h1 className="mt-2 text-4xl font-semibold">My Saved Places</h1>
      <p className="mt-2 mb-8 text-charcoal-600">Saved on this device only. Clearing your browser data will remove them.</p>
      <FavoritesList items={items} />
    </div>
  );
}
