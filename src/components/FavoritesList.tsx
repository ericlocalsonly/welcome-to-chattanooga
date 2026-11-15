"use client";
import Link from "next/link";
import { useFavorites, type FavKey } from "@/lib/favorites";
import { FavoriteButton } from "./ui/FavoriteButton";

export interface FavItem { key: FavKey; title: string; subtitle: string; href: string }

export function FavoritesList({ items }: { items: FavItem[] }) {
  const { list, ready } = useFavorites();
  if (!ready) return <div className="card h-40 animate-pulse" />;
  const saved = list.map((k) => items.find((i) => i.key === k)).filter(Boolean) as FavItem[];
  if (saved.length === 0)
    return (
      <div className="card p-8 text-center">
        <p className="font-serif text-2xl text-forest">Nothing saved yet</p>
        <p className="mt-2 text-charcoal-600">Tap the heart on any place, trail, or event to save it here. Favorites stay on this device — no account needed.</p>
        <Link href="/neighborhoods" className="btn-primary mt-5">Start exploring</Link>
      </div>
    );
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {saved.map((i) => (
        <li key={i.key} className="card flex items-center gap-4 p-4">
          <div className="min-w-0 flex-1">
            <Link href={i.href} className="font-serif text-lg text-forest hover:underline">{i.title}</Link>
            <p className="truncate text-sm text-charcoal-400">{i.subtitle}</p>
          </div>
          <FavoriteButton k={i.key} name={i.title} compact />
        </li>
      ))}
    </ul>
  );
}
