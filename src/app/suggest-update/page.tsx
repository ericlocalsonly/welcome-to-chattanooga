import type { Metadata } from "next";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { getPlace } from "@/lib/data";

export const metadata: Metadata = { title: "Suggest an Update", robots: { index: false } };

export default async function SuggestUpdatePage({ searchParams }: { searchParams: Promise<{ listing?: string }> }) {
  const { listing } = await searchParams;
  const place = listing ? await getPlace(listing) : null;
  return (
    <div className="container-page mt-10 max-w-2xl">
      <p className="eyebrow">Help keep the guide accurate</p>
      <h1 className="mt-2 text-4xl font-semibold">Suggest an update{place ? ` for ${place.name}` : ""}</h1>
      <p className="mt-3 mb-8 text-charcoal-600">Spotted a closed business, wrong hours, or a misplaced pin? Know a great local spot we're missing? Tell us — an editor reviews every suggestion.</p>
      <SubmissionForm kind="correction" listingId={place?.id ?? listing} contactEmail={process.env.CONTACT_EMAIL} />
    </div>
  );
}
