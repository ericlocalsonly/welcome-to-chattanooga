import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { OutdoorGuide } from "@/components/guides/OutdoorGuide";
import { getTrails } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = { title: "Outdoor Chattanooga — Trails, Overlooks & the River", description: "Hiking, walking, biking, running, paddling, and scenic overlooks in and around Chattanooga, with trailheads, parking, and family tips." };

export default async function OutdoorsPage() {
  const trails = await getTrails();
  return (
    <>
      <PageHero image={{ src: "/images/mountain-view.jpg", alt: "A cannon at Point Park overlooking the Tennessee River's Moccasin Bend and the city at sunrise" }} eyebrow="Outdoor Chattanooga" title="Get Outside. It's Kind of Our Thing." subtitle="Ridgelines above, a river through the middle, and greenways connecting it all — adventure starts minutes from downtown." />
      <section className="container-page mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="prose-guide text-lg">
          <p>Chattanooga earned its Scenic City nickname honestly. Lookout Mountain, Signal Mountain, and Raccoon Mountain frame the city, and the Tennessee River winds right through it. You can bike a paved riverside greenway in the morning, hike to a cliffside sunset in the evening, and never be more than a short drive from downtown.</p>
        </div>
        <Link href="/outdoors/riverwalk" className="card group block overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/chattanooga-sign-sm.jpg" alt="" className="h-40 w-full object-cover" />
          <div className="p-5"><p className="eyebrow">Featured</p><h2 className="mt-1 text-2xl font-semibold group-hover:underline">The Tennessee Riverwalk</h2><p className="mt-1 text-sm text-charcoal-600">Access points, parking, and family-friendly stretches.</p></div>
        </Link>
      </section>
      <section className="container-page mt-12" aria-labelledby="trails">
        <SectionHeading id="trails" eyebrow="Trails & activities" title="Find your next adventure" intro="Distances and conditions change. Use each card's official link to check closures before you head out." />
        <OutdoorGuide trails={trails} />
      </section>
    </>
  );
}
