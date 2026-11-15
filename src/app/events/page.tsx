import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { EventsCalendar } from "@/components/events/EventsCalendar";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { getUpcomingEvents } from "@/lib/data";

export const revalidate = 300;
export const metadata: Metadata = { title: "What's Happening in Chattanooga? Events Calendar", description: "Verified concerts, festivals, markets, family events, and community happenings in Chattanooga." };

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const events = await getUpcomingEvents();
  const jsonLd = events.slice(0, 50).map((e) => ({
    "@context": "https://schema.org", "@type": "Event", name: e.name, startDate: e.startsAt, ...(e.endsAt ? { endDate: e.endsAt } : {}),
    location: { "@type": "Place", name: e.venue, address: e.address }, description: e.description, url: e.url,
    ...(e.isFree === true ? { isAccessibleForFree: true } : {}),
  }));
  return (
    <>
      <PageHero image={{ src: "/images/rosss-landing.jpg", alt: "Festival tents, crowds, and paddlers at Ross's Landing on a summer day" }} eyebrow="Events" title="What's Happening in Chattanooga?" subtitle="Live music, festivals, markets, and more — verified before they're listed." />
      {jsonLd.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <section className="container-page mt-12">
        <EventsCalendar events={events} initialCategory={category} />
      </section>
      <section className="container-page mt-12 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-semibold">More official calendars</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="font-semibold text-river-700 underline" href="https://www.visitchattanooga.com" target="_blank" rel="noopener noreferrer">Visit Chattanooga</a> — the city's official tourism site</li>
            <li><a className="font-semibold text-river-700 underline" href="https://chattanooga.gov" target="_blank" rel="noopener noreferrer">City of Chattanooga</a> — parks, public events, and closures</li>
          </ul>
        </div>
        <div className="card p-6 text-sm text-charcoal-600">
          <h2 className="text-xl font-semibold">How we list events</h2>
          <p className="mt-2">Events come from organizers and official sources and are reviewed by our editors. Past events disappear automatically. Times are shown in Chattanooga time (Eastern).</p>
        </div>
      </section>
      <section id="submit" className="container-page mt-12 scroll-mt-24">
        <SectionHeading eyebrow="Hosting something?" title="Submit an event" intro="Share the details and an official link. We'll verify it before it goes live." />
        <SubmissionForm kind="event" contactEmail={process.env.CONTACT_EMAIL} />
      </section>
    </>
  );
}
