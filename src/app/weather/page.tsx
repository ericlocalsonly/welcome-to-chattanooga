import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WeatherPanel } from "@/components/weather/WeatherPanel";

export const metadata: Metadata = { title: "The Scenic City Forecast — Chattanooga Weather", description: "Current conditions, the 7-day forecast, rain chances, wind, and severe weather alerts for Chattanooga from the National Weather Service." };

export default function WeatherPage() {
  return (
    <>
      <PageHero image={{ src: "/images/waterfront.jpg", alt: "Towering clouds over the Tennessee River, riverfront steps, and the mountains west of downtown" }} eyebrow="Chattanooga weather" title="The Scenic City Forecast." subtitle="What the sky's doing — and what it's a great day for." />
      <section className="container-page mt-10"><WeatherPanel /></section>
    </>
  );
}
