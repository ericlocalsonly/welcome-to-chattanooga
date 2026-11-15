import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PlaceDetails } from "@/components/PlaceDetails";
import { StaticPinsMap } from "@/components/map/StaticPinsMap";
import { getNeighborhoods, getPlace, getPlaces } from "@/lib/data";

export const revalidate = 300;
export async function generateStaticParams() {
  return (await getPlaces()).map((p) => ({ id: p.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await getPlace((await params).id);
  if (!p) return {};
  return { title: p.name, description: p.description, openGraph: p.image ? { images: [{ url: p.image.src, alt: p.image.alt }] } : undefined };
}

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [p, hoods] = await Promise.all([getPlace(id), getNeighborhoods()]);
  if (!p) notFound();
  const inHoods = hoods.filter((h) => p.neighborhoods.includes(h.slug));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": p.categories.includes("restaurants") ? "Restaurant" : p.categories.includes("parks") ? "Park" : p.categories.includes("shopping") ? "Store" : "TouristAttraction",
    name: p.name,
    description: p.description,
    address: p.address,
    geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
    ...(p.website ? { url: p.website } : {}),
    ...(p.phone ? { telephone: p.phone } : {}),
  };
  return (
    <div className="container-page mt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-charcoal-400">
        <Link className="underline" href="/neighborhoods">Neighborhoods</Link>
        {inHoods[0] && <> / <Link className="underline" href={`/neighborhoods/${inHoods[0].slug}`}>{inHoods[0].name}</Link></>}
      </nav>
      <div className="mt-4 grid gap-6 lg:grid-cols-[420px_1fr]">
        <PlaceDetails place={p} headingLevel={2} />
        <div className="h-[420px]">
          <StaticPinsMap places={[p]} center={[p.lat, p.lng]} zoom={16} label={`Map showing ${p.name}`} />
        </div>
      </div>
    </div>
  );
}

