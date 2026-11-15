import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { MapExplorer } from "@/components/map/MapExplorer";
import { ShareButton } from "@/components/ui/ShareButton";
import { getNeighborhood, getNeighborhoods, getPlaces } from "@/lib/data";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getNeighborhoods()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const n = await getNeighborhood((await params).slug);
  if (!n) return {};
  return { title: `${n.name} — ${n.vibe}`, description: n.description, openGraph: { images: [{ url: n.hero.src, alt: n.hero.alt }] } };
}

export default async function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [n, all, places] = await Promise.all([getNeighborhood(slug), getNeighborhoods(), getPlaces()]);
  if (!n) notFound();
  const here = places.filter((p) => p.neighborhoods.includes(n.slug));
  const featured = n.featured.map((id) => here.find((p) => p.id === id)).filter(Boolean) as typeof here;

  return (
    <>
      <PageHero image={n.hero} eyebrow={`Vibe: ${n.vibe}`} title={n.name} subtitle={n.tagline}>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#map" className="btn-accent">Open the map</a>
          <ShareButton title={`${n.name} · Welcome to Chattanooga`} path={`/neighborhoods/${n.slug}`} className="!bg-white/95" />
        </div>
      </PageHero>

      <section className="container-page mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="prose-guide">
          <p className="text-lg">{n.description}</p>
          <h2 className="mb-3 mt-8 text-2xl font-semibold">What makes {n.name} special</h2>
          <p>{n.special}</p>
        </div>
        <aside className="space-y-4">
          {n.history && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold">A short timeline</h2>
              <ol className="mt-4 space-y-3 border-l-2 border-terracotta/40 pl-4">
                {n.history.map((h) => (
                  <li key={h.year}><p className="text-sm font-semibold text-terracotta-700">{h.year}</p><p className="text-sm text-charcoal-600">{h.text}</p></li>
                ))}
              </ol>
              {n.sources && (
                <details className="mt-4 text-xs text-charcoal-400">
                  <summary className="cursor-pointer">Sources</summary>
                  <ul className="mt-2 space-y-1">{n.sources.map((s) => <li key={s}><a className="underline" href={s} target="_blank" rel="noopener noreferrer">{new URL(s).hostname}</a></li>)}</ul>
                </details>
              )}
            </div>
          )}
          {featured.length > 0 && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold">Featured</h2>
              <ul className="mt-3 space-y-2">
                {featured.map((p) => <li key={p.id}><Link className="font-medium text-river-700 underline" href={`/places/${p.id}`}>{p.name}</Link></li>)}
              </ul>
            </div>
          )}
        </aside>
      </section>

      <section id="map" className="container-page mt-14 scroll-mt-20">
        <SectionHeading eyebrow="Interactive map" title={`Explore ${n.name}`} intro={n.boundaryNote ?? "The dashed outline shows an approximate exploration area, not an official boundary."} />
        <MapExplorer places={here} center={n.center} zoom={n.zoom} boundary={n.boundary} boundaryLabel={`${n.name} — approximate exploration area`} route={n.walkingRoute} title={n.name} />
      </section>

      <nav aria-label="Other neighborhoods" className="container-page mt-16">
        <h2 className="text-2xl font-semibold">Keep exploring</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {all.filter((x) => x.slug !== n.slug).map((x) => (
            <li key={x.slug}><Link href={`/neighborhoods/${x.slug}`} className="chip-off">{x.name}</Link></li>
          ))}
        </ul>
      </nav>
    </>
  );
}
