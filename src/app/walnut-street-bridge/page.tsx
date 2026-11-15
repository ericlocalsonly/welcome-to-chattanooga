import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Navigation } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { StaticPinsMap } from "@/components/map/StaticPinsMap";
import { ShareButton } from "@/components/ui/ShareButton";
import { getPlaces } from "@/lib/data";
import { googleDirections } from "@/lib/utils";

export const revalidate = 300;
export const metadata: Metadata = { title: "Walnut Street Bridge — The Bridge That Connects More Than Two Shores", description: "History, facts, photo spots, and a walking route across Chattanooga's 2,376-foot pedestrian bridge between Downtown and the Northshore." };

const SOUTH: [number, number] = [35.0590, -85.3069];
const NORTH: [number, number] = [35.0646, -85.3066];

const TIMELINE = [
  { y: "1891", t: "The bridge is completed, linking downtown Chattanooga with the north shore of the Tennessee River. It is considered the first non-military highway bridge across the river." },
  { y: "1906", t: "Ed Johnson, a Black man wrongly accused of a crime, is lynched on the bridge by a mob. The case that followed, United States v. Shipp, remains the only criminal trial in U.S. Supreme Court history." },
  { y: "1978", t: "The bridge closes to traffic over safety concerns, and demolition is considered." },
  { y: "1990", t: "After a community campaign to save it, the bridge is added to the National Register of Historic Places (February 23)." },
  { y: "1993", t: "Restored and reopened as a pedestrian and bicycle bridge — an early, influential example of bridge reuse that helped spark the riverfront's revival." },
];

const PHOTO_SPOTS = [
  { name: "Coolidge Park lawn", tip: "Frame the full span with the downtown skyline behind it.", id: "coolidge-park" },
  { name: "Hunter Museum plaza", tip: "Look down on the bridge from the bluff, especially at golden hour.", id: "hunter-museum" },
  { name: "Mid-span", tip: "Stand in the center of the deck for symmetrical truss shots and river views both ways.", id: "walnut-street-bridge" },
  { name: "Renaissance Park", tip: "A lower, side-on view of the trusses from the Northshore riverbank.", id: "renaissance-park" },
];

export default async function BridgePage() {
  const places = await getPlaces();
  const nearbyIds = ["ed-johnson-memorial", "hunter-museum", "bluff-view-art-district", "coolidge-park", "coolidge-park-carousel", "frazier-avenue", "tennessee-aquarium"];
  const nearby = nearbyIds.map((id) => places.find((p) => p.id === id)).filter(Boolean) as typeof places;
  const nearbyEats = places.filter((p) => p.neighborhoods.includes("northshore") && p.categories.some((c) => ["restaurants", "coffee", "shopping"].includes(c))).slice(0, 8);
  return (
    <>
      <PageHero tall image={{ src: "/images/walnut-street-bridge.jpg", alt: "People walking across the blue truss Walnut Street Bridge at sunset, with the Tennessee Aquarium's glass peaks and mountains beyond" }} eyebrow="Walnut Street Bridge" title="The Bridge That Connects More Than Two Shores." subtitle="Built in 1891, saved by its neighbors, and walked by millions since — this is Chattanooga's front porch over the river.">
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#walk" className="btn-accent">Walk the Bridge</a>
          <a href="https://chattanooga.gov/things-to-do/parks/walnut-street-bridge" target="_blank" rel="noopener noreferrer" className="btn-light"><ExternalLink aria-hidden className="h-4 w-4" />City info & notices</a>
        </div>
      </PageHero>

      <section className="container-page mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="prose-guide text-lg">
          <p>At 2,376 feet — almost half a mile — the Walnut Street Bridge is one of the longest pedestrian bridges in the world. Its blue camelback trusses link Downtown's Bluff View Art District with Coolidge Park and the Northshore, and on any given evening you'll find commuters, joggers, dog walkers, and families stopping mid-span to watch the river.</p>
          <p>The bridge's story is also the city's story. When it closed in 1978 and faced demolition, residents, preservationists, and civic leaders fought to save it. Its 1993 reopening as a walkway became a cornerstone of Chattanooga's riverfront revitalization and a model other cities have followed.</p>
          <p>It carries harder history, too. In 1906, Ed Johnson was taken from jail and lynched on the bridge. Since 2021, the Ed Johnson Memorial at the bridge's downtown end has honored Johnson and the two Black attorneys who fought for him, Noah Parden and Styles Hutchins — a place for reflection on justice and on how a community reckons with its past.</p>
        </div>
        <aside className="card h-fit p-6">
          <h2 className="text-xl font-semibold">By the numbers</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div><dt className="text-xs uppercase tracking-wide text-charcoal-400">Length</dt><dd className="font-serif text-3xl text-forest">2,376 ft</dd><dd className="text-xs text-charcoal-400">about 0.45 miles / 724 m</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-charcoal-400">Completed</dt><dd className="font-serif text-3xl text-forest">1891</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-charcoal-400">Reopened</dt><dd className="font-serif text-3xl text-forest">1993</dd><dd className="text-xs text-charcoal-400">for people on foot & bike</dd></div>
            <div><dt className="text-xs uppercase tracking-wide text-charcoal-400">Walk time</dt><dd className="font-serif text-3xl text-forest">~10 min</dd><dd className="text-xs text-charcoal-400">one way, at an easy pace</dd></div>
          </dl>
          <div className="mt-5"><ShareButton title="Walnut Street Bridge" path="/walnut-street-bridge" /></div>
        </aside>
      </section>

      <section className="container-page mt-14" aria-labelledby="timeline">
        <SectionHeading id="timeline" eyebrow="History" title="A brief timeline" />
        <ol className="grid gap-4 md:grid-cols-5">
          {TIMELINE.map((e) => (
            <li key={e.y} className="card p-5"><p className="font-serif text-2xl text-terracotta-700">{e.y}</p><p className="mt-2 text-sm leading-relaxed text-charcoal-600">{e.t}</p></li>
          ))}
        </ol>
      </section>

      <section id="walk" className="container-page mt-14 scroll-mt-20" aria-labelledby="walk-h">
        <SectionHeading id="walk-h" eyebrow="Walk the Bridge" title="Downtown → Northshore in one easy stroll" intro="Start in the Bluff View Art District, cross the river, and end on Frazier Avenue. The orange line shows the bridge deck." />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="h-[460px]">
            <StaticPinsMap
              label="Map of the Walnut Street Bridge walking route between Downtown and the Northshore"
              center={[35.0618, -85.3068]}
              zoom={16}
              places={nearby}
              route={[SOUTH, NORTH]}
              routeLabel="Walnut Street Bridge"
              markers={[
                { id: "south-end", name: "South (Downtown) access — Walnut St near Bluff View", lat: SOUTH[0], lng: SOUTH[1], color: "#C77B58", glyph: "S" },
                { id: "north-end", name: "North (Northshore) access — by Coolidge Park", lat: NORTH[0], lng: NORTH[1], color: "#C77B58", glyph: "N" },
              ]}
            />
          </div>
          <ol className="space-y-3">
            {[
              ["Start: Bluff View", "Wander the Hunter Museum's sculpture plaza and the Bluff View Art District."],
              ["South access", "Join the bridge where Walnut Street meets the bluff, near the Ed Johnson Memorial."],
              ["Mid-span", "Pause for views upriver to the Market Street Bridge and downriver toward Lookout Mountain."],
              ["North access", "Step down into Coolidge Park — the carousel is right there."],
              ["Finish: Frazier Avenue", "Browse galleries and shops, grab ice cream, and stay for dinner."],
            ].map(([t, d], i) => (
              <li key={t} className="card flex gap-4 p-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta font-semibold text-white">{i + 1}</span><div><p className="font-semibold text-forest">{t}</p><p className="text-sm text-charcoal-600">{d}</p></div></li>
            ))}
            <li className="flex flex-wrap gap-2 pt-2">
              <a className="btn-ghost" href={googleDirections("Walnut Street Bridge, Chattanooga, TN")} target="_blank" rel="noopener noreferrer"><Navigation aria-hidden className="h-4 w-4" />Directions to the bridge</a>
            </li>
          </ol>
        </div>
      </section>

      <section className="container-page mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold">Scenic photo spots</h2>
          <ul className="mt-4 space-y-3">
            {PHOTO_SPOTS.map((s) => <li key={s.name} className="card p-4"><Link href={`/places/${s.id}`} className="font-semibold text-forest underline">{s.name}</Link><p className="text-sm text-charcoal-600">{s.tip}</p></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Eat, shop & linger nearby</h2>
          <p className="mt-2 text-sm text-charcoal-600">A few Northshore spots within a short walk of the bridge's north end.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {nearbyEats.map((p) => <li key={p.id}><Link href={`/places/${p.id}`} className="card block p-3 text-sm font-medium text-forest hover:underline">{p.name}</Link></li>)}
          </ul>
          <p className="mt-4 text-sm"><Link className="font-semibold text-river-700 underline" href="/neighborhoods/northshore">Explore the Northshore map</Link> · <Link className="font-semibold text-river-700 underline" href="/neighborhoods/downtown">Explore Downtown</Link></p>
        </div>
      </section>
      <section className="container-page mt-10">
        <p className="rounded-2xl bg-river-50 p-4 text-sm">For closures, events that restrict access, and official information, see the <a className="font-semibold underline" href="https://chattanooga.gov/things-to-do/parks/walnut-street-bridge" target="_blank" rel="noopener noreferrer">City of Chattanooga's Walnut Street Bridge page</a>.</p>
        <p className="mt-3 text-xs text-charcoal-400">History sources: <a className="underline" href="https://www.achp.gov/sites/default/files/2018-07/WalnutBridge.pdf" target="_blank" rel="noopener noreferrer">Advisory Council on Historic Preservation</a> · <a className="underline" href="https://structurae.net/en/structures/walnut-street-bridge-1891" target="_blank" rel="noopener noreferrer">Structurae / HAER</a> · <a className="underline" href="https://theclio.com/entry/44189" target="_blank" rel="noopener noreferrer">The Clio</a>.</p>
      </section>
    </>
  );
}
