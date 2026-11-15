import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getNeighborhoods, getPlaces, getTrails, getUpcomingEvents } from "@/lib/data";
import { searchAll } from "@/lib/search";

export const metadata: Metadata = { title: "Search", robots: { index: false } };
const TYPE_LABEL = { neighborhood: "Neighborhood", place: "Place", trail: "Trail", event: "Event" } as const;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").slice(0, 100);
  const [places, neighborhoods, trails, events] = await Promise.all([getPlaces(), getNeighborhoods(), getTrails(), getUpcomingEvents()]);
  const results = q ? searchAll(q, { places, neighborhoods, trails, events }) : [];
  return (
    <div className="container-page mt-10 max-w-3xl">
      <h1 className="text-4xl font-semibold">Search the guide</h1>
      <form role="search" action="/search" className="relative mt-6">
        <label htmlFor="q" className="sr-only">Search neighborhoods, restaurants, shops, attractions, trails, and events</label>
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-400" />
        <input id="q" name="q" type="search" defaultValue={q} autoFocus placeholder="Try “ice cream”, “Southside”, or “trail”" className="input !min-h-[52px] pl-12 pr-28 text-lg" />
        <button className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 !min-h-[40px]">Search</button>
      </form>
      {q && (
        <section className="mt-8" aria-live="polite">
          <p className="text-sm text-charcoal-400">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>
          {results.length === 0 ? (
            <p className="card mt-4 p-6 text-charcoal-600">No matches. Try a broader word, or <Link className="underline" href="/neighborhoods">browse the neighborhoods</Link>.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {results.map((r) => (
                <li key={`${r.type}-${r.id}`}>
                  <Link href={r.href} className="card block p-4 transition hover:shadow-lg">
                    <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-700">{TYPE_LABEL[r.type]}</span>
                    <span className="mt-0.5 block font-serif text-xl text-forest">{r.title}</span>
                    <span className="block text-sm text-charcoal-400">{r.subtitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
