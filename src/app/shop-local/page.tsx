import type { Metadata } from "next";
import { ExternalLink, Navigation, Clock, Phone, MapPin } from "lucide-react";
import { getPlace } from "@/lib/data";
import { googleDirections, telHref } from "@/lib/utils";
import { StaticPinsMap } from "@/components/map/StaticPinsMap";

export const revalidate = 300;
export const metadata: Metadata = { title: "Take a Little Chattanooga Home — Locals Only Gifts and Goods", description: "Locally made gifts, goods, and Chattanooga-inspired finds on Frazier Avenue in the Northshore. The sponsor of this guide." };

export default async function ShopLocalPage() {
  const store = await getPlace("locals-only-gifts-and-goods");
  return (
    <>
      <section className="bg-white">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-[1fr_1.1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/locals-only-logo.png" alt="Locals Only Gifts and Goods, established 2015, Chattanooga, Tennessee" className="mx-auto w-full max-w-md" />
          <div>
            <p className="eyebrow">Our sponsor</p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Take a Little Chattanooga Home.</h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal-600">Chattanooga is full of talented makers, artists, and creative people. At Locals Only Gifts and Goods, we celebrate that creativity with a thoughtfully curated collection of locally made gifts, goods, and Chattanooga-inspired finds. Whether you're looking for a souvenir that actually means something or a gift you won't find just anywhere, we'd love to help you discover something special.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://www.localsonlygiftsandgoods.com" target="_blank" rel="noopener noreferrer" className="btn-primary"><ExternalLink aria-hidden className="h-4 w-4" />Visit Locals Only Gifts and Goods</a>
              <a href="#find" className="btn-ghost"><MapPin aria-hidden className="h-4 w-4" />Find Our Store</a>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page mt-12 grid gap-6 md:grid-cols-3">
        {[
          ["Made in Tennessee", "Small-batch and artisan-crafted goods from makers across the state — art, stationery, jewelry, apparel, home goods, and more."],
          ["Local flavor", "Hot sauces, honey, sweets, and specialty foods that taste like the region."],
          ["Gift boxes", "Curated boxes that make it easy to send a little Chattanooga to someone you love."],
        ].map(([h, t]) => (
          <div key={h} className="card p-6"><h2 className="text-xl font-semibold">{h}</h2><p className="mt-2 text-sm leading-relaxed text-charcoal-600">{t}</p></div>
        ))}
      </section>
      {store && (
        <section id="find" className="container-page mt-12 scroll-mt-24 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold">Find our store</h2>
            <p className="mt-1 text-charcoal-600">On Frazier Avenue in the Northshore, a short walk from the Walnut Street Bridge.</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex gap-2"><MapPin aria-hidden className="mt-0.5 h-4 w-4 text-river" /><dt className="sr-only">Address</dt><dd>{store.address}</dd></div>
              {store.hours && <div className="flex gap-2"><Clock aria-hidden className="mt-0.5 h-4 w-4 text-river" /><dt className="sr-only">Hours</dt><dd>{store.hours}</dd></div>}
              {store.phone && <div className="flex gap-2"><Phone aria-hidden className="mt-0.5 h-4 w-4 text-river" /><dt className="sr-only">Phone</dt><dd><a className="underline" href={telHref(store.phone)}>{store.phone}</a></dd></div>}
            </dl>
            <a href={googleDirections(store.address, store.name)} target="_blank" rel="noopener noreferrer" className="btn-accent mt-6"><Navigation aria-hidden className="h-4 w-4" />Get directions</a>
          </div>
          <div className="h-[380px]"><StaticPinsMap places={[store]} center={[store.lat, store.lng]} zoom={17} label="Map showing Locals Only Gifts and Goods on Frazier Avenue" /></div>
        </section>
      )}
      <p className="container-page mt-8 text-xs text-charcoal-400">Locals Only Gifts and Goods sponsors this guide. Sponsorship doesn't affect how other places are listed or ranked in search.</p>
    </>
  );
}
