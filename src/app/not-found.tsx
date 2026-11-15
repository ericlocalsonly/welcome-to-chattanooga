import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-page mt-20 max-w-xl text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl font-semibold">Looks like this trail dead-ends.</h1>
      <p className="mt-3 text-charcoal-600">The page you're looking for isn't here — it may have moved, or the listing may have closed.</p>
      <div className="mt-6 flex justify-center gap-3"><Link className="btn-primary" href="/">Back home</Link><Link className="btn-ghost" href="/search">Search the guide</Link></div>
    </div>
  );
}
