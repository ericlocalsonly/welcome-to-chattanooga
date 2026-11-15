import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { KidsGuide } from "@/components/guides/KidsGuide";
import { getPlaces } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = { title: "Things to Do With Kids in Chattanooga", description: "Little Explorers. Big Adventures. Family-friendly Chattanooga attractions filtered by age, weather, and budget — plus a perfect family day itinerary." };

const DAY = [
  { time: "9:30 a.m.", id: "tennessee-aquarium", title: "Tennessee Aquarium", note: "Start early, while little legs are fresh. Plan 2–3 hours for both buildings." },
  { time: "12:30 p.m.", id: "rosss-landing", title: "Picnic at Ross's Landing", note: "Let everyone run on the riverfront lawns." },
  { time: "1:30 p.m.", id: "walnut-street-bridge", title: "Walk the Walnut Street Bridge", note: "About a 10–15 minute stroll to the Northshore. Count the bridge's blue trusses together." },
  { time: "2:00 p.m.", id: "coolidge-park-carousel", title: "Coolidge Park & the carousel", note: "A ride or two, then play on the lawn." },
  { time: "3:00 p.m.", id: "clumpies-northshore", title: "Ice cream break", note: "Treats on Frazier Avenue." },
  { time: "4:00 p.m.", id: "creative-discovery-museum", title: "Creative Discovery Museum — or the Incline", note: "Younger kids: hands-on play downtown. Older kids: ride the Incline up Lookout Mountain and catch the view from Point Park. Check closing times first." },
];

export default async function KidsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const places = (await getPlaces()).filter((p) => p.family);
  return (
    <>
      <PageHero image={{ src: "/images/coolidge-park-carousel.jpg", alt: "The Coolidge Park carousel pavilion's blue roof and golden horse weathervane against a blue sky" }} eyebrow="Things to do with kids" title="Little Explorers. Big Adventures." subtitle="Aquariums and carousels, mountaintop trains and riverfront lawns — Chattanooga is a city built for curious kids." />
      <section className="container-page mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="prose-guide text-lg">
          <p>Chattanooga packs a remarkable amount of family fun into a walkable downtown. You can see river otters in the morning, ride a 130-year-old incline railway up a mountain in the afternoon, and still be back for ice cream by the river. Many of the best moments are free: running across the Walnut Street Bridge, rolling down the lawn at Coolidge Park, or climbing on sculptures at Main Terrain.</p>
          <p>Use the filters to find the right fit for your crew, and save favorites to build your own plan.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold">Seasonal family fun</h2>
          <p className="mt-2 text-sm text-charcoal-600">Holiday lights, summer concerts, and festivals change every year, so we keep them on the events calendar — and list them only after they're confirmed.</p>
          <Link href="/events?category=family" className="btn-ghost mt-4">See family events</Link>
        </div>
      </section>
      <section className="container-page mt-12" aria-labelledby="activities">
        <SectionHeading id="activities" eyebrow="Family activities" title="Find the right adventure" />
        <KidsGuide places={places} initial={filter} />
      </section>
      <section className="container-page mt-16" aria-labelledby="day">
        <SectionHeading id="day" eyebrow="Suggested itinerary" title="A Perfect Family Day in Chattanooga" intro="A walkable loop that mixes indoor and outdoor time. Times are suggestions, not schedules." />
        <ol className="relative space-y-4 border-l-2 border-terracotta/40 pl-6">
          {DAY.map((d) => (
            <li key={d.time} className="card p-5">
              <p className="text-sm font-semibold text-terracotta-700">{d.time}</p>
              <h3 className="text-lg font-semibold"><Link className="hover:underline" href={`/places/${d.id}`}>{d.title}</Link></h3>
              <p className="mt-1 text-sm text-charcoal-600">{d.note}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
