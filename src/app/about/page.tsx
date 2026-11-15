import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "About This Guide" };
export default function AboutPage() {
  return (
    <div className="container-page prose-guide mt-10 max-w-3xl">
      <p className="eyebrow">About</p>
      <h1 className="mt-2 mb-6 text-4xl font-semibold">A visitor resource first</h1>
      <p>Welcome to Chattanooga is an independent guide to the Scenic City for visitors and locals alike. It's proudly sponsored by <Link className="underline" href="/shop-local">Locals Only Gifts and Goods</Link>, a Northshore gift shop — but the guide exists to help you explore the whole city, not to sell you anything.</p>
      <h2 className="mb-3 mt-8 text-2xl font-semibold">How we check listings</h2>
      <p>Every place is a real business, park, or attraction researched from official websites, government sources, and reputable local media. Each listing records its sources and the date it was last checked. Listings we haven't fully confirmed are flagged for our editors, and we never invent hours — if hours aren't verified, we ask you to check before you go.</p>
      <p>Map pins are placed from published coordinates where available and are otherwise approximate. The Directions buttons always use the street address.</p>
      <p>Neighborhood outlines are approximate areas for exploring, not official boundaries.</p>
      <h2 className="mb-3 mt-8 text-2xl font-semibold">Events</h2>
      <p>We only publish events confirmed with organizers or official sources. Past events are removed automatically, and we never show sample events as real ones.</p>
      <h2 className="mb-3 mt-8 text-2xl font-semibold">Fair listings</h2>
      <p>Search results are ranked by relevance only. Our sponsor appears on the Northshore map like any other shop and receives no boost in search.</p>
      <p><Link className="font-semibold underline" href="/suggest-update">Suggest an update</Link></p>
      <h2 className="mb-3 mt-8 text-2xl font-semibold">Credits</h2>
      <p>Maps © OpenStreetMap contributors. Weather data from the National Weather Service. Photography provided by Locals Only Gifts and Goods.</p>
    </div>
  );
}
