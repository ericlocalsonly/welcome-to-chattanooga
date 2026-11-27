import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { getPlaces } from "@/lib/data";
import { CATEGORIES, CATEGORY_KEYS } from "@/lib/categories";
import type { CategoryKey } from "@/lib/types";

export const revalidate = 300;
export const metadata: Metadata = { title: "Things to Do in Chattanooga", description: "Family fun, outdoor adventures, the Walnut Street Bridge, the Tennessee Riverwalk, local shops, restaurants, and attractions." };

const GUIDES = [
  { href: "/kids", title: "With Kids", text: "Little Explorers. Big Adventures.", img: "/images/coolidge-park-carousel-sm.jpg" },
  { href: "/outdoors", title: "Outdoor Chattanooga", text: "Get outside. It's kind of our thing.", img: "/images/mountain-view-sm.jpg" },
  { href: "/outdoors/riverwalk", title: "Tennessee Riverwalk", text: "Miles of paved riverside path.", img: "/images/chattanooga-sign-sm.jpg" },
  { href: "/walnut-street-bridge", title: "Walnut Street Bridge", text: "Walk from Downtown to the Northshore.", img: "/images/walnut-street-bridge-sm.jpg" },
  { href: "/things-to-do?category=sports#browse", title: "Sports Teams & Venues", text: "Lookouts baseball, Chattanooga FC, Mocs games, and where they play.", img: "/images/finley-stadium-sm.jpg" },
  { href: "/events", title: "Events & Festivals", text: "What's happening around town.", img: "/images/rosss-landing-sm.jpg" },
  { href: "/shop-local", title: "Shop Local", text: "Take a little Chattanooga home.", img: "/brand/locals-only-logo-sm.png", contain: true },
];

export default async function ThingsToDo({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const active = CATEGORY_KEYS.includes(category as CategoryKey) ? (category as CategoryKey) : null;
  const places = await getPlaces();
  const list = active ? places.filter((p) => p.categories.includes(active)) : places.filter((p) => p.featured);

  return (
    <>
      <PageHero image={{ src: "/images/rosss-landing.jpg", alt: "Crowds, tents, and paddlers at a summer festival on the Ross's Landing riverfront" }} eyebrow="Things to do" title="Explore Chattanooga" subtitle="Guides for every kind of day — from toddler-friendly mornings to mountaintop sunsets." />
      <section className="container-page mt-12">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <li key={g.href}>
              <Link href={g.href} className="card group block overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt="" loading="lazy" className={`h-40 w-full ${g.contain ? "bg-white object-contain p-5" : "object-cover"}`} />
                <div className="p-5"><h2 className="text-xl font-semibold group-hover:underline">{g.title}</h2><p className="mt-1 text-sm text-charcoal-600">{g.text}</p></div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="container-page mt-16" aria-labelledby="browse">
        <SectionHeading id="browse" eyebrow="Browse" title={active ? CATEGORIES[active].label : "Local favorites"} />
        <nav aria-label="Browse by category" className="mb-6 flex flex-wrap gap-2">
          <Link href="/things-to-do" className={!active ? "chip-on" : "chip-off"} aria-current={!active ? "page" : undefined}>Featured</Link>
          {CATEGORY_KEYS.map((k) => (
            <Link key={k} href={`/things-to-do?category=${k}`} className={active === k ? "chip-on" : "chip-off"} aria-current={active === k ? "page" : undefined}>
              <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORIES[k].color }} />{CATEGORIES[k].label}
            </Link>
          ))}
        </nav>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <li key={p.id}>
              <Link href={`/places/${p.id}`} className="card block h-full p-5 transition hover:shadow-lg">
                <p className="text-xs font-medium text-charcoal-400">{p.categories.map((c) => CATEGORIES[c].label).join(" · ")}</p>
                <h3 className="mt-1 text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-charcoal-600">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
