import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-charcoal/10 bg-forest-900 pb-28 pt-12 text-cream md:pb-12">
      <div className="container-page grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-white">Welcome to Chattanooga</p>
          <p className="mt-2 text-sm text-cream/75">Explore the Scenic City like a local.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-sm">
          <Link className="hover:underline" href="/neighborhoods">Neighborhoods</Link>
          <Link className="hover:underline" href="/kids">With Kids</Link>
          <Link className="hover:underline" href="/outdoors">Outdoors</Link>
          <Link className="hover:underline" href="/outdoors/riverwalk">Riverwalk</Link>
          <Link className="hover:underline" href="/walnut-street-bridge">Walnut Street Bridge</Link>
          <Link className="hover:underline" href="/events">Events</Link>
          <Link className="hover:underline" href="/suggest-update">Suggest an update</Link>
          <Link className="hover:underline" href="/about">About this guide</Link>
          <Link className="hover:underline" href="/privacy">Privacy</Link>
        </nav>
        <div className="text-sm text-cream/75">
          <p>Listings are researched from public sources and marked with the date they were last checked. Always confirm hours before you go.</p>
        </div>
      </div>
      <div className="container-page mt-10 border-t border-white/10 pt-6 text-xs text-cream/70">
        <p>
          Proudly sponsored by{" "}
          <Link href="/shop-local" className="font-semibold text-white underline-offset-4 hover:underline">Locals Only Gifts and Goods</Link>
          {" "}· Map data © OpenStreetMap contributors · Weather from the National Weather Service
        </p>
      </div>
    </footer>
  );
}
