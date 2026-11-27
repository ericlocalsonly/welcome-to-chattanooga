import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { getNeighborhoods, getPlaces } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = { title: "Explore Chattanooga's Neighborhoods", description: "Northshore, Downtown, Southside, and Lookout Mountain — interactive maps of local shops, restaurants, parks, and attractions." };

export default async function NeighborhoodsPage() {
  const [hoods, places] = await Promise.all([getNeighborhoods(), getPlaces()]);
  return (
    <>
      <PageHero image={{ src: "/images/coolidge-park.jpg", alt: "Aerial view of Coolidge Park, the Walnut Street Bridge, and Northshore storefronts" }} eyebrow="Neighborhood explorer" title="Explore Chattanooga's Neighborhoods" subtitle="Each district has its own personality. Pick one, open the map, and start wandering." />
      <section className="container-page mt-12">
        <ul className="grid gap-6 md:grid-cols-2">
          {hoods.map((n) => {
            const count = places.filter((p) => p.neighborhoods.includes(n.slug)).length;
            return (
              <li key={n.slug}>
                <Link href={`/neighborhoods/${n.slug}`} className="card group grid h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[200px_1fr]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={n.hero.src.replace(/\.(jpg|png)$/, "-sm.$1")} alt={n.hero.alt} loading="lazy" className="h-48 w-full object-cover sm:h-full" />
                  <div className="p-6">
                    <p className="eyebrow">{n.vibe}</p>
                    <h2 className="mt-2 text-3xl font-semibold group-hover:underline">{n.name}</h2>
                    <p className="mt-2 text-charcoal-600">{n.tagline}</p>
                    <p className="mt-4 text-sm font-semibold text-river-700">{count} places on the map →</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
