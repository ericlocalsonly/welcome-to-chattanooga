import type { Metadata } from "next";
import Link from "next/link";
import { Navigation, AlertTriangle } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { StaticPinsMap } from "@/components/map/StaticPinsMap";
import { googleDirections } from "@/lib/utils";

export const metadata: Metadata = { title: "Tennessee Riverwalk Guide", description: "Access points, parking, family-friendly stretches, and connections along Chattanooga's Tennessee Riverwalk." };

const ACCESS = [
  { id: "ra-ross", name: "Ross's Landing (downtown)", address: "100 Riverfront Pkwy, Chattanooga, TN 37402", lat: 35.0568, lng: -85.3118, note: "The downtown heart of the Riverwalk, beside the Tennessee Aquarium. Paid parking nearby.", family: true, source: "https://noogatoday.6amcity.com/parks-guide-chattanooga-tn" },
  { id: "ra-bluegoose", name: "Blue Goose Hollow (Westside)", address: "Riverfront Pkwy, Chattanooga, TN 37402", lat: 35.0510, lng: -85.3196, note: "Small riverside park with heritage sculptures, just west of downtown.", family: true, source: "https://www.mypacer.com/parks/209952/blue-goose-hollow-chattanooga" },
  { id: "ra-935", name: "Riverfront Pkwy parking", address: "935 Riverfront Pkwy, Chattanooga, TN 37402", lat: 35.0478, lng: -85.3222, note: "Parking listed by TrailLink along the western riverfront.", family: false, source: "https://www.traillink.com/gdbkpdf/trail/6032627/tennessee-riverwalk63918121993355-2026.pdf" },
  { id: "ra-curtainpole", name: "Curtain Pole Road trailhead", address: "2011 Curtain Pole Rd, Chattanooga, TN 37406", lat: 35.0790, lng: -85.2600, note: "Free parking east of downtown, per trail users and TrailLink.", family: true, source: "https://www.traillink.com/trail/tennessee-riverwalk/" },
  { id: "ra-amnicola", name: "Amnicola Hwy / South Chickamauga Creek Greenway connection", address: "3716 Amnicola Hwy, Chattanooga, TN 37406", lat: 35.0860, lng: -85.2340, note: "Where the Riverwalk meets the South Chickamauga Creek Greenway.", family: true, source: "https://www.traillink.com/trail/south-chickamauga-creek-greenway/" },
  { id: "ra-riverpark", name: "Tennessee Riverpark", address: "4301 Amnicola Hwy, Chattanooga, TN 37406", lat: 35.0985, lng: -85.2370, note: "A large riverside park near the Chickamauga Dam with picnic areas, playgrounds, and fishing docks.", family: true, source: "https://www.timesfreepress.com/news/2014/mar/27/parks-boast-spaces-nature-and-play/" },
];

export default function RiverwalkPage() {
  return (
    <>
      <PageHero image={{ src: "/images/chattanooga-sign.jpg", alt: "Large CHATTANOOGA letters on the 21st Century Waterfront wall beside the Riverwalk" }} eyebrow="Outdoor Chattanooga" title="The Tennessee Riverwalk" subtitle="A paved, mostly flat greenway along the south bank of the river — walk a little, bike a lot, or just sit and watch the water." />
      <section className="container-page mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="prose-guide text-lg">
          <p>The Riverwalk links downtown's riverfront parks with neighborhoods, parks, and greenways to the east and west. TrailLink describes about 13 miles of main path between endpoints at 1503 Middle St and 4637 Amnicola Hwy; other guides count up to about 16 miles depending on which segments are included. At its eastern end it connects with the South Chickamauga Creek Greenway.</p>
          <p>Because the path is paved and accessible, it works for strollers, wheelchairs, skates, and bikes. Most visitors pick one section and do an out-and-back rather than the whole length.</p>
        </div>
        <div className="card p-6 text-sm">
          <h2 className="text-xl font-semibold">Good to know</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-charcoal-600">
            <li><strong>Walking:</strong> Ross's Landing to the Walnut Street Bridge and Bluff View is a short, scenic downtown stretch.</li>
            <li><strong>Biking:</strong> East of downtown, longer quieter stretches run toward the Tennessee Riverpark. Yield to walkers.</li>
            <li><strong>Family-friendly:</strong> Downtown and the Tennessee Riverpark have parks and play areas nearby.</li>
            <li><strong>Restrooms:</strong> We haven't confirmed restroom locations with the City or County yet, so we don't list them. Look for facilities at major parks.</li>
          </ul>
          <p className="mt-4 flex gap-2 rounded-2xl bg-terracotta-50 p-3 text-xs"><AlertTriangle aria-hidden className="h-4 w-4 shrink-0 text-terracotta-700" />Sections can close for construction, events, or high water. Check with the City of Chattanooga and Hamilton County before a long outing.</p>
        </div>
      </section>
      <section className="container-page mt-12" aria-labelledby="rw-map">
        <SectionHeading id="rw-map" eyebrow="Interactive map" title="Access points & parking" intro="We show access points only. We haven't drawn a continuous line because we haven't verified the exact current route and connections. Pins are approximate; use Directions, which go to the street address." />
        <div className="h-[460px]">
          <StaticPinsMap label="Map of Tennessee Riverwalk access points" center={[35.072, -85.275]} zoom={12} markers={ACCESS.map((a) => ({ id: a.id, name: a.name, lat: a.lat, lng: a.lng, color: "#2E6B3A", glyph: "R" }))} />
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ACCESS.map((a) => (
            <li key={a.id} className="card p-5">
              <h3 className="text-lg font-semibold">{a.name}</h3>
              <p className="mt-1 text-sm text-charcoal-600">{a.note}</p>
              <p className="mt-2 text-xs text-charcoal-400">{a.address}{a.family ? " · Family-friendly area" : ""}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a className="btn-ghost !min-h-[40px] !px-4 !py-1.5" href={googleDirections(a.address, a.name)} target="_blank" rel="noopener noreferrer"><Navigation aria-hidden className="h-4 w-4" />Directions</a>
                <a className="text-xs underline" href={a.source} target="_blank" rel="noopener noreferrer">Source</a>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="container-page mt-12">
        <h2 className="text-2xl font-semibold">Nearby along the river</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {[["tennessee-aquarium", "Tennessee Aquarium"], ["walnut-street-bridge", "Walnut Street Bridge"], ["hunter-museum", "Hunter Museum"], ["coolidge-park", "Coolidge Park"], ["blue-goose-hollow", "Blue Goose Hollow"]].map(([id, n]) => (
            <li key={id}><Link className="chip-off" href={`/places/${id}`}>{n}</Link></li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-charcoal-400">Sources: <a className="underline" href="https://www.traillink.com/trail/tennessee-riverwalk/" target="_blank" rel="noopener noreferrer">TrailLink</a> · <a className="underline" href="https://www.visitchattanooga.com/blog/post/a-guide-to-chattanoogas-riverwalk/" target="_blank" rel="noopener noreferrer">Visit Chattanooga Riverwalk guide</a> (includes a map of official trailheads).</p>
      </section>
    </>
  );
}
