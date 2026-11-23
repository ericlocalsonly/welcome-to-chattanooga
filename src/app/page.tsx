import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { WeatherWidget } from "@/components/weather/WeatherWidget";
import { EventCard } from "@/components/events/EventCard";
import { getNeighborhoods, getUpcomingEvents } from "@/lib/data";

export const revalidate = 300;

/** Google's official "write a review" link for Locals Only Gifts & Goods (10 Frazier Ave). */
const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJE5DZi1leYIgRtDLRDP9FRCM";

const FEATURES = [
  { href: "/neighborhoods", title: "Explore Our Neighborhoods", text: "Five districts, five personalities — with maps of where to eat, shop, and wander.", img: "/images/coolidge-park-sm.jpg", alt: "Aerial view of Coolidge Park and the Walnut Street Bridge" },
  { href: "/kids", title: "Things to Do With Kids", text: "Little explorers, big adventures. Filter by age, weather, and budget.", img: "/images/coolidge-park-carousel-sm.jpg", alt: "The Coolidge Park carousel pavilion's blue roof and golden horse weathervane" },
  { href: "/outdoors", title: "Outdoor Adventures", text: "Trails, overlooks, greenways, and the river. Get outside — it's kind of our thing.", img: "/images/mountain-view-sm.jpg", alt: "View over Moccasin Bend from Lookout Mountain" },
  { href: "/walnut-street-bridge", title: "Walnut Street Bridge", text: "The 1891 bridge that connects more than two shores.", img: "/images/walnut-street-bridge-sm.jpg", alt: "The Walnut Street Bridge at sunset" },
  { href: "/events", title: "Events & Festivals", text: "Concerts, markets, festivals, and community happenings.", img: "/images/rosss-landing-sm.jpg", alt: "A festival crowd at Ross's Landing on the riverfront" },
  { href: "/weather", title: "Chattanooga Weather", text: "The Scenic City 7-day forecast, plus what it's a great day for.", img: "/images/waterfront-sm.jpg", alt: "Big clouds over the Tennessee River and mountains" },
  { href: "/shop-local", title: "Shop Local — Locals Only Gifts and Goods", text: "Take a little Chattanooga home from our guide's sponsor.", img: "/brand/locals-only-logo-sm.png", alt: "Locals Only Gifts and Goods logo", contain: true },
];

export default async function HomePage() {
  const [neighborhoods, events] = await Promise.all([getNeighborhoods(), getUpcomingEvents()]);
  const weekAhead = Date.now() + 7 * 864e5;
  const thisWeek = events.filter((e) => new Date(e.startsAt).getTime() <= weekAhead).slice(0, 3);

  return (
    <>
      <PageHero
        tall
        image={{ src: "/images/tennessee-river.jpg", alt: "Downtown Chattanooga's skyline above the Tennessee River, with the blue Walnut Street Bridge in the foreground and Lookout Mountain behind" }}
        eyebrow="Chattanooga, Tennessee"
        title="Welcome to Chattanooga"
        byline={<>Brought to you by <Link href="/shop-local" className="underline decoration-cream/50 underline-offset-4 hover:decoration-cream">Locals Only Gifts and Goods</Link></>}
        subtitle="Big Views. Local Flavor. Endless Adventures."
      >
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/90 sm:text-lg">
          Welcome to Chattanooga, Tennessee — where mountain views meet riverfront streets, outdoor adventure is always close by, and every neighborhood has a story to tell. From independent shops and unforgettable restaurants to scenic trails, historic landmarks, and family adventures, the Scenic City has a little something for everyone. Whether you're here for a weekend or you've called Chattanooga home for years, there's always something new to discover.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/things-to-do" className="btn-light">Explore Chattanooga <ArrowRight aria-hidden className="h-4 w-4" /></Link>
          <Link href="/neighborhoods" className="btn-light">Find Your Neighborhood</Link>
        </div>
      </PageHero>

      <section className="container-page -mt-10 relative z-10 grid gap-4 md:grid-cols-[1fr_1.4fr]">
        <WeatherWidget />
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">What's Happening This Week</h2>
            <Link href="/events" className="text-sm font-semibold text-river-700 underline">Full calendar</Link>
          </div>
          {thisWeek.length ? (
            <ul className="mt-3 divide-y divide-charcoal/10">
              {thisWeek.map((e) => (
                <li key={e.id} className="py-2"><Link href={`/events#${e.id}`} className="font-medium text-forest hover:underline">{e.name}</Link><p className="text-sm text-charcoal-400">{e.venue}</p></li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
              We only list events we've verified with the organizer, and none are posted for this week yet. Hosting something?{" "}
              <Link className="font-semibold text-river-700 underline" href="/events#submit">Submit your event</Link> for review.
            </p>
          )}
        </div>
      </section>

      <section className="container-page mt-20" aria-labelledby="start">
        <SectionHeading id="start" eyebrow="Start here" title="Find your Chattanooga" intro="Pick a path. Every card leads somewhere worth your afternoon." />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.href}>
              <Link href={f.href} className="card group block h-full overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.alt} loading="lazy" className={`h-48 w-full transition duration-500 group-hover:scale-105 ${f.contain ? "bg-white object-contain p-6" : "object-cover"}`} />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold group-hover:underline">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{f.text}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page mt-20" aria-labelledby="hoods">
        <SectionHeading id="hoods" eyebrow="Neighborhoods" title="Five places to wander" />
        <ul className="grid gap-3 md:grid-cols-5">
          {neighborhoods.map((n) => (
            <li key={n.slug}>
              <Link href={`/neighborhoods/${n.slug}`} className="group relative block h-56 overflow-hidden rounded-3xl md:h-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={n.hero.src.replace(/\.(jpg|png)$/, "-sm.$1")} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-900/85 to-transparent" />
                <span className="absolute bottom-0 p-4 text-white">
                  <span className="block font-serif text-2xl">{n.name}</span>
                  <span className="mt-1 block text-xs text-cream/85">{n.vibe}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page mt-20" aria-labelledby="review">
        <div className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/locals-only-logo-sm.png" alt="" loading="lazy" className="h-20 w-20 shrink-0 rounded-2xl bg-white object-contain p-2 ring-1 ring-charcoal/10" />
          <div className="flex-1">
            <p className="eyebrow">Share your experience</p>
            <h2 id="review" className="mt-1 text-2xl font-semibold">Tell others about Locals Only</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-600">
              Did you enjoy your experience at Locals Only Gifts and Goods? Tell us about it in a quick Google review — it helps other people find Chattanooga-made gifts and keeps this free guide going.
            </p>
          </div>
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="btn-accent shrink-0">
            <Star aria-hidden className="h-4 w-4" />Leave a Google review<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>

      {events.length > 3 && (
        <section className="container-page mt-20">
          <SectionHeading eyebrow="Coming up" title="On the calendar" />
          <div className="grid gap-4 md:grid-cols-3">{events.slice(0, 3).map((e) => <EventCard key={e.id} e={e} />)}</div>
        </section>
      )}
    </>
  );
}
